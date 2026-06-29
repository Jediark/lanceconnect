import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketingShell, PageHeader } from "@/components/marketing/MarketingShell";
import { IMG } from "@/data/content";
import { ArrowRight, Briefcase, Target, Flame, Send, FolderKanban } from "lucide-react";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How it works — LanceConnect" },
      {
        name: "description",
        content:
          "Step-by-step: how LanceConnect helps freelancers go from a blank screen to booked calls.",
      },
      { property: "og:title", content: "How LanceConnect works" },
      { name: "keywords", content: "how lanceconnect works, find freelance clients, client discovery process, lead scoring, AI outreach, business lead generation" },
      {
        property: "og:description",
        content: "A simple 5-step workflow for finding and winning freelance clients.",
      },
    ],
  }),
  component: HowPage,
});

const steps = [
  {
    n: "01",
    title: "Set your craft",
    desc: "Select your freelance specialty to find matching client opportunities.",
    icon: Briefcase,
  },
  {
    n: "02",
    title: "Define your ideal client",
    desc: "Filter by location, industry, and project needs to target perfect fits.",
    icon: Target,
  },
  {
    n: "03",
    title: "Discover scored leads",
    desc: "Access verified lead lists with custom scores indicating hire readiness.",
    icon: Flame,
  },
  {
    n: "04",
    title: "Reach out directly",
    desc: "Pitch instantly using verified contact details and personalized templates.",
    icon: Send,
  },
  {
    n: "05",
    title: "Track replies in your pipeline",
    desc: "Manage your active deals from introduction to closed contract.",
    icon: FolderKanban,
  },
];

function HowPage() {
  return (
    <MarketingShell>
      <PageHeader
        eyebrow="How it works"
        title="From blank screen to booked call in one afternoon."
        subtitle="No funnel diagrams. No marketing degree. Just five honest steps that have helped freelancers in 50+ countries land their first paying clients."
        image={IMG.heroLaptop}
      />
      
      <div className="mx-auto max-w-4xl px-4 py-20 lg:px-8">
        <div className="flex flex-col gap-8">
          {steps.map((s, i) => {
            const Icon = s.icon;
            return (
              <section 
                key={s.n}
                className="rounded-3xl border border-white/[0.06] bg-[#09132e] p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-8 shadow-xl transition-all duration-300 hover:border-primary/35 hover:shadow-2xl hover:shadow-primary/5"
              >
                <div className="p-4.5 rounded-2xl bg-[#020b21] border border-[#11204c] text-primary flex items-center justify-center shrink-0">
                  <Icon className="h-16 w-16 text-primary" />
                </div>
                <div className="space-y-2 flex-1 text-left">
                  <p className="font-mono text-xs text-primary font-bold tracking-widest">
                    // step.{s.n}
                  </p>
                  <h3 className="font-display text-xl font-bold text-white">
                    {s.title}
                  </h3>
                  <p className="text-slate-350 text-sm leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              </section>
            );
          })}
        </div>
      </div>

      <section className="px-4 pb-20 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-3xl bg-primary p-12 text-center text-primary-foreground">
          <h2 className="font-display text-3xl font-bold">Ready in 3 minutes</h2>
          <p className="mt-3 text-primary-foreground/90">
            Sign up, pick your craft, and your first 10 leads land in your dashboard immediately.
          </p>
          <Link
            to="/register"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-card px-6 py-3 text-sm font-semibold text-primary hover:scale-105 transition"
          >
            Start finding leads <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </MarketingShell>
  );
}
