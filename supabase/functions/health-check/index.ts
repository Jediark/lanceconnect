import * as Sentry from "npm:@sentry/deno";
Sentry.init({
  dsn: Deno.env.get("SENTRY_DSN_BACKEND"),
  environment: Deno.env.get("ENVIRONMENT") || "production",
  tracesSampleRate: 0.1,
});

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";
import { handleError } from "../_shared/errors.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const startTime = Date.now();
    const checks: Record<string, any> = {};

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceKey) {
      return new Response(
        JSON.stringify({
          status: "ERROR",
          message: "Server environment misconfigured: missing environment variables",
          timestamp: new Date().toISOString(),
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 1. Database
    try {
      const { error } = await supabase.from("profiles").select("id").limit(1);
      checks.database = { status: error ? "error" : "ok", ...(error && { message: error.message }) };
    } catch (e: any) {
      checks.database = { status: "error", message: e.message };
    }

    // 2. Apify Service (Railway)
    try {
      const apifyUrl = Deno.env.get("APIFY_SERVICE_URL");
      if (apifyUrl) {
        const res = await fetch(`${apifyUrl}/health`, { signal: AbortSignal.timeout(5000) });
        checks.apify = { status: res.ok ? "ok" : "error", httpStatus: res.status };
      } else {
        checks.apify = { status: "skipped", message: "APIFY_SERVICE_URL not configured" };
      }
    } catch (e: any) {
      checks.apify = { status: "error", message: e.message };
    }

    // 3. Maigret Service (Railway)
    try {
      const maigretUrl = Deno.env.get("MAIGRET_SERVICE_URL");
      if (maigretUrl) {
        const res = await fetch(`${maigretUrl}/health`, { signal: AbortSignal.timeout(5000) });
        checks.maigret = { status: res.ok ? "ok" : "error", httpStatus: res.status };
      } else {
        checks.maigret = { status: "skipped", message: "MAIGRET_SERVICE_URL not configured" };
      }
    } catch (e: any) {
      checks.maigret = { status: "error", message: e.message };
    }

    // 4. Vercel Email Scraper
    try {
      const emailScraperUrl = Deno.env.get("EMAIL_SCRAPER_URL") || "https://lanceconnect.vercel.app/api/scrape";
      const baseUrl = emailScraperUrl.replace("/api/scrape", "").replace("/scrape", "");
      const res = await fetch(baseUrl, { signal: AbortSignal.timeout(5000) });
      checks.email_scraper = { status: res.ok ? "ok" : "error", httpStatus: res.status };
    } catch (e: any) {
      checks.email_scraper = { status: "error", message: e.message };
    }

    // 5. OpenCage Geocoding
    try {
      const openCageKey = Deno.env.get("OPENCAGE_API_KEY");
      if (openCageKey) {
        const res = await fetch(
          `https://api.opencagedata.com/geocode/v1/json?q=Lagos&key=${openCageKey}&limit=1`,
          { signal: AbortSignal.timeout(5000) },
        );
        const data = await res.json();
        checks.opencage = { status: data.results?.length > 0 ? "ok" : "error" };
      } else {
        checks.opencage = { status: "skipped", message: "OPENCAGE_API_KEY not configured" };
      }
    } catch (e: any) {
      checks.opencage = { status: "error", message: e.message };
    }

    // 6. Prospeo Email Finder
    try {
      const prospeoKey = Deno.env.get("PROSPEO_LANCECONNECT_API_KEY");
      if (prospeoKey) {
        const res = await fetch("https://api.prospeo.io/domain-search", {
          method: "POST",
          headers: { "X-KEY": prospeoKey, "Content-Type": "application/json" },
          body: JSON.stringify({ domain: "google.com" }),
          signal: AbortSignal.timeout(5000),
        });
        checks.prospeo = { status: res.ok ? "ok" : "error", httpStatus: res.status };
      } else {
        checks.prospeo = { status: "skipped", message: "PROSPEO_LANCECONNECT_API_KEY not configured" };
      }
    } catch (e: any) {
      checks.prospeo = { status: "error", message: e.message };
    }

    // 7. Mailboxlayer Email Verification
    try {
      const mailboxKey = Deno.env.get("MAILBOXLAYER_API_KEY");
      if (mailboxKey) {
        const res = await fetch(
          `http://apilayer.net/api/check?access_key=${mailboxKey}&email=test@gmail.com`,
          { signal: AbortSignal.timeout(5000) },
        );
        checks.mailboxlayer = { status: res.ok ? "ok" : "error", httpStatus: res.status };
      } else {
        checks.mailboxlayer = { status: "skipped", message: "MAILBOXLAYER_API_KEY not configured" };
      }
    } catch (e: any) {
      checks.mailboxlayer = { status: "error", message: e.message };
    }

    // 8. Numverify Phone Validation
    try {
      const numverifyKey = Deno.env.get("NUMVERIFY_API_KEY");
      if (numverifyKey) {
        const res = await fetch(
          `http://apilayer.net/api/validate?access_key=${numverifyKey}&number=14158586273`,
          { signal: AbortSignal.timeout(5000) },
        );
        checks.numverify = { status: res.ok ? "ok" : "error", httpStatus: res.status };
      } else {
        checks.numverify = { status: "skipped", message: "NUMVERIFY_API_KEY not configured" };
      }
    } catch (e: any) {
      checks.numverify = { status: "error", message: e.message };
    }

    // 9. Gemini AI
    try {
      const geminiKey = Deno.env.get("Google_Gemini_API_KEY") || Deno.env.get("GEMINI_API_KEY");
      if (geminiKey) {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models?key=${geminiKey}`,
          { signal: AbortSignal.timeout(5000) },
        );
        checks.gemini = { status: res.ok ? "ok" : "error", httpStatus: res.status };
      } else {
        checks.gemini = { status: "skipped", message: "GEMINI_API_KEY not configured" };
      }
    } catch (e: any) {
      checks.gemini = { status: "error", message: e.message };
    }

    // 10. Anthropic Claude
    try {
      const anthropicKey = Deno.env.get("ANTHROPIC_API_KEY");
      if (anthropicKey) {
        const res = await fetch("https://api.anthropic.com/v1/models", {
          headers: {
            "x-api-key": anthropicKey,
            "anthropic-version": "2023-06-01",
          },
          signal: AbortSignal.timeout(5000),
        });
        checks.claude = { status: res.ok ? "ok" : "error", httpStatus: res.status };
      } else {
        checks.claude = { status: "skipped", message: "ANTHROPIC_API_KEY not configured" };
      }
    } catch (e: any) {
      checks.claude = { status: "error", message: e.message };
    }

    // 11. Resend Email
    try {
      const resendKey = Deno.env.get("RESEND_API_KEY_LANCECONNECT") || Deno.env.get("RESEND_API_KEY");
      if (resendKey) {
        const res = await fetch("https://api.resend.com/domains", {
          headers: { Authorization: `Bearer ${resendKey}` },
          signal: AbortSignal.timeout(5000),
        });
        checks.resend = { status: res.ok ? "ok" : "error", httpStatus: res.status };
      } else {
        checks.resend = { status: "skipped", message: "RESEND_API_KEY not configured" };
      }
    } catch (e: any) {
      checks.resend = { status: "error", message: e.message };
    }

    // 12. Screenshotlayer
    try {
      const screenshotKey = Deno.env.get("SCREENSHOTLAYER_API_KEY");
      if (screenshotKey) {
        const res = await fetch(
          `https://api.screenshotlayer.com/api/capture?access_key=${screenshotKey}&url=https://google.com&width=100`,
          { signal: AbortSignal.timeout(8000) },
        );
        checks.screenshotlayer = { status: res.ok ? "ok" : "error", httpStatus: res.status };
      } else {
        checks.screenshotlayer = { status: "skipped", message: "SCREENSHOTLAYER_API_KEY not configured" };
      }
    } catch (e: any) {
      checks.screenshotlayer = { status: "error", message: e.message };
    }

    // 13. Stripe
    try {
      const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
      if (stripeKey) {
        const res = await fetch("https://api.stripe.com/v1/balance", {
          headers: { Authorization: `Bearer ${stripeKey}` },
          signal: AbortSignal.timeout(5000),
        });
        checks.stripe = { status: res.ok ? "ok" : "error", httpStatus: res.status };
      } else {
        checks.stripe = { status: "skipped", message: "STRIPE_SECRET_KEY not configured" };
      }
    } catch (e: any) {
      checks.stripe = { status: "error", message: e.message };
    }

    // 14. Paystack
    try {
      const paystackKey = Deno.env.get("PAYSTACK_SECRET_KEY");
      if (paystackKey) {
        const res = await fetch("https://api.paystack.co/balance", {
          headers: { Authorization: `Bearer ${paystackKey}` },
          signal: AbortSignal.timeout(5000),
        });
        checks.paystack = { status: res.ok ? "ok" : "error", httpStatus: res.status };
      } else {
        checks.paystack = { status: "skipped", message: "PAYSTACK_SECRET_KEY not configured" };
      }
    } catch (e: any) {
      checks.paystack = { status: "error", message: e.message };
    }

    const allHealthy = Object.values(checks).every(
      (c: any) => c.status === "ok" || c.status === "skipped",
    );
    const responseTime = Date.now() - startTime;

    return new Response(
      JSON.stringify({
        status: allHealthy ? "healthy" : "degraded",
        checks,
        response_time_ms: responseTime,
        timestamp: new Date().toISOString(),
        version: "2.0.0",
        environment: Deno.env.get("ENVIRONMENT") || "production",
      }),
      {
        status: allHealthy ? 200 : 503,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    Sentry.captureException(error);
    return handleError(error);
  }
});
