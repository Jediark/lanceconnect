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
    const maigretServiceUrl =
      Deno.env.get("MAIGRET_SERVICE_URL") || "http://maigret-service.internal:8001";

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new AppError("Server is not configured correctly", 500, "MISCONFIGURED");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Enforce Rate Limit: 50 requests/hour for social check
    const ipAddress = req.headers.get("x-real-ip") || req.headers.get("x-forwarded-for") || null;
    const rateLimit = await checkRateLimit(supabase, user.id, ipAddress, "check-social", 50, 3600);
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

    // Clean business name to use as username candidate
    const username = lead.business_name.toLowerCase().replace(/[^a-z0-9]/g, "");

    if (!username) {
      throw new AppError(
        "Could not generate a valid social handle candidate from business name",
        400,
        "BAD_REQUEST",
      );
    }

    console.log(`Starting Maigret social scan for: ${username} via ${maigretServiceUrl}`);

    // Query Maigret microservice
    let maigretData: any = {};
    try {
      const internalApiKey = Deno.env.get("INTERNAL_API_KEY");
      const maigretRes = await fetch(`${maigretServiceUrl}/scan?username=${username}`, {
        method: "GET",
        headers: internalApiKey ? { Authorization: `Bearer ${internalApiKey}` } : undefined,
        signal: AbortSignal.timeout(10000), // 10s timeout
      });

      if (maigretRes.ok) {
        maigretData = await maigretRes.json();
      } else {
        console.warn(`Maigret microservice returned non-200 status: ${maigretRes.status}`);
      }
    } catch (fetchErr) {
      console.warn(
        "Failed to contact Maigret microservice, falling back to empty social check",
        fetchErr,
      );
    }

    // Map scanned socials
    const updateData: any = {
      social_scan_done: true,
      social_scanned_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (maigretData.platforms) {
      const p = maigretData.platforms;
      if (p.facebook?.exists) {
        updateData.has_facebook = true;
        updateData.facebook_url = p.facebook.url;
      }
      if (p.instagram?.exists) {
        updateData.has_instagram = true;
        updateData.instagram_url = p.instagram.url;
      }
      if (p.twitter?.exists) {
        updateData.has_twitter = true;
        updateData.twitter_url = p.twitter.url;
      }
      if (p.tiktok?.exists) {
        updateData.has_tiktok = true;
      }
      if (p.linkedin?.exists) {
        updateData.has_linkedin = true;
      }
      if (p.youtube?.exists) {
        updateData.has_youtube = true;
      }
    }

    // Update the lead record
    const { data: updatedLead, error: updateError } = await supabase
      .from("leads")
      .update(updateData)
      .eq("id", leadId)
      .select()
      .single();

    if (updateError) throw updateError;

    // Recalculate score (internal score-opportunity API trigger)
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
      console.error("Failed to trigger score-opportunity after social check:", scoreErr);
    }

    // Log Action to Audit Log
    try {
      await supabase.from("audit_log").insert({
        user_id: user.id,
        action: "lead.social_scanned",
        entity_type: "lead",
        entity_id: leadId,
        metadata: { username_searched: username },
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
