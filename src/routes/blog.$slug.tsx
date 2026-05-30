import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { BLOG_POSTS } from "@/data/content";
import { ArrowLeft, Twitter, Linkedin, Link2 } from "lucide-react";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const post = BLOG_POSTS.find(p => p.slug === params.slug);
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData }) => ({
    meta: loaderData ? [
      { title: `${loaderData.post.title} — FreelanceConnect Blog` },
      { name: "description", content: loaderData.post.excerpt },
      { property: "og:title", content: loaderData.post.title },
      { property: "og:description", content: loaderData.post.excerpt },
      { property: "og:image", content: loaderData.post.cover },
      { property: "og:type", content: "article" },
    ] : [],
  }),
  notFoundComponent: () => (
    <MarketingShell>
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="font-display text-3xl font-bold">Post not found</h1>
        <Link to="/blog" className="mt-4 inline-block text-primary hover:underline">← Back to blog</Link>
      </div>
    </MarketingShell>
  ),
  errorComponent: ({ reset }) => (
    <MarketingShell><div className="mx-auto max-w-2xl px-4 py-24 text-center"><p>Something went wrong.</p><button onClick={reset} className="mt-3 rounded bg-primary px-4 py-2 text-sm text-primary-foreground">Retry</button></div></MarketingShell>
  ),
  component: BlogPost,
});

function BlogPost() {
  const { post } = Route.useLoaderData();
  const related = BLOG_POSTS.filter(p => p.slug !== post.slug).slice(0, 3);
  return (
    <MarketingShell>
      <article>
        <div className="mx-auto max-w-3xl px-4 pt-12 lg:px-8">
          <Link to="/blog" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-3.5 w-3.5"/> Back to blog</Link>
          <span className="mt-6 inline-block text-xs font-semibold uppercase tracking-widest text-primary">{post.category}</span>
          <h1 className="mt-2 font-display text-4xl font-bold leading-tight md:text-5xl">{post.title}</h1>
          <div className="mt-6 flex items-center gap-3 text-sm text-muted-foreground">
            <img src={post.authorAvatar} alt={post.author} className="h-10 w-10 rounded-full object-cover"/>
            <div><p className="font-semibold text-foreground">{post.author}</p><p className="text-xs">{post.date} · {post.readMins} min read</p></div>
          </div>
        </div>
        <div className="mx-auto mt-10 max-w-5xl px-4 lg:px-8">
          <img src={post.cover} alt="" className="aspect-[16/9] w-full rounded-2xl object-cover"/>
        </div>
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 lg:grid-cols-[1fr_240px] lg:px-8">
          <div className="space-y-5 text-base leading-relaxed text-foreground/85">
            {post.body.split("\n\n").map((para, i) => <p key={i}>{para}</p>)}
            <hr className="my-8 border-border"/>
            <div className="rounded-2xl border border-border bg-paper p-6">
              <p className="font-display text-lg font-semibold">Stop refreshing job boards.</p>
              <p className="mt-1 text-sm text-muted-foreground">Get 10 real, scored leads in your city — free.</p>
              <Link to="/register" className="mt-3 inline-block rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">Start free</Link>
            </div>
          </div>
          <aside className="space-y-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Share</p>
              <div className="mt-2 flex gap-2">
                {[Twitter, Linkedin, Link2].map((I, i) => <button key={i} className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-card hover:bg-accent"><I className="h-4 w-4"/></button>)}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">More posts</p>
              <ul className="mt-3 space-y-3">
                {related.map(p => (
                  <li key={p.slug}>
                    <Link to="/blog/$slug" params={{slug:p.slug}} className="group block">
                      <img src={p.cover} alt="" className="aspect-[16/10] w-full rounded-lg object-cover"/>
                      <p className="mt-2 text-sm font-semibold leading-snug group-hover:text-primary">{p.title}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </article>
    </MarketingShell>
  );
}
