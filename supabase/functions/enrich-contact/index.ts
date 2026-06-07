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

    const numverifyApiKey = Deno.env.get("NUMVERIFY_API_KEY");
    const mailboxlayerApiKey = Deno.env.get("MAILBOXLAYER_API_KEY");
    const prospeoApiKey = Deno.env.get("PROSPEO_LANCECONNECT_API_KEY");
    const screenshotKey = Deno.env.get("SCREENSHOTLAYER_API_KEY");

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new AppError("Server is not configured correctly", 500, "MISCONFIGURED");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Enforce Rate Limit: 50 requests/hour for enrichment
    const ipAddress = req.headers.get("x-real-ip") || req.headers.get("x-forwarded-for") || null;
    const rateLimit = await checkRateLimit(
      supabase,
      user.id,
      ipAddress,
      "enrich-contact",
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

    console.log(`[enrich-contact] Starting for lead: ${lead.business_name}`);
    console.log(`[enrich-contact] Website URL: ${lead.website_url}`);
    console.log(`[enrich-contact] Has website: ${lead.has_website}`);

    // Check if EMAIL_SCRAPER_URL is set
    const scraperUrl = Deno.env.get("EMAIL_SCRAPER_URL");
    console.log(`[enrich-contact] Scraper URL: ${scraperUrl}`);

    if (!scraperUrl) {
      console.error("[enrich-contact] EMAIL_SCRAPER_URL not set!");
    }

    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    // 1. Phone validation (Numverify)
    if (lead.phone && !lead.phone_verified && numverifyApiKey) {
      try {
        const numRes = await fetch(
          `http://apilayer.net/api/validate?access_key=${numverifyApiKey}&number=${encodeURIComponent(lead.phone)}`,
          { signal: AbortSignal.timeout(5000) },
        );
        if (numRes.ok) {
          const numData = await numRes.json();
          if (numData.valid) {
            updateData.phone_verified = true;
            updateData.phone_verified_at = new Date().toISOString();
            const cleanPhone = lead.phone.replace(/[^0-9]/g, "");
            updateData.phone_whatsapp_link = `https://wa.me/${cleanPhone}`;
          }
        }
      } catch (err) {
        console.error("Numverify API check failed:", err);
      }
    }

    // 2. Email discovery (Prospeo + Vercel Email Scraper)
    let emailFound = lead.email;
    if (!lead.email && lead.website_url) {
      try {
        const domain = new URL(lead.website_url).hostname.replace("www.", "");

        // Layer 1 — Prospeo
        if (prospeoApiKey) {
          const prospeoRes = await fetch("https://api.prospeo.io/domain-search", {
            method: "POST",
            headers: { "X-KEY": prospeoApiKey, "Content-Type": "application/json" },
            body: JSON.stringify({ domain }),
            signal: AbortSignal.timeout(8000),
          });
          if (prospeoRes.ok) {
            const prospeoData = await prospeoRes.json();
            if (prospeoData.response?.email_list && prospeoData.response.email_list.length > 0) {
              emailFound = prospeoData.response.email_list[0].email;
              updateData.email = emailFound;
              updateData.email_confidence = "verified";
            }
          }
        }

        // Layer 2 — Our Vercel Email Scraper
        if (!emailFound) {
          try {
            const emailScraperUrl =
              Deno.env.get("EMAIL_SCRAPER_URL") || "https://lanceconnect.vercel.app/api/scrape";
            const internalApiKey = Deno.env.get("INTERNAL_API_KEY");

            const scraperRes = await fetch(emailScraperUrl, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "X-Internal-Key": internalApiKey || "",
              },
              body: JSON.stringify({
                url: lead.website_url,
                businessName: lead.business_name,
                city: lead.city,
                country: lead.country,
                deduplicate: true,
                filter_noreply: true,
                lowercase: true,
              }),
              signal: AbortSignal.timeout(12000),
            });

            if (scraperRes.ok) {
              const scraperData = await scraperRes.json();
              if (scraperData.emails && scraperData.emails.length > 0) {
                emailFound = scraperData.emails[0];
                updateData.email = emailFound;
                updateData.email_confidence = "likely";
              }
            }
          } catch (err) {
            console.error("Vercel email scraper failed:", err);
          }
        }
      } catch (err) {
        console.error("Email discovery failed:", err);
      }
    }

    // Layer 3: Instagram bio scraping
    if (!emailFound && lead.has_instagram && lead.instagram_url) {
      try {
        console.log(`[enrich-contact] Fetching Instagram URL for bio scraping: ${lead.instagram_url}`);
        const igRes = await fetch(lead.instagram_url, {
          headers: {
            "User-Agent": "Mozilla/5.0 (compatible; LanceConnect/1.0)",
          },
          signal: AbortSignal.timeout(8000),
        });
        const igHtml = await igRes.text();

        // Extract emails from Instagram page HTML
        const emailPattern = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g;
        const igEmails = igHtml.match(emailPattern) || [];

        // Also look for WhatsApp numbers in bio
        const waPattern = /wa\.me\/(\d+)/g;
        const waMatches = igHtml.match(waPattern) || [];

        if (igEmails.length > 0) {
          emailFound = igEmails[0];
          updateData.email = emailFound;
          updateData.email_confidence = "likely";
          console.log(`[enrich-contact] Found email in Instagram bio: ${emailFound}`);
        }

        if (waMatches.length > 0 && !lead.phone) {
          // Extract WhatsApp number if no phone was found
          const waNumber = waMatches[0].replace("wa.me/", "+");
          console.log(`[enrich-contact] Found WhatsApp number in Instagram bio: ${waNumber}`);
          await supabase
            .from("leads")
            .update({ phone: waNumber })
            .eq("id", lead.id);
        }
      } catch (e: any) {
        console.warn(`[enrich-contact] Instagram scrape failed: ${e.message}`);
      }
    }

    // 3. Email verification (Mailboxlayer)
    if (emailFound && !lead.email_verified && mailboxlayerApiKey) {
      try {
        const mailRes = await fetch(
          `http://apilayer.net/api/check?access_key=${mailboxlayerApiKey}&email=${encodeURIComponent(emailFound)}&smtp=1`,
          { signal: AbortSignal.timeout(5000) },
        );
        if (mailRes.ok) {
          const mailData = await mailRes.json();
          updateData.email_verified = mailData.smtp_check;
          if (updateData.email_verified) {
            updateData.email_verified_at = new Date().toISOString();
            updateData.email_confidence = "verified";
          } else {
            updateData.email_confidence = "unverified";
          }
        }
      } catch (err) {
        console.error("Mailboxlayer API check failed:", err);
      }
    } else if (!emailFound) {
      updateData.email = null;
    }

    // 4. Google PageSpeed Audit
    if (lead.website_url && lead.has_website) {
      try {
        let testUrl = lead.website_url;
        if (!testUrl.startsWith("http://") && !testUrl.startsWith("https://")) {
          testUrl = `https://${testUrl}`;
        }
        const pageSpeedUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(testUrl)}&strategy=mobile`;

        const speedRes = await fetch(pageSpeedUrl, { signal: AbortSignal.timeout(8000) });
        if (speedRes.ok) {
          const speedData = await speedRes.json();
          const audit = speedData.lighthouseResult;
          const performanceScore = audit?.categories?.performance?.score;
          const mobileFriendly = audit?.audits?.["viewport"]?.score === 1;

          if (performanceScore !== undefined) {
            updateData.website_score = Math.round(performanceScore * 100);
          }
          updateData.website_mobile_ok = mobileFriendly;
          updateData.website_live = true;
          updateData.website_has_ssl = testUrl.startsWith("https://");
          updateData.last_verified_at = new Date().toISOString();
        }
      } catch (err) {
        console.error("Google PageSpeed check failed:", err);
      }
    }

    // 5. Website Screenshot (Screenshotlayer API)
    if (lead.website_url && lead.has_website && screenshotKey) {
      try {
        let testUrl = lead.website_url;
        if (!testUrl.startsWith("http://") && !testUrl.startsWith("https://")) {
          testUrl = `https://${testUrl}`;
        }
        console.log(`Capturing website screenshot for ${testUrl} via Screenshotlayer...`);
        const screenRes = await fetch(
          `https://api.screenshotlayer.com/api/capture?access_key=${screenshotKey}&url=${encodeURIComponent(testUrl)}&viewport=1440x900&format=PNG`,
          { signal: AbortSignal.timeout(8000) },
        );
        if (screenRes.ok) {
          const imageBlob = await screenRes.blob();

          // Ensure bucket exist check or auto upload
          const { error: uploadError } = await supabase.storage
            .from("screenshots")
            .upload(`${leadId}.png`, imageBlob, { contentType: "image/png", upsert: true });

          if (uploadError) {
            console.error("Failed to upload screenshot to Supabase Storage:", uploadError.message);
          } else {
            const { data: publicUrlData } = supabase.storage
              .from("screenshots")
              .getPublicUrl(`${leadId}.png`);

            if (publicUrlData?.publicUrl) {
              updateData.website_screenshot = publicUrlData.publicUrl;
              console.log(`Saved screenshot URL: ${publicUrlData.publicUrl}`);
            }
          }
        } else {
          console.warn(`Screenshotlayer failed with status ${screenRes.status}`);
        }
      } catch (err) {
        console.error("Screenshotlayer API capture failed:", err);
      }
    }

    // Save enrichment results
    const { data: updatedLead, error: updateError } = await supabase
      .from("leads")
      .update(updateData)
      .eq("id", leadId)
      .select()
      .single();

    if (updateError) throw updateError;

    // Automatically trigger opportunity scoring recalculation after enrichment
    try {
      await fetch(`${supabaseUrl}/functions/v1/score-opportunity`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: req.headers.get("Authorization") || "",
        },
        body: JSON.stringify({ leadId }),
      });
    } catch (scoreErr) {
      console.error("Failed to trigger score-opportunity after enrichment:", scoreErr);
    }

    // Log Action to Audit Log
    try {
      await supabase.from("audit_log").insert({
        user_id: user.id,
        action: "lead.enriched",
        entity_type: "lead",
        entity_id: leadId,
        metadata: {
          phone_checked: !!numverifyApiKey,
          email_searched: true,
          email_verified: !!mailboxlayerApiKey,
        },
        ip_address: ipAddress,
        user_agent: req.headers.get("user-agent") || null,
      });
    } catch (auditErr) {
      console.error("Failed to insert audit log:", auditErr);
    }

    return new Response(JSON.stringify({ success: true, lead: updatedLead }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    Sentry.captureException(error);
    return handleError(error);
  }
});
