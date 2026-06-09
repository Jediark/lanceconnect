import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, CheckCircle2, Globe, Users, TrendingUp, Building2, Zap, Gem, Sun } from "lucide-react";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { MaskedLeadCard, MOCK_LEADS, SKILL_PILLS, type LeadData } from "@/components/marketing/SEOLeadCard";

export const Route = createFileRoute("/find-clients/dubai")({
  head: () => ({
    meta: [
      { title: "Find Clients in Dubai, UAE — LanceConnect" },
      {
        name: "description",
        content:
          "Access high-value business leads in Dubai. Find restaurants, salons, clinics and more — all needing digital services. Verified contacts and opportunity scores.",
      },
      {
        name: "keywords",
        content:
          "find clients in Dubai, freelance clients Dubai UAE, get clients Dubai, freelance Dubai, business leads Dubai, web design clients Dubai",
      },
      { property: "og:title", content: "Find Clients in Dubai — LanceConnect" },
      { property: "og:description", content: "Access high-value business leads in Dubai." },
    ],
  }),
  component: DubaiPage,
});

function DubaiPage() {
  const [leads, setLeads] = useState<LeadData[]>(MOCK_LEADS.dubai);

  useEffect(() => {
    const supabaseUrl =
      import.meta.env.VITE_SUPABASE_URL || "https://rpaodsmwhmzyhopvkwjt.supabase.co";
    fetch(`${supabaseUrl}/functions/v1/public-leads`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ city: "Dubai" }),
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.leads?.length) setLeads(d.leads);
      })
      .catch(() => {});
  }, []);

  return (
    <MarketingShell>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border bg-[#020b21] py-20 lg:py-28">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/20 via-transparent to-primary/10 pointer-events-none" />
        <div className="relative mx-auto max-w-5xl px-4 lg:px-8 text-center z-10">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 px-3 py-1 text-xs font-semibold text-amber-400 font-mono uppercase tracking-wider mb-6">
            🇦🇪 Dubai, UAE
          </span>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
            Find Clients in{" "}
            <span className="text-[#F59E0B]">Dubai, UAE</span>
          </h1>
          <p className="mt-5 text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Access high-value business leads in Dubai — restaurants, salons, clinics and more, all needing digital services.
          </p>
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <Link
              to="/register"
              search={{ city: "Dubai", country: "UAE" } as any}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]"
            >
              Get Free Leads in Dubai <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-mono text-slate-450 pt-4 justify-center">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" /> No credit card
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Instant access
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" /> 10 free leads
            </span>
          </div>
        </div>
      </section>

      {/* Live Leads Preview */}
      <section className="bg-background py-20 border-b border-border">
        <div className="mx-auto max-w-6xl px-4 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Real leads from Dubai
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight md:text-4xl">
              Dubai businesses ready for your services
            </h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
              These are real businesses in Dubai scored by how urgently they need freelance help.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {leads.map((lead, idx) => (
              <MaskedLeadCard key={idx} lead={lead} registerUrl="/register?city=Dubai&country=UAE" />
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              to="/register"
              search={{ city: "Dubai", country: "UAE" } as any}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition"
            >
              Sign up to see all Dubai leads <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Dubai */}
      <section className="bg-muted/30 py-20 border-b border-border">
        <div className="mx-auto max-w-5xl px-4 lg:px-8">
          <h2 className="font-display text-2xl font-bold tracking-tight md:text-3xl text-center mb-12">
            Why freelance in Dubai?
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Gem, title: "Tax-Free Freelancing", desc: "0% income tax for freelancers in the UAE" },
              { icon: TrendingUp, title: "Booming Startup Scene", desc: "Thousands of new businesses launching every month" },
              { icon: Sun, title: "High Spending Power", desc: "Premium market willing to invest in quality services" },
              { icon: Globe, title: "Digital Investment", desc: "Businesses actively modernising their online presence" },
            ].map((item, idx) => (
              <div key={idx} className="rounded-2xl border border-border bg-card p-6 text-center shadow-card hover:shadow-card-hover transition duration-300">
                <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-xl bg-primary/10 border border-primary/20">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-display text-sm font-bold text-foreground">{item.title}</h3>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="bg-background py-16 border-b border-border">
        <div className="mx-auto max-w-4xl px-4 lg:px-8 text-center">
          <h2 className="font-display text-xl font-bold tracking-tight md:text-2xl mb-8">
            Find Dubai clients by skill
          </h2>
          <div className="flex flex-wrap gap-3 justify-center">
            {SKILL_PILLS.map((s) => (
              <Link
                key={s.to}
                to={s.to as any}
                className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-accent hover:border-primary/30 transition-all duration-200 hover:-translate-y-0.5"
              >
                {s.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-[#020b21] py-20">
        <div className="mx-auto max-w-3xl px-4 lg:px-8 text-center">
          <Zap className="h-8 w-8 text-primary mx-auto mb-4" />
          <h2 className="font-display text-3xl font-bold text-white tracking-tight md:text-4xl">
            Start finding clients in Dubai today
          </h2>
          <p className="mt-4 text-slate-400 max-w-xl mx-auto">
            Join freelancers already using LanceConnect to win premium contracts in Dubai.
          </p>
          <Link
            to="/register"
            search={{ city: "Dubai", country: "UAE" } as any}
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-4 text-base font-semibold text-primary-foreground hover:bg-primary/90 transition shadow-lg shadow-primary/25 hover:scale-[1.02]"
          >
            Get 10 Free Leads <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </MarketingShell>
  );
}
