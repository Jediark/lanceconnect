import { toast } from "sonner";
import {
  createStripeCheckout,
  createStripeDonation,
  createPaystackCheckout,
  createPaystackDonation,
} from "./api/payments.server";

// ─── Types ──────────────────────────────────────────────────────────────────

export interface CheckoutParams {
  planName: "individual" | "company";
  checkoutType?: "subscription" | "payment";
  creditsAmount?: number;
  currency: string;
  customerEmail?: string;
  successUrl?: string;
  cancelUrl?: string;
}

export interface CheckoutResult {
  url?: string;
  error?: string;
}

export interface DonationParams {
  amount: number; // For NGN: raw naira (e.g. 1000 = ₦1,000). For others: dollars/euros/pounds.
  currency: string;
  email: string;
  donorName?: string;
  message?: string;
  showOnWall?: boolean;
  successUrl?: string;
  cancelUrl?: string;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function getOrigin(): string {
  return typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
}

// ─── Plan Checkout (Upgrade page) ───────────────────────────────────────────

/**
 * Trigger payment gateway checkout based on selected currency.
 * Routes to:
 *   - NGN → Paystack server function
 *   - Others → Stripe server function
 */
export async function initiateCheckout(params: CheckoutParams): Promise<CheckoutResult> {
  const origin = getOrigin();
  const successUrl = params.successUrl || `${origin}/app/settings/subscription?success=true`;
  const cancelUrl = params.cancelUrl || `${origin}/app/upgrade?canceled=true`;
  const isNgn = params.currency.toUpperCase() === "NGN";

  try {
    toast.loading(`Redirecting to ${isNgn ? "Paystack" : "Stripe"}...`, {
      id: "checkout-redirect",
    });

    if (isNgn) {
      // ── Paystack ──
      if (!params.customerEmail) {
        throw new Error("Email is required for Paystack checkout. Please log in first.");
      }

      const result = await createPaystackCheckout({
        data: {
          planName: params.planName,
          checkoutType: params.checkoutType || "subscription",
          email: params.customerEmail,
          callbackUrl: successUrl,
        },
      });

      if (!result.authorization_url) {
        throw new Error("Paystack initialization failed — no redirect URL received.");
      }

      toast.success("Redirecting to Paystack...", { id: "checkout-redirect" });
      return { url: result.authorization_url };
    } else {
      // ── Stripe ──
      const result = await createStripeCheckout({
        data: {
          planName: params.planName,
          checkoutType: params.checkoutType || "subscription",
          successUrl,
          cancelUrl,
          customerEmail: params.customerEmail,
        },
      });

      if (!result.url) {
        throw new Error("Stripe initialization failed — no redirect URL received.");
      }

      toast.success("Redirecting to Stripe...", { id: "checkout-redirect" });
      return { url: result.url };
    }
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : "Checkout initialization failed";
    console.error("Checkout error:", err);
    toast.error(errorMsg, { id: "checkout-redirect" });
    return { error: errorMsg };
  }
}

// ─── Donation (Support-us page) ─────────────────────────────────────────────

/**
 * Initiate a one-time donation payment.
 * Routes to:
 *   - NGN → Paystack donation
 *   - Others → Stripe donation
 */
export async function initiateDonation(params: DonationParams): Promise<CheckoutResult> {
  const origin = getOrigin();
  const successUrl = params.successUrl || `${origin}/app/dashboard?donation=success`;
  const cancelUrl = params.cancelUrl || `${origin}/support-us?donation=canceled`;
  const isNgn = params.currency.toUpperCase() === "NGN";

  try {
    toast.loading(`Redirecting to ${isNgn ? "Paystack" : "Stripe"}...`, {
      id: "donation-redirect",
    });

    if (isNgn) {
      // Amount in kobo (1 NGN = 100 kobo)
      const amountKobo = params.amount * 100;

      const result = await createPaystackDonation({
        data: {
          amount: amountKobo,
          email: params.email,
          callbackUrl: successUrl,
          donorName: params.donorName,
          message: params.message,
          showOnWall: params.showOnWall ?? true,
        },
      });

      if (!result.authorization_url) {
        throw new Error("Paystack donation initialization failed.");
      }

      toast.success("Redirecting to Paystack...", { id: "donation-redirect" });
      return { url: result.authorization_url };
    } else {
      // Amount in cents (1 USD = 100 cents)
      const amountCents = params.amount * 100;

      const currencyLower = params.currency.toLowerCase();
      const validCurrency = (["usd", "eur", "gbp"].includes(currencyLower) ? currencyLower : "usd") as "usd" | "eur" | "gbp";

      const result = await createStripeDonation({
        data: {
          amount: amountCents,
          currency: validCurrency,
          successUrl,
          cancelUrl,
          customerEmail: params.email,
          donorName: params.donorName,
        },
      });

      if (!result.url) {
        throw new Error("Stripe donation initialization failed.");
      }

      toast.success("Redirecting to Stripe...", { id: "donation-redirect" });
      return { url: result.url };
    }
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : "Donation initialization failed";
    console.error("Donation error:", err);
    toast.error(errorMsg, { id: "donation-redirect" });
    return { error: errorMsg };
  }
}
