import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

// ─── Stripe Checkout ────────────────────────────────────────────────────────

const stripeCheckoutInput = z.object({
  planName: z.enum(["individual", "company"]),
  checkoutType: z.enum(["subscription", "payment"]).default("subscription"),
  successUrl: z.string().url(),
  cancelUrl: z.string().url(),
  customerEmail: z.string().email().optional(),
});

/**
 * Dynamically resolves the active Stripe Price ID for a plan.
 * 1. Checks environment variables first.
 * 2. If missing, queries Stripe's active prices and matches by metadata or product name.
 */
async function resolveStripePriceId(stripe: any, planName: "individual" | "company"): Promise<string> {
  // 1. Check environment variables
  const envVar = planName === "individual"
    ? process.env.STRIPE_INDIVIDUAL_PRICE_ID
    : process.env.STRIPE_COMPANY_PRICE_ID;
  if (envVar) return envVar;

  // 2. Query the Stripe active prices list
  try {
    const prices = await stripe.prices.list({
      active: true,
      limit: 100,
      expand: ["data.product"],
    });

    for (const price of prices.data) {
      const product = price.product;
      if (typeof product === "object" && product !== null) {
        const metadata = product.metadata || {};
        const productName = (product.name || "").toLowerCase();

        if (planName === "individual") {
          if (
            metadata.plan === "individual" ||
            metadata.plan === "grow" ||
            productName.includes("grow") ||
            productName.includes("individual")
          ) {
            return price.id;
          }
        } else if (planName === "company") {
          if (
            metadata.plan === "company" ||
            metadata.plan === "scale" ||
            productName.includes("scale") ||
            productName.includes("company")
          ) {
            return price.id;
          }
        }
      }
    }
  } catch (err) {
    console.error("Failed to dynamically resolve Stripe Price ID:", err);
  }

  throw new Error(
    `Stripe Price ID for "${planName}" plan is not configured. ` +
      `Set STRIPE_INDIVIDUAL_PRICE_ID / STRIPE_COMPANY_PRICE_ID in Vercel/Railway env vars, ` +
      `or ensure your Stripe products have metadata { plan: "${planName}" } or names containing "${
        planName === "individual" ? "Grow" : "Scale"
      }".`,
  );
}

/**
 * Creates a Stripe Checkout Session on the server.
 * Secret key is read inside the handler — never reaches the client bundle.
 */
export const createStripeCheckout = createServerFn({ method: "POST" })
  .inputValidator(stripeCheckoutInput)
  .handler(async ({ data }) => {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      throw new Error(
        "STRIPE_SECRET_KEY is not configured. Add it to your Vercel environment variables.",
      );
    }

    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(secretKey);

    // Resolve Price ID (via env vars or dynamic query)
    const priceId = await resolveStripePriceId(stripe, data.planName);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: data.checkoutType === "subscription" ? "subscription" : "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: data.successUrl,
      cancel_url: data.cancelUrl,
      ...(data.customerEmail && { customer_email: data.customerEmail }),
    });

    return { url: session.url };
  });

// ─── Stripe Donation (one-time payment with custom amount) ──────────────────

const stripeDonationInput = z.object({
  amount: z.number().min(100), // cents (e.g. 500 = $5.00)
  currency: z.enum(["usd", "eur", "gbp"]).default("usd"),
  successUrl: z.string().url(),
  cancelUrl: z.string().url(),
  customerEmail: z.string().email().optional(),
  donorName: z.string().optional(),
});

/**
 * Creates a Stripe Checkout Session for a one-time donation.
 */
export const createStripeDonation = createServerFn({ method: "POST" })
  .inputValidator(stripeDonationInput)
  .handler(async ({ data }) => {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      throw new Error(
        "STRIPE_SECRET_KEY is not configured. Add it to your Vercel environment variables.",
      );
    }

    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(secretKey);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: data.currency,
            product_data: {
              name: "LanceConnect Donation",
              description: data.donorName
                ? `Donation from ${data.donorName}`
                : "Support LanceConnect",
            },
            unit_amount: data.amount,
          },
          quantity: 1,
        },
      ],
      success_url: data.successUrl,
      cancel_url: data.cancelUrl,
      ...(data.customerEmail && { customer_email: data.customerEmail }),
    });

    return { url: session.url };
  });

// ─── Paystack Checkout ──────────────────────────────────────────────────────

const paystackCheckoutInput = z.object({
  planName: z.enum(["individual", "company"]),
  checkoutType: z.enum(["subscription", "payment"]).default("subscription"),
  email: z.string().email(),
  callbackUrl: z.string().url(),
  amount: z.number().min(100).optional(), // kobo (100 kobo = ₦1) — used for one-time
});

/**
 * Initializes a Paystack transaction on the server.
 */
export const createPaystackCheckout = createServerFn({ method: "POST" })
  .inputValidator(paystackCheckoutInput)
  .handler(async ({ data }) => {
    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!secretKey) {
      throw new Error(
        "PAYSTACK_SECRET_KEY is not configured. Add it to your Vercel environment variables.",
      );
    }

    // For subscriptions, use Paystack Plans
    if (data.checkoutType === "subscription") {
      const planCodeMap: Record<string, string | undefined> = {
        individual: process.env.PAYSTACK_INDIVIDUAL_PLAN_CODE,
        company: process.env.PAYSTACK_COMPANY_PLAN_CODE,
      };

      const planCode = planCodeMap[data.planName];
      if (!planCode) {
        throw new Error(
          `Paystack Plan Code for "${data.planName}" is not configured. ` +
            `Set PAYSTACK_INDIVIDUAL_PLAN_CODE / PAYSTACK_COMPANY_PLAN_CODE in Vercel env vars.`,
        );
      }

      const res = await fetch("https://api.paystack.co/transaction/initialize", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${secretKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          plan: planCode,
          callback_url: data.callbackUrl,
        }),
      });

      const result = await res.json();
      if (!result.status || !result.data?.authorization_url) {
        throw new Error(result.message || "Paystack initialization failed");
      }

      return { authorization_url: result.data.authorization_url };
    }

    // One-time payment
    const amountKobo = data.amount || 0;
    if (amountKobo < 10000) {
      throw new Error("Minimum amount is ₦100 (10000 kobo)");
    }

    const res = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: data.email,
        amount: amountKobo,
        currency: "NGN",
        callback_url: data.callbackUrl,
      }),
    });

    const result = await res.json();
    if (!result.status || !result.data?.authorization_url) {
      throw new Error(result.message || "Paystack initialization failed");
    }

    return { authorization_url: result.data.authorization_url };
  });

// ─── Paystack Donation ──────────────────────────────────────────────────────

const paystackDonationInput = z.object({
  amount: z.number().min(10000), // kobo (10000 = ₦100 minimum)
  email: z.string().email(),
  callbackUrl: z.string().url(),
  donorName: z.string().optional(),
  message: z.string().optional(),
  showOnWall: z.boolean().default(true),
});

/**
 * Initializes a Paystack donation transaction.
 */
export const createPaystackDonation = createServerFn({ method: "POST" })
  .inputValidator(paystackDonationInput)
  .handler(async ({ data }) => {
    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!secretKey) {
      throw new Error(
        "PAYSTACK_SECRET_KEY is not configured. Add it to your Vercel environment variables.",
      );
    }

    const res = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: data.email,
        amount: data.amount,
        currency: "NGN",
        callback_url: data.callbackUrl,
        metadata: {
          custom_fields: [
            { display_name: "Donor Name", variable_name: "donor_name", value: data.donorName || "Anonymous" },
            { display_name: "Message", variable_name: "message", value: data.message || "" },
            { display_name: "Show on Wall", variable_name: "show_on_wall", value: data.showOnWall ? "yes" : "no" },
            { display_name: "Type", variable_name: "type", value: "donation" },
          ],
        },
      }),
    });

    const result = await res.json();
    if (!result.status || !result.data?.authorization_url) {
      throw new Error(result.message || "Paystack donation initialization failed");
    }

    return { authorization_url: result.data.authorization_url };
  });
