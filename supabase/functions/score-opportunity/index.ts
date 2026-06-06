import * as Sentry from "npm:@sentry/deno";
Sentry.init({
  dsn: Deno.env.get("SENTRY_DSN_BACKEND"),
  environment: Deno.env.get("ENVIRONMENT") || "production",
  tracesSampleRate: 0.1,
});

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";
import { validateAuth } from "../_shared/auth.ts";
import { handleError, AppError } from "../_shared/errors.ts";
import { checkRateLimit } from "../_shared/ratelimit.ts";
import { z } from "https://esm.sh/zod@3.22.0";

const requestSchema = z.object({
  leadId: z.string().uuid(),
});

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const user = await validateAuth(req);
    if (!user) {
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
    }

    const body = await req.json().catch(() => ({}));
    const parsed = requestSchema.safeParse(body);
    if (!parsed.success) {
      return new Response(
        JSON.stringify({ error: "VALIDATION_FAILED", details: parsed.error.flatten() }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const { leadId } = parsed.data;

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new AppError("Server is not configured correctly", 500, "MISCONFIGURED");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Enforce Rate Limit: 50 requests/hour for scoring
    const ipAddress = req.headers.get("x-real-ip") || req.headers.get("x-forwarded-for") || null;
    const rateLimit = await checkRateLimit(
      supabase,
      user.id,
      ipAddress,
      "score-opportunity",
      50,
      3600,
    );
    if (!rateLimit.allowed) {
      throw new AppError("Too many requests. Please try again later.", 429, "RATE_LIMIT_EXCEEDED");
    }

    // Fetch lead details
    const { data: lead, error: fetchError } = await supabase
      .from("leads")
      .select("*")
      .eq("id", leadId)
      .single();

    if (fetchError || !lead) {
      throw new AppError("Lead not found", 404, "NOT_FOUND");
    }

    let score = 0;
    const breakdown: any = {};

    const category = lead.industry || "web_dev";
    const isB2B = [
      "african_food_export",
      "restaurant_supplier",
      "product_export",
      "b2b_trade",
      "human_capital",
      "training_recruitment",
    ].includes(category);

    if (isB2B) {
      // B2B SCORING — established = better partner
      if (lead.has_website) {
        score += 25;
        breakdown["has_website"] = 25;
      }
      if (lead.google_review_count > 100) {
        score += 20;
        breakdown["very_established_reviews"] = 20;
      } else if (lead.google_review_count > 50) {
        score += 15;
        breakdown["established_business_reviews"] = 15;
      } else if (lead.google_review_count > 20) {
        score += 10;
        breakdown["semi_established_reviews"] = 10;
      }

      const rating = parseFloat(lead.google_rating || "0");
      if (rating >= 4.0) {
        score += 15;
        breakdown["good_reputation_rating"] = 15;
      } else if (rating >= 3.5) {
        score += 8;
        breakdown["average_reputation_rating"] = 8;
      }

      if (lead.has_facebook) {
        score += 8;
        breakdown["has_facebook"] = 8;
      }
      if (lead.has_instagram) {
        score += 7;
        breakdown["has_instagram"] = 7;
      }
      if (lead.phone) {
        score += 15;
        breakdown["contactable_phone"] = 15;
      }
      if (lead.email) {
        score += 10;
        breakdown["contactable_email"] = 10;
      }
    } else {
      // FREELANCE SCORING — existing code stays
      // 1. Website signal (up to 40 pts)
      if (!lead.has_website || !lead.website_url) {
        score += 40;
        breakdown["no_website"] = 40;

        // Digital gap bonus — businesses in emerging markets with no website score HIGHER
        const DIGITAL_GAP_BONUS: Record<string, number> = {
          // Africa
          Nigeria: 15,
          Ghana: 15,
          Kenya: 12,
          Ethiopia: 15,
          Tanzania: 15,
          Uganda: 12,
          Cameroon: 12,
          // Asia
          Bangladesh: 12,
          Pakistan: 10,
          Myanmar: 12,
          Cambodia: 12,
          Nepal: 12,
          // Latin America
          Haiti: 15,
          Bolivia: 10,
          Honduras: 10,
        };
        const bonus = DIGITAL_GAP_BONUS[lead.country || ""] || 0;
        if (bonus > 0) {
          score += bonus;
          breakdown[`digital_gap_bonus_${(lead.country || "").toLowerCase()}`] = bonus;
        }
      } else {
        const websiteScore = lead.website_score || 100;
        if (websiteScore < 50) {
          score += 25;
          breakdown["slow_website"] = 25;
        } else if (websiteScore < 80) {
          score += 15;
          breakdown["average_website_speed"] = 15;
        }

        if (lead.website_mobile_ok === false) {
          score += 10;
          breakdown["mobile_unfriendly"] = 10;
        }

        if (lead.website_has_ssl === false) {
          score += 5;
          breakdown["no_https"] = 5;
        }
      }

      // 2. Google Maps / Yelp Signals (up to 30 pts)
      if (lead.google_rating) {
        const rating = parseFloat(lead.google_rating);
        if (rating < 3.5) {
          score += 20;
          breakdown["poor_google_rating"] = 20;
        } else if (rating < 4.5) {
          score += 10;
          breakdown["suboptimal_google_rating"] = 10;
        }

        const reviews = lead.google_review_count || 0;
        if (reviews < 5) {
          score += 10;
          breakdown["very_few_google_reviews"] = 10;
        } else if (reviews < 20) {
          score += 5;
          breakdown["few_google_reviews"] = 5;
        }
      } else {
        score += 15;
        breakdown["no_google_business_rating"] = 15;
      }

      // 3. Social Media Presence (up to 20 pts)
      if (lead.social_scan_done) {
        let missingSocials = 0;
        if (!lead.has_facebook) missingSocials++;
        if (!lead.has_instagram) missingSocials++;
        if (!lead.has_twitter) missingSocials++;
        if (!lead.has_linkedin) missingSocials++;

        const socialPenalty = missingSocials * 5;
        if (socialPenalty > 0) {
          score += socialPenalty;
          breakdown[`missing_${missingSocials}_social_channels`] = socialPenalty;
        }
      } else {
        score += 10;
        breakdown["social_presence_unchecked"] = 10;
      }

      // 4. Contact signals (up to 10 pts)
      if (!lead.email) {
        score += 5;
        breakdown["no_email_listed"] = 5;
      }
      if (!lead.phone) {
        score += 5;
        breakdown["no_phone_listed"] = 5;
      }
    }

    // GMB Gap Signals — add to ALL categories
    const gmbGaps: string[] = [];
    let gmbBonus = 0;

    // No photos on GMB listing
    if (!lead.google_photo_url) {
      gmbGaps.push("No GMB photos uploaded");
      gmbBonus += 8;
    }

    // No business description
    if (!lead.description || lead.description.length < 20) {
      gmbGaps.push("No business description on GMB");
      gmbBonus += 7;
    }

    // Very few reviews — hard to be found
    const reviewCount = lead.google_review_count || 0;
    if (reviewCount < 5) {
      gmbGaps.push("Fewer than 5 Google reviews");
      gmbBonus += 10;
    } else if (reviewCount < 10) {
      gmbGaps.push("Fewer than 10 Google reviews");
      gmbBonus += 5;
    }

    // No website on GMB listing
    if (!lead.has_website) {
      gmbGaps.push("No website linked on GMB");
      // already scored in main algorithm
    }

    // Low rating — reputation opportunity
    const ratingValue = parseFloat(lead.google_rating || "0");
    if (ratingValue > 0 && ratingValue < 3.5) {
      gmbGaps.push("Low Google rating — needs reputation management");
      gmbBonus += 8;
    }

    // Add GMB bonus to total score
    score += gmbBonus;

    // Save GMB gaps to score breakdown
    breakdown.gmb_gaps = gmbGaps;
    breakdown.gmb_bonus = gmbBonus;

    // Clamp score to 100 max, 0 min
    const finalScore = Math.min(Math.max(score, 0), 100);

    // Update lead with final score and breakdown
    const { data: updatedLead, error: updateError } = await supabase
      .from("leads")
      .update({
        opportunity_score: finalScore,
        score_breakdown: breakdown,
        updated_at: new Date().toISOString(),
      })
      .eq("id", leadId)
      .select()
      .single();

    if (updateError) throw updateError;

    // Log Action to Audit Log
    try {
      await supabase.from("audit_log").insert({
        user_id: user.id,
        action: "lead.scored",
        entity_type: "lead",
        entity_id: leadId,
        metadata: { final_score: finalScore },
        ip_address: ipAddress,
        user_agent: req.headers.get("user-agent") || null,
      });
    } catch (auditErr) {
      console.warn("Failed to insert audit log:", auditErr);
    }

    return new Response(JSON.stringify({ success: true, lead: updatedLead }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    Sentry.captureException(error);
    return handleError(error);
  }
});
