import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketingShell, PageHeader } from "@/components/marketing/MarketingShell";
import { IMG } from "@/data/content";
import { Search, Filter, Star, Bookmark, Mail, Sparkles, BarChart3, Globe2, Phone, Users, Zap, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/features")({
  head: () => ({
    meta: [
      { title: "Features — LanceConnect" },
      { name: "description", content: "Deep dive into every feature: lead discovery, opportunity scoring, CRM pipeline, outreach templates, and the AI message writer." },
      { property: "og:title", content: "LanceConnect Features" },
      { property: "og:description", content: "Every feature explained, with screenshots." },
    ],
  }),
  component: FeaturesPage,
});

const sections = [
  { icon: Search, title: "Global Lead Discovery", desc: "Search any city in 150+ countries and surface businesses matching the criteria that matter to your craft.", points: ["Filter by industry, country, city, rating, and review count","Detect businesses with no website, broken sites, or empty social","Refreshed daily from public sources"], image: IMG.workspace },
  { icon: BarChart3, title: "Opportunity Scoring", desc: "Every lead gets a 0–100 score based on how badly they need what you sell. Hot leads bubble to the top.", points: ["Per-category scoring models — what's hot for an SEO is cold for a videographer","Clear 'why' next to each score","Filter for >80 to start your week with the best 20"], image: IMG.seo },
  { icon: Bookmark, title: "Built-in CRM Pipeline", desc: "A simple kanban + table view that tracks every lead from saved → contacted → won, without a learning curve.", points: ["Drag-and-drop stages","Per-lead notes, follow-up dates, and reminders","CSV export for accountants"], image: IMG.marketing },
  { icon: Mail, title: "Outreach Templates", desc: "Email, phone scripts, WhatsApp messages, and LinkedIn DMs — all variable-templated to each lead.", points: ["Variables auto-fill business name, city, industry","Channel filters (email / phone / DM)","Save your own templates and reuse them in one click"], image: IMG.copywriter },
  { icon: Sparkles, title: "AI Outreach Writer (Pro)", desc: "Generate personalized first-touch messages in 5 languages, fed by each lead's profile.", points: ["Tone slider: friendly, formal, casual, direct","One-click rewrite or shorten","Multi-language: EN, ES, FR, IT, PT"], image: IMG.appDev },
  { icon: Phone, title: "Contact Details, One Click", desc: "Phone, email, website and socials — surfaced and copy-ready next to every lead.", points: ["Click-to-copy phone numbers","Mailto + WhatsApp + LinkedIn buttons","Notes field for that 'manager named Carla' detail"], image: IMG.va },
];

function FeaturesPage() {
  return (
    <MarketingShell>
      <PageHeader eyebrow="Features" title="Every tool you need. Nothing you don't." subtitle="LanceConnect is built by freelancers — so it does only what helps you find and close clients. No CRM bloat. No sales-team jargon." image={IMG.heroLaptop} />
      <div className="mx-auto max-w-6xl px-4 py-16 lg:px-8 space-y-24">
        {sections.map((s, i) => (
          <div key={s.title} className={`grid gap-10 items-center lg:grid-cols-2 ${i % 2 === 1 ? "lg:[&>:first-child]:order-2" : ""}`}>
            <div>
              <div className="inline-grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary"><s.icon className="h-6 w-6"/></div>
              <h2 className="mt-4 font-display text-3xl font-bold">{s.title}</h2>
              <p className="mt-3 text-muted-foreground">{s.desc}</p>
              <ul className="mt-5 space-y-2">
                {s.points.map(p => (
                  <li key={p} className="flex gap-2 text-sm"><Zap className="h-4 w-4 shrink-0 text-primary"/><span className="text-foreground/80">{p}</span></li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="absolute -inset-3 rounded-2xl bg-primary/10"/>
              <img src={s.image} alt={s.title} className="relative aspect-[4/3] w-full rounded-2xl object-cover shadow-xl"/>
            </div>
          </div>
        ))}
      </div>

      <section className="px-4 pb-20 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-3xl border border-border bg-paper p-10 text-center">
          <Filter className="mx-auto h-8 w-8 text-primary"/>
          <h3 className="mt-3 font-display text-2xl font-bold">All this on the Free plan</h3>
          <p className="mt-2 text-sm text-muted-foreground">Try every feature except the AI writer with 10 free leads — no credit card.</p>
          <Link to="/register" className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90">Start free <ArrowRight className="h-4 w-4"/></Link>
        </div>
      </section>
    </MarketingShell>
  );
}
