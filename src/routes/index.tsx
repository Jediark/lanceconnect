import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import {
  ArrowRight, Bookmark, CheckCircle2, Globe, LineChart, Mail, Map, Play,
  Sparkles, Star, Target, Users, Phone, Building2, MapPin, Plus, Minus,
} from "lucide-react";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { HeroCarousel } from "@/components/marketing/HeroCarousel";
import { CATEGORIES } from "@/data/mockData";
import { IMG, BLOG_POSTS } from "@/data/content";

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
      <LogoStrip />
      <HeroCarousel />
      <ProductShowcase />
      <Stats />
      <HowItWorks />
      <Features />
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

const HUMAN_IMAGES = [
  { src: IMG.face1, name: "Taiwo", skills: ["Web Dev 🇳🇬"], top: "10%", left: "5%", delay: 0 },
  { src: IMG.face2, name: "Maria", skills: ["Copywriter 🇧🇷"], top: "25%", left: "85%", delay: 0.5 },
  { src: IMG.face3, name: "James", skills: ["SEO 🇰🇪"], top: "55%", left: "5%", delay: 1 },
  { src: IMG.face4, name: "Priya", skills: ["Designer 🇮🇳"], top: "70%", left: "80%", delay: 1.5 },
  { src: IMG.face5, name: "Alex", skills: ["Marketer 🇬🇧"], top: "40%", left: "70%", delay: 2 },
  { src: IMG.face6, name: "Sofia", skills: ["Video 🇦🇷"], top: "15%", left: "75%", delay: 2.5 },
];

function HeroWithMosaic() {
  const floatVariants = {
    animate: {
      y: [0, -12, 0],
      transition: { duration: 4, repeat: Infinity, ease: "easeInOut" as const, delay: 0 },
    },
  };

  return (
    <section className="relative overflow-hidden border-b border-border bg-sidebar/95">
      <div className="absolute inset-0 opacity-10">
        <div className="h-full w-full" style={{ backgroundImage: "radial-gradient(circle at 20% 30%, var(--primary) 0.5px, transparent 1px)", backgroundSize: "40px 40px" }} />
      </div>
      <div className="relative mx-auto max-w-7xl px-4 py-20 lg:px-8 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-[11px] font-mono-data text-muted-foreground uppercase tracking-widest">
              // find.clients.globally
            </p>
            <h1 className="font-display text-4xl font-bold text-foreground mt-3 sm:text-5xl lg:text-6xl">
              The Meeting Point<br/>for Freelancers<br/>and Clients.
            </h1>
            <p className="mt-4 text-base text-muted-foreground max-w-lg">
              Stop waiting for work to come to you. LanceConnect finds businesses that need your skills anywhere in the world and hands you their direct contacts.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/register" className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
                Get 10 Free Leads <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/how-it-works" className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-6 py-3 text-sm font-medium hover:bg-accent">
                <Play className="h-4 w-4" /> Watch Demo
              </Link>
            </div>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> No credit card</span>
              <span className="flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Instant access</span>
              <span className="flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Cancel anytime</span>
            </div>
          </div>

          <div className="relative h-[400px] lg:h-[500px]">
            <div className="relative h-full w-full">
              {HUMAN_IMAGES.map((img, i) => (
                <motion.div
                  key={i}
                  className="absolute h-20 w-20 rounded-full overflow-hidden ring-2 ring-primary/30 shadow-card"
                  style={{ top: img.top, left: img.left }}
                  variants={floatVariants}
                  animate="animate"
                  transition={{ delay: i * 0.5, duration: 4, repeat: Infinity }}
                >
                  <img src={img.src} alt={img.name} className="h-full w-full object-cover" loading="lazy" />
                </motion.div>
              ))}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-10 left-10 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-medium text-emerald-400 backdrop-blur">🔥 94 Hot Lead</div>
                <div className="absolute bottom-16 right-12 rounded-full bg-blue-500/20 px-3 py-1 text-xs font-medium text-blue-400 backdrop-blur">📞 +234 802...</div>
                <div className="absolute top-24 right-8 rounded-full bg-red-500/20 px-3 py-1 text-xs font-medium text-red-400 backdrop-blur">❌ No website</div>
              </div>
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
    <div className="bg-sidebar/90 backdrop-blur-sm border-b border-sidebar-border">
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
              <span className="ml-3">app.LanceConnect.com / discover</span>
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
              <p className="font-display text-3xl font-semibold text-white">{s.k}</p>
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

/* ────────────────────────────────────────────────────────────
   FEATURES
   ──────────────────────────────────────────────────────────── */
function Features() {
  const features = [
    { icon: Globe, title: "Global Lead Discovery", desc: "Find businesses without websites in any country, any city." },
    { icon: Star, title: "Opportunity Scoring", desc: "A clear score showing how much a business actually needs you." },
    { icon: Phone, title: "Verified Contact Details", desc: "Phone numbers, emails, and social profiles in one click." },
    { icon: Bookmark, title: "Built-in CRM", desc: "Track your outreach with a simple, freelancer-friendly pipeline." },
    { icon: Users, title: "Outreach Templates", desc: "Battle-tested emails, phone scripts, and DM templates." },
    { icon: Sparkles, title: "AI Message Writer", desc: "Personalised outreach generated in seconds. (Pro)" },
  ];
  return (
    <section id="features" className="border-y border-border bg-paper py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">Everything you need to get clients</h2>
          <p className="mt-3 text-muted-foreground">No bloat. Just the tools freelancers actually use to win work.</p>
        </div>
        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="group rounded-2xl border border-border bg-card p-6 transition hover:-translate-y-0.5">
              <div className="mb-5 inline-grid h-11 w-11 place-items-center rounded-lg bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="font-display text-lg font-semibold">{f.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

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
        {CATEGORIES.map((c) => (
          <Link to="/freelancers/$slug" params={{ slug: categorySlug(c.id) }} key={c.id}
            className="group rounded-xl border border-border bg-card p-5 transition hover:border-foreground/30">
            <div className="text-2xl">{c.emoji}</div>
            <p className="mt-3 font-display text-sm font-semibold">{c.label}</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{c.example}</p>
            <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary opacity-0 transition group-hover:opacity-100">
              See leads <ArrowRight className="h-3 w-3" />
            </span>
          </Link>
        ))}
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
  const plans = [
    { name: "Free", price: "0", leads: "10", popular: false, cta: "Start Free", features: ["Basic filters", "1 template", "1 team seat"] },
    { name: "Starter", price: "19", leads: "100", popular: false, cta: "Get Started", features: ["All filters", "5 templates", "CRM pipeline", "CSV export"] },
    { name: "Pro", price: "49", leads: "500", popular: true, cta: "Go Pro", features: ["Everything in Starter", "Unlimited templates", "AI outreach writer", "Priority support"] },
    { name: "Agency", price: "99", leads: "Unlimited", popular: false, cta: "Scale Up", features: ["Everything in Pro", "3 team seats", "API access", "White-label option"] },
  ];
  return (
    <section id="pricing" className="border-y border-border bg-paper py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">Simple, transparent pricing</h2>
          <p className="mt-3 text-muted-foreground">Start free. Upgrade when you're winning work.</p>
        </div>
        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {plans.map((p) => (
            <div key={p.name} className={`relative rounded-2xl border bg-card p-7 ${p.popular ? "border-foreground shadow-card-hover lg:-translate-y-3" : "border-border"}`}>
              {p.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-foreground px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-background">
                  Most Popular
                </span>
              )}
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{p.name}</p>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="font-display text-4xl font-semibold tracking-tight">${p.price}</span>
                <span className="text-sm text-muted-foreground">/mo</span>
              </div>
              <p className="mt-1 font-mono-data text-sm text-primary">{p.leads} leads / month</p>
              <ul className="mt-6 space-y-2.5 text-sm">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                    <span className="text-foreground/80">{f}</span>
                  </li>
                ))}
              </ul>
              <Link to="/register" className={`mt-7 block rounded-lg py-2.5 text-center text-sm font-semibold transition ${p.popular ? "bg-foreground text-background hover:bg-foreground/90" : "border border-border bg-background hover:bg-accent"}`}>
                {p.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
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
    <section className="relative overflow-hidden border-y border-border">
      <div className="absolute inset-0">
        <img src={IMG.marketStall} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-[color:var(--ink-bg)]/85" />
      </div>
      <div className="relative mx-auto max-w-7xl px-4 py-20 lg:px-8">
        <div className="mx-auto max-w-2xl text-center text-white">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/70">By the numbers</p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight md:text-4xl">
            A real product, with real traction.
          </h2>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.k} className="rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur">
              <p className="font-display text-4xl font-semibold text-white md:text-5xl">{s.k}</p>
              <p className="mt-2 text-sm text-white/75">{s.v}</p>
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
