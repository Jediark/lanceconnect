import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { MarketingShell, PageHeader } from "@/components/marketing/MarketingShell";
import { FREELANCER_CATEGORIES } from "@/data/content";
import { ArrowRight, AlertCircle, Building2, Code, Palette, PenTool, TrendingUp, MessageSquare, Video, Camera, Megaphone, Smartphone, Users } from "lucide-react";

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  "web-developers": <Code className="h-5 w-5 text-primary" />,
  "designers": <Palette className="h-5 w-5 text-primary" />,
  "copywriters": <PenTool className="h-5 w-5 text-primary" />,
  "seo-specialists": <TrendingUp className="h-5 w-5 text-primary" />,
  "social-media": <MessageSquare className="h-5 w-5 text-primary" />,
  "videographers": <Video className="h-5 w-5 text-primary" />,
  "photographers": <Camera className="h-5 w-5 text-primary" />,
  "marketers": <Megaphone className="h-5 w-5 text-primary" />,
  "app-developers": <Smartphone className="h-5 w-5 text-primary" />,
  "virtual-assistants": <Users className="h-5 w-5 text-primary" />
};

export const Route = createFileRoute("/freelancers/$slug")({
  loader: ({ params }) => {
    const cat = FREELANCER_CATEGORIES.find(c => c.slug === params.slug);
    if (!cat) throw notFound();
    return { cat };
  },
  head: ({ loaderData }) => ({
    meta: loaderData ? [
      { title: `Find clients as a ${loaderData.cat.label.toLowerCase()} — LanceConnect` },
      { name: "description", content: loaderData.cat.tagline },
      { property: "og:title", content: `For ${loaderData.cat.label}` },
      { property: "og:description", content: loaderData.cat.tagline },
      { property: "og:image", content: loaderData.cat.image },
    ] : [],
  }),
  notFoundComponent: () => (
    <MarketingShell>
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="font-display text-3xl font-bold">Category not found</h1>
        <Link to="/" className="mt-4 inline-block text-primary hover:underline">← Back home</Link>
      </div>
    </MarketingShell>
  ),
  errorComponent: ({ reset }) => (
    <MarketingShell><div className="mx-auto max-w-2xl px-4 py-24 text-center"><p>Something went wrong.</p><button onClick={reset} className="mt-3 rounded bg-primary px-4 py-2 text-sm text-primary-foreground">Retry</button></div></MarketingShell>
  ),
  component: CategoryPage,
});

function CategoryPage() {
  const { cat } = Route.useLoaderData();
  const others = FREELANCER_CATEGORIES.filter(c => c.slug !== cat.slug).slice(0, 4);
  return (
    <MarketingShell>
      <PageHeader eyebrow={`For ${cat.label}`} title={cat.tagline} subtitle={cat.description} image={cat.image}/>

      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8 grid gap-10 lg:grid-cols-2">
        <div>
          <div className="inline-grid h-12 w-12 place-items-center rounded-xl bg-warn/15 text-warn"><AlertCircle className="h-6 w-6"/></div>
          <h2 className="mt-4 font-display text-3xl font-bold">What we detect</h2>
          <p className="mt-3 text-muted-foreground">LanceConnect's scoring engine specifically looks for the signals that mean a business is ready to hire {cat.label.toLowerCase()}:</p>
          <ul className="mt-5 space-y-2">
            {cat.problems.map((p: string) => (
              <li key={p} className="flex gap-3 rounded-xl border border-border bg-card p-3 text-sm"><span className="text-primary">●</span>{p}</li>
            ))}
          </ul>
        </div>
        <div>
          <div className="inline-grid h-12 w-12 place-items-center rounded-xl bg-success/15 text-success"><Building2 className="h-6 w-6"/></div>
          <h2 className="mt-4 font-display text-3xl font-bold">Example leads</h2>
          <p className="mt-3 text-muted-foreground">A snapshot of the kind of businesses you'll see on day one.</p>
          <div className="mt-5 space-y-3">
            {cat.sampleBusinesses.map((b: {name:string;reason:string}) => (
              <div key={b.name} className="rounded-xl border border-border bg-card p-4">
                <p className="font-semibold">{b.name}</p>
                <p className="mt-1 text-sm text-muted-foreground"><span className="text-primary">Why:</span> {b.reason}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-16 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-3xl bg-primary p-10 text-center text-primary-foreground">
          <h2 className="font-display text-3xl font-bold">Start with 10 free {cat.label.toLowerCase()} leads.</h2>
          <p className="mt-2 text-primary-foreground/90">No credit card. Pick your city and they're in your dashboard in seconds.</p>
          <Link to="/register" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-card px-6 py-3 text-sm font-semibold text-primary hover:scale-105 transition">Get my leads <ArrowRight className="h-4 w-4"/></Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 lg:px-8">
        <h3 className="font-display text-xl font-bold">Other crafts we serve</h3>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {others.map(o => (
            <Link key={o.slug} to="/freelancers/$slug" params={{slug:o.slug}} className="group rounded-xl border border-border bg-card p-4 hover:border-primary">
              <div className="mb-2 text-primary">{CATEGORY_ICONS[o.slug] || <Code className="h-5 w-5" />}</div>
              <p className="mt-2 font-display font-semibold group-hover:text-primary">{o.label}</p>
              <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{o.tagline}</p>
            </Link>
          ))}
        </div>
      </section>
    </MarketingShell>
  );
}
