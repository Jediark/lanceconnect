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
import Stripe from "https://esm.sh/stripe@12.0.0";

const requestSchema = z.object({}); // Expects empty request body

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const user = await validateAuth(req);
    if (!user) {
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
    }

    // Verify empty body (or parse correctly)
    const body = await req.json().catch(() => ({}));
    const parsed = requestSchema.safeParse(body);
    if (!parsed.success) {
      return new Response(
        JSON.stringify({ error: "VALIDATION_FAILED", details: parsed.error.flatten() }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    const paystackSecretKey = Deno.env.get("PAYSTACK_SECRET_KEY");

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new AppError("Server is not configured correctly", 500, "MISCONFIGURED");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Enforce Rate Limit: 50 requests/hour for account deletion
    const ipAddress = req.headers.get("x-real-ip") || req.headers.get("x-forwarded-for") || null;
    const rateLimit = await checkRateLimit(
      supabase,
      user.id,
      ipAddress,
      "delete-account",
      50,
      3600,
    );
    if (!rateLimit.allowed) {
      throw new AppError("Too many requests. Please try again later.", 429, "RATE_LIMIT_EXCEEDED");
    }

    // 1. Fetch user profile to check active subscriptions
    const { data: profile, error: profileErr } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileErr || !profile) {
      throw new AppError("User profile not found", 404, "NOT_FOUND");
    }

    // 2. Cancel Stripe subscription if one exists
    if (profile.stripe_subscription_id && stripeSecretKey) {
      try {
        console.log(`Cancelling active Stripe subscription: ${profile.stripe_subscription_id}`);
        const stripe = new Stripe(stripeSecretKey, {
          apiVersion: "2022-11-15",
          httpClient: Stripe.createFetchHttpClient(),
        });
        await stripe.subscriptions.cancel(profile.stripe_subscription_id);
        console.log("Stripe subscription cancelled successfully.");
      } catch (err) {
        console.error("Failed to cancel Stripe subscription during account deletion:", err);
      }
    }

    // 3. Cancel Paystack subscription if one exists
    if (profile.paystack_subscription_code && paystackSecretKey) {
      try {
        console.log(
          `Cancelling active Paystack subscription: ${profile.paystack_subscription_code}`,
        );
        const paystackRes = await fetch("https://api.paystack.co/subscription/disable", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${paystackSecretKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            code: profile.paystack_subscription_code,
            token: "dummy_token", // Dummy token as code is the main unique identifier
          }),
        });
        const paystackData = await paystackRes.json();
        console.log("Paystack subscription cancel result:", paystackData);
      } catch (err) {
        console.error("Failed to cancel Paystack subscription during account deletion:", err);
      }
    }

    // 4. Log Action to Audit Log before executing table deletes
    try {
      await supabase.from("audit_log").insert({
        user_id: user.id,
        action: "account.deleted",
        entity_type: "account",
        metadata: { email: profile.email, plan: profile.plan },
        ip_address: ipAddress,
        user_agent: req.headers.get("user-agent") || null,
      });
    } catch (auditErr) {
      console.error("Failed to insert audit log prior to user delete:", auditErr);
    }

    // 5. Delete user data in strict sequence:
    // ai_messages → credit_transactions → search_history → outreach_templates → user_leads → audit_log → rate_limit_log → profiles
    console.log(`Executing sequential GDPR deletion for user: ${user.id}`);

    const tablesToDelete = [
      "ai_messages",
      "credit_transactions",
      "search_history",
      "outreach_templates",
      "user_leads",
      "audit_log",
      "rate_limit_log",
      "profiles",
    ];

    for (const table of tablesToDelete) {
      const { error: deleteErr } = await supabase.from(table).delete().eq("user_id", user.id);

      if (deleteErr) {
        console.error(`Error deleting from table "${table}":`, deleteErr.message);
      }
    }

    // 6. Delete user from auth.users (requires service role / admin privileges)
    console.log(`Deleting user from auth.users: ${user.id}`);
    const { error: authDeleteErr } = await supabase.auth.admin.deleteUser(user.id);
    if (authDeleteErr) {
      throw new Error(`Failed to delete user from Supabase Auth: ${authDeleteErr.message}`);
    }

    return new Response(JSON.stringify({ deleted: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    Sentry.captureException(error);
    return handleError(error);
  }
});
