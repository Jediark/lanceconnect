import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketingShell, PageHeader } from "@/components/marketing/MarketingShell";
import { IMG } from "@/data/content";
import { Globe2, BarChart3, Mail, Bookmark, Sparkles, Zap, ArrowRight } from "lucide-react";

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
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <p className="text-[11px] font-mono-data text-muted-foreground uppercase tracking-widest mb-2">
          // what.we.give.you
        </p>
        <h2 className="font-display text-4xl font-bold text-foreground mb-12">
          Everything you need to get clients
        </h2>

        {/* Bento Grid */}
        <div className="grid gap-6 lg:grid-cols-3 auto-rows-[280px]">
          <div className="rounded-2xl border border-border bg-card p-8 shadow-card lg:col-span-2">
            <div className="inline-grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary mb-4">
              <Globe2 className="h-6 w-6" />
            </div>
            <h3 className="font-display text-xl font-semibold mb-2">Global Lead Discovery</h3>
            <p className="text-sm text-muted-foreground mb-4">Find any business in any city in 150+ countries.</p>
            <ul className="space-y-2 text-sm">
              <li className="flex gap-2"><Zap className="h-4 w-4 text-primary shrink-0" /><span className="text-foreground/80">Filter by industry, country, city, rating, reviews</span></li>
              <li className="flex gap-2"><Zap className="h-4 w-4 text-primary shrink-0" /><span className="text-foreground/80">Detect businesses with no website or empty social</span></li>
              <li className="flex gap-2"><Zap className="h-4 w-4 text-primary shrink-0" /><span className="text-foreground/80">2.4M+ leads refreshed daily</span></li>
            </ul>
          </div>

          <div className="rounded-2xl border border-border bg-card p-8 shadow-card">
            <div className="inline-grid h-12 w-12 place-items-center rounded-xl bg-emerald-500/10 text-emerald-500 mb-4">
              <BarChart3 className="h-6 w-6" />
            </div>
            <h3 className="font-display text-xl font-semibold mb-2">Opportunity Scoring</h3>
            <p className="text-sm text-muted-foreground mb-4">0–100 scores based on how badly they need you.</p>
            <p className="text-4xl font-mono-data text-emerald-500">94 🔥</p>
            <p className="text-xs text-muted-foreground mt-1">Hot leads float to the top</p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-8 shadow-card lg:row-span-2">
            <div className="inline-grid h-12 w-12 place-items-center rounded-xl bg-blue-500/10 text-blue-500 mb-4">
              <Phone className="h-6 w-6" />
            </div>
            <h3 className="font-display text-xl font-semibold mb-2">Contact Details</h3>
            <p className="text-sm text-muted-foreground mb-4">Phone, email, WhatsApp — all copy-ready.</p>
            <div className="space-y-3 text-xs font-mono-data">
              <div className="rounded-lg bg-muted/50 p-3">📞 +234 802 555 0198</div>
              <div className="rounded-lg bg-muted/50 p-3">📧 info@business.com</div>
              <div className="rounded-lg bg-muted/50 p-3">🌐 No website</div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-8 shadow-card">
            <div className="inline-grid h-12 w-12 place-items-center rounded-xl bg-amber-500/10 text-amber-500 mb-4">
              <Bookmark className="h-6 w-6" />
            </div>
            <h3 className="font-display text-xl font-semibold mb-2">CRM Pipeline</h3>
            <p className="text-sm text-muted-foreground mb-4">Track leads from new to won.</p>
            <div className="flex items-center gap-2 text-xs">
              <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-700">New</span>
              <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-700">Contacted</span>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-8 shadow-card">
            <div className="inline-grid h-12 w-12 place-items-center rounded-xl bg-indigo-500/10 text-indigo-500 mb-4">
              <Mail className="h-6 w-6" />
            </div>
            <h3 className="font-display text-xl font-semibold mb-2">Templates</h3>
            <p className="text-sm text-muted-foreground mb-4">Ready-made outreach for every channel.</p>
            <div className="flex gap-2">
              <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">📧 Email</span>
              <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">📞 Phone</span>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-8 shadow-card lg:col-span-2">
            <div className="inline-grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary mb-4">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="font-display text-xl font-semibold mb-2">AI Outreach Writer (Pro)</h3>
            <p className="text-sm text-muted-foreground mb-4">Generate personalized messages in seconds.</p>
            <div className="text-left text-xs font-mono-data bg-muted/50 rounded-lg p-4">
              <p>Hi there,</p>
              <p className="mt-2">I found your business while searching Lagos...</p>
              <p className="mt-2 text-primary">[Your message generated here]</p>
            </div>
          </div>
        </div>
      </div>
    </MarketingShell>
  );
}
