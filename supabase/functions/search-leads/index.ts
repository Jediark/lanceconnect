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
import { sendEmail, getWelcomeEmailHtml, getQuotaWarningEmailHtml } from "../_shared/email.ts";
import { z } from "https://esm.sh/zod@3.22.0";

const requestSchema = z.object({
  query: z.string().min(1),
  city: z.string().min(1),
  country: z.string().min(1),
  limit: z.number().optional().default(10),
  product: z.string().optional(),
  niche: z.string().optional(),
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

    const { query, city, country, limit, product, niche } = parsed.data;

    // Map skill category IDs to target local business niches (potential clients)
    const categoryNiches: Record<string, string[]> = {
      web_dev: ["restaurant", "bakery", "beauty salon", "plumber", "auto repair", "dry cleaner"],
      seo: ["dentist", "chiropractor", "gym", "law firm", "medical clinic", "pest control"],
      designer: ["cafe", "boutique", "bakery", "spa", "restaurant", "florist"],
      copywriter: ["lawyer", "clinic", "consultant", "accountant", "architect"],
      social_media: ["gym", "beauty salon", "boutique", "cafe", "restaurant", "fitness studio"],
      video: ["real estate agency", "hotel", "private school", "gym", "resort"],
      photography: ["restaurant", "hotel", "boutique", "wedding planner", "portrait studio"],
      marketing: ["contractor", "garage", "dentist", "private school", "roofing contractor"],
      app_dev: ["restaurant", "pharmacy", "taxi service", "gym", "food delivery"],
      va: ["consultant", "coaching", "shortcut", "law firm", "real estate agent"],
      tutor: [
        "primary school",
        "secondary school",
        "learning center",
        "tutoring center",
        "language school",
        "university",
        "college",
      ],
      african_food_export: [
        "african food store",
        "caribbean food importer",
        "ethnic food wholesaler",
        "african restaurant",
        "international food distributor",
        "african caribbean supermarket",
        "ethnic grocery",
      ],
      restaurant_supplier: [
        "restaurant",
        "hotel kitchen",
        "catering company",
        "food service company",
        "pub kitchen",
        "cafe",
      ],
      product_export: [
        "food importer",
        "commodity trader",
        "wholesale distributor",
        "import export company",
        "international trader",
      ],
      b2b_trade: [
        "manufacturer",
        "wholesale supplier",
        "distributor",
        "procurement company",
        "buying agent",
        "trading company",
      ],
      corporate_training: [
        "corporate office",
        "hr department",
        "private school administrative office",
        "training center",
        "business headquarters",
        "non profit organization",
      ],
    };

    let searchKeyword = query;
    if (niche) {
      searchKeyword = niche;
      console.log(`Overriding search category with niche query: "${searchKeyword}"`);
    } else if (query in categoryNiches) {
      const niches = categoryNiches[query];
      // Pick a random niche to keep results fresh and diverse
      searchKeyword = niches[Math.floor(Math.random() * niches.length)];
      console.log(`Mapped category "${query}" to client niche keyword "${searchKeyword}"`);
    }

    if (
      product &&
      ["african_food_export", "b2b_trade", "restaurant_supplier", "product_export"].includes(query)
    ) {
      searchKeyword = `${searchKeyword} ${product}`;
      console.log(`Appended product to query: "${searchKeyword}"`);
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const apifyServiceUrl =
      Deno.env.get("APIFY_SERVICE_URL") || "http://apify-service.internal:8002";
    const openCageApiKey = Deno.env.get("OPENCAGE_API_KEY");

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new AppError("Server is not configured correctly", 500, "MISCONFIGURED");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Enforce Rate Limit: 10 requests/hour for search-leads
    const ipAddress = req.headers.get("x-real-ip") || req.headers.get("x-forwarded-for") || null;
    const rateLimit = await checkRateLimit(supabase, user.id, ipAddress, "search-leads", 10, 3600);
    if (!rateLimit.allowed) {
      throw new AppError("Too many requests. Please try again later.", 429, "RATE_LIMIT_EXCEEDED");
    }

    // Fetch user details for welcome email and quota warnings
    const { data: profile } = await supabase
      .from("profiles")
      .select(
        "email, full_name, welcome_email_sent, quota_warning_sent, leads_used_this_month, leads_limit",
      )
      .eq("id", user.id)
      .single();

    // 1. Welcome on registration email check
    if (profile && !profile.welcome_email_sent) {
      console.log(`Sending welcome email to new user: ${profile.email}`);
      await sendEmail({
        to: profile.email,
        subject: "Welcome to LanceConnect! 🎉",
        html: getWelcomeEmailHtml(profile.full_name || "Freelancer"),
      });
      await supabase.from("profiles").update({ welcome_email_sent: true }).eq("id", user.id);
    }

    // 2. Check user lead limits
    const { data: limitCheck, error: limitErr } = await supabase.rpc("check_lead_limit", {
      p_user_id: user.id,
      p_count: 1,
    });

    if (limitErr) {
      throw new Error(`Quota check failed: ${limitErr.message}`);
    }

    if (!limitCheck) {
      throw new AppError(
        "Monthly lead limit or credits exhausted. Please upgrade your plan.",
        402,
        "QUOTA_EXHAUSTED",
      );
    }

    // 3. Query cached database first
    const { data: cachedLeads, error: cacheError } = await supabase
      .from("leads")
      .select("*")
      .eq("country", country)
      .ilike("city", city)
      .or(`industry.ilike.%${query}%,business_type.ilike.%${query}%,business_name.ilike.%${query}%`)
      .gt("cache_expires_at", new Date().toISOString())
      .limit(limit);

    if (cacheError) {
      console.warn("Cache query failed, proceeding directly to scrape:", cacheError);
    }

    let finalLeads = cachedLeads || [];

    // 4. Geocode using OpenCage API if provided (improves accuracy)
    let lat: number | null = null;
    let lng: number | null = null;

    if (finalLeads.length < 3 && openCageApiKey) {
      try {
        console.log(`Geocoding city "${city}, ${country}" using OpenCage...`);
        const geoRes = await fetch(
          `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(`${city}, ${country}`)}&key=${openCageApiKey}`,
          { signal: AbortSignal.timeout(5000) },
        );
        if (geoRes.ok) {
          const geoData = await geoRes.json();
          if (geoData.results && geoData.results.length > 0) {
            lat = geoData.results[0].geometry.lat;
            lng = geoData.results[0].geometry.lng;
            console.log(`Geocoded to lat: ${lat}, lng: ${lng}`);
          }
        }
      } catch (err) {
        console.error("OpenCage geocoding failed:", err);
      }
    }

    // 5. Fallback to scrape if cache is empty or insufficient
    if (finalLeads.length < 3) {
      console.log(
        `Cache miss for category "${query}" (keyword "${searchKeyword}") in ${city}, ${country}. Invoking Apify scraper...`,
      );

      try {
        let scrapeUrl = `${apifyServiceUrl}/scrape?keyword=${encodeURIComponent(searchKeyword)}&city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&limit=10`;
        if (lat !== null && lng !== null) {
          scrapeUrl += `&lat=${lat}&lng=${lng}`;
        }

        const apifyToken = Deno.env.get("APIFY_API_KEY_LANCECONNECT");
        const headers: Record<string, string> = {};
        if (apifyToken) {
          headers["Authorization"] = `Bearer ${apifyToken}`;
        }

        const scrapeRes = await fetch(scrapeUrl, {
          method: "GET",
          headers,
          signal: AbortSignal.timeout(55000), // 55s timeout — Apify actor runs take 20-45s
        });

        if (scrapeRes.ok) {
          const scrapedData = await scrapeRes.json();
          const newLeads = scrapedData.leads || [];

          if (newLeads.length > 0) {
            const leadsToInsert = newLeads.map((item: any) => ({
              business_name: item.business_name,
              business_type: item.business_type || searchKeyword,
              industry: query,
              description: product
                ? item.description
                  ? `${item.description} (Product Interest: ${product})`
                  : `Product Interest: ${product}`
                : item.description || null,
              country,
              city,
              full_address: item.full_address || null,
              phone: item.phone || null,
              email: item.email || null,
              website_url: item.website_url || null,
              has_website: !!item.website_url,
              google_place_id: item.google_place_id || null,
              google_rating: item.google_rating || null,
              google_review_count: item.google_review_count || 0,
              google_maps_url: item.google_maps_url || null,
              source: "google_maps",
              cache_expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days cache
            }));

            // Batch upsert leads ignoring duplicates on google_place_id
            const { data: insertedLeads, error: upsertError } = await supabase
              .from("leads")
              .upsert(leadsToInsert, { onConflict: "google_place_id" })
              .select();

            if (upsertError) {
              console.error("Failed to upsert scraped leads into database:", upsertError);
            } else if (insertedLeads) {
              // Trigger socials lookup (which in turn triggers scoring) for the newly scraped leads asynchronously
              for (const newLead of insertedLeads) {
                fetch(`${supabaseUrl}/functions/v1/check-social`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: req.headers.get("Authorization") || "",
                  },
                  body: JSON.stringify({ leadId: newLead.id }),
                }).catch((err) =>
                  console.error("Async social check trigger failed for lead:", newLead.id, err),
                );
              }

              // Append to final results
              finalLeads = [...finalLeads, ...insertedLeads].slice(0, limit);
            }
          }
        } else {
          console.warn(`Apify microservice returned status ${scrapeRes.status}`);
        }
      } catch (scrapeErr) {
        console.error("Apify service call failed:", scrapeErr);
      }
    }

    // 6. Deduct quota and log search
    await supabase.rpc("consume_leads", {
      p_user_id: user.id,
      p_count: 1,
    });

    await supabase.from("search_history").insert({
      user_id: user.id,
      query_params: { query, city, country },
      results_count: finalLeads.length,
      leads_consumed: 1,
    });

    // 7. Check 80% usage threshold for quota warnings
    if (profile) {
      const updatedUsed = (profile.leads_used_this_month || 0) + 1;
      const limitVal = profile.leads_limit || 10;
      const usagePercent = (updatedUsed / limitVal) * 100;

      if (usagePercent >= 80 && !profile.quota_warning_sent) {
        console.log(
          `User ${profile.email} has hit 80% quota threshold (${updatedUsed}/${limitVal}). Sending warning email...`,
        );
        await sendEmail({
          to: profile.email,
          subject: "Action Required: 80% of Monthly Leads Used ⚠️",
          html: getQuotaWarningEmailHtml(profile.full_name || "Freelancer", updatedUsed, limitVal),
        });
        await supabase.from("profiles").update({ quota_warning_sent: true }).eq("id", user.id);
      }
    }

    // 8. Insert Action to Audit Log
    try {
      await supabase.from("audit_log").insert({
        user_id: user.id,
        action: "lead.searched",
        entity_type: "lead",
        metadata: { query, city, country, results_count: finalLeads.length },
        ip_address: ipAddress,
        user_agent: req.headers.get("user-agent") || null,
      });
    } catch (auditErr) {
      console.warn("Failed to insert audit log:", auditErr);
    }

    return new Response(JSON.stringify({ success: true, leads: finalLeads }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    Sentry.captureException(error);
    return handleError(error);
  }
});
