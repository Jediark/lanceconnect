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
  planName: z.string().optional(),
  checkoutType: z.enum(["subscription", "credits"]).optional().default("subscription"),
  creditsAmount: z.number().optional().default(0),
  currency: z.string().optional().default("NGN"),
  callbackUrl: z.string(),
});

/**
 * Paystack Checkout Edge Function
 * ================================
 * Initializes a Paystack payment transaction for:
 *  - Subscription plans (Individual ₦10,000 / $7, Company ₦30,000 / $20)
 *  - One-off credit purchases
 *
 * Paystack API: https://paystack.com/docs/api/transaction/#initialize
 */

// Fixed pricing tiers — avoids volatile exchange-rate issues
const PRICING: Record<string, Record<string, { amount: number; currency: string }>> = {
  individual: {
    NGN: { amount: 1_000_000, currency: "NGN" }, // ₦10,000 in kobo
    USD: { amount: 700, currency: "USD" }, // $7 in cents
    GHS: { amount: 5_000, currency: "GHS" }, // GH₵50 in pesewas
    ZAR: { amount: 12_000, currency: "ZAR" }, // R120 in cents
    KES: { amount: 100_000, currency: "KES" }, // KSh1,000 in cents
  },
  company: {
    NGN: { amount: 3_000_000, currency: "NGN" }, // ₦30,000 in kobo
    USD: { amount: 2_000, currency: "USD" }, // $20 in cents
    GHS: { amount: 15_000, currency: "GHS" }, // GH₵150 in pesewas
    ZAR: { amount: 35_000, currency: "ZAR" }, // R350 in cents
    KES: { amount: 300_000, currency: "KES" }, // KSh3,000 in cents
  },
};

// Credits: ₦50 per credit (NGN), $0.20 per credit (USD)
const CREDIT_RATES: Record<string, number> = {
  NGN: 5_000, // ₦50 in kobo
  USD: 20, // $0.20 in cents
  GHS: 500, // GH₵5 in pesewas
  ZAR: 600, // R6 in cents
  KES: 5_000, // KSh50 in cents
};

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
    const { planName, checkoutType, creditsAmount, currency, callbackUrl } = parsed.data;

    const paystackSecretKey = Deno.env.get("PAYSTACK_SECRET_KEY");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!paystackSecretKey || !supabaseUrl || !supabaseServiceKey) {
      throw new AppError("Server is not configured correctly", 500, "MISCONFIGURED");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Enforce Rate Limit: 50 requests/hour for checkout creation
    const ipAddress = req.headers.get("x-real-ip") || req.headers.get("x-forwarded-for") || null;
    const rateLimit = await checkRateLimit(
      supabase,
      user.id,
      ipAddress,
      "paystack-checkout",
      50,
      3600,
    );
    if (!rateLimit.allowed) {
      throw new AppError("Too many requests. Please try again later.", 429, "RATE_LIMIT_EXCEEDED");
    }

    // Get user email from profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("email, paystack_customer_code")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      throw new AppError("User profile not found", 404, "NOT_FOUND");
    }

    let amountInSubunit: number;
    let txCurrency: string;
    let description: string;

    if (checkoutType === "subscription") {
      if (!planName || !PRICING[planName]) {
        throw new AppError(
          `Invalid planName. Supported: ${Object.keys(PRICING).join(", ")}`,
          400,
          "BAD_REQUEST",
        );
      }

      const currencyKey = currency.toUpperCase();
      const tier = PRICING[planName][currencyKey] || PRICING[planName]["USD"];
      amountInSubunit = tier.amount;
      txCurrency = tier.currency;
      description = `LanceConnect ${planName.charAt(0).toUpperCase() + planName.slice(1)} Plan – Monthly`;
    } else if (checkoutType === "credits") {
      if (creditsAmount <= 0) {
        throw new AppError("creditsAmount must be greater than 0", 400, "BAD_REQUEST");
      }

      const currencyKey = currency.toUpperCase();
      const rate = CREDIT_RATES[currencyKey] || CREDIT_RATES["USD"];
      txCurrency = currencyKey in CREDIT_RATES ? currencyKey : "USD";
      amountInSubunit = creditsAmount * rate;
      description = `${creditsAmount} LanceConnect Lead Credits`;
    } else {
      throw new AppError(
        "Invalid checkoutType. Supported: subscription, credits",
        400,
        "BAD_REQUEST",
      );
    }

    // Initialize Paystack transaction
    const paystackPayload = {
      email: profile.email,
      amount: amountInSubunit,
      currency: txCurrency,
      callback_url: callbackUrl,
      metadata: {
        custom_fields: [
          { display_name: "Plan", variable_name: "plan_name", value: planName || "" },
          { display_name: "Type", variable_name: "checkout_type", value: checkoutType },
          {
            display_name: "Credits",
            variable_name: "credits_amount",
            value: String(creditsAmount),
          },
        ],
        supabase_user_id: user.id,
        checkout_type: checkoutType,
        plan_name: planName || "",
        credits_amount: creditsAmount,
      },
    };

    // If user already has a Paystack customer code, attach it
    if (profile.paystack_customer_code) {
      (paystackPayload as Record<string, unknown>).customer = profile.paystack_customer_code;
    }

    const paystackRes = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${paystackSecretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paystackPayload),
    });

    const paystackData = await paystackRes.json();

    if (!paystackData.status) {
      console.error("Paystack init failed:", paystackData);
      throw new AppError(
        paystackData.message || "Paystack transaction initialization failed",
        502,
        "PAYSTACK_ERROR",
      );
    }

    // Log Action to Audit Log
    try {
      await supabase.from("audit_log").insert({
        user_id: user.id,
        action: "checkout.paystack_initialized",
        entity_type: "payment",
        metadata: {
          plan_name: planName || "",
          checkout_type: checkoutType,
          currency,
          reference: paystackData.data.reference,
        },
        ip_address: ipAddress,
        user_agent: req.headers.get("user-agent") || null,
      });
    } catch (auditErr) {
      console.warn("Failed to insert audit log:", auditErr);
    }

    return new Response(
      JSON.stringify({
        authorization_url: paystackData.data.authorization_url,
        access_code: paystackData.data.access_code,
        reference: paystackData.data.reference,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    Sentry.captureException(error);
    return handleError(error);
  }
});
