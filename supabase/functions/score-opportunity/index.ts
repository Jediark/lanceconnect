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
    const breakdown: Record<string, number> = {};

    // 1. Website signal (up to 40 pts)
    if (!lead.has_website || !lead.website_url) {
      score += 40;
      breakdown["no_website"] = 40;
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
