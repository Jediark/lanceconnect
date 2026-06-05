import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketingShell, PageHeader } from "@/components/marketing/MarketingShell";
import { IMG } from "@/data/content";
import { ArrowRight } from "lucide-react";

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
    title: "Pick your skill",
    desc: "Select your freelance category — web dev, design, copywriting, and 7 more.",
    image: IMG.webDev,
    human: IMG.face1,
    caption: "This is Amara from Lagos",
  },
  {
    n: "02",
    title: "Choose your market",
    desc: "Target any city or country in the world. Filter by industry, size, signals.",
    image: IMG.marketStall,
    human: IMG.face2,
    caption: "This is Diego from São Paulo",
  },
  {
    n: "03",
    title: "Discover scored leads",
    desc: "Get a scored list of businesses that fit. Hot leads bubble to the top.",
    image: IMG.seo,
    human: IMG.face3,
    caption: "This is Sarah from London",
  },
  {
    n: "04",
    title: "Reach out directly",
    desc: "Use our templates (or the AI writer on Pro) to send a first message.",
    image: IMG.copywriter,
    human: IMG.face4,
    caption: "This is Priya from Mumbai",
  },
  {
    n: "05",
    title: "Track replies in your pipeline",
    desc: "Move leads from 'contacted' to 'interested' to 'won'.",
    image: IMG.workspace,
    human: IMG.face1,
    caption: "Your pipeline, simple and clean",
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
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8 space-y-20">
        {steps.map((s, i) => (
          <section key={s.n} className="grid gap-10 items-center lg:grid-cols-2">
            <div className={`${i % 2 === 0 ? "lg:order-2" : ""}`}>
              <p className="font-mono-data text-sm text-primary">// step.{s.n}</p>
              <h2 className="mt-2 font-display text-3xl font-bold md:text-3xl">{s.title}</h2>
              <p className="mt-4 text-muted-foreground">{s.desc}</p>
              <p className="mt-3 text-xs text-primary font-medium">{s.caption}</p>
            </div>
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-3xl border border-border bg-card shadow-2xl group">
              <img
                src={s.image}
                alt={s.title}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                loading="lazy"
              />

              {/* Floating Freelancer Badge */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3 rounded-2xl border border-border bg-card p-3 shadow-xl">
                <img
                  src={s.human}
                  alt={s.caption}
                  className="h-9 w-9 rounded-full object-cover border-2 border-primary/45 shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold text-foreground truncate leading-tight">
                    {s.caption}
                  </p>
                  <p className="text-[9px] text-muted-foreground font-mono mt-0.5 leading-none">
                    Verified Freelancer
                  </p>
                </div>
              </div>
            </div>
          </section>
        ))}
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
