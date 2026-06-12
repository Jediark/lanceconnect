import { useState, useEffect } from "react";
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
  ChevronRight,
  Clock,
  BookOpen,
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
          { property: "og:url", content: `https://lanceconnect.vercel.app/blog/${loaderData.post.slug}` },
          { name: "twitter:card", content: "summary_large_image" },
          { name: "twitter:title", content: loaderData.post.title },
          { name: "twitter:description", content: loaderData.post.excerpt },
          { name: "twitter:image", content: loaderData.post.cover },
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
  const [scrollProgress, setScrollProgress] = useState(0);

  // Scroll tracking for progress indicator
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress((window.scrollY / totalHeight) * 100);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  const handleShare = (platform: "twitter" | "linkedin" | "copy") => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const title = post.title;
    
    if (platform === "twitter") {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, "_blank");
    } else if (platform === "linkedin") {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, "_blank");
    } else {
      navigator.clipboard.writeText(url);
      toast.success("Article link copied to clipboard!");
    }
  };

  // Yoast SEO: Extract headings for Table of Contents
  const headings = post.body
    .split("\n\n")
    .filter((para) => para.trim().startsWith("## "))
    .map((para) => para.trim().replace("## ", ""));

  const getAuthorBio = (authorName: string) => {
    switch (authorName) {
      case "Taiwo Adeyemi":
        return "Taiwo Adeyemi is a senior client acquisition specialist and outreach designer. Having sent thousands of cold emails for startups and freelancers, he helps professionals secure clients globally.";
      case "Maria Silva":
        return "Maria Silva is a freelance growth strategist and data analyst based in Brazil. She designs lead scoring models and advises agencies on cold outreach operations.";
      case "Sophia Jenkins":
        return "Sophia Jenkins is a senior freelance writer and B2B marketer with a focus on value pricing models and positioning strategy.";
      default:
        return `${authorName} is a senior writer and marketing consultant at LanceConnect, specializing in B2B lead generation, client positioning, and freelance growth strategy.`;
    }
  };

  // Yoast SEO: JSON-LD Structured Data Schema Markup
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "image": [post.cover],
    "datePublished": "2026-05-21", // Fallback standard date
    "author": {
      "@type": "Person",
      "name": post.author,
      "image": post.authorAvatar
    },
    "publisher": {
      "@type": "Organization",
      "name": "LanceConnect",
      "logo": {
        "@type": "ImageObject",
        "url": "https://lanceconnect.vercel.app/favicon.png"
      }
    },
    "description": post.excerpt,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": typeof window !== "undefined" ? window.location.href : `https://lanceconnect.vercel.app/blog/${post.slug}`
    }
  };

  return (
    <MarketingShell>
      {/* JSON-LD Schema Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
      />

      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-[3px] bg-border/20 z-50 select-none">
        <div
          className="h-full bg-gradient-to-r from-primary to-cyan-500 transition-all duration-100"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <article className="min-h-screen bg-background">
        {/* Premium Immersive Hero Section */}
        <header className="relative overflow-hidden bg-[#070e1e] border-b border-border/40 py-16 md:py-24">
          {/* Subtle Ambient Blurred Cover Backdrop */}
          <div className="absolute inset-0 z-0 opacity-15 pointer-events-none select-none">
            <img
              src={post.cover}
              alt=""
              className="w-full h-full object-cover blur-3xl scale-110"
            />
            <div className="absolute inset-0 bg-[#070e1e]/85" />
          </div>

          <div className="relative z-10 mx-auto max-w-6xl px-4 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-[1fr_420px] items-center">
              {/* Left Side: Post Metadata & Title */}
              <div className="space-y-6">
                <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono text-muted-foreground select-none uppercase tracking-widest">
                  <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
                  <ChevronRight className="h-3 w-3" />
                  <Link to="/blog" className="hover:text-foreground transition-colors">Blog</Link>
                  <ChevronRight className="h-3 w-3" />
                  <span className="text-primary font-semibold">{post.category}</span>
                </div>

                <div className="space-y-3">
                  <span className="inline-block rounded-full bg-primary/10 border border-primary/25 px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-primary">
                    {post.category}
                  </span>
                  <h1 className="font-display text-3xl font-black leading-tight text-white md:text-4xl lg:text-5xl tracking-tight">
                    {post.title}
                  </h1>
                </div>

                <p className="text-sm md:text-base text-slate-350 leading-relaxed max-w-2xl font-normal">
                  {post.excerpt}
                </p>

                {/* Author Info & Share Tools */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-slate-800/80">
                  <div className="flex items-center gap-3">
                    <img
                      src={post.authorAvatar}
                      alt={post.author}
                      className="h-11 w-11 rounded-full object-cover border-2 border-primary/20 bg-primary/10"
                    />
                    <div>
                      <p className="font-bold text-white text-sm leading-snug">{post.author}</p>
                      <p className="text-[10px] text-slate-400 flex items-center gap-2 mt-1 font-mono">
                        <Calendar className="h-3.5 w-3.5" /> {post.date} • <Clock className="h-3.5 w-3.5" /> {post.readMins} min read
                      </p>
                    </div>
                  </div>

                  {/* Share button tray */}
                  <div className="flex items-center gap-2 select-none">
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest hidden sm:inline">Share:</span>
                    <button
                      onClick={() => handleShare("twitter")}
                      className="p-2 border border-slate-800 bg-slate-900/40 rounded-xl text-slate-400 hover:text-white hover:border-slate-700 hover:bg-slate-900 transition"
                      title="Share on Twitter"
                    >
                      <Twitter className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleShare("linkedin")}
                      className="p-2 border border-slate-800 bg-slate-900/40 rounded-xl text-slate-400 hover:text-white hover:border-slate-700 hover:bg-slate-900 transition"
                      title="Share on LinkedIn"
                    >
                      <Linkedin className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleShare("copy")}
                      className="p-2 border border-slate-800 bg-slate-900/40 rounded-xl text-slate-400 hover:text-white hover:border-slate-700 hover:bg-slate-900 transition"
                      title="Copy Link"
                    >
                      <Link2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Side: Main Cover Frame */}
              <div className="relative aspect-[16/10] w-full rounded-3xl overflow-hidden border border-slate-850 shadow-2xl hover:border-primary/30 transition duration-300">
                <img
                  src={post.cover}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </header>

        {/* 3-Column Responsive Reading Layout */}
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 lg:grid-cols-[220px_1fr] xl:grid-cols-[220px_1fr_280px] lg:px-8">
          
          {/* Column 1: Sticky Table of Contents (Desktop Only) */}
          <aside className="hidden lg:block">
            <div className="sticky top-28 space-y-6 max-h-[calc(100vh-140px)] overflow-y-auto pr-4 scrollbar-thin select-none">
              <div className="space-y-4">
                <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
                  Table of Contents
                </p>
                <nav className="space-y-2 text-xs">
                  {headings.length > 0 ? (
                    headings.map((h, i) => (
                      <a
                        key={i}
                        href={`#section-${i}`}
                        className="block text-slate-600 dark:text-slate-400 hover:text-primary transition-colors font-medium border-l border-border/80 pl-3 py-1 hover:border-primary"
                      >
                        {h}
                      </a>
                    ))
                  ) : (
                    <span className="text-muted-foreground italic">No subheadings</span>
                  )}
                </nav>
              </div>

              <hr className="border-border/60" />

              <div className="space-y-3">
                <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
                  Quick Share
                </p>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => handleShare("twitter")}
                    className="flex-1 py-2 rounded-lg border border-border bg-card hover:bg-accent hover:text-foreground text-muted-foreground flex justify-center items-center transition"
                  >
                    <Twitter className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleShare("linkedin")}
                    className="flex-1 py-2 rounded-lg border border-border bg-card hover:bg-accent hover:text-foreground text-muted-foreground flex justify-center items-center transition"
                  >
                    <Linkedin className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </aside>

          {/* Column 2: Main Body Column */}
          <div className="space-y-12 max-w-3xl mx-auto">
            {/* Inline Table of Contents for Mobile Viewports */}
            {headings.length > 0 && (
              <div className="rounded-2xl border border-border bg-card/30 p-5 lg:hidden select-none">
                <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-muted-foreground mb-3">
                  Table of Contents
                </p>
                <ul className="space-y-2 text-xs">
                  {headings.map((h, i) => (
                    <li key={i}>
                      <a
                        href={`#section-${i}`}
                        className="text-primary hover:underline font-semibold flex items-center gap-1.5"
                      >
                        <span className="text-muted-foreground/50 font-mono">0{i + 1}.</span> {h}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Structured Article Body Content */}
            <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-350 leading-relaxed text-base font-normal space-y-6">
              {post.body.split("\n\n").map((para: string, i: number) => {
                const trimmed = para.trim();

                // H2 Heading Parsing
                if (trimmed.startsWith("## ")) {
                  const headingText = trimmed.replace("## ", "");
                  const headingId = headings.indexOf(headingText);
                  return (
                    <h2
                      key={i}
                      id={`section-${headingId}`}
                      className="font-display text-xl md:text-2xl font-black text-slate-900 dark:text-white mt-12 mb-4 pt-6 border-t border-border/40 tracking-tight scroll-mt-24 flex items-center gap-2"
                    >
                      <span className="text-primary/70 font-mono text-sm font-bold">#</span>
                      {headingText}
                    </h2>
                  );
                }

                // H3 Heading Parsing
                if (trimmed.startsWith("### ")) {
                  return (
                    <h3
                      key={i}
                      className="font-display text-lg font-extrabold text-slate-800 dark:text-slate-100 mt-8 mb-3 tracking-tight"
                    >
                      {trimmed.replace("### ", "")}
                    </h3>
                  );
                }

                // Bullet Lists Parsing
                if (trimmed.startsWith("- ")) {
                  const items = trimmed.split("\n").map((li) => li.replace(/^- /, "").trim());
                  return (
                    <ul
                      key={i}
                      className="list-disc pl-6 my-4 space-y-2.5 text-slate-700 dark:text-slate-350 font-normal"
                    >
                      {items.map((item, idx) => {
                        if (item.includes("**")) {
                          const parts = item.split("**");
                          return (
                            <li key={idx}>
                              {parts.map((part, pidx) =>
                                pidx % 2 === 1 ? (
                                  <strong key={pidx} className="font-bold text-slate-900 dark:text-white">
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

                // Paragraph with Inline Bold Formatting
                if (trimmed.includes("**")) {
                  const parts = trimmed.split("**");
                  return (
                    <p key={i} className="mb-6 leading-relaxed">
                      {parts.map((part, pidx) =>
                        pidx % 2 === 1 ? (
                          <strong key={pidx} className="font-bold text-slate-900 dark:text-white">
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
                  <p key={i} className="mb-6 leading-relaxed">
                    {para}
                  </p>
                );
              })}
            </div>

            {/* Author Biography Box (Google EEAT Compliance) */}
            <div className="rounded-3xl border border-border bg-card/40 p-6 md:p-8 shadow-sm flex flex-col sm:flex-row gap-6 items-start">
              <img
                src={post.authorAvatar}
                alt={post.author}
                className="h-16 w-16 rounded-full object-cover border-2 border-primary/20 bg-primary/10 shrink-0"
              />
              <div className="space-y-2">
                <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-primary">About the Author</p>
                <h4 className="font-display font-bold text-base text-slate-900 dark:text-white leading-tight">
                  {post.author}
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed font-normal">
                  {getAuthorBio(post.author)}
                </p>
              </div>
            </div>

            {/* Newsletter CTA Block */}
            <div className="rounded-3xl border border-border bg-gradient-to-br from-[#0c162b] to-[#040811] p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-[0_0_25px_rgba(6,182,212,0.05)]">
              <div className="max-w-md space-y-1.5">
                <h4 className="font-display text-lg font-black text-white">
                  Stop chasing dead job boards.
                </h4>
                <p className="text-xs text-slate-400 leading-normal">
                  Receive 10 fresh, highly-scored business leads in your target industry and location every week — 100% free.
                </p>
              </div>
              <Link
                to="/register"
                className="w-full md:w-auto text-center shrink-0 inline-flex justify-center items-center rounded-xl bg-primary px-5 py-3 text-xs font-bold text-white hover:brightness-110 transition shadow-lg shadow-primary/15 select-none"
              >
                Get 10 Free Leads
              </Link>
            </div>

            {/* Comments Section */}
            <section className="border-t border-border pt-10 space-y-8">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                Comments ({comments.length})
              </h3>

              {/* Leave a Comment Form */}
              <form
                onSubmit={handlePostComment}
                className="bg-card/30 rounded-2xl border border-border p-6 space-y-4"
              >
                <div className="space-y-1.5">
                  <h4 className="text-sm font-bold text-foreground">Join the discussion</h4>
                  <p className="text-xs text-muted-foreground">
                    Required fields are marked with * (your email address will not be published).
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                      Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jane Doe"
                      className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground focus:outline-none focus:border-primary transition"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="jane@example.com"
                      className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground focus:outline-none focus:border-primary transition"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                    Comment *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Write your thought here..."
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground resize-none focus:outline-none focus:border-primary transition"
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-white hover:brightness-110 transition cursor-pointer select-none"
                >
                  <Send className="h-3.5 w-3.5" /> Post Comment
                </button>
              </form>

              {/* Comments List */}
              <div className="space-y-6">
                {comments.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic">
                    No comments yet. Be the first to start the conversation!
                  </p>
                ) : (
                  comments.map((comment) => (
                    <div key={comment.id} className="flex gap-4 border-b border-border/40 pb-6 last:border-b-0">
                      <img
                        src={comment.avatar}
                        alt={comment.author}
                        className="h-10 w-10 rounded-full bg-accent/30 border border-border object-cover shrink-0"
                      />
                      <div className="space-y-1">
                        <div className="flex items-baseline gap-2">
                          <span className="text-xs font-bold text-foreground">
                            {comment.author}
                          </span>
                          <span className="text-[9px] text-muted-foreground font-mono">{comment.date}</span>
                        </div>
                        <p className="text-xs text-foreground/80 leading-relaxed font-normal">
                          {comment.content}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>

          {/* Column 3: Secondary Sidebar (Desktop/XL Only) */}
          <aside className="hidden xl:block">
            <div className="sticky top-28 space-y-6 max-h-[calc(100vh-140px)] overflow-y-auto pl-4 scrollbar-thin">
              {/* Promo widget */}
              <div className="rounded-2xl border border-border bg-card p-5 space-y-3 select-none">
                <BookOpen className="h-5 w-5 text-primary" />
                <h4 className="font-display font-bold text-xs text-foreground">LanceConnect Platform</h4>
                <p className="text-[10px] text-muted-foreground leading-normal">
                  Find active business leads in 150+ countries. Filter by gap detection, contact status, and opportunity scores.
                </p>
                <Link
                  to="/pricing"
                  className="inline-flex items-center gap-1 text-[10px] font-bold text-primary hover:underline"
                >
                  Explore Pricing Plans <ChevronRight className="h-3 w-3" />
                </Link>
              </div>

              {/* Related posts */}
              <div className="space-y-4">
                <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
                  Read Next
                </p>
                <ul className="space-y-4">
                  {related.map((p) => (
                    <li key={p.slug} className="group">
                      <Link to="/blog/$slug" params={{ slug: p.slug }} className="block space-y-2">
                        <div className="overflow-hidden rounded-xl border border-border/80 aspect-[16/10] relative">
                          <img
                            src={p.cover}
                            alt={p.title}
                            className="w-full h-full object-cover transition duration-355 group-hover:scale-103"
                          />
                        </div>
                        <p className="text-xs font-bold leading-snug text-foreground group-hover:text-primary transition-colors line-clamp-2">
                          {p.title}
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </article>
    </MarketingShell>
  );
}
