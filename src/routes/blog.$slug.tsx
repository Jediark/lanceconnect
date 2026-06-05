import { useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { BLOG_POSTS } from "@/data/content";
import {
  ArrowLeft,
  Twitter,
  Linkedin,
  Link2,
  MessageSquare,
  Send,
  Calendar,
  User,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const post = BLOG_POSTS.find((p) => p.slug === params.slug);
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.post.title} — LanceConnect Blog` },
          { name: "description", content: loaderData.post.excerpt },
          { property: "og:title", content: loaderData.post.title },
          { property: "og:description", content: loaderData.post.excerpt },
          { property: "og:image", content: loaderData.post.cover },
          { property: "og:type", content: "article" },
        ]
      : [],
  }),
  notFoundComponent: () => (
    <MarketingShell>
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="font-display text-3xl font-bold">Post not found</h1>
        <Link to="/blog" className="mt-4 inline-block text-primary hover:underline">
          ← Back to blog
        </Link>
      </div>
    </MarketingShell>
  ),
  errorComponent: ({ reset }) => (
    <MarketingShell>
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <p>Something went wrong.</p>
        <button
          onClick={reset}
          className="mt-3 rounded bg-primary px-4 py-2 text-sm text-primary-foreground"
        >
          Retry
        </button>
      </div>
    </MarketingShell>
  ),
  component: BlogPost,
});

type Comment = {
  id: string;
  author: string;
  avatar: string;
  date: string;
  content: string;
};

const MOCK_COMMENTS: Record<string, Comment[]> = {
  "first-five-cold-emails": [
    {
      id: "c1",
      author: "Adebayo Alao",
      avatar:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&q=80",
      date: "May 22, 2026",
      content:
        "This formula is gold. I tried the three-sentence approach this morning for a local retail shop here in Lagos and got a reply within an hour! Keeping it low pressure is key.",
    },
    {
      id: "c2",
      author: "Sarah Jenkins",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&q=80",
      date: "May 23, 2026",
      content:
        "I used to write long emails explaining my background. Now I realize nobody cares about my life story, they just want to know how I can fix their broken site.",
    },
  ],
  "scoring-leads-without-ai": [
    {
      id: "c3",
      author: "Carlos Mendez",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&q=80",
      date: "May 15, 2026",
      content:
        "I love the +15 point rule for broken contact forms. That is a massive pain point for any business because they are losing actual dollars. Brilliant checklist.",
    },
  ],
  "pricing-as-a-new-freelancer": [
    {
      id: "c4",
      author: "Sophia V.",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&q=80",
      date: "May 8, 2026",
      content:
        "Charging by project changed my life. I used to feel rushed when coding. Now I focus purely on creating the absolute best experience for the client, and they're happy to pay a premium.",
    },
  ],
};

function BlogPost() {
  const { post } = Route.useLoaderData();
  const related = BLOG_POSTS.filter((p) => p.slug !== post.slug).slice(0, 3);

  // Comments State
  const [comments, setComments] = useState<Comment[]>(() => MOCK_COMMENTS[post.slug] || []);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [text, setText] = useState("");

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !text.trim()) {
      toast.error("Please provide both your name and comment text.");
      return;
    }

    const newComment: Comment = {
      id: String(Date.now()),
      author: name,
      avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name)}`,
      date: "Just now",
      content: text,
    };

    setComments((prev) => [newComment, ...prev]);
    setName("");
    setEmail("");
    setText("");
    toast.success("Comment posted successfully!");
  };

  // Yoast SEO: Extract headings for Table of Contents
  const headings = post.body
    .split("\n\n")
    .filter((para) => para.trim().startsWith("## "))
    .map((para) => para.trim().replace("## ", ""));

  return (
    <MarketingShell>
      <article className="min-h-screen bg-background">
        {/* Post Title & Metadata (SEO-Standard H1) */}
        <div className="mx-auto max-w-3xl px-4 pt-12 lg:px-8">
          <Link
            to="/blog"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to blog
          </Link>
          <span className="mt-6 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
            {post.category}
          </span>
          <h1 className="mt-4 font-display text-4xl font-extrabold leading-tight text-foreground md:text-5xl lg:text-6xl tracking-tight">
            {post.title}
          </h1>
          <div className="mt-6 flex items-center gap-3 border-y border-border/60 py-4 text-sm text-muted-foreground">
            <img
              src={post.authorAvatar}
              alt={post.author}
              className="h-10 w-10 rounded-full object-cover border-2 border-primary/20"
            />
            <div>
              <p className="font-bold text-foreground">{post.author}</p>
              <p className="text-xs flex items-center gap-2 mt-0.5">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground/60" /> {post.date} ·{" "}
                {post.readMins} min read
              </p>
            </div>
          </div>
        </div>

        {/* Featured Cover Image */}
        <div className="mx-auto mt-10 max-w-5xl px-4 lg:px-8">
          <img
            src={post.cover}
            alt={post.title}
            className="aspect-[16/9] w-full rounded-2xl object-cover shadow-sm border border-border/80"
          />
        </div>

        {/* Content Layout with Table of Contents & Body */}
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 lg:grid-cols-[1fr_280px] lg:px-8">
          <div className="space-y-6">
            {/* Table of Contents for Readability (Yoast SEO Requirement) */}
            {headings.length > 0 && (
              <div className="rounded-xl border border-border bg-card/40 p-4 mb-6">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                  Table of Contents
                </p>
                <ul className="space-y-1.5 text-sm">
                  {headings.map((h, i) => (
                    <li key={i}>
                      <a
                        href={`#section-${i}`}
                        className="text-primary hover:underline font-medium hover:text-primary-foreground flex items-center gap-1.5"
                      >
                        <span className="text-xs text-muted-foreground/60 font-mono">
                          0{i + 1}.
                        </span>{" "}
                        {h}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Post Content Body */}
            <div className="space-y-6 text-[16px] md:text-[17px] leading-relaxed text-foreground font-medium">
              {post.body.split("\n\n").map((para: string, i: number) => {
                const trimmed = para.trim();

                // H2 headings
                if (trimmed.startsWith("## ")) {
                  const headingText = trimmed.replace("## ", "");
                  const headingId = headings.indexOf(headingText);
                  return (
                    <h2
                      key={i}
                      id={`section-${headingId}`}
                      className="font-display text-2xl font-extrabold text-foreground mt-10 mb-4 pt-4 border-t border-border/20 tracking-tight scroll-mt-20"
                    >
                      {headingText}
                    </h2>
                  );
                }

                // H3 headings
                if (trimmed.startsWith("### ")) {
                  return (
                    <h3
                      key={i}
                      className="font-display text-xl font-bold text-foreground mt-8 mb-3 tracking-tight"
                    >
                      {trimmed.replace("### ", "")}
                    </h3>
                  );
                }

                // Bullet Lists
                if (trimmed.startsWith("- ")) {
                  const items = trimmed.split("\n").map((li) => li.replace(/^- /, "").trim());
                  return (
                    <ul
                      key={i}
                      className="list-disc pl-6 my-4 space-y-2 text-foreground/90 font-normal"
                    >
                      {items.map((item, idx) => {
                        if (item.includes("**")) {
                          const parts = item.split("**");
                          return (
                            <li key={idx}>
                              {parts.map((part, pidx) =>
                                pidx % 2 === 1 ? (
                                  <strong key={pidx} className="font-extrabold text-foreground">
                                    {part}
                                  </strong>
                                ) : (
                                  part
                                ),
                              )}
                            </li>
                          );
                        }
                        return <li key={idx}>{item}</li>;
                      })}
                    </ul>
                  );
                }

                // Standard Paragraph with Inline Bold Formatting
                if (trimmed.includes("**")) {
                  const parts = trimmed.split("**");
                  return (
                    <p key={i} className="mb-4 text-foreground/90 font-normal">
                      {parts.map((part, pidx) =>
                        pidx % 2 === 1 ? (
                          <strong key={pidx} className="font-extrabold text-foreground">
                            {part}
                          </strong>
                        ) : (
                          part
                        ),
                      )}
                    </p>
                  );
                }

                return (
                  <p key={i} className="mb-4 text-foreground/90 font-normal">
                    {para}
                  </p>
                );
              })}
            </div>

            {/* Newsletter CTA Block */}
            <hr className="my-10 border-border/50" />
            <div className="rounded-2xl border border-border bg-card p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="max-w-md">
                <h4 className="font-display text-lg font-bold text-foreground">
                  Stop refreshing cold job boards.
                </h4>
                <p className="mt-1 text-sm text-muted-foreground">
                  Get 10 fresh, highly-scored leads in your targeted city every week — completely
                  free.
                </p>
              </div>
              <Link
                to="/register"
                className="w-full md:w-auto text-center shrink-0 inline-flex justify-center items-center rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white hover:brightness-110 transition-all"
              >
                Start Free Program
              </Link>
            </div>

            {/* Yoast SEO / User Comment Section */}
            <section className="mt-12 border-t border-border pt-10">
              <h3 className="text-xl font-bold text-foreground flex items-center gap-2 mb-6">
                <MessageSquare className="h-5 w-5 text-primary" />
                Comments ({comments.length})
              </h3>

              {/* Leave a Comment Form */}
              <form
                onSubmit={handlePostComment}
                className="bg-card/50 rounded-xl border border-border p-6 mb-8 space-y-4"
              >
                <h4 className="text-sm font-bold text-foreground">Join the conversation</h4>
                <p className="text-xs text-muted-foreground">
                  Your email address will not be published. Required fields are marked *
                </p>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                      Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jane Doe"
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="jane@example.com"
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                    Comment *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Write your thought here..."
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-white hover:brightness-110 transition cursor-pointer"
                >
                  <Send className="h-3.5 w-3.5" /> Post Comment
                </button>
              </form>

              {/* Comments List */}
              <div className="space-y-6">
                {comments.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic">
                    No comments yet. Be the first to comment!
                  </p>
                ) : (
                  comments.map((comment) => (
                    <div key={comment.id} className="flex gap-4 border-b border-border/40 pb-6">
                      <img
                        src={comment.avatar}
                        alt={comment.author}
                        className="h-10 w-10 rounded-full bg-accent/30 border border-border object-cover shrink-0"
                      />
                      <div className="space-y-1">
                        <div className="flex items-baseline gap-2">
                          <span className="text-sm font-bold text-foreground">
                            {comment.author}
                          </span>
                          <span className="text-[10px] text-muted-foreground">{comment.date}</span>
                        </div>
                        <p className="text-sm text-foreground/80 leading-relaxed font-normal">
                          {comment.content}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Share Article
              </p>
              <div className="mt-2.5 flex gap-2">
                {[Twitter, Linkedin, Link2].map((I, i) => (
                  <button
                    key={i}
                    onClick={() => toast.success("Shared link copied!")}
                    className="grid h-10 w-10 place-items-center rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-accent transition"
                  >
                    <I className="h-4 w-4" />
                  </button>
                ))}
              </div>
            </div>

            <hr className="border-border/60" />

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                More from our blog
              </p>
              <ul className="mt-4 space-y-4">
                {related.map((p) => (
                  <li key={p.slug}>
                    <Link to="/blog/$slug" params={{ slug: p.slug }} className="group block">
                      <div className="overflow-hidden rounded-xl border border-border/80">
                        <img
                          src={p.cover}
                          alt={p.title}
                          className="aspect-[16/10] w-full object-cover transition duration-300 group-hover:scale-105"
                        />
                      </div>
                      <p className="mt-2 text-sm font-bold leading-snug text-foreground group-hover:text-primary transition-colors">
                        {p.title}
                      </p>
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
