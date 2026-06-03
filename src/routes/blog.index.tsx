import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketingShell, PageHeader } from "@/components/marketing/MarketingShell";
import { BLOG_POSTS } from "@/data/content";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: "Blog — LanceConnect" },
      { name: "description", content: "Real stories, scripts, and playbooks from freelancers who actually win clients." },
      { property: "og:title", content: "LanceConnect Blog" },
    ],
  }),
  component: BlogIndex,
});

function BlogIndex() {
  const [hero, ...rest] = BLOG_POSTS;
  return (
    <MarketingShell>
      <PageHeader eyebrow="Blog" title="Playbooks from working freelancers." subtitle="Cold-email scripts that landed real clients. Pricing mistakes. Outreach experiments. Written by the people who actually do the work."/>
      <section className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <Link to="/blog/$slug" params={{slug: hero.slug}} className="group grid gap-8 rounded-3xl border border-border bg-card p-6 lg:grid-cols-2 lg:p-8 hover:shadow-card-hover transition">
          <div className="relative overflow-hidden rounded-2xl">
            <img src={hero.cover} alt={hero.title} className="aspect-[4/3] w-full object-cover transition group-hover:scale-105"/>
          </div>
          <div className="flex flex-col justify-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">{hero.category} · Featured</span>
            <h2 className="mt-3 font-display text-3xl font-bold md:text-4xl">{hero.title}</h2>
            <p className="mt-4 text-muted-foreground">{hero.excerpt}</p>
            <div className="mt-5 flex items-center gap-3 text-xs text-muted-foreground">
              <img src={hero.authorAvatar} alt={hero.author} className="h-8 w-8 rounded-full object-cover"/>
              <span>{hero.author} · {hero.date} · {hero.readMins} min read</span>
            </div>
          </div>
        </Link>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {rest.map(p => (
            <Link key={p.slug} to="/blog/$slug" params={{slug: p.slug}} className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition hover:-translate-y-0.5 hover:shadow-card-hover">
              <div className="overflow-hidden">
                <img src={p.cover} alt={p.title} className="aspect-[16/10] w-full object-cover transition duration-500 group-hover:scale-105"/>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <span className="text-[11px] font-semibold uppercase tracking-widest text-primary">{p.category}</span>
                <h3 className="mt-2 font-display text-lg font-semibold leading-snug">{p.title}</h3>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{p.excerpt}</p>
                <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                  <img src={p.authorAvatar} alt={p.author} className="h-6 w-6 rounded-full object-cover"/>
                  <span>{p.author} · {p.readMins} min</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </MarketingShell>
  );
}
