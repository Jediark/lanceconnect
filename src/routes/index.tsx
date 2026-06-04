import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowRight, Bookmark, CheckCircle2, Globe, LineChart, Mail, Map, Play,
  Sparkles, Star, Target, Users, Phone, Building2, MapPin, Plus, Minus,
  Globe2, BarChart3, Zap, Search, Terminal, Copy, Check, Loader2, Code2, Palette,
  PenTool, Smartphone, Film, Camera, Megaphone, AppWindow, Handshake,
} from "lucide-react";
import { motion } from "framer-motion";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { HeroCarousel } from "@/components/marketing/HeroCarousel";
import { CATEGORIES } from "@/data/mockData";
import { IMG, BLOG_POSTS } from "@/data/content";
import { usePreferences } from "@/contexts/PreferencesContext";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LanceConnect — The Meeting Point for Freelancers and Clients" },
      { name: "description", content: "LanceConnect finds businesses that need your skills anywhere in the world, and hands you their contact details." },
      { property: "og:title", content: "LanceConnect" },
      { property: "og:description", content: "The Meeting Point for Freelancers and Clients" },
      { property: "og:image", content: IMG.heroFreelancer },
    ],
  }),
  component: () => (
    <MarketingShell>
      <HeroWithMosaic />
      <StatsBar />
      <ValuePropositionCards />
      <LogoStrip />
      <TutorialVideoSection />
      <HeroCarousel />
      <ProductShowcase />
      <Stats />
      <HowItWorks />
      <Features />
      <LeadScannerSandbox />
      <GlobalReach />
      <WhoFor />
      <Testimonials />
      <Pricing />
      <BlogTeaser />
      <FAQ />
      <CTA />
    </MarketingShell>
  ),
});

const HERO_SLIDES = [
  {
    img: IMG.workspace,
    eyebrow: "Now scanning leads in 150+ countries",
    title: <>Find clients. <span className="text-primary">Win work.</span><br/>Without the chase.</>,
    sub: "LanceConnect scans the internet for businesses that need your skills — then hands you their phone numbers, emails, and a ready-made way in.",
  },
  {
    img: IMG.marketStall,
    eyebrow: "Real leads · Real cities",
    title: <>Local businesses,<br/><span className="text-primary">ready to hire</span> today.</>,
    sub: "From bakeries in Lyon to studios in Lagos — we surface the businesses already searching for what you do.",
  },
  {
    img: IMG.coffeeShop,
    eyebrow: "Built for working freelancers",
    title: <>Stop pitching cold.<br/>Start <span className="text-primary">conversations</span>.</>,
    sub: "Every lead comes with a scored opportunity, a verified contact, and an outreach script written for your craft.",
  },
  {
    img: IMG.team,
    eyebrow: "Loved in 50+ countries",
    title: <>One workspace.<br/>Every <span className="text-primary">client win</span>, tracked.</>,
    sub: "Discover, contact, and close — in a single, calm dashboard built by freelancers, for freelancers.",
  },
];

const HERO_MOSAIC = [
  { src: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400&q=80&fit=crop&crop=face", name: "Taiwo", skill: "Web Dev", size: 100, top: "8%", left: "8%", delay: 0 },
  { src: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80&fit=crop&crop=face", name: "Priya", skill: "SEO", size: 110, top: "10%", left: "62%", delay: 0.4 },
  { src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80&fit=crop&crop=face", name: "Alex", skill: "Marketer", size: 85, top: "42%", left: "80%", delay: 0.8 },
  { src: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80&fit=crop&crop=face", name: "Maria", skill: "Designer", size: 90, top: "46%", left: "4%", delay: 1.2 },
  { src: "https://images.unsplash.com/photo-1556157382-97eda2d62296?w=400&q=80&fit=crop&crop=face", name: "Kenji", skill: "Developer", size: 95, top: "72%", left: "66%", delay: 1.6 },
  { src: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&q=80&fit=crop&crop=face", name: "Sofia", skill: "Video", size: 100, top: "74%", left: "14%", delay: 2.0 },
];

function HeroWithMosaic() {
  const { t } = usePreferences();
  return (
    <section className="relative overflow-hidden border-b border-border bg-background py-20 lg:py-28 text-foreground transition-colors duration-300">
      {/* Background Image with theme overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img 
          src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=2000&q=80" 
          alt="" 
          className="h-full w-full object-cover opacity-5 dark:opacity-10 mix-blend-luminosity"
        />
        {/* Glittering color radial gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_10%,var(--primary-glow),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_90%,var(--secondary-glow),transparent_40%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-background/50 to-background" />
      </div>

      <div className="absolute inset-0 opacity-40 z-0">
        <div className="h-full w-full bg-dot-pattern" />
      </div>
      <div className="relative mx-auto max-w-7xl px-4 lg:px-8 z-10">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="z-10">
            <p className="text-xs font-mono text-muted-foreground mb-2 tracking-widest uppercase">
              {t("hero_eyebrow")}
            </p>
            <h1 className="font-display text-4xl font-extrabold text-foreground mt-3 sm:text-5xl lg:text-6xl leading-[1.1] tracking-tight">
              {t("hero_title")}
            </h1>
            <p className="mt-6 text-base text-muted-foreground max-w-lg leading-relaxed">
              {t("hero_sub")}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/register" className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition shadow-lg shadow-primary/20">
                {t("hero_cta_leads")} <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/how-it-works" className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-6 py-3.5 text-sm font-medium hover:bg-accent hover:text-foreground transition text-foreground">
                <Play className="h-4 w-4 text-primary" /> {t("hero_cta_demo")}
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-xs font-mono text-muted-foreground">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> No credit card</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Instant access</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Cancel anytime</span>
            </div>
          </div>

          <div className="relative h-[480px] flex items-center justify-center select-none overflow-hidden lg:overflow-visible">
            {/* Core rotating cluster */}
            <div className="relative w-[380px] h-[380px] flex items-center justify-center">
              {/* Central glowing hub */}
              <div className="absolute h-20 w-20 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center animate-pulse shadow-[0_0_30px_rgba(99,102,241,0.2)]">
                <div className="h-3 w-3 rounded-full bg-emerald-500" />
              </div>

              {/* Orbital rotation container */}
              <motion.div
                className="absolute w-full h-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              >
                {HERO_MOSAIC.map((img, i) => {
                  const angle = (i * 2 * Math.PI) / 6;
                  const radius = 120; // 120px radius from center for compact packing
                  const left = `calc(50% + ${radius * Math.cos(angle)}px - ${img.size / 2}px)`;
                  const top = `calc(50% + ${radius * Math.sin(angle)}px - ${img.size / 2}px)`;
                  return (
                    <motion.div
                      key={i}
                      className="absolute rounded-full overflow-hidden border-2 border-primary/40 shadow-[0_0_20px_rgba(99,102,241,0.25)] bg-card group cursor-pointer hover:border-emerald-400 hover:scale-105 transition-all duration-300"
                      style={{ 
                        top, 
                        left, 
                        width: img.size, 
                        height: img.size 
                      }}
                      animate={{ rotate: -360 }}
                      transition={{
                        duration: 40,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    >
                      <img src={img.src} alt={img.name} className="h-full w-full object-cover" loading="lazy" />
                      <span className="absolute bottom-1 left-1/2 -translate-x-1/2 rounded-full bg-slate-950/85 border border-slate-800/80 px-2 py-0.5 text-[8px] font-mono font-medium text-slate-300 whitespace-nowrap">
                        {img.skill}
                      </span>
                    </motion.div>
                  );
                })}
              </motion.div>

              {/* Floating Data Pills (positioned statically relative to right column, float in place) */}
              <motion.div 
                className="absolute top-[8%] left-[6%] rounded-full bg-emerald-500/20 border border-emerald-500/30 px-3 py-1.5 text-xs font-semibold text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)] z-20"
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
              >
                94 Hot Lead
              </motion.div>
              <motion.div 
                className="absolute bottom-[8%] right-[8%] rounded-full bg-indigo-500/20 border border-indigo-500/30 px-3 py-1.5 text-xs font-semibold text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.2)] z-20"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
              >
                +234 802...
              </motion.div>
              <motion.div 
                className="absolute top-[50%] right-[0%] rounded-full bg-red-500/20 border border-red-500/30 px-3 py-1.5 text-xs font-semibold text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.2)] z-20"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1.0 }}
              >
                No website
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatsBar() {
  const stats = [
    { k: "2.4M+", v: "Leads Found" },
    { k: "150+", v: "Countries" },
    { k: "89%", v: "Accuracy" },
    { k: "$0", v: "Commission" },
  ];

  const [counts, setCounts] = useState({ leads: 0, countries: 0, accuracy: 0, commission: 0 });

  useEffect(() => {
    const duration = 2000;
    const timer = setTimeout(() => {
      setCounts({ leads: 240, countries: 150, accuracy: 89, commission: 0 });
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-sidebar border-b border-sidebar-border">
      <div className="mx-auto max-w-7xl px-4 py-4 lg:px-8">
        <div className="flex flex-wrap justify-center gap-8 lg:gap-12">
          {stats.map((s, i) => (
            <div key={s.v} className="text-center">
              <p className="font-mono-data text-2xl font-bold text-primary">{counts.leads || s.k}</p>
              <p className="text-[10px] text-sidebar-foreground uppercase tracking-wider">{s.v}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function BlogTeaser() {
  const posts = BLOG_POSTS.slice(0, 3);
  return (
    <section className="border-y border-border bg-paper py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">From the journal</p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight md:text-4xl">
              Field notes from working freelancers.
            </h2>
            <p className="mt-3 text-muted-foreground">Real scripts, real numbers, real clients — written by the people doing the work.</p>
          </div>
          <Link to="/blog" className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold hover:bg-accent">
            Read the blog <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {posts.map((p) => (
            <Link
              key={p.slug}
              to="/blog/$slug"
              params={{ slug: p.slug }}
              className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition hover:-translate-y-0.5 hover:shadow-card-hover"
            >
              <div className="overflow-hidden">
                <img src={p.cover} alt={p.title} loading="lazy" className="aspect-[16/10] w-full object-cover transition duration-500 group-hover:scale-[1.04]" />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <span className="text-[11px] font-semibold uppercase tracking-widest text-primary">{p.category}</span>
                <h3 className="mt-2 font-display text-lg font-semibold leading-snug">{p.title}</h3>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{p.excerpt}</p>
                <div className="mt-5 flex items-center gap-2 border-t border-border pt-4 text-xs text-muted-foreground">
                  <img src={p.authorAvatar} alt={p.author} className="h-6 w-6 rounded-full object-cover" />
                  <span>{p.author} · {p.readMins} min read</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────
   VALUE PROPOSITION CARDS — inspired by abiglobalfoods.co.uk trust row
   ──────────────────────────────────────────────────────────── */
function ValuePropositionCards() {
  const items = [
    {
      icon: Zap,
      title: "10 FREE SCANS",
      subtitle: "Get 10 verified, high-scoring client leads monthly.",
    },
    {
      icon: Globe,
      title: "GLOBAL COVERAGE",
      subtitle: "Target and find leads in over 150+ countries instantly.",
    },
    {
      icon: CheckCircle2,
      title: "DIRECT REACH",
      subtitle: "Verified phone lines and email addresses ready to copy.",
    },
  ];

  return (
    <section className="bg-background py-8 select-none border-b border-border transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          {items.map((item, idx) => (
            <div 
              key={idx}
              className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-card hover:shadow-card-hover transition duration-300 group"
            >
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-muted group-hover:scale-105 transition duration-300">
                <item.icon className="h-5 w-5 text-primary" />
              </div>
              <div className="min-w-0">
                <h3 className="font-display text-xs font-black uppercase tracking-wider text-foreground">
                  {item.title}
                </h3>
                <p className="mt-1 text-xs text-muted-foreground leading-snug">
                  {item.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────
   LOGO STRIP — text marks instead of fake company logos
   ──────────────────────────────────────────────────────────── */
function LogoStrip() {
  const marks = ["Linear", "Notion", "Stripe", "Vercel", "Framer", "Mercury", "Loom", "Intercom"];
  return (
    <section className="border-b border-border bg-background py-10">
      <p className="text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        Loved by freelancers serving teams at
      </p>
      <div className="mx-auto mt-6 grid max-w-5xl grid-cols-4 items-center gap-y-6 px-4 md:grid-cols-8">
        {marks.map((m) => (
          <span key={m} className="text-center font-display text-base font-semibold tracking-tight text-foreground/55">
            {m}
          </span>
        ))}
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────
   TUTORIAL VIDEO SECTION — abiglobalfoods-inspired premium video player
   ──────────────────────────────────────────────────────────── */
function TutorialVideoSection() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-background to-card/20 py-24 select-none transition-colors duration-300">
      <div className="mx-auto max-w-5xl px-4 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto mb-12">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-semibold text-primary font-mono uppercase tracking-wider">
            Walkthrough Video
          </span>
          <h2 className="mt-4 font-display text-3xl font-extrabold text-foreground tracking-tight sm:text-4xl md:text-5xl leading-tight">
            Bringing Clients to Your Clipboard.
          </h2>
          <p className="mt-4 text-base text-muted-foreground leading-relaxed max-w-xl mx-auto">
            Watch our quick 2-minute walkthrough to see how LanceConnect scans, scores, and helps you win contracts in any city.
          </p>
        </div>

        {/* Premium Player Card container */}
        <div className="relative mx-auto max-w-4xl aspect-[16/9] rounded-2xl border border-border bg-slate-950 overflow-hidden shadow-2xl group transition hover:border-primary/45">
          {!isPlaying ? (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center cursor-pointer select-none" onClick={() => setIsPlaying(true)}>
              {/* Styled Mock Dashboard Graphic for Thumbnail */}
              <div className="absolute inset-0 bg-[#080B14] opacity-80 mix-blend-multiply" />
              <img 
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80" 
                alt="LanceConnect Tutorial Video" 
                className="absolute inset-0 h-full w-full object-cover opacity-35"
              />
              {/* Glowing Play Icon button */}
              <div className="relative z-20 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/30 group-hover:scale-110 group-hover:bg-primary/95 transition duration-300">
                <Play className="h-6 w-6 text-white fill-current ml-0.5" />
              </div>
              <span className="relative z-20 mt-4 text-xs font-mono font-bold text-slate-300 uppercase tracking-widest bg-slate-900/80 px-3.5 py-1.5 rounded-full border border-slate-800">
                Play walkthrough demo (2:14)
              </span>
            </div>
          ) : (
            <iframe 
              className="w-full h-full border-0 absolute inset-0 bg-black"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1" 
              title="LanceConnect Platform Demo"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
              allowFullScreen
            />
          )}
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────
   PRODUCT SHOWCASE — Vercel-dark canvas with Apollo-style cards
   ──────────────────────────────────────────────────────────── */
function ProductShowcase() {
  const leads = [
    { name: "Boulangerie Dupont", type: "Bakery", city: "Lyon, France", rating: 4.9, reviews: 412, phone: "+33 4 78 24 18 90", score: 92, tag: "Hot" },
    { name: "Mario's Ristorante", type: "Italian restaurant", city: "Naples, Italy", rating: 4.7, reviews: 821, phone: "+39 081 552 47 13", score: 78, tag: "Strong" },
    { name: "Lagos Hair Studio", type: "Hair salon", city: "Lagos, Nigeria", rating: 4.8, reviews: 196, phone: "+234 803 442 1109", score: 71, tag: "Strong" },
  ];
  return (
    <section className="relative" style={{ background: "var(--ink-bg)", color: "var(--ink-fg)" }}>
      <div className="mx-auto max-w-7xl px-4 py-24 lg:px-8">
        <div className="grid items-end gap-6 md:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--ink-muted)" }}>
              The dashboard
            </p>
            <h2 className="mt-4 font-display text-3xl font-semibold leading-tight tracking-tight md:text-5xl">
              Every lead, scored and ready to contact.
            </h2>
          </div>
          <p className="text-base leading-relaxed md:text-lg" style={{ color: "var(--ink-muted)" }}>
            Real businesses. Real phone numbers. Real opportunity scores based on whether they
            have a website, how dated it is, and how visible they are on Google.
          </p>
        </div>

        <div className="mt-12 overflow-hidden rounded-2xl border" style={{ borderColor: "var(--ink-border)", background: "var(--ink-bg-2)" }}>
          {/* Toolbar */}
          <div className="flex items-center justify-between border-b px-5 py-3 text-xs" style={{ borderColor: "var(--ink-border)", color: "var(--ink-muted)" }}>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-red-400/60" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400/60" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/60" />
              <span className="ml-3">LanceConnect App / discover</span>
            </div>
            <span className="font-mono-data">3 of 247 leads</span>
          </div>
          {/* Lead rows */}
          <ul className="divide-y" style={{ borderColor: "var(--ink-border)" }}>
            {leads.map((l) => (
              <li key={l.name} className="grid grid-cols-12 items-center gap-4 px-5 py-5">
                <div className="col-span-12 md:col-span-4">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-lg" style={{ background: "var(--ink-border)" }}>
                      <Building2 className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-display text-[15px] font-semibold">{l.name}</p>
                      <p className="text-xs" style={{ color: "var(--ink-muted)" }}>{l.type}</p>
                    </div>
                  </div>
                </div>
                <div className="col-span-6 md:col-span-3 flex items-center gap-1.5 text-sm" style={{ color: "var(--ink-muted)" }}>
                  <MapPin className="h-3.5 w-3.5" /> {l.city}
                </div>
                <div className="col-span-6 md:col-span-2 flex items-center gap-1.5 text-sm">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  <span className="font-mono-data">{l.rating}</span>
                  <span style={{ color: "var(--ink-muted)" }}>({l.reviews})</span>
                </div>
                <div className="col-span-8 md:col-span-2 font-mono-data text-sm">{l.phone}</div>
                <div className="col-span-4 md:col-span-1 flex justify-end">
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2.5 py-1 text-xs font-semibold text-primary">
                    {l.score}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10 grid gap-6 text-sm md:grid-cols-3" style={{ color: "var(--ink-muted)" }}>
          {[
            { k: "247", v: "leads surfaced this week in Italy alone" },
            { k: "1.8s", v: "average time to load 100 scored leads" },
            { k: "34%", v: "average reply rate using our templates" },
          ].map((s) => (
            <div key={s.k} className="border-l-2 pl-4" style={{ borderColor: "var(--ink-border)" }}>
              <p className="font-display text-3xl font-semibold text-foreground">{s.k}</p>
              <p className="mt-1">{s.v}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────
   HOW IT WORKS
   ──────────────────────────────────────────────────────────── */
function HowItWorks() {
  const steps = [
    { icon: Target, title: "Pick your skill", desc: "Select your freelance category — web dev, design, copywriting, and 7 more." },
    { icon: Map, title: "Choose your market", desc: "Target any city or country in the world. Filter by industry, size, signals." },
    { icon: LineChart, title: "Discover leads", desc: "Get a scored list of businesses that need exactly what you sell." },
    { icon: Mail, title: "Reach out", desc: "Use ready-made templates — or our AI writer — to contact them in seconds." },
  ];
  return (
    <section id="how" className="mx-auto max-w-7xl px-4 py-24 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">From zero to outreach in minutes</h2>
        <p className="mt-3 text-muted-foreground">A simple workflow built around how freelancers actually find clients.</p>
      </div>
      <div className="relative mt-14 grid gap-6 md:grid-cols-4">
        <div className="absolute left-0 right-0 top-7 hidden h-px bg-border md:block" />
        {steps.map((s, i) => (
          <div key={s.title} className="relative rounded-2xl border border-border bg-card p-6">
            <div className="mb-4 grid h-14 w-14 place-items-center rounded-xl bg-foreground text-background">
              <s.icon className="h-6 w-6" />
            </div>
            <p className="font-mono-data text-xs text-muted-foreground">STEP {i + 1}</p>
            <h3 className="mt-1 font-display text-lg font-semibold">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

const AiOutreachFooter = () => {
  const [tone, setTone] = useState<'casual' | 'professional' | 'bold'>('casual');

  const messages = {
    casual: "Hey Mario, saw your pizza spot has no site...",
    professional: "Dear Mario, I noticed Mario's Ristorante does not currently have a web presence...",
    bold: "Hey Mario, why doesn't Mario's Ristorante have a website yet? Your competitors in Naples are..."
  };

  return (
    <div className="flex flex-col gap-2 w-full mt-2">
      <div className="flex items-center justify-between bg-background p-1 rounded-lg border border-border/80">
        {(['casual', 'professional', 'bold'] as const).map((t) => (
          <button
            key={t}
            onClick={(e) => {
              e.stopPropagation();
              setTone(t);
            }}
            className={`text-[9px] font-mono px-2 py-0.5 rounded transition-all capitalize flex-1 text-center ${
              tone === t
                ? 'bg-primary text-white shadow-sm font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/45'
            }`}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="w-full bg-background border border-border rounded-xl p-2.5 font-mono text-[9px] text-slate-400 h-[60px] overflow-hidden select-none">
        <div className="flex justify-between items-center text-[#64748B] mb-0.5">
          <span>// Generated intro</span>
          <span className="text-[8px] bg-primary/20 text-primary px-1 rounded uppercase tracking-wider font-semibold">Active</span>
        </div>
        <motion.p
          key={tone}
          initial={{ opacity: 0, y: 3 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -3 }}
          className="mt-0.5 text-primary leading-tight font-medium"
        >
          {messages[tone]}
        </motion.p>
      </div>
    </div>
  );
};

const getMockLeads = (craft: string, city: string) => {
  const leads = [
    {
      id: 1,
      name: `${city} Gourmet Kitchen`,
      type: "Restaurant & Catering",
      score: 94,
      issues: craft === 'web' ? ["No website", "Only Facebook page link"] 
            : craft === 'design' ? ["Outdated 2012 layout", "Cluttered booking form"] 
            : craft === 'seo' ? ["Not visible on local search", "Missing Google Business profile reviews"]
            : ["No video presence", "Outdated food gallery"],
      phone: "+1 555-832-1920",
      email: `contact@${city.toLowerCase().replace(" ", "")}gourmet.com`,
      subject: craft === 'web' ? `Website inquiry for ${city} Gourmet Kitchen`
             : craft === 'design' ? `Branding update - ${city} Gourmet Kitchen`
             : craft === 'seo' ? `Google visibility boost for ${city} Gourmet Kitchen`
             : `Promo video concepts for ${city} Gourmet Kitchen`,
      draft: craft === 'web' ? `Hi Chef,\n\nI love your menu but noticed customers can't order directly online. I'd love to build a quick, high-converting checkout site for you.\n\nBest,\n[Your Name]`
           : craft === 'design' ? `Hello,\n\nI love the dining vibe at Gourmet Kitchen! I noticed your online logo and branding could use a premium refresh to match that feel.\n\nBest,\n[Your Name]`
           : craft === 'seo' ? `Hi Team,\n\nI searched for restaurants in ${city} and couldn't find your kitchen on the first page. Let's optimize your profile to pull in more local customers.\n\nBest,\n[Your Name]`
           : `Hi Chef,\n\nI saw your gorgeous dishes on Instagram. I can create a professional 30-second promo reel to drive reservations.\n\nBest,\n[Your Name]`,
    },
    {
      id: 2,
      name: `${city} Dental Care`,
      type: "Medical Practice",
      score: 87,
      issues: craft === 'web' ? ["Non-responsive on mobile", "Broken appointment button"]
            : craft === 'design' ? ["Stock-photo heavy landing page", "Hard to read fonts"]
            : craft === 'seo' ? ["High competitor ranking", "No local schema mapping"]
            : ["Missing patient walkthrough video", "No video introduction"],
      phone: "+1 555-401-3829",
      email: `office@${city.toLowerCase().replace(" ", "")}dentalcare.com`,
      subject: craft === 'web' ? `Mobile booking issue on your site`
             : craft === 'design' ? `Modern UI facelift for ${city} Dental`
             : craft === 'seo' ? `Patients can't find you on Google`
             : `Patient testimonial videos for ${city} Dental`,
      draft: craft === 'web' ? `Hi Dr.,\n\nI tried booking an appointment on my phone and the layout was cut off. I can fix this responsiveness issue so you don't lose patients.\n\nBest,\n[Your Name]`
           : craft === 'design' ? `Dear Practice Manager,\n\nI noticed your website uses standard stock photos. A custom illustrated interface would build much higher trust with patients.\n\nBest,\n[Your Name]`
           : craft === 'seo' ? `Hello Dr.,\n\nYour competitors are ranking above you for 'dentist in ${city}'. I can optimize your site structure to get you to #1.\n\nBest,\n[Your Name]`
           : `Dear Practice Manager,\n\nWe can film and edit 3 high-impact patient video testimonials to put on your home page to build instant trust.\n\nBest,\n[Your Name]`,
    },
    {
      id: 3,
      name: `${city} Auto Body`,
      type: "Car Service",
      score: 79,
      issues: craft === 'web' ? ["Slow load speed (8.4s)", "Outdated HTML template"]
            : craft === 'design' ? ["Unstructured service pricing table", "Low contrast buttons"]
            : craft === 'seo' ? ["No Google Reviews linkage", "Low speed indexing penalty"]
            : ["No video gallery showing repairs", "Missing TikTok/Reels presence"],
      phone: "+1 555-901-7261",
      email: `info@${city.toLowerCase().replace(" ", "")}autobody.com`,
      subject: craft === 'web' ? `Website loading speeds at ${city} Auto`
             : craft === 'design' ? `UI revamp for your repair list`
             : craft === 'seo' ? `Rankings check for local auto body repairs`
             : `Reels & Shorts promo for ${city} Auto`,
      draft: craft === 'web' ? `Hi Manager,\n\nYour page takes over 8 seconds to load, which causes visitors to leave. Let's rebuild a lightweight, lightning-fast static site.\n\nBest,\n[Your Name]`
           : craft === 'design' ? `Hello,\n\nYour services page is a bit hard to scan on mobile. I designed a cleaner table that makes it easy for clients to request quotes.\n\nBest,\n[Your Name]`
           : craft === 'seo' ? `Hi Team,\n\nI saw your business lacks backlinks from local directories. I can manage a citation campaign to raise your authority score.\n\nBest,\n[Your Name]`
           : `Hi Manager,\n\nLet's capture high-quality 'before/after' transformation reels of your paint/dent jobs to build a massive TikTok following.\n\nBest,\n[Your Name]`,
    }
  ];
  return leads;
};

const FEATURES_LIST = [
  {
    id: 1,
    icon: Globe2,
    title: "Global Lead Discovery",
    desc: "Find any business in any street in 150+ countries. Get access to verified pipelines of clients in seconds.",
    gridClass: "lg:col-start-1 lg:row-start-1 lg:col-span-1",
    connector: () => (
      <div className="absolute top-1/2 -right-3 w-6 h-0.5 border-t border-dashed border-primary/45 -translate-y-1/2 lg:block hidden z-0">
        <span className="absolute top-[-2.5px] h-1.5 w-1.5 rounded-full bg-secondary shadow-[0_0_8px_var(--color-secondary)] animate-slide-right" />
      </div>
    ),
    footer: () => (
      <div className="space-y-2 border-t border-border/60 pt-4 font-mono text-xs text-[#64748B] w-full">
        <div className="flex justify-between"><span>Leads indexed</span><span className="text-white font-semibold">2.4M+</span></div>
        <div className="flex justify-between"><span>Countries covered</span><span className="text-white font-semibold">150+</span></div>
      </div>
    )
  },
  {
    id: 2,
    icon: BarChart3,
    title: "Opportunity Scoring",
    desc: "0–100 scores based on how badly they need what you sell. Hot leads float to the top.",
    gridClass: "lg:col-start-2 lg:row-start-1 lg:col-span-1",
    connector: () => (
      <div className="absolute top-1/2 -right-3 w-6 h-0.5 border-t border-dashed border-primary/45 -translate-y-1/2 lg:block hidden z-0">
        <span className="absolute top-[-2.5px] h-1.5 w-1.5 rounded-full bg-secondary shadow-[0_0_8px_var(--color-secondary)] animate-slide-right" />
      </div>
    ),
    footer: () => (
      <div className="flex items-center gap-2 mt-4 w-full">
        <span className="rounded-full bg-emerald-500/20 px-2.5 py-1 text-xs font-semibold text-emerald-400">94 Hot Lead</span>
      </div>
    )
  },
  {
    id: 3,
    icon: Phone,
    title: "Verified Contacts",
    desc: "Phone numbers, emails, and direct WhatsApp links copy-ready right next to every lead.",
    gridClass: "lg:col-start-3 lg:row-start-1 lg:col-span-1",
    connector: () => (
      <div className="absolute left-1/2 -bottom-3 w-0.5 h-6 border-l border-dashed border-primary/45 -translate-x-1/2 lg:block hidden z-0">
        <span className="absolute left-[-2.5px] h-1.5 w-1.5 rounded-full bg-secondary shadow-[0_0_8px_var(--color-secondary)] animate-slide-down" />
      </div>
    ),
    footer: () => (
      <div className="flex items-center gap-2 mt-4 font-mono text-[10px] text-slate-400 bg-background border border-border px-3 py-1.5 rounded-lg w-full justify-between">
        <span>+234 802...</span>
        <span className="text-emerald-500 font-semibold">✓ Verified</span>
      </div>
    )
  },
  {
    id: 4,
    icon: Sparkles,
    title: "AI Outreach (Pro)",
    desc: "Claude-powered personalized messages for every lead. Generates email, phone script, LinkedIn DM in seconds.",
    gridClass: "lg:col-start-3 lg:row-start-2 lg:col-span-1",
    connector: () => (
      <div className="absolute top-1/2 -left-3 w-6 h-0.5 border-t border-dashed border-primary/45 -translate-y-1/2 lg:block hidden z-0">
        <span className="absolute top-[-2.5px] h-1.5 w-1.5 rounded-full bg-secondary shadow-[0_0_8px_var(--color-secondary)] animate-slide-left" />
      </div>
    ),
    footer: AiOutreachFooter
  },
  {
    id: 5,
    icon: Bookmark,
    title: "CRM Pipeline",
    desc: "Track leads from saved to won without complex CRM bloat. Simple, clean, and fast.",
    gridClass: "lg:col-start-2 lg:row-start-2 lg:col-span-1",
    connector: () => (
      <div className="absolute top-1/2 -left-3 w-6 h-0.5 border-t border-dashed border-primary/45 -translate-y-1/2 lg:block hidden z-0">
        <span className="absolute top-[-2.5px] h-1.5 w-1.5 rounded-full bg-secondary shadow-[0_0_8px_var(--color-secondary)] animate-slide-left" />
      </div>
    ),
    footer: () => (
      <div className="flex gap-1.5 mt-4 w-full">
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">New</span>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-900/30 text-blue-400 border border-blue-500/20">Contacted</span>
      </div>
    )
  },
  {
    id: 6,
    icon: Globe,
    title: "Online Opportunities",
    desc: "LinkedIn, Indeed, Reddit remote opportunities consolidated for remote freelancers.",
    gridClass: "lg:col-start-1 lg:row-start-2 lg:col-span-1",
    connector: () => (
      <div className="absolute left-1/2 -bottom-3 w-0.5 h-6 border-l border-dashed border-primary/45 -translate-x-1/2 lg:block hidden z-0">
        <span className="absolute left-[-2.5px] h-1.5 w-1.5 rounded-full bg-secondary shadow-[0_0_8px_var(--color-secondary)] animate-slide-down" />
      </div>
    ),
    footer: () => (
      <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 px-2 py-1.5 rounded border border-purple-500/20 mt-4 text-center block w-full">
        Remote channels auto-scraped
      </span>
    )
  },
  {
    id: 7,
    icon: Users,
    title: "All Freelancer Skills Covered",
    desc: "Whether you build websites, write copy, design brands, manage socials, edit video, or handle virtual tasks, we have custom opportunity models for you.",
    gridClass: "lg:col-start-1 lg:row-start-3 lg:col-span-3 lg:w-full lg:max-w-none",
    connector: () => null,
    footer: () => (
      <div className="flex flex-wrap gap-1.5 mt-4 text-[9px] font-mono text-[#CBD5E1] w-full">
        {["Web Dev", "Design", "SEO", "Copywriting", "Video", "Photo", "VA", "Marketing", "App Dev"].map(tag => (
          <span key={tag} className="px-2 py-0.5 rounded bg-background border border-border">{tag}</span>
        ))}
      </div>
    )
  }
];

function Features() {
  return (
    <section id="features" className="border-y border-border bg-card/30 py-24 select-none">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <p className="text-xs font-mono text-[#64748B] mb-2 tracking-widest uppercase">
            // what.we.give.you
          </p>
          <h2 className="font-display text-4xl font-extrabold text-foreground">Everything you need to get clients</h2>
          <p className="mt-4 text-muted-foreground">No bloat. Just the tools freelancers actually use to win work.</p>
        </div>

        {/* Desktop Layout: Snake Grid */}
        <div className="hidden lg:grid gap-6 lg:grid-cols-3 auto-rows-[280px] relative z-10">
          {FEATURES_LIST.map((card) => {
            const Icon = card.icon;
            const FooterComponent = card.footer;
            const ConnectorComponent = card.connector;
            return (
              <div 
                key={card.id} 
                className={`relative rounded-2xl border border-border bg-card/80 p-6 shadow-card flex flex-col justify-between group hover:border-[#6366F1]/30 transition duration-300 z-10 ${card.gridClass}`}
              >
                {card.id === 7 ? (
                  <div className="flex items-center justify-between gap-8 w-full h-full text-left">
                    <div className="max-w-md">
                      <div className="inline-grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary mb-3 group-hover:bg-primary group-hover:text-primary-foreground transition duration-300">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="font-display text-lg font-bold text-white mb-2">{card.title}</h3>
                      <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
                        {card.desc}
                      </p>
                    </div>
                    <div className="flex-1 max-w-lg">
                      <FooterComponent />
                    </div>
                  </div>
                ) : (
                  <>
                    <div>
                      <div className="inline-grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary mb-3 group-hover:bg-primary group-hover:text-primary-foreground transition duration-300">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="font-display text-lg font-bold text-white mb-2">{card.title}</h3>
                      <p className="text-xs md:text-sm text-slate-400 leading-relaxed line-clamp-3">
                        {card.desc}
                      </p>
                    </div>
                    <FooterComponent />
                  </>
                )}
                <ConnectorComponent />
              </div>
            );
          })}
        </div>

        {/* Mobile/Tablet Layout: Infinite Horizontal Scroll Ticker */}
        <div className="lg:hidden relative w-full overflow-hidden py-4">
          <div className="flex gap-6 animate-ticker w-max hover:[animation-play-state:paused] cursor-pointer">
            {/* Set 1 */}
            {FEATURES_LIST.map((card) => {
              const Icon = card.icon;
              const FooterComponent = card.footer;
              return (
                <div 
                  key={`m1-${card.id}`} 
                  className="w-[280px] shrink-0 rounded-2xl border border-border bg-card/80 p-6 shadow-card flex flex-col justify-between"
                >
                  <div>
                    <div className="inline-grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary mb-3">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-display text-lg font-bold text-white mb-2">{card.title}</h3>
                    <p className="text-xs md:text-sm text-slate-400 leading-relaxed line-clamp-3">
                      {card.desc}
                    </p>
                  </div>
                  <div className="mt-4">
                    <FooterComponent />
                  </div>
                </div>
              );
            })}
            {/* Set 2 for infinite effect */}
            {FEATURES_LIST.map((card) => {
              const Icon = card.icon;
              const FooterComponent = card.footer;
              return (
                <div 
                  key={`m2-${card.id}`} 
                  className="w-[280px] shrink-0 rounded-2xl border border-border bg-card/80 p-6 shadow-card flex flex-col justify-between"
                >
                  <div>
                    <div className="inline-grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary mb-3">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-display text-lg font-bold text-white mb-2">{card.title}</h3>
                    <p className="text-xs md:text-sm text-slate-400 leading-relaxed line-clamp-3">
                      {card.desc}
                    </p>
                  </div>
                  <div className="mt-4">
                    <FooterComponent />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────
   INTERACTIVE LEAD SCANNER PLAYGROUND
   ──────────────────────────────────────────────────────────── */
function LeadScannerSandbox() {
  const [craft, setCraft] = useState<'web' | 'design' | 'seo' | 'video'>('web');
  const [city, setCity] = useState<string>('London');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanProgress, setScanProgress] = useState<number>(0);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [scanComplete, setScanComplete] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [leads, setLeads] = useState<any[]>([]);
  const { t } = usePreferences();

  const handleDraftChange = (id: number, text: string) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, draft: text } : l));
  };

  const handleCopy = (id: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const startScan = () => {
    setIsScanning(true);
    setScanComplete(false);
    setScanProgress(0);
    setTerminalLogs([]);

    const logSequence = [
      `[INFO] Initializing LanceConnect engine...`,
      `[INFO] Target: ${craft.toUpperCase()} opportunities in ${city}...`,
      `[INFO] Fetching regional business directories...`,
      `[SCAN] Scraping active website meta tags & schema...`,
      `[MODEL] Analyzing mobile speed & Core Web Vitals...`,
      `[AI] Ranking target list by opportunity potential...`,
      `[SUCCESS] Analysis complete. 3 hot leads found!`
    ];

    let currentLogIndex = 0;
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setLeads(getMockLeads(craft, city));
            setIsScanning(false);
            setScanComplete(true);
          }, 300);
          return 100;
        }
        
        const step = Math.floor(prev / 15);
        if (step > currentLogIndex && currentLogIndex < logSequence.length) {
          setTerminalLogs(logs => [...logs, logSequence[currentLogIndex]]);
          currentLogIndex++;
        }
        
        return prev + 10;
      });
    }, 150);
  };

  return (
    <section id="sandbox" className="border-b border-border bg-background py-24 select-none">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <p className="text-xs font-mono text-[#64748B] mb-2 tracking-widest uppercase">
            {t("sandbox_eyebrow")}
          </p>
          <h2 className="font-display text-4xl font-extrabold text-foreground">{t("sandbox_title")}</h2>
          <p className="mt-4 text-muted-foreground">
            {t("sandbox_sub")}
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-12">
          {/* Controls - Left Column */}
          <div className="lg:col-span-5 bg-card/80 border border-border rounded-2xl p-6 flex flex-col justify-between">
            <div className="space-y-6">
              {/* Craft Selector */}
              <div>
                <label className="text-xs font-mono text-[#64748B] uppercase tracking-wider block mb-3">{t("sandbox_step_1")}</label>
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { id: 'web', label: 'Web Developer', icon: Code2 },
                    { id: 'design', label: 'Designer', icon: Palette },
                    { id: 'seo', label: 'SEO Specialist', icon: LineChart },
                    { id: 'video', label: 'Video Producer', icon: Play }
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setCraft(item.id as any)}
                      className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all ${
                        craft === item.id 
                          ? 'border-primary bg-primary/10 text-white font-semibold shadow-[0_0_15px_rgba(99,102,241,0.15)]'
                          : 'border-border/60 bg-background text-slate-400 hover:text-white hover:border-border'
                      }`}
                    >
                      <item.icon className="h-4.5 w-4.5 text-primary shrink-0" />
                      <span className="text-xs">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* City Selector */}
              <div>
                <label className="text-xs font-mono text-[#64748B] uppercase tracking-wider block mb-3">{t("sandbox_step_2")}</label>
                <div className="relative">
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-background border border-border/80 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-primary appearance-none cursor-pointer"
                  >
                    {["London", "Lagos", "São Paulo", "Tokyo", "Buenos Aires"].map((c) => (
                      <option key={c} value={c} className="bg-background text-white">
                        {c}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Run Button */}
            <div className="mt-8">
              <button
                onClick={startScan}
                disabled={isScanning}
                className={`w-full relative overflow-hidden flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 text-sm font-semibold text-white shadow-lg transition-all duration-300 ${
                  isScanning 
                    ? 'opacity-85 cursor-not-allowed' 
                    : 'hover:bg-primary/90 hover:scale-[1.01] hover:shadow-primary/25'
                }`}
              >
                {isScanning ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                    <span>{t("sandbox_running")}</span>
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 text-white animate-pulse" />
                    <span>{t("sandbox_run")}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Sandbox Screen Output - Right Column */}
          <div className="lg:col-span-7 bg-card/40 border border-border rounded-2xl min-h-[420px] overflow-hidden flex flex-col">
            {/* Screen Header */}
            <div className="bg-card border-b border-border/80 px-4 py-3 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-red-500/60" />
                <span className="h-2 w-2 rounded-full bg-yellow-500/60" />
                <span className="h-2 w-2 rounded-full bg-emerald-500/60" />
                <span className="font-mono ml-2 text-[10px] text-slate-500">console_output.sh</span>
              </div>
              {scanComplete && (
                <div className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  <span className="h-1 w-1 bg-emerald-500 rounded-full animate-ping" />
                  Live Leads Generated
                </div>
              )}
            </div>

            {/* Screen Body */}
            <div className="flex-1 p-6 flex flex-col justify-center">
              {/* Not scanned yet */}
              {!isScanning && !scanComplete && (
                <div className="text-center max-w-sm mx-auto space-y-4 py-8">
                  <div className="h-12 w-12 rounded-2xl bg-card/80 border border-border/80 flex items-center justify-center mx-auto shadow-md">
                    <Search className="h-5 w-5 text-slate-400" />
                  </div>
                  <div>
                    <h3 className="font-display text-sm font-semibold text-white">{t("sandbox_ready_title")}</h3>
                    <p className="text-xs text-slate-400 mt-1">
                      {t("sandbox_ready_desc")}
                    </p>
                  </div>
                </div>
              )}

              {/* Scanning Simulator */}
              {isScanning && (
                <div className="space-y-6 flex-1 flex flex-col justify-between">
                  {/* High Tech Radar Sweep */}
                  <div className="relative h-28 flex items-center justify-center overflow-hidden">
                    <div className="absolute h-24 w-24 rounded-full border border-primary/20 flex items-center justify-center">
                      <div className="absolute h-16 w-16 rounded-full border border-primary/30" />
                      <div className="absolute h-8 w-8 rounded-full border border-primary/45" />
                      <div className="absolute inset-0 border-t-2 border-primary rounded-full animate-spin" style={{ animationDuration: '1.2s' }} />
                    </div>
                    <div className="h-2 w-2 rounded-full bg-primary animate-ping" />
                  </div>

                  {/* Terminal Logs */}
                  <div className="bg-background rounded-xl border border-border/80 p-4 font-mono text-[10px] text-slate-400 space-y-1.5 max-h-[140px] overflow-y-auto flex-1 flex flex-col justify-end">
                    {terminalLogs.map((log, idx) => (
                      <div key={idx} className="flex gap-2">
                        <span className="text-primary font-bold">{`>`}</span>
                        <span className={log.includes('[SUCCESS]') ? 'text-emerald-400 font-semibold' : log.includes('[SCAN]') ? 'text-yellow-400' : 'text-slate-300'}>
                          {log}
                        </span>
                      </div>
                    ))}
                    <div className="flex items-center gap-1.5 text-primary mt-1">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      <span>Scraping {scanProgress}%...</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Scan completed successfully */}
              {scanComplete && (
                <div className="space-y-4">
                  {leads.map((l) => (
                    <div 
                      key={l.id} 
                      className="bg-background/80 border border-border/80 hover:border-primary/40 rounded-xl p-4 transition-all duration-300 flex flex-col gap-3 group"
                    >
                      {/* Lead meta */}
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-display text-sm font-bold text-white leading-tight">{l.name}</h4>
                            <span className="inline-flex items-center gap-0.5 rounded-full bg-primary/10 px-1.5 py-0.5 text-[9px] font-mono font-semibold text-primary">
                              {l.score} Match
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">{l.type} · {city}</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 justify-end">
                          {l.issues.map((issue: string, idx: number) => (
                            <span key={idx} className="bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded-[4px] text-[8px] font-mono">
                              ⚠ {issue}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* AI Draft section */}
                      <div className="bg-card border border-border/60 rounded-lg p-2.5 flex flex-col gap-2">
                        <div className="flex justify-between items-center text-[9px] text-slate-400 font-mono">
                          <span>Subject: {l.subject}</span>
                          <button
                            onClick={() => handleCopy(l.id, `Subject: ${l.subject}\n\n${l.draft}`)}
                            className="flex items-center gap-1 hover:text-white transition duration-200"
                          >
                            {copiedId === l.id ? (
                              <>
                                <Check className="h-3 w-3 text-emerald-400" />
                                <span className="text-emerald-400">Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="h-3 w-3" />
                                <span>Copy Template</span>
                              </>
                            )}
                          </button>
                        </div>
                        <textarea
                          value={l.draft}
                          onChange={(e) => handleDraftChange(l.id, e.target.value)}
                          className="bg-transparent border-0 font-mono text-[9px] text-slate-300 resize-none h-16 focus:outline-none focus:ring-0 leading-relaxed scrollbar-thin scrollbar-thumb-border"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────
   GLOBAL REACH
   ──────────────────────────────────────────────────────────── */
function GlobalReach() {
  const cities = [
    { name: "Lagos", x: "50%", y: "58%", delay: 0 },
    { name: "London", x: "47%", y: "30%", delay: 0.3 },
    { name: "Mumbai", x: "68%", y: "50%", delay: 0.6 },
    { name: "New York", x: "30%", y: "36%", delay: 0.9 },
    { name: "São Paulo", x: "38%", y: "74%", delay: 1.2 },
    { name: "Tokyo", x: "83%", y: "40%", delay: 1.5 },
    { name: "Dubai", x: "60%", y: "45%", delay: 1.8 },
  ];

  return (
    <section className="relative overflow-hidden border-t border-border bg-background py-16 select-none">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
          {/* Left: Content */}
          <div className="lg:col-span-5">
            <p className="text-xs font-mono text-[#64748B] mb-2 tracking-widest uppercase">
              // we.are.everywhere
            </p>
             <h2 className="font-display text-3xl font-extrabold text-foreground tracking-tight leading-tight">
              Freelancers in every country.<br className="hidden sm:inline" /> Leads in every city.
            </h2>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-md">
              A truly global ecosystem matching local clients with global freelance talent. We scan 150+ countries in real-time.
            </p>
            
            {/* City badges list */}
            <div className="mt-6 flex flex-wrap gap-2">
              {cities.map((city) => (
                <span 
                  key={city.name} 
                  className="inline-flex items-center gap-1.5 rounded-full bg-card border border-border px-3 py-1 text-xs text-slate-300 font-mono"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {city.name}
                </span>
              ))}
            </div>
          </div>

          {/* Right: Map */}
          <div className="lg:col-span-7">
            <div className="relative mx-auto w-full h-[280px] md:h-[320px] border border-border bg-card/20 rounded-2xl overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-dot-pattern opacity-45" />
              
              {/* Stylized world grid coordinates */}
              <svg className="absolute inset-0 w-full h-full text-slate-800/40" xmlns="http://www.w3.org/2000/svg">
                <line x1="0" y1="50%" x2="100%" y2="50%" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" />
                <line x1="50%" y1="0" x2="50%" y2="100%" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" />
              </svg>

              {/* Pulse cities */}
              {cities.map((city, i) => (
                <div 
                  key={city.name} 
                  className="absolute group" 
                  style={{ top: city.y, left: city.x }}
                >
                  {/* Pulse rings */}
                  <span className="absolute inline-flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 animate-ping" style={{ animationDelay: `${city.delay}s`, animationDuration: '3s' }} />
                  <span className="absolute inline-flex h-4.5 w-4.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/45 animate-pulse" />
                  <span className="absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-secondary" />

                  {/* Floating label */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-10">
                    <div className="bg-slate-950 border border-slate-800 rounded-lg py-1 px-2.5 text-[10px] font-mono font-medium text-white shadow-xl whitespace-nowrap">
                      {city.name} Hub
                    </div>
                  </div>
                </div>
              ))}

              {/* Bottom stats pill overlay */}
              <div className="absolute bottom-4 left-4 bg-slate-950/90 border border-slate-800/80 rounded-full px-4 py-1.5 text-[10px] text-slate-300 font-mono flex items-center gap-2 shadow-2xl">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Scanning 150+ countries in real-time</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const CATEGORY_ICONS: Record<string, React.ComponentType<any>> = {
  web_dev: Code2,
  designer: Palette,
  copywriter: PenTool,
  seo: LineChart,
  social_media: Smartphone,
  video: Film,
  photography: Camera,
  marketing: Megaphone,
  app_dev: AppWindow,
  va: Handshake,
};

/* ────────────────────────────────────────────────────────────
   WHO IT IS FOR
   ──────────────────────────────────────────────────────────── */
function WhoFor() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">Built for every freelancer</h2>
        <p className="mt-3 text-muted-foreground">Whatever skill you sell, we'll help you find businesses that need it.</p>
      </div>
      <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {CATEGORIES.map((c) => {
          const Icon = CATEGORY_ICONS[c.id] || Sparkles;
          return (
            <Link to="/freelancers/$slug" params={{ slug: categorySlug(c.id) }} key={c.id}
              className="group rounded-xl border border-border bg-card p-5 transition hover:border-foreground/30 hover:shadow-card-hover">
              <div className="text-primary h-8 w-8 flex items-center justify-center rounded-lg bg-primary/10 border border-primary/20 transition group-hover:bg-primary/20">
                <Icon className="h-4.5 w-4.5 text-primary" />
              </div>
              <p className="mt-4 font-display text-sm font-semibold text-foreground">{c.label}</p>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{c.example}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary opacity-0 transition group-hover:opacity-100">
                See leads <ArrowRight className="h-3 w-3" />
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function categorySlug(id: string) {
  const map: Record<string, string> = {
    web_dev: "web-developers", designer: "designers", copywriter: "copywriters", seo: "seo-specialists",
    social_media: "social-media", video: "videographers", photography: "photographers", marketing: "marketers",
    app_dev: "app-developers", va: "virtual-assistants",
  };
  return map[id] ?? id;
}

/* ────────────────────────────────────────────────────────────
   TESTIMONIALS — bigger human imagery, Ramp-credibility feel
   ──────────────────────────────────────────────────────────── */
function Testimonials() {
  const items = [
    { quote: "I found 3 new clients in my first week. The opportunity scoring tells me exactly which businesses to call first.", name: "Taiwo Adeyemi", role: "Web Developer", city: "Lagos, Nigeria", avatar: IMG.face1 },
    { quote: "As a copywriter, I never knew how to find leads. Now I have a full pipeline every Monday morning.", name: "Maria Silva", role: "Copywriter", city: "São Paulo, Brazil", avatar: IMG.face2 },
    { quote: "The phone scripts are gold. I went from zero cold calls to booking 2 meetings a day.", name: "James Kariuki", role: "SEO Specialist", city: "Nairobi, Kenya", avatar: IMG.face3 },
  ];
  return (
    <section className="border-t border-border bg-background py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Customer stories</p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight md:text-4xl">Freelancers in 50+ countries trust us</h2>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {items.map((t) => (
            <figure key={t.name} className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card">
              <img src={t.avatar} alt={t.name} className="aspect-[4/3] w-full object-cover" loading="lazy" />
              <div className="flex flex-1 flex-col p-6">
                <div className="mb-3 flex gap-0.5 text-amber-500">
                  {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                </div>
                <blockquote className="text-sm leading-relaxed text-foreground/90">"{t.quote}"</blockquote>
                <figcaption className="mt-5 border-t border-border pt-4 text-xs">
                  <p className="font-semibold text-foreground">{t.name}</p>
                  <p className="text-muted-foreground">{t.role} · {t.city}</p>
                </figcaption>
              </div>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────
   PRICING — Intercom-clean
   ──────────────────────────────────────────────────────────── */
function Pricing() {
  const { t, formatPrice, getCurrencySymbol } = usePreferences();
  const plans = [
    { name: t("plan_free"), price: 0, leads: "10", popular: false, cta: t("plan_cta_free"), features: [t("plan_free_feature_1"), t("plan_free_feature_2"), t("plan_free_feature_3")] },
    { name: t("plan_individual"), price: 7, leads: "200", popular: true, cta: t("plan_cta_ind"), features: [t("plan_ind_feature_1"), t("plan_ind_feature_2"), t("plan_ind_feature_3"), t("plan_ind_feature_4"), t("plan_ind_feature_5")] },
    { name: t("plan_company"), price: 20, leads: "Unlimited", popular: false, cta: t("plan_cta_comp"), features: [t("plan_comp_feature_1"), t("plan_comp_feature_2"), t("plan_comp_feature_3"), t("plan_comp_feature_4"), t("plan_comp_feature_5")] },
  ];
  return (
    <div className="mx-auto max-w-7xl px-4 py-24 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-mono text-[#64748B] mb-2 tracking-widest uppercase">
          // simple.pricing
        </p>
        <h2 className="font-display text-4xl font-extrabold text-foreground tracking-tight">{t("pricing_title")}</h2>
        <p className="mt-4 text-muted-foreground">{t("pricing_sub")}</p>
      </div>
      <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
        {plans.map((p) => (
          <div key={p.name} className={`relative rounded-2xl border bg-card/85 p-7 transition hover:shadow-card-hover ${p.popular ? "border-primary shadow-[0_0_25px_rgba(99,102,241,0.15)] lg:-translate-y-3" : "border-border"}`}>
            {p.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                Most Popular
              </span>
            )}
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{p.name}</p>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="font-display text-4xl font-extrabold text-foreground">{getCurrencySymbol()}{formatPrice(p.price)}</span>
              <span className="text-xs text-muted-foreground">{t("plan_mo")}</span>
            </div>
            <p className="mt-2 font-mono-data text-xs text-primary font-semibold">{p.leads === "Unlimited" ? "Unlimited" : p.leads} {t("plan_leads_mo")}</p>
            <ul className="mt-6 space-y-2.5 text-xs text-muted-foreground">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <Link to="/register" className={`mt-7 block rounded-lg py-2.5 text-center text-sm font-semibold transition ${p.popular ? "bg-primary text-white hover:bg-primary/95" : "border border-border bg-background text-foreground hover:bg-accent"}`}>
              {p.cta}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   CTA — Vercel-dark, calm
   ──────────────────────────────────────────────────────────── */
function CTA() {
  return (
    <section className="px-4 py-20 lg:px-8">
      <div
        className="mx-auto max-w-6xl overflow-hidden rounded-3xl p-14 text-center"
        style={{ background: "var(--ink-bg)", color: "var(--ink-fg)" }}
      >
        <h2 className="font-display text-3xl font-semibold tracking-tight md:text-5xl">Start finding clients today</h2>
        <p className="mx-auto mt-4 max-w-xl text-base" style={{ color: "var(--ink-muted)" }}>
          Join thousands of freelancers who've stopped waiting for work to come to them.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link to="/register" className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-white/90">
            Create free account <ArrowRight className="h-4 w-4" />
          </Link>
          <Link to="/pricing" className="inline-flex items-center gap-2 rounded-xl border px-6 py-3 text-sm font-semibold text-white hover:bg-white/10" style={{ borderColor: "var(--ink-border)" }}>
            See pricing
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────
   STATS — bold numbers band with background image
   ──────────────────────────────────────────────────────────── */
function Stats() {
  const stats = [
    { k: "150+", v: "Countries covered" },
    { k: "240k", v: "Businesses scored monthly" },
    { k: "34%", v: "Average reply rate" },
    { k: "4.8/5", v: "Customer satisfaction" },
  ];
  return (
    <section className="relative overflow-hidden border-y border-border bg-background transition-colors duration-300">
      <div className="absolute inset-0">
        <img src={IMG.team} alt="" className="h-full w-full object-cover opacity-10 dark:opacity-15 light:opacity-5 mix-blend-luminosity" />
        <div className="absolute inset-0 bg-background/90 dark:bg-[#080B14]/85" />
      </div>
      <div className="relative mx-auto max-w-7xl px-4 py-20 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">By the numbers</p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight md:text-4xl text-foreground">
            A real product, with real traction.
          </h2>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.k} className="rounded-2xl border border-border bg-card p-6 shadow-card hover:shadow-card-hover transition duration-300">
              <p className="font-display text-4xl font-semibold text-primary md:text-5xl">{s.k}</p>
              <p className="mt-2 text-sm text-muted-foreground font-medium">{s.v}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────
   FAQ — expandable, no library, calm
   ──────────────────────────────────────────────────────────── */
function FAQ() {
  const faqs = [
    { q: "How is LanceConnect different from a job board?", a: "Job boards wait for clients to post. We do the opposite — we surface businesses who don't yet know they need you, and give you their contact details so you can reach out first." },
    { q: "Do I need any sales experience?", a: "No. Every lead comes with a ready-made outreach template tuned to your skill — email, phone script, and DM. Pro adds an AI writer that personalises each message." },
    { q: "Which countries do you cover?", a: "150+ countries. We have especially strong coverage of Nigeria, Italy, India, UK, France, Argentina, Malaysia, and Canada, with daily refreshed data." },
    { q: "What if I don't find any leads?", a: "Every plan includes a 'no leads, no charge' guarantee in your first month. If your first 10 leads aren't useful, we refund you in full." },
    { q: "Can I cancel anytime?", a: "Yes. No contracts. Cancel from your dashboard in one click. You keep access until the end of your billing period." },
    { q: "Is my data private?", a: "Absolutely. We never share your account info, your saved leads, or your outreach history with anyone. Read our Privacy Policy for full details." },
  ];
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="mx-auto max-w-4xl px-4 py-24 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">FAQ</p>
        <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight md:text-4xl">Questions, answered honestly</h2>
        <p className="mt-3 text-muted-foreground">Still curious? <Link to="/contact" className="text-primary underline-offset-4 hover:underline">Talk to a human</Link>.</p>
      </div>
      <div className="mt-12 divide-y divide-border rounded-2xl border border-border bg-card">
        {faqs.map((f, i) => {
          const isOpen = open === i;
          return (
            <div key={f.q}>
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
              >
                <span className="font-display text-base font-semibold md:text-lg">{f.q}</span>
                {isOpen ? <Minus className="h-4 w-4 shrink-0 text-muted-foreground" /> : <Plus className="h-4 w-4 shrink-0 text-muted-foreground" />}
              </button>
              {isOpen && (
                <div className="px-6 pb-6 text-sm leading-relaxed text-muted-foreground animate-fade-in">
                  {f.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
