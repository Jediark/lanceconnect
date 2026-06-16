import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";
import { TrendingSearches } from "@/components/ui/TrendingSearches";
import {
  ArrowRight,
  Bookmark,
  CheckCircle2,
  Globe,
  LineChart,
  Mail,
  Map,
  Play,
  Sparkles,
  Star,
  Target,
  Users,
  Phone,
  Building2,
  MapPin,
  Plus,
  Minus,
  Globe2,
  BarChart3,
  Zap,
  Search,
  Code2,
  Palette,
  PenTool,
  Smartphone,
  Film,
  Camera,
  Megaphone,
  AppWindow,
  Handshake,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Leaf,
  Utensils,
  Package,
  Factory,
  BookOpen,
  Brain,
  Heart,
  Bot,
  FolderKanban,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { HeroCarousel } from "@/components/marketing/HeroCarousel";
import { CATEGORIES } from "@/data/mockData";
import { IMG, BLOG_POSTS } from "@/data/content";
import { usePreferences } from "@/contexts/PreferencesContext";
import { useStats } from "@/contexts/StatsContext";
import useEmblaCarousel from "embla-carousel-react";
import { CurrencyConverter } from "@/components/ui/CurrencyConverter";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LanceConnect — The Meeting Point for Freelancers and Clients" },
      {
        name: "description",
        content:
          "LanceConnect finds businesses that need your skills anywhere in the world, and hands you their contact details.",
      },
      {
        name: "keywords",
        content:
          "find freelance clients, freelancer leads, get clients as freelancer, find web design clients, SEO clients, find businesses without websites, African food export leads, B2B trade leads, find tutoring students, freelance client finder, business leads Nigeria, business leads UK, business leads globally, lanceconnect, meeting point freelancers clients",
      },
      { property: "og:title", content: "LanceConnect" },
      { property: "og:description", content: "The Meeting Point for Freelancers and Clients" },
      { property: "og:image", content: IMG.heroFreelancer },
    ],
  }),
  component: HomepageComponent,
});

function HomepageComponent() {
  const navigate = useNavigate();

  const handleSelectSearch = (search: any) => {
    const ID_TO_SLUG: Record<string, string> = {
      web_dev: "web-developers",
      designer: "designers",
      copywriter: "copywriters",
      seo: "seo-specialists",
      social_media: "social-media",
      video: "videographers",
      photography: "photographers",
      marketing: "marketers",
      app_dev: "app-developers",
      va: "virtual-assistants",
      tutor: "online-tutors",
      parent_tutor: "parent-tutors",
      african_food_export: "african-food-export",
      restaurant_supplier: "restaurant-suppliers",
      product_export: "product-export",
      b2b_trade: "b2b-trade",
      human_capital: "human-capital",
      training_recruitment: "training-recruitment",
      "local business": "local-business",
      local_business: "local-business",
    };
    const slug = ID_TO_SLUG[search.category] || String(search.category).toLowerCase().replace(/\s+/g, "-");
    navigate({
      to: "/find-clients/$category",
      params: { category: slug },
    });
  };

  // BreadcrumbList JSON-LD for homepage
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://lanceconnect.vercel.app",
      },
    ],
  };

  return (
    <MarketingShell>
      {/* BreadcrumbList Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <HeroWithMosaic />
      <div className="mx-auto max-w-7xl px-4 lg:px-8 -mt-6 mb-12 relative z-10 animate-in fade-in slide-in-from-bottom-3 duration-500">
        <TrendingSearches onSelectSearch={handleSelectSearch} />
      </div>
      <StatsBar />
      <ValuePropositionCards />
      <LogoStrip />
      <PlatformManifesto />
      <TutorialVideoSection />
      <HeroCarousel />
      <ProductShowcase />
      <Stats />
      <HowItWorks />
      <Features />
      <GlobalReach />
      <WhoFor />
      <Testimonials />
      <MeetOurTeam />
      <Pricing />
      <BlogTeaser />
      <FAQ />
      <CTA />
    </MarketingShell>
  );
}
const SLIDES_DATA = [
  {
    bgImg: IMG.workspace,
    eyebrow: "Now scanning leads in 150+ countries",
    title: (
      <>
        Find clients. <span className="text-primary font-black">Win work.</span>
        <br />
        Without the chase.
      </>
    ),
    sub: "LanceConnect scans the internet for businesses that need your skills — then hands you their phone numbers, emails, and opportunity scores.",
    themeColor: "emerald" as const,
    profileImg: "/assets/freelancers/freelancer_11.jpg",
    profileName: "Taiwo (Web Developer)",
    pills: ["94 Hot Lead", "Web Dev", "✓ Email Verified"],
    mockLead: {
      name: "Boulangerie Dupont",
      city: "Lyon, France",
      score: 94,
      tag: "Hot Lead",
      details: ["No website found", "Only Facebook page link"],
    },
  },
  {
    bgImg: IMG.marketStall,
    eyebrow: "Real leads · Real cities",
    title: (
      <>
        Local businesses,
        <br />
        <span className="text-[#3B82F6] dark:text-[#60A5FA] font-black">ready to hire</span> today.
      </>
    ),
    sub: "From bakeries in Lyon to clinics in Lagos — we surface the businesses already searching for what you do.",
    themeColor: "blue" as const,
    profileImg: "/assets/freelancers/freelancer_8.jpg",
    profileName: "James (SEO Specialist)",
    pills: ["Lagos, NG", "89% Accuracy", "SEO Audit"],
    mockLead: {
      name: "Lagos Dental Care",
      city: "Lagos, Nigeria",
      score: 87,
      tag: "Strong Lead",
      details: ["Slow mobile speed (8.4s)", "Missing Google reviews"],
    },
  },
  {
    bgImg: IMG.coffeeShop,
    eyebrow: "Built for working freelancers",
    title: (
      <>
        Stop pitching cold.
        <br />
        Start <span className="text-primary font-black">conversations</span>.
      </>
    ),
    sub: "Every lead comes with a scored opportunity, a verified contact, and an outreach script written for your craft.",
    themeColor: "purple" as const,
    profileImg: "/assets/freelancers/freelancer_6.jpg",
    profileName: "Sofia (Designer)",
    pills: ["✦ Claude 3.5", "Email + DM", "⚡ 1.8s Response"],
    mockLead: {
      name: "Mario's Ristorante",
      city: "Naples, Italy",
      score: 79,
      tag: "AI Generated",
      details: ["Tone: Casual & Friendly", "Intro: 'Hey Mario, saw your pizza spot...'"],
    },
  },
  {
    bgImg: IMG.team,
    eyebrow: "One workspace · Direct reach",
    title: (
      <>
        One workspace.
        <br />
        Every <span className="text-[#F59E0B] dark:text-[#FBBF24] font-black">client win</span>,
        tracked.
      </>
    ),
    sub: "Discover, contact, and close — in a single, calm CRM dashboard built by freelancers, for freelancers.",
    themeColor: "amber" as const,
    profileImg: "/assets/freelancers/freelancer_2.jpg",
    profileName: "Kenji (App Developer)",
    pills: ["Pipeline CRM", "100% Free", "+$4,800 Won"],
    mockLead: {
      name: "Toronto Auto Body",
      city: "Toronto, Canada",
      score: 81,
      tag: "Contract Won",
      details: ["Saved: May 12", "Status: Contract Closed (+$4.8k)"],
    },
  },
];

const THEMES = {
  emerald: {
    accent: "text-emerald-600 dark:text-emerald-400",
    bgAccent: "bg-emerald-500/10 dark:bg-emerald-500/20",
    borderAccent: "border-emerald-500/30 dark:border-emerald-400/30",
    glow: "shadow-[0_0_50px_rgba(16,185,129,0.25)]",
    gradient: "from-emerald-500/20 to-teal-500/20",
    badge: "bg-emerald-500 text-white dark:bg-emerald-500 dark:text-emerald-950",
    glowCircle: "bg-emerald-500/15 border-emerald-500/30",
  },
  blue: {
    accent: "text-blue-600 dark:text-blue-400",
    bgAccent: "bg-blue-500/10 dark:bg-blue-500/20",
    borderAccent: "border-blue-500/30 dark:border-blue-400/30",
    glow: "shadow-[0_0_50px_rgba(59,130,246,0.25)]",
    gradient: "from-blue-500/20 to-sky-500/20",
    badge: "bg-blue-500 text-white dark:bg-blue-500 dark:text-blue-950",
    glowCircle: "bg-blue-500/15 border-blue-500/30",
  },
  purple: {
    accent: "text-purple-600 dark:text-purple-400",
    bgAccent: "bg-purple-500/10 dark:bg-purple-500/20",
    borderAccent: "border-purple-500/30 dark:border-purple-400/30",
    glow: "shadow-[0_0_50px_rgba(139,92,246,0.25)]",
    gradient: "from-purple-500/20 to-fuchsia-500/20",
    badge: "bg-purple-500 text-white dark:bg-purple-500 dark:text-purple-950",
    glowCircle: "bg-purple-500/15 border-purple-500/30",
  },
  amber: {
    accent: "text-amber-600 dark:text-amber-400",
    bgAccent: "bg-amber-500/10 dark:bg-amber-500/20",
    borderAccent: "border-amber-500/30 dark:border-amber-400/30",
    glow: "shadow-[0_0_50px_rgba(245,158,11,0.25)]",
    gradient: "from-amber-500/20 to-orange-500/20",
    badge: "bg-amber-500 text-white dark:bg-amber-500 dark:text-amber-950",
    glowCircle: "bg-amber-500/15 border-amber-500/30",
  },
};

const LiveLeadCard = () => {
  return (
    <div className="w-[320px] sm:w-[360px] rounded-2xl border border-slate-200/80 dark:border-slate-800/60 bg-white/95 dark:bg-slate-900/95 shadow-2xl p-5 text-left text-slate-900 dark:text-white backdrop-blur-md">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          <span className="text-xl">🏪</span>
          <h3 className="text-base font-bold text-foreground">Mario's Restaurant</h3>
        </div>
        <div className="flex items-center gap-1 bg-red-500/10 text-red-650 dark:text-red-400 px-2.5 py-0.5 rounded-full border border-red-500/20 text-xs font-bold font-mono">
          94 🔥
        </div>
      </div>
      <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
        Restaurant · Lagos, Nigeria
      </p>
      
      <div className="mt-4 space-y-2 border-t border-slate-100 dark:border-slate-800/50 pt-3">
        <div className="flex items-center gap-2 text-xs">
          <span className="text-red-500">❌</span>
          <span className="text-slate-700 dark:text-slate-350 font-medium">No website</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-amber-500">⭐</span>
          <span className="text-slate-700 dark:text-slate-350">3.2 (18 reviews)</span>
        </div>
      </div>

      <div className="mt-4 space-y-2 border-t border-slate-100 dark:border-slate-800/50 pt-3 font-mono text-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">📞</span>
            <span className="text-foreground">+234 803 080 6363</span>
          </div>
          <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
            WhatsApp
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-slate-455">📧</span>
          <span className="text-slate-500">Not publicly listed</span>
        </div>
      </div>

      <div className="mt-5 flex gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/50">
        <button className="flex-1 rounded-xl border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-900 text-[11px] font-semibold py-2.5 hover:bg-accent hover:text-foreground text-center cursor-pointer transition text-slate-800 dark:text-slate-200">
          Save Lead
        </button>
        <button className="flex-1 rounded-xl bg-primary text-primary-foreground text-[11px] font-semibold py-2.5 hover:bg-primary/90 text-center cursor-pointer transition">
          Generate Outreach
        </button>
      </div>
    </div>
  );
};

function HeroWithMosaic() {
  const HERO_SLIDES = [
    {
      headline: (
        <>
          Find freelance <span className="text-primary font-black">clients.</span>
        </>
      ),
      subtitle:
        "LanceConnect scans the internet for businesses that need your skills — then hands you their phone numbers, emails, and opportunity scores.",
      bgImg: IMG.workspace,
    },
    {
      headline: (
        <>
          GET <span className="text-[#3B82F6] dark:text-[#60A5FA] font-black">HIRED.</span>
        </>
      ),
      subtitle:
        "Local businesses are already searching for what you do. We surface them with verified contacts so you can reach out directly.",
      bgImg: IMG.marketStall,
    },
    {
      headline: (
        <>
          Own your{" "}
          <span className="text-[#F59E0B] dark:text-[#FBBF24] font-black">income.</span>
        </>
      ),
      subtitle:
        "Zero commissions. Zero bidding wars. Every lead comes with a scored opportunity and a verified contact — ready for your outreach.",
      bgImg: IMG.coffeeShop,
    },
  ];

  const [activeSlide, setActiveSlide] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startAutoPlay = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
  };

  useEffect(() => {
    startAutoPlay();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const goTo = (idx: number) => {
    setActiveSlide(idx);
    startAutoPlay();
  };

  const goPrev = () => goTo((activeSlide - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  const goNext = () => goTo((activeSlide + 1) % HERO_SLIDES.length);

  const slide = HERO_SLIDES[activeSlide];

  return (
    <section className="relative overflow-hidden border-b border-border bg-[#020b21] py-20 lg:py-28 transition-colors duration-300">
      {/* Background — crossfade with horizontal parallax motion */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={activeSlide}
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -60 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0 z-0 select-none pointer-events-none"
        >
          <div className="absolute inset-0 bg-[#020b21] opacity-90 mix-blend-multiply" />
          <img
            src={slide.bgImg}
            className="w-full h-full object-cover opacity-20"
            alt=""
          />
        </motion.div>
      </AnimatePresence>

      <div className="relative mx-auto max-w-7xl w-full px-4 lg:px-8 z-10">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          <div className="text-left space-y-6">
            {/* Animated headline — horizontal scrolling effect */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSlide}
                initial={{ opacity: 0, x: 80 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -80 }}
                transition={{ type: "tween", ease: "easeInOut", duration: 0.5 }}
              >
                <h1 className="font-display text-5xl font-black text-white sm:text-6xl lg:text-7xl leading-[1.1] tracking-tight">
                  {slide.headline}
                </h1>
                <p className="mt-4 text-base text-slate-300 leading-relaxed max-w-lg">
                  {slide.subtitle}
                </p>
              </motion.div>
            </AnimatePresence>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]"
              >
                Get 10 Free Leads <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/how-it-works"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/60 px-6 py-3.5 text-sm font-medium hover:bg-slate-800 transition text-white hover:scale-[1.02]"
              >
                <Play className="h-4 w-4 text-slate-400" /> Learn How It Works
              </Link>
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-mono text-slate-300 pt-2">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" /> No credit card
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Instant access
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Cancel anytime
              </span>
            </div>

            {/* Slide navigation dots */}
            <div className="flex items-center gap-3 pt-2">
              {HERO_SLIDES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => goTo(idx)}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    idx === activeSlide
                      ? "w-8 bg-primary shadow-lg shadow-primary/30"
                      : "w-2 bg-slate-600 hover:bg-slate-500"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
              <span className="text-[10px] text-slate-300 font-mono ml-2">
                {activeSlide + 1}/{HERO_SLIDES.length}
              </span>
            </div>
          </div>

          <div className="relative w-full flex items-center justify-center select-none overflow-visible lg:mt-0 mt-8">
            <div
              className="absolute bottom-4 w-[340px] h-[340px] rounded-full bg-gradient-to-b from-primary/30 to-transparent border border-primary/20 opacity-70 shadow-2xl transition-all duration-500"
              style={{ transform: "rotateX(72deg) translateY(60px)" }}
            >
              <div className="absolute inset-4 rounded-full border border-primary/20 bg-primary/5 animate-pulse" />
            </div>

            <motion.div
              animate={{ y: [-8, 8, -8] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="relative z-10 transition-transform duration-500 scale-90 sm:scale-100"
              style={{
                transformStyle: "preserve-3d",
                transform:
                  "perspective(1000px) rotateY(-18deg) rotateX(12deg) rotateZ(1deg)",
              }}
            >
              <LiveLeadCard />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatsBar() {
  const { stats: globalStats } = useStats();

  const stats = [
    { number: `${globalStats.lifetimeSearches.toLocaleString()}+`, label: "searches performed" },
    { number: `${globalStats.lifetimeLeads.toLocaleString()}+`, label: "leads found" },
    { number: `${globalStats.lifetimeCountries}+`, label: "countries" },
    { number: "0%", label: "commission" },
  ];

  return (
    <div className="bg-sidebar border-b border-sidebar-border select-none py-8">
      <div className="mx-auto max-w-5xl px-4 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((s, idx) => (
            <div key={idx} className="space-y-1">
              <p className="text-4xl md:text-5xl font-black text-primary tracking-tight">
                {s.number}
              </p>
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider font-sans">
                {s.label}
              </p>
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
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              From the journal
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight md:text-4xl">
              Field notes from working freelancers.
            </h2>
            <p className="mt-3 text-muted-foreground">
              Real scripts, real numbers, real clients — written by the people doing the work.
            </p>
          </div>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold hover:bg-accent"
          >
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
                <img
                  src={p.cover}
                  alt={p.title}
                  loading="lazy"
                  className="aspect-[16/10] w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <span className="text-[11px] font-semibold uppercase tracking-widest text-primary">
                  {p.category}
                </span>
                <h3 className="mt-2 font-display text-lg font-semibold leading-snug">{p.title}</h3>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{p.excerpt}</p>
                <div className="mt-5 flex items-center gap-2 border-t border-border pt-4 text-xs text-muted-foreground">
                  <img
                    src={p.authorAvatar}
                    alt={p.author}
                    className="h-6 w-6 rounded-full object-cover"
                  />
                  <span>
                    {p.author} · {p.readMins} min read
                  </span>
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
                <p className="mt-1 text-xs text-muted-foreground leading-snug">{item.subtitle}</p>
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
          <span
            key={m}
            className="text-center font-display text-base font-semibold tracking-tight text-foreground/55"
          >
            {m}
          </span>
        ))}
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────
   PLATFORM MANIFESTO / PHILOSOPHY BANNER
   ──────────────────────────────────────────────────────────── */
function PlatformManifesto() {
  return (
    <section className="bg-muted/30 border-b border-border py-12 select-none transition-colors duration-300">
      <div className="mx-auto max-w-5xl px-4 lg:px-8">
        <div className="rounded-3xl border border-primary/20 bg-primary/5 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-left">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-[10px] font-semibold text-primary font-mono uppercase tracking-wider">
              ✦ Our Philosophy
            </span>
            <h3 className="font-display text-xl font-extrabold text-foreground tracking-tight sm:text-2xl">
              Built by freelancers, for freelancers.
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-xl">
              We believe client relationships should be direct. LanceConnect extracts real contacts
              and provides a public directory to connect you directly with clients. **0% commission,
              100% direct outreach, zero bidding wars.**
            </p>
          </div>
          <Link
            to="/freelancers"
            className="shrink-0 rounded-xl bg-primary px-5 py-3 text-xs font-bold text-white hover:brightness-110 transition shadow-lg shadow-primary/10 flex items-center gap-1.5 cursor-pointer"
          >
            Explore Freelancers Directory <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
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
    <section className="relative overflow-hidden border-b border-border bg-background py-24 select-none transition-colors duration-300">
      <div className="mx-auto max-w-5xl px-4 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto mb-12">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-semibold text-primary font-mono uppercase tracking-wider">
            Walkthrough Video
          </span>
          <h2 className="mt-4 font-display text-3xl font-extrabold text-foreground tracking-tight sm:text-4xl md:text-5xl leading-tight">
            Bringing Clients to Your Clipboard.
          </h2>
          <p className="mt-4 text-base text-muted-foreground leading-relaxed max-w-xl mx-auto">
            Watch our quick 2-minute walkthrough to see how LanceConnect scans, scores, and helps
            you win contracts in any city.
          </p>
        </div>

        {/* Premium Player Card container */}
        <div className="relative mx-auto max-w-4xl aspect-[16/9] rounded-2xl border border-border bg-slate-950 overflow-hidden shadow-2xl group transition hover:border-primary/45">
          {!isPlaying ? (
            <div
              className="absolute inset-0 z-10 flex flex-col items-center justify-center cursor-pointer select-none"
              onClick={() => setIsPlaying(true)}
            >
              {/* Styled Mock Dashboard Graphic for Thumbnail */}
              <div className="absolute inset-0 bg-[#020b21] opacity-80 mix-blend-multiply" />
              <img
                src={IMG.workspace}
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
    {
      name: "Boulangerie Dupont",
      type: "Bakery",
      city: "Lyon, France",
      rating: 4.9,
      reviews: 412,
      phone: "+33 4 78 24 18 90",
      score: 92,
      tag: "Hot",
    },
    {
      name: "Mario's Ristorante",
      type: "Italian restaurant",
      city: "Naples, Italy",
      rating: 4.7,
      reviews: 821,
      phone: "+39 081 552 47 13",
      score: 78,
      tag: "Strong",
    },
    {
      name: "Lagos Hair Studio",
      type: "Hair salon",
      city: "Lagos, Nigeria",
      rating: 4.8,
      reviews: 196,
      phone: "+234 803 442 1109",
      score: 71,
      tag: "Strong",
    },
  ];
  return (
    <section className="relative" style={{ background: "var(--ink-bg)", color: "var(--ink-fg)" }}>
      <div className="mx-auto max-w-7xl px-4 py-24 lg:px-8">
        <div className="grid items-end gap-6 md:grid-cols-[1.2fr_1fr]">
          <div>
            <p
              className="text-[11px] font-semibold uppercase tracking-[0.2em]"
              style={{ color: "var(--ink-muted)" }}
            >
              The dashboard
            </p>
            <h2 className="mt-4 font-display text-3xl font-semibold leading-tight tracking-tight md:text-5xl">
              Every lead, scored and ready to contact.
            </h2>
          </div>
          <p className="text-base leading-relaxed md:text-lg" style={{ color: "var(--ink-muted)" }}>
            Real businesses. Real phone numbers. Real opportunity scores based on whether they have
            a website, how dated it is, and how visible they are on Google.
          </p>
        </div>

        <div
          className="mt-12 overflow-hidden rounded-2xl border"
          style={{ borderColor: "var(--ink-border)", background: "var(--ink-bg-2)" }}
        >
          {/* Toolbar */}
          <div
            className="flex items-center justify-between border-b px-5 py-3 text-xs"
            style={{ borderColor: "var(--ink-border)", color: "var(--ink-muted)" }}
          >
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
                    <div
                      className="grid h-10 w-10 place-items-center rounded-lg"
                      style={{ background: "var(--ink-border)" }}
                    >
                      <Building2 className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-display text-[15px] font-semibold">{l.name}</p>
                      <p className="text-xs" style={{ color: "var(--ink-muted)" }}>
                        {l.type}
                      </p>
                    </div>
                  </div>
                </div>
                <div
                  className="col-span-6 md:col-span-3 flex items-center gap-1.5 text-sm"
                  style={{ color: "var(--ink-muted)" }}
                >
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

        <div
          className="mt-10 grid gap-6 text-sm md:grid-cols-3"
          style={{ color: "var(--ink-muted)" }}
        >
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
  const [selectedSkill, setSelectedSkill] = useState("Web Developer");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState("Lagos, NG");
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);

  const skills = ["Web Developer", "Designer", "SEO Specialist", "Copywriter", "Photographer", "App Developer"];
  const cities = ["Lagos, NG", "London, UK", "Seattle, US", "Lyon, FR", "Naples, IT", "Toronto, CA"];

  // Helper to get a dynamic mock lead based on dropdown selections
  const getMockLeadForStep3 = (skill: string, city: string) => {
    const cityName = city.split(",")[0].trim();
    
    const leadsDb: Record<string, Record<string, { name: string; emoji: string; score: number }>> = {
      "Web Developer": {
        "Lagos": { name: "Lagos Tech Hub", emoji: "💻", score: 95 },
        "London": { name: "Soho Cafe", emoji: "☕", score: 88 },
        "Seattle": { name: "Emerald Books", emoji: "📚", score: 92 },
        "Lyon": { name: "Petit Bistro", emoji: "🍽️", score: 89 },
        "Naples": { name: "Mario's Ristorante", emoji: "🍕", score: 94 },
        "Toronto": { name: "Yonge Garage", emoji: "🚗", score: 90 },
      },
      "Designer": {
        "Lagos": { name: "Lagos Hair Studio", emoji: "💇", score: 78 },
        "London": { name: "Covent Flowers", emoji: "💐", score: 85 },
        "Seattle": { name: "Rainy Day Apparel", emoji: "👕", score: 83 },
        "Lyon": { name: "Galerie d'Art", emoji: "🎨", score: 86 },
        "Naples": { name: "Vesuvio Fashion", emoji: "👗", score: 81 },
        "Toronto": { name: "CN Design Agency", emoji: "📐", score: 87 },
      },
      "SEO Specialist": {
        "Lagos": { name: "Eko Logistics", emoji: "📦", score: 91 },
        "London": { name: "West End Dental", emoji: "🦷", score: 93 },
        "Seattle": { name: "Pike Place Bakery", emoji: "🍞", score: 94 },
        "Lyon": { name: "Lyon Auto Repair", emoji: "🔧", score: 88 },
        "Naples": { name: "Napoli Hotel", emoji: "🏨", score: 90 },
        "Toronto": { name: "Bay St Law Firm", emoji: "⚖️", score: 92 },
      },
      "Copywriter": {
        "Lagos": { name: "Gidi Real Estate", emoji: "🏠", score: 86 },
        "London": { name: "Thames Marketing", emoji: "📣", score: 89 },
        "Seattle": { name: "Cascadia Travel", emoji: "✈️", score: 87 },
        "Lyon": { name: "Chateau Wine", emoji: "🍷", score: 92 },
        "Naples": { name: "Pompeii Tours", emoji: "🗺️", score: 85 },
        "Toronto": { name: "Ontario Consulting", emoji: "💼", score: 88 },
      },
      "Photographer": {
        "Lagos": { name: "Naija Weddings", emoji: "👰", score: 93 },
        "London": { name: "Soho Eats", emoji: "🍔", score: 91 },
        "Seattle": { name: "Seattle Real Estate", emoji: "🏡", score: 90 },
        "Lyon": { name: "Boulangerie Dupont", emoji: "🥖", score: 96 },
        "Naples": { name: "Amalfi Weddings", emoji: "💍", score: 94 },
        "Toronto": { name: "Drake Events", emoji: "🎉", score: 89 },
      },
      "App Developer": {
        "Lagos": { name: "Gidi Pay", emoji: "💳", score: 97 },
        "London": { name: "London Transit Co", emoji: "🚌", score: 94 },
        "Seattle": { name: "Sound Delivery", emoji: "🛵", score: 93 },
        "Lyon": { name: "Velo Rentals", emoji: "🚲", score: 89 },
        "Naples": { name: "Capri Ferry App", emoji: "🚢", score: 91 },
        "Toronto": { name: "TO Fitness App", emoji: "💪", score: 95 },
      }
    };

    const skillLeads = leadsDb[skill] || leadsDb["Web Developer"];
    return skillLeads[cityName] || { name: `${cityName} Business`, emoji: "🏢", score: 90 };
  };

  const currentLead = getMockLeadForStep3(selectedSkill, selectedCity);

  return (
    <section id="how" className="relative overflow-hidden border-y border-border py-24 bg-[#020b21] text-white">
      <div className="relative mx-auto max-w-7xl px-4 lg:px-8 z-20">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
            // workflow
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight md:text-4xl text-white">
            From zero to outreach in minutes
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Step 1 — Interactive Dropdown */}
          <div className="rounded-2xl border border-blue-900/30 bg-[#131c31] p-6 flex flex-col items-center text-center space-y-4 shadow-xl">
            <span className="text-xs font-mono font-bold text-blue-405">STEP 01</span>
            
            <div className="w-full relative">
              <button
                onClick={() => { setDropdownOpen(!dropdownOpen); setCityDropdownOpen(false); }}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 flex items-center justify-between text-xs text-white cursor-pointer hover:border-primary/50 hover:bg-slate-800 transition-all duration-200"
              >
                <span>{selectedSkill}</span>
                <motion.span
                  animate={{ rotate: dropdownOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-slate-400"
                >
                  ▼
                </motion.span>
              </button>
              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 right-0 mt-1.5 z-30 bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shadow-2xl shadow-black/40"
                  >
                    {skills.map((skill) => (
                      <button
                        key={skill}
                        onClick={() => { setSelectedSkill(skill); setDropdownOpen(false); }}
                        className={`w-full text-left px-3 py-2 text-xs transition-colors cursor-pointer ${
                          skill === selectedSkill
                            ? "bg-primary/20 text-primary font-semibold"
                            : "text-slate-300 hover:bg-slate-800 hover:text-white"
                        }`}
                      >
                        {skill}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <p className="text-sm font-semibold text-slate-100">
              Pick your skill
            </p>
          </div>

          {/* Step 2 — Interactive City Selector */}
          <div className="rounded-2xl border border-blue-900/30 bg-[#131c31] p-6 flex flex-col items-center text-center space-y-4 shadow-xl">
            <span className="text-xs font-mono font-bold text-blue-405">STEP 02</span>
            
            <div className="w-full relative">
              <button
                onClick={() => { setCityDropdownOpen(!cityDropdownOpen); setDropdownOpen(false); }}
                className="w-full relative h-12 flex items-center justify-center cursor-pointer group"
              >
                <span className="absolute animate-ping h-8 w-8 rounded-full bg-red-500/20" />
                <MapPin className="h-8 w-8 text-red-500 fill-red-500/20 group-hover:scale-110 transition-transform" />
                <motion.span
                  key={selectedCity}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute -bottom-1 bg-slate-900 border border-slate-700 px-2 py-0.5 rounded text-[8px] font-mono"
                >
                  {selectedCity}
                </motion.span>
              </button>
              <AnimatePresence>
                {cityDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 right-0 mt-3 z-30 bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shadow-2xl shadow-black/40"
                  >
                    {cities.map((city) => (
                      <button
                        key={city}
                        onClick={() => { setSelectedCity(city); setCityDropdownOpen(false); }}
                        className={`w-full text-left px-3 py-2 text-xs transition-colors cursor-pointer ${
                          city === selectedCity
                            ? "bg-red-500/20 text-red-400 font-semibold"
                            : "text-slate-300 hover:bg-slate-800 hover:text-white"
                        }`}
                      >
                        <MapPin className="h-3 w-3 inline mr-1.5" />{city}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <p className="text-sm font-semibold text-slate-100">
              Choose a city
            </p>
          </div>

          {/* Step 3 */}
          <div className="rounded-2xl border border-blue-900/30 bg-[#131c31] p-6 flex flex-col items-center text-center space-y-4 shadow-xl">
            <span className="text-xs font-mono font-bold text-blue-405">STEP 03</span>
            
            {/* Visual: Scored Lead Card */}
            <motion.div
              key={selectedSkill + selectedCity}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 flex items-center justify-between text-[10px]"
            >
              <span className="font-bold truncate max-w-[105px]">{currentLead.emoji} {currentLead.name}</span>
              <span className="bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 text-[8px] font-bold px-1 py-0.5 rounded font-mono shrink-0">
                {currentLead.score} 🔥
              </span>
            </motion.div>
            
            <p className="text-sm font-semibold text-slate-100">
              Get scored leads
            </p>
          </div>

          {/* Step 4 — Interactive Outreach Links */}
          <div className="rounded-2xl border border-blue-900/30 bg-[#131c31] p-6 flex flex-col items-center text-center space-y-4 shadow-xl">
            <span className="text-xs font-mono font-bold text-blue-405">STEP 04</span>
            
            {/* Visual: Outreach Icons — now clickable */}
            <div className="flex gap-4">
              <Link
                to="/register"
                className="h-10 w-10 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 hover:bg-blue-500/25 hover:border-blue-400/60 hover:scale-110 transition-all duration-200 cursor-pointer"
                title="Send Email"
              >
                <Mail className="h-4 w-4" />
              </Link>
              <Link
                to="/register"
                className="h-10 w-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-xs hover:bg-emerald-500/25 hover:border-emerald-400/60 hover:scale-110 transition-all duration-200 cursor-pointer"
                title="WhatsApp"
              >
                WA
              </Link>
            </div>
            
            <p className="text-sm font-semibold text-slate-100">
              Reach out
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

const AiOutreachFooter = () => {
  const [tone, setTone] = useState<"casual" | "professional" | "bold">("casual");

  const messages = {
    casual: "Hey Mario, saw your pizza spot has no site...",
    professional:
      "Dear Mario, I noticed Mario's Ristorante does not currently have a web presence...",
    bold: "Hey Mario, why doesn't Mario's Ristorante have a website yet? Your competitors in Naples are...",
  };

  return (
    <div className="flex flex-col gap-2 w-full mt-2">
      <div className="flex items-center justify-between bg-background p-1 rounded-lg border border-border/80">
        {(["casual", "professional", "bold"] as const).map((t) => (
          <button
            key={t}
            onClick={(e) => {
              e.stopPropagation();
              setTone(t);
            }}
            className={`text-[9px] font-mono px-2 py-0.5 rounded transition-all capitalize flex-1 text-center ${
              tone === t
                ? "bg-primary text-white shadow-sm font-semibold"
                : "text-slate-400 hover:text-white hover:bg-slate-800/45"
            }`}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="w-full bg-background border border-border rounded-xl p-2.5 font-mono text-[9px] text-slate-400 h-[60px] overflow-hidden select-none">
        <div className="flex justify-between items-center text-[#64748B] mb-0.5">
          <span>// Generated intro</span>
          <span className="text-[8px] bg-primary/20 text-primary px-1 rounded uppercase tracking-wider font-semibold">
            Active
          </span>
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
      <div className="space-y-2 border-t border-border/60 pt-4 font-mono text-xs text-slate-600 dark:text-[#64748B] w-full">
        <div className="flex justify-between">
          <span>Leads indexed</span>
          <span className="text-slate-950 dark:text-white font-semibold">2.4M+</span>
        </div>
        <div className="flex justify-between">
          <span>Countries covered</span>
          <span className="text-slate-950 dark:text-white font-semibold">150+</span>
        </div>
      </div>
    ),
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
        <span className="rounded-full bg-emerald-500/20 px-2.5 py-1 text-xs font-semibold text-emerald-400">
          94 Hot Lead
        </span>
      </div>
    ),
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
    ),
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
    footer: AiOutreachFooter,
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
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
          New
        </span>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-900/30 text-blue-400 border border-blue-500/20">
          Contacted
        </span>
      </div>
    ),
  },
  {
    id: 6,
    icon: Globe,
    title: "Online Opportunities",
    desc: "LinkedIn, Indeed, Reddit remote opportunities consolidated for remote freelancers.",
    gridClass: "lg:col-start-1 lg:row-start-2 lg:col-span-1",
    connector: () => (
      <div className="absolute left-1/2 -bottom-3 w-0.5 h-6 border-l border-dashed border-primary/45 -translate-x-1/2 lg:block hidden z-0" />
    ),
  },
];

function Features() {
  const features = [
    { icon: Globe2, text: "150+ countries covered", color: "text-blue-500 bg-blue-500/10 border-blue-500/20" },
    { icon: Phone, text: "Verified phone numbers", color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" },
    { icon: Mail, text: "Email finder included", color: "text-amber-500 bg-amber-500/10 border-amber-500/20" },
    { icon: BarChart3, text: "Opportunity score 1-100", color: "text-sky-500 bg-sky-500/10 border-sky-500/20" },
    { icon: Bot, text: "AI outreach generator", color: "text-indigo-500 bg-indigo-500/10 border-indigo-500/20" },
    { icon: FolderKanban, text: "Built-in CRM pipeline", color: "text-violet-500 bg-violet-500/10 border-violet-500/20" },
  ];

  return (
    <section id="features" className="border-y border-border bg-background py-20 select-none">
      <div className="mx-auto max-w-5xl px-4 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <p className="text-xs font-mono text-[#64748B] mb-2 tracking-widest uppercase">
            // features
          </p>
          <h2 className="font-display text-4xl font-extrabold text-foreground">
            Everything you need to get clients
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, idx) => {
            const Icon = f.icon;
            return (
              <div
                key={idx}
                className="rounded-2xl border bg-card p-6 flex items-center gap-4 hover:scale-[1.02] hover:border-primary/30 transition-all duration-300 shadow-sm"
              >
                <div className={cn("shrink-0 p-3 rounded-xl border", f.color)}>
                  <Icon className="h-6 w-6" />
                </div>
                <p className="font-display text-base font-bold text-foreground">
                  {f.text}
                </p>
              </div>
            );
          })}
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
    { name: "Lagos", country: "Nigeria", x: "50%", y: "58%", delay: 0 },
    { name: "London", country: "United Kingdom", x: "47%", y: "30%", delay: 0.3 },
    { name: "Mumbai", country: "India", x: "68%", y: "50%", delay: 0.6 },
    { name: "New York", country: "United States", x: "30%", y: "36%", delay: 0.9 },
    { name: "São Paulo", country: "Brazil", x: "38%", y: "74%", delay: 1.2 },
    { name: "Tokyo", country: "Japan", x: "83%", y: "40%", delay: 1.5 },
    { name: "Dubai", country: "UAE", x: "60%", y: "45%", delay: 1.8 },
  ];

  return (
    <section className="hidden md:block relative overflow-hidden border-t border-border bg-background py-16 select-none">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
          {/* Left: Content */}
          <div className="lg:col-span-5">
            <p className="text-xs font-mono text-[#64748B] mb-2 tracking-widest uppercase">
              // we.are.everywhere
            </p>
            <h2 className="font-display text-3xl font-extrabold text-foreground tracking-tight leading-tight">
              Freelancers in every country.
              <br className="hidden sm:inline" /> Leads in every city.
            </h2>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-md">
              A truly global ecosystem matching local clients with global freelance talent. We scan
              150+ countries in real-time.
            </p>

            {/* City badges list */}
            <div className="mt-6 flex flex-wrap gap-2">
              {cities.map((city) => (
                <Link
                  key={city.name}
                  to={["Lagos", "London", "Dubai"].includes(city.name) ? `/find-clients/${city.name.toLowerCase()}` as any : `/find-clients/web-developer/${city.name.toLowerCase()}` as any}
                  className="inline-flex items-center gap-1.5 rounded-full bg-card border border-border px-3 py-1 text-xs text-slate-800 dark:text-slate-300 hover:border-primary transition font-mono font-medium cursor-pointer"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {city.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Right: Map */}
          <div className="lg:col-span-7">
            <div className="relative mx-auto w-full h-[280px] md:h-[320px] border border-[#1e293b] bg-[#020b21] rounded-2xl overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-dot-pattern opacity-45" />

              {/* Stylized world grid coordinates */}
              <svg
                className="absolute inset-0 w-full h-full text-slate-800/40"
                xmlns="http://www.w3.org/2000/svg"
              >
                <line
                  x1="0"
                  y1="50%"
                  x2="100%"
                  y2="50%"
                  stroke="currentColor"
                  strokeWidth="0.5"
                  strokeDasharray="4 4"
                />
                <line
                  x1="50%"
                  y1="0"
                  x2="50%"
                  y2="100%"
                  stroke="currentColor"
                  strokeWidth="0.5"
                  strokeDasharray="4 4"
                />
              </svg>

              {/* Pulse cities */}
              {cities.map((city, i) => (
                <div
                  key={city.name}
                  className="absolute group"
                  style={{ top: city.y, left: city.x }}
                >
                  {/* Pulse rings */}
                  <span
                    className="absolute inline-flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 animate-ping"
                    style={{ animationDelay: `${city.delay}s`, animationDuration: "3s" }}
                  />
                  <span className="absolute inline-flex h-4.5 w-4.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/45 animate-pulse" />
                  <span className="absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-secondary" />

                  {/* Always visible label showing City and Country */}
                  <div className="absolute bottom-3.5 left-1/2 -translate-x-1/2 pointer-events-none z-10">
                    <div className="bg-[#020b21]/90 border border-primary/30 rounded-md py-0.5 px-2 text-[8px] md:text-[9px] font-mono font-medium text-slate-100 shadow-md whitespace-nowrap">
                      {city.name}, {city.country}
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
  tutor: GraduationCap,
  african_food_export: Leaf,
  restaurant_supplier: Utensils,
  product_export: Package,
  b2b_trade: Factory,
  human_capital: Brain,
  training_recruitment: Target,
  parent_tutor: Users,
};

/* ────────────────────────────────────────────────────────────
   WHO IT IS FOR
   ──────────────────────────────────────────────────────────── */
function WhoFor() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 lg:px-8 bg-background">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
          Built for every freelancer
        </h2>
        <p className="mt-3 text-muted-foreground">
          Whatever skill you sell, we'll help you find businesses that need it.
        </p>
      </div>
      <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {CATEGORIES.slice(0, 5).map((c) => {
          const Icon = CATEGORY_ICONS[c.id] || Sparkles;
          return (
            <Link
              to="/freelancers/$slug"
              params={{ slug: categorySlug(c.id) }}
              key={c.id}
              className="group rounded-xl border border-border bg-card p-5 transition hover:border-foreground/30 hover:shadow-card-hover"
            >
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
      <div className="mt-10 text-center">
        <Link
          to="/services"
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-2.5 text-xs font-mono font-bold hover:bg-accent text-primary transition shadow-sm"
        >
          Explore all 18+ services & niche trade directories <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </section>
  );
}

function categorySlug(id: string) {
  const map: Record<string, string> = {
    web_dev: "web-developers",
    designer: "designers",
    copywriter: "copywriters",
    seo: "seo-specialists",
    social_media: "social-media",
    video: "videographers",
    photography: "photographers",
    marketing: "marketers",
    app_dev: "app-developers",
    va: "virtual-assistants",
    tutor: "online-tutors",
    african_food_export: "african-food-export",
    restaurant_supplier: "restaurant-suppliers",
    product_export: "product-export",
    b2b_trade: "b2b-trade",
    human_capital: "human-capital-development",
    training_recruitment: "training-recruitment",
    parent_tutor: "parent-tutor-matching",
  };
  return map[id] ?? id;
}

/* ────────────────────────────────────────────────────────────
   TESTIMONIALS — bigger human imagery, Ramp-credibility feel
   ──────────────────────────────────────────────────────────── */
function Testimonials() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  const scroll = (direction: "left" | "right") => {
    if (containerRef.current) {
      const scrollAmount = direction === "left" ? -380 : 380;
      containerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      if (containerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          containerRef.current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          containerRef.current.scrollBy({ left: 380, behavior: "smooth" });
        }
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [isHovered]);

  const items = [
    {
      quote: "Found 3 clients in my first week. The opportunity scores let me focus on high-conversion leads.",
      name: "Taiwo Adeyemi",
      role: "Web Developer",
      city: "Lagos 🇳🇬",
      avatar: IMG.face1,
    },
    {
      quote: "The WhatsApp outreach templates are genius. I can pitch clients in under 30 seconds directly from my phone.",
      name: "Maria Silva",
      role: "Designer",
      city: "São Paulo 🇧🇷",
      avatar: IMG.face2,
    },
    {
      quote: "LanceConnect completely replaced my manual prospecting. I get fresh local business leads daily with verified emails.",
      name: "James Kariuki",
      role: "SEO Specialist",
      city: "Nairobi 🇰🇪",
      avatar: IMG.face3,
    },
    {
      quote: "Finding high-paying B2B leads used to take hours. Now I just filter by city and skill and start pitching immediately.",
      name: "Priya Patel",
      role: "App Developer",
      city: "London 🇬🇧",
      avatar: IMG.face4,
    },
    {
      quote: "The system grades opportunity based on mobile speed and reviews. Clients are blown away when I send them their audit points.",
      name: "Sofia Romano",
      role: "Copywriter",
      city: "Rome 🇮🇹",
      avatar: IMG.face6,
    },
    {
      quote: "Zero commissions. Zero bidding wars. I own the client relationship from day one, which is how freelancing should be.",
      name: "Kenji Tanaka",
      role: "Digital Marketer",
      city: "Tokyo 🇯🇵",
      avatar: IMG.face7,
    },
  ];

  return (
    <section className="border-t border-border bg-background py-20 relative overflow-hidden">
      <div className="mx-auto max-w-5xl px-4 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Customer stories
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight md:text-4xl text-foreground">
              Freelancers trust us
            </h2>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => scroll("left")}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card hover:bg-accent text-foreground transition cursor-pointer"
              aria-label="Previous Testimonial"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card hover:bg-accent text-foreground transition cursor-pointer"
              aria-label="Next Testimonial"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div
          ref={containerRef}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="flex gap-6 overflow-x-auto pb-8 pt-2 scroll-smooth snap-x snap-mandatory scrollbar-none"
          style={{ scrollbarWidth: "none" }}
        >
          {items.map((t, idx) => (
            <figure
              key={idx}
              className="flex-none w-[290px] sm:w-[350px] snap-center flex flex-col items-center text-center p-6 rounded-2xl border border-border bg-card shadow-sm hover:border-primary/40 transition duration-300"
            >
              <img
                src={t.avatar}
                alt={t.name}
                className="h-16 w-16 rounded-full object-cover border border-border mb-4"
                loading="lazy"
              />
              <blockquote className="text-sm font-semibold italic text-foreground/90 mb-4 leading-relaxed flex-1">
                "{t.quote}"
              </blockquote>
              <figcaption className="text-xs text-muted-foreground mt-auto">
                <span className="font-bold text-foreground">{t.name}</span>, {t.role} <br />
                <span className="text-[10px] text-muted-foreground mt-0.5 block">{t.city}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────
   MEET OUR TEAM
   ──────────────────────────────────────────────────────────── */
function MeetOurTeam() {
  const team = [
    {
      name: "AKINOLA OLUJOBI",
      role: "CEO / Founder",
      bio: "Visionary founder driving strategic direction, platform growth, and global freelancer success programs.",
      avatar: "/assets/team/akinola.jpg",
      location: "Lagos, Nigeria 🇳🇬",
    },
    {
      name: "TEARI BEY",
      role: "COO (Chief Operation Officer)",
      bio: "Operations leader managing global workflows, scaling systems, and daily product operations.",
      avatar: "/assets/team/teari.jpg",
      location: "USA 🇺🇸",
    },
  ];

  return (
    <section className="border-t border-border bg-[#020b21] py-20 text-white relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-40 pointer-events-none" />
      <div className="mx-auto max-w-5xl px-4 lg:px-8 relative z-10">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
            Behind the platform
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight md:text-4xl text-white">
            Meet Our Team
          </h2>
          <p className="mt-4 text-sm text-slate-400">
            Building the ultimate ecosystem connecting top-tier freelance talent with local and global clients.
          </p>
        </div>

        <div className="max-w-2xl mx-auto grid gap-8 sm:grid-cols-2">
          {team.map((m, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center text-center p-6 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-sm shadow-xl transition-all duration-300 hover:translate-y-[-4px] hover:border-primary/20 hover:bg-white/[0.04]"
            >
              <img
                src={m.avatar}
                alt={m.name}
                className="h-32 w-32 rounded-full object-cover object-top border-2 border-primary/30 mb-4 shadow-lg ring-4 ring-primary/10"
                loading="lazy"
              />
              <h3 className="text-base font-bold text-white">{m.name}</h3>
              <p className="text-xs text-primary font-semibold mt-1">{m.role}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">{m.location}</p>
              <p className="mt-3 text-xs text-slate-400 leading-relaxed">
                {m.bio}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────
   SUPPORT LANCECONNECT (BUY ME A COFFEE / DONATE)
   ──────────────────────────────────────────────────────────── */
function Pricing() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      description: "Perfect for testing the waters and getting started.",
      features: [
        "10 B2B lead searches / mo",
        "Basic opportunity scoring",
        "Full contact details (masked)",
        "Standard email templates"
      ],
      cta: "Start for Free",
      ctaLink: "/register",
      popular: false,
      color: "border-slate-850 bg-[#0d1527]/50"
    },
    {
      name: "Grow",
      price: "$20",
      description: "Great for active freelancers seeking monthly client projects.",
      features: [
        "100 B2B lead searches / mo",
        "Premium opportunity scoring",
        "Unmasked email & phone lines",
        "AI outreach script writer",
        "CRM pipeline management"
      ],
      cta: "Get Started",
      ctaLink: "/register?plan=grow",
      popular: true,
      color: "border-primary/50 bg-[#13233a]/60 shadow-[0_0_30px_rgba(6,182,212,0.15)]"
    },
    {
      name: "Scale",
      price: "$75",
      description: "For agencies and power users seeking maximum reach.",
      features: [
        "250 B2B lead searches / mo",
        "Priority lead processing",
        "Advanced filtering & export",
        "Dedicated account helper",
        "Early access to new features"
      ],
      cta: "Scale Now",
      ctaLink: "/register?plan=scale",
      popular: false,
      color: "border-slate-850 bg-[#0d1527]/50"
    }
  ];

  return (
    <section id="pricing" className="mx-auto max-w-7xl px-4 py-24 lg:px-8 border-t border-border select-none bg-card/20 rounded-3xl">
      <div className="mx-auto max-w-3xl text-center mb-16 space-y-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
          // pricing.plans
        </p>
        <h2 className="font-display text-4xl font-extrabold text-white tracking-tight">
          Simple, Flexible Pricing.
        </h2>
        <p className="text-sm text-slate-350 leading-relaxed max-w-xl mx-auto">
          Start for free to test our leads, and upgrade when you are ready to scale your outreach.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto items-stretch">
        {plans.map((plan, idx) => (
          <div
            key={idx}
            className={`relative flex flex-col justify-between rounded-3xl border p-8 transition duration-300 hover:scale-[1.02] ${plan.color}`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-[10px] font-bold text-white uppercase tracking-wider shadow">
                Most Popular
              </div>
            )}
            
            <div>
              <p className="text-xs font-mono text-primary uppercase tracking-widest">{plan.name}</p>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-white">{plan.price}</span>
                <span className="text-xs text-muted-foreground font-medium">/month</span>
              </div>
              <p className="mt-3 text-xs text-muted-foreground leading-relaxed">{plan.description}</p>

              <ul className="mt-6 space-y-3">
                {plan.features.map((feature, fIdx) => (
                  <li key={fIdx} className="flex items-start gap-2 text-slate-300">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-xs leading-normal">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8">
              <Link
                to={plan.ctaLink}
                className={`w-full inline-flex justify-center items-center rounded-xl py-3 text-xs font-bold transition shadow ${
                  plan.popular
                    ? "bg-primary text-white hover:brightness-110 shadow-primary/20"
                    : "border border-slate-700 bg-slate-900/60 text-white hover:bg-slate-800"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Live Currency Calculator */}
      <CurrencyConverter className="mt-16 bg-slate-900/40 border-slate-800" mode="plans" />
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
        <h2 className="font-display text-3xl font-semibold tracking-tight md:text-5xl">
          Start finding clients today
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base" style={{ color: "var(--ink-muted)" }}>
          Join thousands of freelancers who've stopped waiting for work to come to them.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/register"
            className="inline-flex items-center gap-2 rounded-xl bg-foreground px-6 py-3 text-sm font-semibold text-background transition hover:opacity-90"
          >
            Create free account <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/pricing"
            className="inline-flex items-center gap-2 rounded-xl border px-6 py-3 text-sm font-semibold text-foreground hover:bg-foreground/10 transition"
            style={{ borderColor: "var(--ink-border)" }}
          >
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
    <section className="relative overflow-hidden border-y border-border py-24 bg-background transition-colors duration-300">
      <div className="relative mx-auto max-w-7xl px-4 lg:px-8 z-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
            // by.the.numbers
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight md:text-4xl text-foreground">
            A real product, with real traction.
          </h2>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div
              key={s.k}
              className="rounded-2xl border border-border bg-card p-6 shadow-card hover:shadow-card-hover transition duration-300"
            >
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
    {
      q: "How is LanceConnect different from a job board?",
      a: "Job boards wait for clients to post. We do the opposite — we surface businesses who don't yet know they need you, and give you their contact details so you can reach out first.",
    },
    {
      q: "Do I need any sales experience?",
      a: "No. Every lead comes with a ready-made outreach template tuned to your skill — email, phone script, and DM. Pro adds an AI writer that personalises each message.",
    },
    {
      q: "Which countries do you cover?",
      a: "150+ countries. We have especially strong coverage of Nigeria, Italy, India, UK, France, Argentina, Malaysia, and Canada, with daily refreshed data.",
    },
    {
      q: "What if I don't find any leads?",
      a: "Every plan includes a 'no leads, no charge' guarantee in your first month. If your first 10 leads aren't useful, we refund you in full.",
    },
    {
      q: "Can I cancel anytime?",
      a: "Yes. No contracts. Cancel from your dashboard in one click. You keep access until the end of your billing period.",
    },
    {
      q: "Is my data private?",
      a: "Absolutely. We never share your account info, your saved leads, or your outreach history with anyone. Read our Privacy Policy for full details.",
    },
  ];
  const [open, setOpen] = useState<number | null>(0);

  // FAQPage JSON-LD schema for Google rich snippets
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
      },
    })),
  };

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden border-y border-border py-24 bg-[#020b21] transition-colors duration-300"
    >
      {/* FAQPage JSON-LD for Google rich snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <motion.div
        className="absolute inset-0 z-0 bg-cover bg-center opacity-35 dark:opacity-55"
        style={{
          backgroundImage: "url('/assets/freelancers/freelancer_5.jpg')",
          y,
          height: "130%",
          top: "-15%",
        }}
      />
      <div className="absolute inset-0 bg-[#020b21] opacity-80 mix-blend-multiply z-10" />

      <div className="relative mx-auto max-w-4xl px-4 lg:px-8 z-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
            // questions.answered
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight md:text-4xl text-white">
            Questions, answered honestly
          </h2>
          <p className="mt-3 text-slate-300">
            Still curious?{" "}
            <Link to="/contact" className="text-blue-400 hover:text-blue-300 underline-offset-4 hover:underline">
              Talk to a human
            </Link>
            .
          </p>
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
                  <span className="font-display text-base font-semibold md:text-lg text-foreground">
                    {f.q}
                  </span>
                  {isOpen ? (
                    <Minus className="h-4 w-4 shrink-0 text-muted-foreground" />
                  ) : (
                    <Plus className="h-4 w-4 shrink-0 text-muted-foreground" />
                  )}
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
      </div>
    </section>
  );
}
