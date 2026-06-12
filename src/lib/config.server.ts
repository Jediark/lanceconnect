import process from "node:process";

// Server-only config. The .server.ts suffix prevents Vite from bundling
// this file into the client — values here never reach the browser.
//
// On Cloudflare Workers, env binds at REQUEST time. Module-scope reads
// (e.g. `const x = process.env.X`) resolve to undefined — always read
// process.env INSIDE a function or handler.
//
// When to use which env-access pattern:
//   - .server.ts module (this file): server-only helpers reused across
//     handlers. Wrap reads in a function so they run per-request.
//   - inline process.env inside a createServerFn handler: one-off reads
//     not reused elsewhere.
//   - import.meta.env.VITE_FOO: PUBLIC config readable from both client
//     and server (analytics IDs, public URLs). Define in .env with the
//     VITE_ prefix. Never put secrets here — they ship to the browser.

export function getServerConfig() {
  const clean = (val: string | undefined) => {
    if (!val) return undefined;
    let cleaned = val.trim();
    if (
      (cleaned.startsWith('"') && cleaned.endsWith('"')) ||
      (cleaned.startsWith("'") && cleaned.endsWith("'"))
    ) {
      cleaned = cleaned.slice(1, -1).trim();
    }
    return cleaned;
  };

  return {
    nodeEnv: process.env.NODE_ENV,
    stripeSecretKey: clean(process.env.STRIPE_SECRET_KEY || process.env.stripe_secret_key || process.env.Stripe_Secret_Key),
    paystackSecretKey: clean(process.env.PAYSTACK_SECRET_KEY || process.env.paystack_secret_key || process.env.Paystack_Secret_Key),
    // Stripe Price IDs for subscription plans
    stripeIndividualPriceId: clean(process.env.STRIPE_INDIVIDUAL_PRICE_ID || process.env.stripe_individual_price_id),
    stripeCompanyPriceId: clean(process.env.STRIPE_COMPANY_PRICE_ID || process.env.stripe_company_price_id),
    // Paystack Plan Codes for subscription plans
    paystackIndividualPlanCode: clean(process.env.PAYSTACK_INDIVIDUAL_PLAN_CODE || process.env.paystack_individual_plan_code),
    paystackCompanyPlanCode: clean(process.env.PAYSTACK_COMPANY_PLAN_CODE || process.env.paystack_company_plan_code),
  };
}
