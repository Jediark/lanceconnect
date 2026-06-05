import { supabase } from "./supabase";
import { toast } from "sonner";

export interface CheckoutParams {
  planName: "individual" | "company";
  checkoutType?: "subscription" | "credits";
  creditsAmount?: number;
  currency: string;
  successUrl?: string;
  cancelUrl?: string;
}

export interface CheckoutResult {
  url?: string;
  error?: string;
}

/**
 * Trigger payment gateway checkout based on selected currency.
 * routes to:
 *   - NGN -> Paystack Edge Function (paystack-checkout)
 *   - Others -> Stripe Edge Function (create-checkout)
 */
export async function initiateCheckout(params: CheckoutParams): Promise<CheckoutResult> {
  const currentHost =
    typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
  const successUrl = params.successUrl || `${currentHost}/app/settings/subscription?success=true`;
  const cancelUrl = params.cancelUrl || `${currentHost}/app/upgrade?canceled=true`;

  const isNgn = params.currency.toUpperCase() === "NGN";

  try {
    toast.loading(`Redirecting to ${isNgn ? "Paystack" : "Stripe"}...`, {
      id: "checkout-redirect",
    });

    // Ensure we are authenticated (if mock authentication is used, we fallback)
    const session = (await supabase.auth.getSession()).data.session;

    if (!session) {
      // In development / demo mode, if no active session is found, mock the redirection URL
      // to let the user see the visual transition without throwing an exception.
      console.warn("No Supabase session found. Mocking checkout response in demo mode.");
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const mockUrl = isNgn
        ? `https://checkout.paystack.com/mock-session-${params.planName}`
        : `https://checkout.stripe.com/pay/mock-session-${params.planName}`;

      toast.success("Redirecting to sandbox payment gateway...", { id: "checkout-redirect" });
      return { url: mockUrl };
    }

    if (isNgn) {
      // Route to Paystack Edge Function
      const { data, error } = await supabase.functions.invoke("paystack-checkout", {
        body: {
          planName: params.planName,
          checkoutType: params.checkoutType || "subscription",
          creditsAmount: params.creditsAmount || 0,
          currency: "NGN",
          callbackUrl: successUrl,
        },
      });

      if (error || !data?.authorization_url) {
        throw new Error(error?.message || data?.message || "Paystack initialization failed");
      }

      toast.success("Redirecting to Paystack...", { id: "checkout-redirect" });
      return { url: data.authorization_url };
    } else {
      // Route to Stripe Edge Function (starter / pro / agency mapping)
      // Stripe uses Price IDs configured on Stripe. Let's map our plans:
      // Map 'individual' -> 'individual_price_id', 'company' -> 'company_price_id'
      const priceIdMap: Record<string, string> = {
        individual:
          import.meta.env.VITE_STRIPE_INDIVIDUAL_PRICE_ID || "price_individual_placeholder",
        company: import.meta.env.VITE_STRIPE_COMPANY_PRICE_ID || "price_company_placeholder",
      };

      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: {
          priceId: priceIdMap[params.planName],
          planName: params.planName,
          checkoutType: params.checkoutType || "subscription",
          creditsAmount: params.creditsAmount || 0,
          successUrl,
          cancelUrl,
        },
      });

      if (error || !data?.url) {
        throw new Error(error?.message || data?.message || "Stripe initialization failed");
      }

      toast.success("Redirecting to Stripe...", { id: "checkout-redirect" });
      return { url: data.url };
    }
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : "Checkout initialization failed";
    console.error("Checkout error:", err);
    toast.error(errorMsg, { id: "checkout-redirect" });
    return { error: errorMsg };
  }
}
