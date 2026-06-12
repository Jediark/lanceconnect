import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketingShell, PageHeader } from "@/components/marketing/MarketingShell";
import { IMG } from "@/data/content";
import { Check, Heart, HeartHandshake, Shield, Sparkles, HelpCircle } from "lucide-react";
import { PaymentTrustBadge } from "@/components/ui/PaymentBranding";
import { CurrencyConverter } from "@/components/ui/CurrencyConverter";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing & Plans — LanceConnect" },
      {
        name: "description",
        content:
          "LanceConnect offers simple, flexible pricing for freelancers and agencies. Get started with our Free plan or upgrade to Grow or Scale.",
      },
      { property: "og:title", content: "LanceConnect Pricing & Plans" },
      { name: "keywords", content: "freelance leads pricing, B2B lead finder cost, client outreach plans" },
      {
        property: "og:description",
        content: "Find B2B leads. Pick the plan that fits your freelance business. Cancel anytime.",
      },
    ],
  }),
  component: PricingPage,
});

const faqs = [
  {
    q: "Is there a free trial or free tier?",
    a: "Yes! Our Free plan gives you 10 hot lead searches per month with basic opportunity scoring and email templates. No credit card is required to sign up.",
  },
  {
    q: "Can I upgrade or downgrade at any time?",
    a: "Absolutely. You can change your plan or cancel your subscription at any time directly from your dashboard settings. There are no long-term contracts or cancellation fees.",
  },
  {
    q: "Where do the leads come from?",
    a: "We aggregate public business registries, Google Maps listings, and directories. Our AI cleanses, scores, and verifies emails and phone numbers so you get valid contact lines.",
  },
  {
    q: "How does opportunity scoring work?",
    a: "Our AI scans businesses for critical digital gaps—such as missing websites, poor SEO rankings, or no social media profiles. Leads are then scored from 0 to 100 based on their likelihood to buy.",
  },
];

function PricingPage() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      description: "Perfect for testing the waters and getting started.",
      features: [
        "10 B2B lead searches / mo",
        "Basic opportunity scoring",
        "Full contact details (masked)",
        "Standard email templates"
      ],
      cta: "Start for Free",
      ctaLink: "/register",
      popular: false,
      color: "border-slate-800 bg-[#0d1527]/50"
    },
    {
      name: "Grow",
      price: "$20",
      description: "Great for active freelancers seeking monthly client projects.",
      features: [
        "100 B2B lead searches / mo",
        "Premium opportunity scoring",
        "Unmasked email & phone lines",
        "AI outreach script writer",
        "CRM pipeline management"
      ],
      cta: "Get Started",
      ctaLink: "/register?plan=grow",
      popular: true,
      color: "border-primary/50 bg-[#13233a]/60 shadow-[0_0_30px_rgba(6,182,212,0.15)]"
    },
    {
      name: "Scale",
      price: "$75",
      description: "For agencies and power users seeking maximum reach.",
      features: [
        "250 B2B lead searches / mo",
        "Priority lead processing",
        "Advanced filtering & export",
        "Dedicated account helper",
        "Early access to new features"
      ],
      cta: "Scale Now",
      ctaLink: "/register?plan=scale",
      popular: false,
      color: "border-slate-800 bg-[#0d1527]/50"
    }
  ];

  return (
    <MarketingShell>
      <PageHeader
        eyebrow="premium plans. honest pricing."
        title="Find Clients. Grow Your Income."
        subtitle="Choose the plan that fits your business. No hidden fees, cancel anytime."
        image={IMG.coffeeShop}
      />

      <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8 bg-background">
        <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto items-stretch">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`relative flex flex-col justify-between rounded-3xl border p-8 transition duration-300 hover:scale-[1.02] ${plan.color}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-[10px] font-bold text-white uppercase tracking-wider shadow">
                  Most Popular
                </div>
              )}
              
              <div>
                <p className="text-xs font-mono text-primary uppercase tracking-widest">{plan.name}</p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-slate-900 dark:text-white">{plan.price}</span>
                  <span className="text-xs text-muted-foreground font-medium">/month</span>
                </div>
                <p className="mt-4 text-xs text-muted-foreground leading-relaxed">{plan.description}</p>

                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                      <Check className="h-4 w-4 text-emerald-500 dark:text-emerald-400 shrink-0 mt-0.5" />
                      <span className="text-xs leading-normal">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8">
                <Link
                  to={plan.ctaLink}
                  className={`w-full inline-flex justify-center items-center rounded-xl py-3 text-xs font-bold transition shadow ${
                    plan.popular
                      ? "bg-primary text-white hover:brightness-110 shadow-primary/20"
                      : "border border-border bg-card text-foreground hover:bg-accent"
                  }`}
                >
                  {plan.cta}
                </Link>
                {plan.price !== "$0" && (
                  <p className="mt-2 text-[9px] text-center text-muted-foreground">
                    💳 Pay securely via Stripe or Paystack
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Live Currency Calculator */}
        <CurrencyConverter className="mt-16 bg-[#0d1527]/40 border-slate-800" mode="plans" />

        {/* Philosophy / Value Perception */}
        <div className="max-w-3xl mx-auto text-center bg-card/45 border border-border p-8 md:p-12 rounded-3xl backdrop-blur-sm mt-16">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
            <Shield className="h-6 w-6" />
          </div>
          <h3 className="font-display text-2xl font-bold text-slate-900 dark:text-white mb-4">
            Premium Leads. No Risk.
          </h3>
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
            We scour millions of B2B opportunity sources daily to find you hot, active leads in 150+ countries. Start with our 10-lead Free plan to see the quality for yourself. No credit card required. Upgrade or downgrade anytime.
          </p>
        </div>

        {/* FAQs */}
        <div className="pt-16">
          <h3 className="font-display text-2xl font-bold mb-6 text-center text-slate-900 dark:text-white">Frequently Asked Questions</h3>
          <div className="space-y-4 max-w-3xl mx-auto">
            {faqs.map((f, i) => (
              <details key={i} className="group rounded-2xl border border-border bg-card p-4 transition-all duration-300">
                <summary className="cursor-pointer list-none font-semibold flex items-center justify-between text-slate-800 dark:text-slate-200">
                  <span className="text-sm">{f.q}</span>
                  <span className="ml-2 text-primary group-open:rotate-45 transition">+</span>
                </summary>
                <p className="mt-3 text-xs text-muted-foreground leading-relaxed pl-1">
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </div>

        {/* Payment Trust Badge */}
        <div className="pt-16">
          <PaymentTrustBadge />
        </div>
      </section>
    </MarketingShell>
  );
}

function ArrowRight(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}
