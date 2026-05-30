import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketingShell, PageHeader } from "@/components/marketing/MarketingShell";
import { IMG } from "@/data/content";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How it works — FreelanceConnect" },
      { name: "description", content: "Step-by-step: how FreelanceConnect helps freelancers go from a blank screen to booked calls." },
      { property: "og:title", content: "How FreelanceConnect works" },
      { property: "og:description", content: "A simple 5-step workflow for finding and winning freelance clients." },
    ],
  }),
  component: HowPage,
});

const steps = [
  { n: "01", title: "Tell us your craft", desc: "Pick what you do — web dev, copy, SEO, design, video, photo, or 4 more. We tune the lead detector to what matters in your craft.", image: IMG.webDev },
  { n: "02", title: "Tell us where to look", desc: "Pick a country and city. Lagos, Naples, Mumbai, Mexico City — anywhere in the world. You can change it anytime.", image: IMG.marketStall },
  { n: "03", title: "Get a scored list of businesses", desc: "Within seconds you see a list of real businesses that fit. Each one has a score 0–100 telling you how much they need you.", image: IMG.seo },
  { n: "04", title: "Reach out with a real human message", desc: "Use our templates (or the AI writer on Pro) to send a first message in under a minute. Email, phone script, or DM.", image: IMG.copywriter },
  { n: "05", title: "Track replies in your pipeline", desc: "Move leads from 'contacted' to 'interested' to 'won' on a simple kanban board. No CRM headaches.", image: IMG.workspace },
];

function HowPage() {
  return (
    <MarketingShell>
      <PageHeader eyebrow="How it works" title="From blank screen to booked call in one afternoon." subtitle="No funnel diagrams. No marketing degree. Just five honest steps that have helped freelancers in 50+ countries land their first paying clients." image={IMG.heroLaptop} />
      <div className="mx-auto max-w-6xl px-4 py-16 lg:px-8 space-y-20">
        {steps.map((s, i) => (
          <div key={s.n} className={`grid gap-10 items-center lg:grid-cols-2 ${i % 2 ? "lg:[&>:first-child]:order-2" : ""}`}>
            <div>
              <p className="font-mono-data text-sm text-primary">{s.n}</p>
              <h2 className="mt-2 font-display text-3xl font-bold md:text-4xl">{s.title}</h2>
              <p className="mt-4 text-muted-foreground">{s.desc}</p>
            </div>
            <div className="relative">
              <div className="absolute -inset-3 rounded-2xl bg-primary/10"/>
              <img src={s.image} alt={s.title} className="relative aspect-[4/3] w-full rounded-2xl object-cover shadow-xl"/>
            </div>
          </div>
        ))}
      </div>
      <section className="px-4 pb-20 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-3xl bg-primary p-12 text-center text-primary-foreground">
          <h2 className="font-display text-3xl font-bold">Ready in 3 minutes</h2>
          <p className="mt-3 text-primary-foreground/90">Sign up, pick your craft, and your first 10 leads land in your dashboard immediately.</p>
          <Link to="/register" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-card px-6 py-3 text-sm font-semibold text-primary hover:scale-105 transition">Start finding leads <ArrowRight className="h-4 w-4"/></Link>
        </div>
      </section>
    </MarketingShell>
  );
}
