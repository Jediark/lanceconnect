import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, CheckCircle2, Palette, MapPin, Zap, Eye, Brush, Sparkles } from "lucide-react";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { MaskedLeadCard, MOCK_LEADS, CITY_PILLS, type LeadData } from "@/components/marketing/SEOLeadCard";

export const Route = createFileRoute("/find-clients/graphic-designer")({
  head: () => ({
    meta: [
      { title: "Find Clients as a Graphic Designer — LanceConnect" },
      {
        name: "description",
        content:
          "Find businesses with no branding, amateur logos, or weak visual identity. Get verified contacts and pitch them directly with AI-powered outreach.",
      },
      {
        name: "keywords",
        content:
          "find clients as a graphic designer, get graphic design clients, graphic designer client finder, freelance designer leads, find logo design clients, brand identity projects",
      },
      { property: "og:title", content: "Find Clients as a Graphic Designer — LanceConnect" },
      { property: "og:description", content: "Find businesses needing branding, logos, and visual identity." },
    ],
  }),
  component: GraphicDesignerPage,
});

function GraphicDesignerPage() {
  const [leads, setLeads] = useState<LeadData[]>(MOCK_LEADS.designer);

  useEffect(() => {
    const supabaseUrl =
      import.meta.env.VITE_SUPABASE_URL || "https://rpaodsmwhmzyhopvkwjt.supabase.co";
    fetch(`${supabaseUrl}/functions/v1/public-leads`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category: "Professional Services" }),
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
        <div className="absolute inset-0 bg-gradient-to-br from-pink-900/20 via-transparent to-primary/10 pointer-events-none" />
        <div className="relative mx-auto max-w-5xl px-4 lg:px-8 text-center z-10">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-pink-500/10 border border-pink-500/20 px-3 py-1 text-xs font-semibold text-pink-400 font-mono uppercase tracking-wider mb-6">
            <Palette className="h-3.5 w-3.5" /> Graphic Design
          </span>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
            Find Clients as a{" "}
            <span className="text-[#EC4899]">Graphic Designer</span>
          </h1>
          <p className="mt-5 text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Find businesses with no branding, amateur logos, or weak visual identity — and pitch them directly.
          </p>
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <Link
              to="/register"
              search={{ category: "designer" } as any}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]"
            >
              Get Free Design Leads <ArrowRight className="h-4 w-4" />
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
              Opportunities for graphic designers
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight md:text-4xl">
              Businesses that need your creative eye
            </h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
              New businesses without branding, firms with amateur logos, shops with no visual identity — all scored and ready.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {leads.map((lead, idx) => (
              <MaskedLeadCard key={idx} lead={lead} registerUrl="/register?category=designer" />
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              to="/register"
              search={{ category: "designer" } as any}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition"
            >
              Sign up to see all design leads <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* What you can offer */}
      <section className="bg-muted/30 py-20 border-b border-border">
        <div className="mx-auto max-w-5xl px-4 lg:px-8">
          <h2 className="font-display text-2xl font-bold tracking-tight md:text-3xl text-center mb-12">
            Services these businesses need
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Palette, title: "Logo Design", desc: "New brands and rebrands for growing businesses" },
              { icon: Eye, title: "Brand Identity", desc: "Colour palettes, typography, style guides" },
              { icon: Brush, title: "Marketing Materials", desc: "Flyers, social media graphics, menus" },
              { icon: Sparkles, title: "Visual Refresh", desc: "Modernise outdated amateur designs" },
            ].map((item, idx) => (
              <div key={idx} className="rounded-2xl border border-border bg-card p-6 text-center shadow-card hover:shadow-card-hover transition duration-300">
                <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-xl bg-pink-500/10 border border-pink-500/20">
                  <item.icon className="h-5 w-5 text-pink-500" />
                </div>
                <h3 className="font-display text-sm font-bold text-foreground">{item.title}</h3>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Cities */}
      <section className="bg-background py-16 border-b border-border">
        <div className="mx-auto max-w-4xl px-4 lg:px-8 text-center">
          <h2 className="font-display text-xl font-bold tracking-tight md:text-2xl mb-8">
            Find design clients by city
          </h2>
          <div className="flex flex-wrap gap-3 justify-center">
            {[...CITY_PILLS,
              { label: "Mumbai", to: "/find-clients/designers" },
              { label: "New York", to: "/find-clients/designers" },
              { label: "Paris", to: "/find-clients/designers" },
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
          <Palette className="h-8 w-8 text-pink-500 mx-auto mb-4" />
          <h2 className="font-display text-3xl font-bold text-white tracking-tight md:text-4xl">
            Your design skills deserve better clients
          </h2>
          <p className="mt-4 text-slate-400 max-w-xl mx-auto">
            Stop scrolling job boards. LanceConnect surfaces businesses that actually need a designer — and hands you their contact details.
          </p>
          <Link
            to="/register"
            search={{ category: "designer" } as any}
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-4 text-base font-semibold text-primary-foreground hover:bg-primary/90 transition shadow-lg shadow-primary/25 hover:scale-[1.02]"
          >
            Get 10 Free Leads <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </MarketingShell>
  );
}
