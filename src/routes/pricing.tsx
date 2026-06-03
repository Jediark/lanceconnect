import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketingShell, PageHeader } from "@/components/marketing/MarketingShell";
import { IMG } from "@/data/content";
import { Check, Minus, Shield } from "lucide-react";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — LanceConnect" },
      { name: "description", content: "Plans from $0 to $99/month. 14-day money-back guarantee. No credit card to start." },
      { property: "og:title", content: "LanceConnect Pricing" },
      { property: "og:description", content: "Free, Starter, Pro, Agency. Simple, transparent." },
    ],
  }),
  component: PricingPage,
});

const plans = [
  { name: "Free", price: 0, leads: "10 leads / month", cta: "Start free", popular: false },
  { name: "Starter", price: 19, leads: "100 leads / month", cta: "Get Starter", popular: false },
  { name: "Pro", price: 49, leads: "500 leads / month", cta: "Go Pro", popular: true },
  { name: "Agency", price: 99, leads: "Unlimited", cta: "Scale up", popular: false },
];

const matrix: { label: string; values: (boolean | string)[] }[] = [
  { label: "Lead discovery", values: [true, true, true, true] },
  { label: "Opportunity scoring", values: [true, true, true, true] },
  { label: "CRM pipeline", values: [false, true, true, true] },
  { label: "Templates", values: ["1", "5", "Unlimited", "Unlimited"] },
  { label: "CSV export", values: [false, true, true, true] },
  { label: "AI Outreach Writer", values: [false, false, true, true] },
  { label: "Team seats", values: ["1", "1", "1", "3"] },
  { label: "API access", values: [false, false, false, true] },
  { label: "White-label option", values: [false, false, false, true] },
  { label: "Priority support", values: [false, false, true, true] },
];

const faqs = [
  { q: "Can I really use this for free, forever?", a: "Yes. The Free plan gives you 10 leads a month, every month, with no credit card. Most freelancers upgrade when they win their first client and want more leads." },
  { q: "How do I get a refund?", a: "Email us within 14 days of any paid charge and we'll refund you in full, no questions asked." },
  { q: "Where do the leads come from?", a: "Public sources: Google Maps, business directories, and open company registries. Every lead is verifiable." },
  { q: "Do you support my country?", a: "We work in 150+ countries. If your country isn't supported, email us — we usually add new markets within a week." },
  { q: "Can I cancel anytime?", a: "Yes. Cancel from Settings → Subscription. You keep access until the end of your billing period." },
];

function PricingPage() {
  return (
    <MarketingShell>
      <PageHeader eyebrow="Pricing" title="Honest pricing. Built for freelancers." subtitle="No 'contact sales'. No annual lock-ins. Cancel anytime. 14-day money-back guarantee on every paid plan." image={IMG.coffeeShop}/>

      {/* Monthly/Annual Toggle */}
      <section className="mx-auto max-w-7xl px-4 pt-8 lg:px-8">
        <div className="flex justify-center">
          <div className="inline-flex rounded-full border border-border bg-card p-1">
            <button className="rounded-full bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground">Monthly</button>
            <button className="rounded-full px-4 py-1.5 text-xs font-medium">Annual <span className="ml-1 text-emerald-500">−20%</span></button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {plans.map(p => (
            <div key={p.name} className={`relative rounded-2xl border bg-card p-6 ${p.popular ? "border-primary shadow-card-hover lg:-translate-y-3" : "border-border shadow-card"}`}>
              {p.popular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">Most popular</span>}
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{p.name}</p>
              <div className="mt-3 flex items-baseline gap-1"><span className="font-display text-4xl font-bold">${p.price}</span><span className="text-sm text-muted-foreground">/mo</span></div>
              <p className="mt-1 text-sm font-mono-data text-primary">{p.leads}</p>
              <Link to="/register" className={`mt-5 block rounded-lg py-2.5 text-center text-sm font-semibold transition ${p.popular ? "bg-primary text-primary-foreground hover:bg-primary/90" : "border border-border bg-background hover:bg-accent"}`}>{p.cta}</Link>
            </div>
          ))}
        </div>

        {/* Credit Packs Section */}
        <div className="mt-16">
          <p className="text-[11px] font-mono-data text-muted-foreground uppercase tracking-widest mb-4">
            // pay.as.you.go
          </p>
          <h3 className="font-display text-2xl font-bold mb-6">Prefer credit packs?</h3>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { leads: "50 leads", price: "₦5,000", usd: "$5" },
              { leads: "200 leads", price: "₦15,000", usd: "$15", popular: true },
              { leads: "500 leads", price: "₦30,000", usd: "$30" },
            ].map((c) => (
              <div key={c.leads} className={`rounded-2xl border bg-card p-5 text-center ${c.popular ? "border-primary" : "border-border"}`}>
                {c.popular && <span className="inline-block mb-2 text-[10px] font-bold uppercase text-primary">Most popular</span>}
                <p className="font-display text-lg font-semibold">{c.leads}</p>
                <p className="mt-1 font-mono-data text-xl">{c.price} <span className="text-xs text-muted-foreground">{c.usd}</span></p>
                <button className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">Buy credits</button>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead className="bg-paper border-b border-border">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Feature</th>
                {plans.map(p => <th key={p.name} className="px-4 py-3 text-center font-semibold">{p.name}</th>)}
              </tr>
            </thead>
            <tbody>
              {matrix.map(row => (
                <tr key={row.label} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 text-foreground/80">{row.label}</td>
                  {row.values.map((v, i) => (
                    <td key={i} className="px-4 py-3 text-center">
                      {v === true ? <Check className="mx-auto h-4 w-4 text-success"/> : v === false ? <Minus className="mx-auto h-4 w-4 text-muted-foreground"/> : <span className="font-mono-data text-xs">{v}</span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-border bg-paper p-6">
            <Shield className="h-6 w-6 text-primary"/>
            <h3 className="mt-3 font-display text-lg font-semibold">14-day money-back guarantee</h3>
            <p className="mt-2 text-sm text-muted-foreground">Don't love it? Email us within 14 days for a full refund. No forms, no questions.</p>
          </div>
          <div className="lg:col-span-2">
            <h3 className="font-display text-2xl font-bold">FAQ</h3>
            <div className="mt-4 space-y-3">
              {faqs.map(f => (
                <details key={f.q} className="group rounded-xl border border-border bg-card p-4">
                  <summary className="cursor-pointer list-none font-semibold flex items-center justify-between">
                    {f.q}<span className="ml-2 text-primary group-open:rotate-45 transition">+</span>
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
