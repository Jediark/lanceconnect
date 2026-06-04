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

        {/* Global Community Map */}
        <div className="mt-20 border-t border-border pt-16">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary font-mono">// global.contributors</span>
            <h2 className="mt-2 font-display text-2xl font-bold tracking-tight md:text-3xl text-foreground">Global Freelancer Registry</h2>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Our community editors, authors, and active contributors share real playbooks from every major city.
            </p>
          </div>
          <div className="rounded-3xl border border-border bg-card overflow-hidden shadow-xl">
            <div className="relative aspect-[21/9] w-full min-h-[350px] bg-slate-950">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5015383.05602758!2d-10.4568!3d54.2379!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x254b85c40fb2f4b9%3A0x6fa1f2ef1c756!2sUnited%20Kingdom!5e0!3m2!1sen!2s!4v1680000000000!5m2!1sen!2s"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Map Contributors Location"
                className="absolute inset-0 w-full h-full grayscale-[15%] invert-[85%] dark:invert-[90%] hue-rotate-[180deg]"
              />
            </div>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
