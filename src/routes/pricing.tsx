import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketingShell, PageHeader } from "@/components/marketing/MarketingShell";
import { IMG } from "@/data/content";
import { Check, Minus, Shield } from "lucide-react";
import { usePreferences } from "@/contexts/PreferencesContext";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — LanceConnect" },
      {
        name: "description",
        content:
          "Plans from $0 to $20/month. 14-day money-back guarantee. No credit card to start.",
      },
      { property: "og:title", content: "LanceConnect Pricing" },
      {
        property: "og:description",
        content: "Free, Individual, Large Company. Simple, transparent.",
      },
    ],
  }),
  component: PricingPage,
});

const matrix: { label: string; values: (boolean | string)[] }[] = [
  { label: "Lead discovery", values: [true, true, true] },
  { label: "Opportunity scoring", values: [true, true, true] },
  { label: "CRM pipeline", values: [false, true, true] },
  { label: "Templates", values: ["1", "Unlimited", "Unlimited"] },
  { label: "CSV export", values: [false, true, true] },
  { label: "AI Outreach Writer", values: [false, true, true] },
  { label: "Team seats", values: ["1", "1", "3"] },
  { label: "API access", values: [false, false, true] },
  { label: "White-label option", values: [false, false, true] },
  { label: "Priority support", values: [false, true, true] },
];

const faqs = [
  {
    q: "Can I really use this for free, forever?",
    a: "Yes. The Free plan gives you 10 leads a month, every month, with no credit card. Most freelancers upgrade when they win their first client and want more leads.",
  },
  {
    q: "How do I get a refund?",
    a: "Email us within 14 days of any paid charge and we'll refund you in full, no questions asked.",
  },
  {
    q: "Where do the leads come from?",
    a: "Public sources: Google Maps, business directories, and open company registries. Every lead is verifiable.",
  },
  {
    q: "Do you support my country?",
    a: "We work in 150+ countries. If your country isn't supported, email us — we usually add new markets within a week.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. Cancel from Settings → Subscription. You keep access until the end of your billing period.",
  },
];

function PricingPage() {
  const { t, formatPrice, getCurrencySymbol } = usePreferences();

  const plans = [
    {
      name: t("plan_free"),
      price: 0,
      leads: `10 ${t("plan_leads_mo")}`,
      cta: t("plan_cta_free"),
      popular: false,
    },
    {
      name: t("plan_individual"),
      price: 7,
      leads: `200 ${t("plan_leads_mo")}`,
      cta: t("plan_cta_ind"),
      popular: true,
    },
    {
      name: t("plan_company"),
      price: 20,
      leads: "Unlimited",
      cta: t("plan_cta_comp"),
      popular: false,
    },
  ];

  return (
    <MarketingShell>
      <PageHeader
        eyebrow={t("nav_pricing")}
        title="Honest pricing. Built for freelancers."
        subtitle="No 'contact sales'. No annual lock-ins. Cancel anytime. 14-day money-back guarantee on every paid plan."
        image={IMG.coffeeShop}
      />

      {/* Monthly/Annual Toggle */}
      <section className="mx-auto max-w-7xl px-4 pt-8 lg:px-8">
        <div className="flex justify-center">
          <div className="inline-flex rounded-full border border-border bg-card p-1">
            <button className="rounded-full bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground">
              Monthly
            </button>
            <button className="rounded-full px-4 py-1.5 text-xs font-medium">
              Annual <span className="ml-1 text-emerald-500">−20%</span>
            </button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`relative rounded-2xl border bg-card p-6 ${p.popular ? "border-primary shadow-card-hover lg:-translate-y-3" : "border-border shadow-card"}`}
            >
              {p.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
                  Most popular
                </span>
              )}
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {p.name}
              </p>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="font-display text-4xl font-bold">
                  {getCurrencySymbol()}
                  {formatPrice(p.price)}
                </span>
                <span className="text-sm text-muted-foreground">{t("plan_mo")}</span>
              </div>
              <p className="mt-1 text-sm font-mono-data text-primary">{p.leads}</p>
              <Link
                to="/register"
                className={`mt-5 block rounded-lg py-2.5 text-center text-sm font-semibold transition ${p.popular ? "bg-primary text-primary-foreground hover:bg-primary/90" : "border border-border bg-background hover:bg-accent"}`}
              >
                {p.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* Parallax Divider */}
        <section
          className="bg-parallax relative h-[280px] w-full flex items-center justify-center my-12 rounded-3xl"
          style={{ backgroundImage: "url('/assets/freelancers/freelancer_16.jpg')" }}
        >
          <div className="absolute inset-0 bg-[#080B14]/80 z-0" />
          <div className="relative z-10 text-center max-w-xl px-4 text-white">
            <p className="text-xs font-mono text-primary uppercase tracking-widest">
              // pay.with.confidence
            </p>
            <h3 className="mt-4 font-display text-2xl font-bold tracking-tight text-white">
              Invest in client acquisition that pays for itself.
            </h3>
            <p className="mt-2 text-sm text-slate-300">
              One won project pays for years of LanceConnect Pro.
            </p>
          </div>
        </section>

        <div className="mt-12 overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead className="bg-paper border-b border-border">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Feature</th>
                {plans.map((p) => (
                  <th key={p.name} className="px-4 py-3 text-center font-semibold">
                    {p.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {matrix.map((row) => (
                <tr key={row.label} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 text-foreground/80">{row.label}</td>
                  {row.values.map((v, i) => (
                    <td key={i} className="px-4 py-3 text-center">
                      {v === true ? (
                        <Check className="mx-auto h-4 w-4 text-success" />
                      ) : v === false ? (
                        <Minus className="mx-auto h-4 w-4 text-muted-foreground" />
                      ) : (
                        <span className="font-mono-data text-xs">{v}</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl border border-[#1e293b] dark:border-border bg-card p-8 shadow-lg relative overflow-hidden flex flex-col justify-between hover:border-primary/45 transition duration-300">
            {/* Top decorative gradient bar */}
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-brand" />
            <div>
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4 shadow-sm">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="font-display text-xl font-bold text-foreground">
                100% Risk-Free Guarantee
              </h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                Try LanceConnect Pro. If you don't find high-value client leads in your first 14
                days, we will refund you in full.
              </p>

              <ul className="mt-6 space-y-3.5 text-xs text-foreground/85 border-t border-border/80 pt-6">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  <span>No complicated forms to fill</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  <span>No awkward questions asked</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  <span>Refunds processed in 24 hours</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-4">
              <a
                href="mailto:hello@lanceconnect.app"
                className="inline-flex items-center justify-center w-full rounded-xl bg-background border border-border px-4 py-2.5 text-xs font-semibold text-foreground hover:bg-accent transition"
              >
                hello@lanceconnect.app
              </a>
            </div>
          </div>
          <div className="lg:col-span-2">
            <h3 className="font-display text-2xl font-bold">FAQ</h3>
            <div className="mt-4 space-y-3">
              {faqs.map((f) => (
                <details key={f.q} className="group rounded-xl border border-border bg-card p-4">
                  <summary className="cursor-pointer list-none font-semibold flex items-center justify-between">
                    {f.q}
                    <span className="ml-2 text-primary group-open:rotate-45 transition">+</span>
                  </summary>
                  <p className="mt-3 text-sm text-muted-foreground">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
