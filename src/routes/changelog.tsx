import { createFileRoute } from "@tanstack/react-router";
import { MarketingShell, PageHeader } from "@/components/marketing/MarketingShell";
import { CHANGELOG } from "@/data/content";

export const Route = createFileRoute("/changelog")({
  head: () => ({
    meta: [
      { title: "Changelog — LanceConnect" },
      { name: "description", content: "Every update we ship. Features, improvements, and fixes." },
    ],
  }),
  component: () => (
    <MarketingShell>
      <PageHeader
        eyebrow="Changelog"
        title="What we shipped."
        subtitle="A new version roughly every 2 weeks. Built by 6 people across 6 time zones."
      />
      <section className="mx-auto max-w-3xl px-4 py-16 lg:px-8">
        <ol className="space-y-10">
          {CHANGELOG.map((e) => (
            <li key={e.version} className="relative pl-6 border-l-2 border-border">
              <span className="absolute -left-[7px] top-2 h-3 w-3 rounded-full bg-primary" />
              <div className="flex flex-wrap items-baseline gap-3">
                <span className="font-mono-data text-xs text-muted-foreground">{e.date}</span>
                <span className="font-mono-data text-xs font-semibold text-primary">
                  {e.version}
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                    e.tag === "feature"
                      ? "bg-primary/10 text-primary"
                      : e.tag === "improvement"
                        ? "bg-success/10 text-success"
                        : "bg-warn/10 text-warn"
                  }`}
                >
                  {e.tag}
                </span>
              </div>
              <h3 className="mt-2 font-display text-xl font-bold">{e.title}</h3>
              <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                {e.items.map((i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-primary">→</span>
                    {i}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </section>
    </MarketingShell>
  ),
});
