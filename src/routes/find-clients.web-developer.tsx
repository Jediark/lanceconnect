import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, CheckCircle2, Code, Globe, MapPin, Zap, Search, BarChart3, Mail } from "lucide-react";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { MaskedLeadCard, MOCK_LEADS, type LeadData } from "@/components/marketing/SEOLeadCard";

export const Route = createFileRoute("/find-clients/web-developer")({
  head: () => ({
    meta: [
      { title: "Find Clients as a Web Developer — LanceConnect" },
      {
        name: "description",
        content:
          "Discover businesses with outdated or missing websites. Get opportunity scores, verified contacts, and AI-powered outreach scripts to win web design projects.",
      },
      {
        name: "keywords",
        content:
          "find clients as a web developer, how to get web design clients, web developer client finder, find web design clients, get web development projects, freelance web developer leads",
      },
      { property: "og:title", content: "Find Clients as a Web Developer — LanceConnect" },
      { property: "og:description", content: "Discover businesses with outdated or missing websites." },
    ],
  }),
  component: WebDevPage,
});

function WebDevPage() {
  const [leads, setLeads] = useState<LeadData[]>(MOCK_LEADS.web_dev);

  useEffect(() => {
    const supabaseUrl =
      import.meta.env.VITE_SUPABASE_URL || "https://rpaodsmwhmzyhopvkwjt.supabase.co";
    fetch(`${supabaseUrl}/functions/v1/public-leads`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category: "Technology" }),
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
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-primary/10 pointer-events-none" />
        <div className="relative mx-auto max-w-5xl px-4 lg:px-8 text-center z-10">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 px-3 py-1 text-xs font-semibold text-purple-400 font-mono uppercase tracking-wider mb-6">
            <Code className="h-3.5 w-3.5" /> Web Development
          </span>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
            Find Clients as a{" "}
            <span className="text-primary">Web Developer</span>
          </h1>
          <p className="mt-5 text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Discover businesses with outdated or missing websites — complete with opportunity scores and verified contacts.
          </p>
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <Link
              to="/register"
              search={{ category: "web_dev" } as any}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]"
            >
              Get Free Web Dev Leads <ArrowRight className="h-4 w-4" />
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

      {/* Lead Niches */}
      <section className="bg-background py-20 border-b border-border">
        <div className="mx-auto max-w-6xl px-4 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Real opportunities for web developers
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight md:text-4xl">
              Businesses that need a website — right now
            </h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
              From bakeries with no website to restaurants with outdated ones — these leads are scored and ready.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {leads.map((lead, idx) => (
              <MaskedLeadCard key={idx} lead={lead} registerUrl="/register?category=web_dev" />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-[#020b21] py-20 border-b border-border text-white">
        <div className="mx-auto max-w-5xl px-4 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
              How it works
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight md:text-4xl text-white">
              From search to outreach in 3 steps
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              { icon: Search, step: "01", title: "Pick your niche", desc: "Select 'Web Developer' and a target industry" },
              { icon: MapPin, step: "02", title: "Choose a city", desc: "Any city in 150+ countries worldwide" },
              { icon: BarChart3, step: "03", title: "Get scored leads", desc: "See businesses ranked by opportunity" },
            ].map((s, idx) => (
              <div key={idx} className="rounded-2xl border border-blue-900/30 bg-[#131c31] p-6 flex flex-col items-center text-center space-y-4 shadow-xl">
                <span className="text-xs font-mono font-bold text-blue-400">STEP {s.step}</span>
                <div className="grid h-14 w-14 place-items-center rounded-full bg-primary/10 border border-primary/30">
                  <s.icon className="h-6 w-6 text-primary" />
                </div>
                <p className="text-sm font-semibold text-slate-100">{s.title}</p>
                <p className="text-xs text-slate-400">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Cities */}
      <section className="bg-background py-16 border-b border-border">
        <div className="mx-auto max-w-4xl px-4 lg:px-8 text-center">
          <h2 className="font-display text-xl font-bold tracking-tight md:text-2xl mb-8">
            Find web dev clients by city
          </h2>
          <div className="flex flex-wrap gap-3 justify-center">
            {[
              { label: "Lagos", to: "/find-clients/web-developer/lagos" },
              { label: "London", to: "/find-clients/web-developer/london" },
              { label: "Dubai", to: "/find-clients/web-developer/dubai" },
              { label: "Accra", to: "/find-clients/web-developer/accra" },
              { label: "Nairobi", to: "/find-clients/web-developer/nairobi" },
              { label: "Mumbai", to: "/find-clients/web-developer/mumbai" },
              { label: "Toronto", to: "/find-clients/web-developer/toronto" },
              { label: "Berlin", to: "/find-clients/web-developer/berlin" },
              { label: "Paris", to: "/find-clients/web-developer/paris" },
              { label: "Singapore", to: "/find-clients/web-developer/singapore" },
              { label: "Austin", to: "/find-clients/web-developer/austin" },
              { label: "Fort Lauderdale", to: "/find-clients/web-developer/fort-lauderdale" },
            ].map((c) => (
              <Link
                key={c.label}
                to={c.to as any}
                className="rounded-full border border-border bg-card px-5 py-2.5 text-sm font-medium text-foreground hover:bg-accent hover:border-primary/30 transition-all duration-200 hover:-translate-y-0.5 flex items-center gap-2"
              >
                <MapPin className="h-3.5 w-3.5 text-muted-foreground" /> {c.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-[#020b21] py-20">
        <div className="mx-auto max-w-3xl px-4 lg:px-8 text-center">
          <Code className="h-8 w-8 text-primary mx-auto mb-4" />
          <h2 className="font-display text-3xl font-bold text-white tracking-tight md:text-4xl">
            Stop waiting for clients to find you
          </h2>
          <p className="mt-4 text-slate-400 max-w-xl mx-auto">
            LanceConnect scans for businesses without websites so you can pitch them directly. No cold emails, no bidding wars.
          </p>
          <Link
            to="/register"
            search={{ category: "web_dev" } as any}
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-4 text-base font-semibold text-primary-foreground hover:bg-primary/90 transition shadow-lg shadow-primary/25 hover:scale-[1.02]"
          >
            Get 10 Free Leads <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </MarketingShell>
  );
}
