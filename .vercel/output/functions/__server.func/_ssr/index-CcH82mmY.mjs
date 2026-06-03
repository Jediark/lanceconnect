import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { M as MarketingShell } from "./MarketingShell-BaQqOUPP.mjs";
import { u as useEmblaCarousel } from "../_libs/embla-carousel-react.mjs";
import { a as usePreferences, I as IMG, C as CATEGORIES, B as BLOG_POSTS } from "./router-Co1PU52Q.mjs";
import "../_libs/sonner.mjs";
import { A as ArrowRight, r as Play, C as CircleCheck, s as ChevronLeft, t as ChevronRight, g as MapPin, u as Building2, f as Star, T as Target, v as Map, w as ChartLine, a as Mail, i as Earth, j as ChartColumn, P as Phone, k as Sparkles, B as Bookmark, G as Globe, U as Users, x as CodeXml, y as Palette, L as LoaderCircle, Z as Zap, e as Search, c as Check, z as Copy, D as Handshake, F as AppWindow, I as Megaphone, J as Camera, N as Film, O as Smartphone, Q as PenTool, d as Minus, V as Plus } from "../_libs/lucide-react.mjs";
import { m as motion } from "../_libs/framer-motion.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/embla-carousel-reactive-utils.mjs";
import "../_libs/embla-carousel.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
const SLIDES = [
  { img: IMG.heroFreelancer, kicker: "Lagos, Nigeria", title: "Taiwo found his first 3 web-dev clients in week one.", meta: "Web Developer · Free plan" },
  { img: IMG.marketStall, kicker: "Naples, Italy", title: "Sofia turned a local market into a portfolio of 8 brands.", meta: "Designer · Starter plan" },
  { img: IMG.coffeeShop, kicker: "Buenos Aires, Argentina", title: "Lucas books 2 discovery calls a day from coffee shops.", meta: "Copywriter · Pro plan" },
  { img: IMG.workspace, kicker: "Mumbai, India", title: "Priya replaced her 9-to-5 in 5 months of freelance SEO.", meta: "SEO Specialist · Pro plan" },
  { img: IMG.team, kicker: "Toronto, Canada", title: "Alex grew an agency of 4 — every lead from LanceConnect.", meta: "Agency owner · Agency plan" }
];
function HeroCarousel() {
  const [emblaRef, embla] = useEmblaCarousel({ loop: true, align: "start" });
  const [index, setIndex] = reactExports.useState(0);
  reactExports.useEffect(() => {
    if (!embla) return;
    const onSelect = () => setIndex(embla.selectedScrollSnap());
    embla.on("select", onSelect);
    const id = setInterval(() => embla.scrollNext(), 5500);
    return () => {
      embla.off("select", onSelect);
      clearInterval(id);
    };
  }, [embla]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "border-b border-border bg-background py-20 lg:py-24", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-4 lg:px-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-end justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground", children: "Real freelancers · Real cities" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-3 font-display text-3xl font-semibold tracking-tight md:text-4xl", children: "Stories from the people we built this for" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => embla?.scrollPrev(), "aria-label": "Previous", className: "grid h-10 w-10 place-items-center rounded-full border border-border bg-card hover:bg-accent", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "h-4 w-4" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => embla?.scrollNext(), "aria-label": "Next", className: "grid h-10 w-10 place-items-center rounded-full border border-border bg-card hover:bg-accent", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4" }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: emblaRef, className: "mt-10 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex -ml-5", children: SLIDES.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-w-0 shrink-0 grow-0 basis-full pl-5 sm:basis-[80%] md:basis-[60%] lg:basis-[48%]", children: /* @__PURE__ */ jsxRuntimeExports.jsx("article", { className: "group relative overflow-hidden rounded-3xl border border-border bg-card", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative aspect-[3/2] md:aspect-[16/10] overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "img",
        {
          src: s.img,
          alt: s.title,
          loading: "lazy",
          className: "h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-x-0 bottom-0 p-7 text-white", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-medium backdrop-blur", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-3 w-3" }),
          " ",
          s.kicker
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-3 font-display text-2xl font-semibold leading-tight md:text-3xl", children: s.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-xs uppercase tracking-widest text-white/80", children: s.meta })
      ] })
    ] }) }) }, s.title)) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 flex justify-center gap-2", children: SLIDES.map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: () => embla?.scrollTo(i),
        "aria-label": `Go to slide ${i + 1}`,
        className: `h-1.5 rounded-full transition-all ${i === index ? "w-8 bg-foreground" : "w-2 bg-border"}`
      },
      i
    )) })
  ] }) });
}
const HERO_MOSAIC = [{
  src: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400&q=80&fit=crop&crop=face",
  name: "Taiwo",
  skill: "Web Dev",
  size: 100,
  top: "8%",
  left: "8%",
  delay: 0
}, {
  src: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80&fit=crop&crop=face",
  name: "Priya",
  skill: "SEO",
  size: 110,
  top: "10%",
  left: "62%",
  delay: 0.4
}, {
  src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80&fit=crop&crop=face",
  name: "Alex",
  skill: "Marketer",
  size: 85,
  top: "42%",
  left: "80%",
  delay: 0.8
}, {
  src: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80&fit=crop&crop=face",
  name: "Maria",
  skill: "Designer",
  size: 90,
  top: "46%",
  left: "4%",
  delay: 1.2
}, {
  src: "https://images.unsplash.com/photo-1556157382-97eda2d62296?w=400&q=80&fit=crop&crop=face",
  name: "Kenji",
  skill: "Developer",
  size: 95,
  top: "72%",
  left: "66%",
  delay: 1.6
}, {
  src: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&q=80&fit=crop&crop=face",
  name: "Sofia",
  skill: "Video",
  size: 100,
  top: "74%",
  left: "14%",
  delay: 2
}];
function HeroWithMosaic() {
  const {
    t
  } = usePreferences();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "relative overflow-hidden border-b border-border bg-[#080B14] py-20 lg:py-28", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 z-0 pointer-events-none", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=2000&q=80", alt: "", className: "h-full w-full object-cover opacity-15 mix-blend-luminosity" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-b from-[#080B14]/40 via-[#080B14]/70 to-[#080B14]" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 opacity-20 z-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full w-full bg-grid-pattern" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative mx-auto max-w-7xl px-4 lg:px-8 z-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-12 lg:grid-cols-2 lg:items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "z-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-mono text-[#64748B] mb-2 tracking-widest uppercase", children: t("hero_eyebrow") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-4xl font-extrabold text-white mt-3 sm:text-5xl lg:text-6xl leading-[1.1] tracking-tight", children: t("hero_title") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-6 text-base text-slate-400 max-w-lg leading-relaxed", children: t("hero_sub") }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 flex flex-wrap gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/register", className: "inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition shadow-lg shadow-primary/20", children: [
            t("hero_cta_leads"),
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/how-it-works", className: "inline-flex items-center gap-2 rounded-xl border border-border bg-[#0F172A]/80 px-6 py-3.5 text-sm font-medium hover:bg-accent transition text-white", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "h-4 w-4" }),
            " ",
            t("hero_cta_demo")
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 flex flex-wrap gap-x-6 gap-y-2 text-xs font-mono text-[#475569]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 text-emerald-500" }),
            " No credit card"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 text-emerald-500" }),
            " Instant access"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 text-emerald-500" }),
            " Cancel anytime"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative h-[480px] flex items-center justify-center select-none overflow-hidden lg:overflow-visible", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-[380px] h-[380px] flex items-center justify-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute h-20 w-20 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center animate-pulse shadow-[0_0_30px_rgba(99,102,241,0.2)]", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-3 w-3 rounded-full bg-emerald-500" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { className: "absolute w-full h-full", animate: {
          rotate: 360
        }, transition: {
          duration: 40,
          repeat: Infinity,
          ease: "linear"
        }, children: HERO_MOSAIC.map((img, i) => {
          const angle = i * 2 * Math.PI / 6;
          const radius = 120;
          const left = `calc(50% + ${radius * Math.cos(angle)}px - ${img.size / 2}px)`;
          const top = `calc(50% + ${radius * Math.sin(angle)}px - ${img.size / 2}px)`;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { className: "absolute rounded-full overflow-hidden border-2 border-primary/40 shadow-[0_0_20px_rgba(99,102,241,0.25)] bg-[#0F172A] group cursor-pointer hover:border-emerald-400 hover:scale-105 transition-all duration-300", style: {
            top,
            left,
            width: img.size,
            height: img.size
          }, animate: {
            rotate: -360
          }, transition: {
            duration: 40,
            repeat: Infinity,
            ease: "linear"
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: img.src, alt: img.name, className: "h-full w-full object-cover", loading: "lazy" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute bottom-1 left-1/2 -translate-x-1/2 rounded-full bg-slate-950/85 border border-slate-800/80 px-2 py-0.5 text-[8px] font-mono font-medium text-slate-300 backdrop-blur whitespace-nowrap", children: img.skill })
          ] }, i);
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { className: "absolute top-[8%] left-[6%] rounded-full bg-emerald-500/20 border border-emerald-500/30 px-3 py-1.5 text-xs font-semibold text-emerald-400 backdrop-blur-sm shadow-[0_0_15px_rgba(16,185,129,0.2)] z-20", animate: {
          y: [0, 8, 0]
        }, transition: {
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.2
        }, children: "94 Hot Lead" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { className: "absolute bottom-[8%] right-[8%] rounded-full bg-indigo-500/20 border border-indigo-500/30 px-3 py-1.5 text-xs font-semibold text-indigo-400 backdrop-blur-sm shadow-[0_0_15px_rgba(99,102,241,0.2)] z-20", animate: {
          y: [0, -8, 0]
        }, transition: {
          duration: 3.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.6
        }, children: "+234 802..." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { className: "absolute top-[50%] right-[0%] rounded-full bg-red-500/20 border border-red-500/30 px-3 py-1.5 text-xs font-semibold text-red-400 backdrop-blur-sm shadow-[0_0_15px_rgba(239,68,68,0.2)] z-20", animate: {
          y: [0, 10, 0]
        }, transition: {
          duration: 4.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }, children: "No website" })
      ] }) })
    ] }) })
  ] });
}
function StatsBar() {
  const stats = [{
    k: "2.4M+",
    v: "Leads Found"
  }, {
    k: "150+",
    v: "Countries"
  }, {
    k: "89%",
    v: "Accuracy"
  }, {
    k: "$0",
    v: "Commission"
  }];
  const [counts, setCounts] = reactExports.useState({
    leads: 0,
    countries: 0,
    accuracy: 0,
    commission: 0
  });
  reactExports.useEffect(() => {
    const timer = setTimeout(() => {
      setCounts({
        leads: 240,
        countries: 150,
        accuracy: 89,
        commission: 0
      });
    }, 100);
    return () => clearTimeout(timer);
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-sidebar/90 backdrop-blur-sm border-b border-sidebar-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-7xl px-4 py-4 lg:px-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap justify-center gap-8 lg:gap-12", children: stats.map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono-data text-2xl font-bold text-primary", children: counts.leads || s.k }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-sidebar-foreground uppercase tracking-wider", children: s.v })
  ] }, s.v)) }) }) });
}
function BlogTeaser() {
  const posts = BLOG_POSTS.slice(0, 3);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "border-y border-border bg-paper py-24", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-4 lg:px-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-end justify-between gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground", children: "From the journal" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-3 font-display text-3xl font-semibold tracking-tight md:text-4xl", children: "Field notes from working freelancers." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-muted-foreground", children: "Real scripts, real numbers, real clients — written by the people doing the work." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/blog", className: "inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold hover:bg-accent", children: [
        "Read the blog ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-12 grid gap-6 md:grid-cols-3", children: posts.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/blog/$slug", params: {
      slug: p.slug
    }, className: "group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition hover:-translate-y-0.5 hover:shadow-card-hover", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: p.cover, alt: p.title, loading: "lazy", className: "aspect-[16/10] w-full object-cover transition duration-500 group-hover:scale-[1.04]" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-1 flex-col p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] font-semibold uppercase tracking-widest text-primary", children: p.category }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-2 font-display text-lg font-semibold leading-snug", children: p.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 line-clamp-2 text-sm text-muted-foreground", children: p.excerpt }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 flex items-center gap-2 border-t border-border pt-4 text-xs text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: p.authorAvatar, alt: p.author, className: "h-6 w-6 rounded-full object-cover" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            p.author,
            " · ",
            p.readMins,
            " min read"
          ] })
        ] })
      ] })
    ] }, p.slug)) })
  ] }) });
}
function LogoStrip() {
  const marks = ["Linear", "Notion", "Stripe", "Vercel", "Framer", "Mercury", "Loom", "Intercom"];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "border-b border-border bg-background py-10", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground", children: "Loved by freelancers serving teams at" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto mt-6 grid max-w-5xl grid-cols-4 items-center gap-y-6 px-4 md:grid-cols-8", children: marks.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-center font-display text-base font-semibold tracking-tight text-foreground/55", children: m }, m)) })
  ] });
}
function ProductShowcase() {
  const leads = [{
    name: "Boulangerie Dupont",
    type: "Bakery",
    city: "Lyon, France",
    rating: 4.9,
    reviews: 412,
    phone: "+33 4 78 24 18 90",
    score: 92,
    tag: "Hot"
  }, {
    name: "Mario's Ristorante",
    type: "Italian restaurant",
    city: "Naples, Italy",
    rating: 4.7,
    reviews: 821,
    phone: "+39 081 552 47 13",
    score: 78,
    tag: "Strong"
  }, {
    name: "Lagos Hair Studio",
    type: "Hair salon",
    city: "Lagos, Nigeria",
    rating: 4.8,
    reviews: 196,
    phone: "+234 803 442 1109",
    score: 71,
    tag: "Strong"
  }];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "relative", style: {
    background: "var(--ink-bg)",
    color: "var(--ink-fg)"
  }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-4 py-24 lg:px-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid items-end gap-6 md:grid-cols-[1.2fr_1fr]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] font-semibold uppercase tracking-[0.2em]", style: {
          color: "var(--ink-muted)"
        }, children: "The dashboard" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-4 font-display text-3xl font-semibold leading-tight tracking-tight md:text-5xl", children: "Every lead, scored and ready to contact." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base leading-relaxed md:text-lg", style: {
        color: "var(--ink-muted)"
      }, children: "Real businesses. Real phone numbers. Real opportunity scores based on whether they have a website, how dated it is, and how visible they are on Google." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-12 overflow-hidden rounded-2xl border", style: {
      borderColor: "var(--ink-border)",
      background: "var(--ink-bg-2)"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between border-b px-5 py-3 text-xs", style: {
        borderColor: "var(--ink-border)",
        color: "var(--ink-muted)"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-2.5 w-2.5 rounded-full bg-red-400/60" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-2.5 w-2.5 rounded-full bg-amber-400/60" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-2.5 w-2.5 rounded-full bg-emerald-400/60" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-3", children: "app.LanceConnect.com / discover" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono-data", children: "3 of 247 leads" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "divide-y", style: {
        borderColor: "var(--ink-border)"
      }, children: leads.map((l) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "grid grid-cols-12 items-center gap-4 px-5 py-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-12 md:col-span-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-10 w-10 place-items-center rounded-lg", style: {
            background: "var(--ink-border)"
          }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "h-4 w-4" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate font-display text-[15px] font-semibold", children: l.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs", style: {
              color: "var(--ink-muted)"
            }, children: l.type })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-6 md:col-span-3 flex items-center gap-1.5 text-sm", style: {
          color: "var(--ink-muted)"
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-3.5 w-3.5" }),
          " ",
          l.city
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-6 md:col-span-2 flex items-center gap-1.5 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-3.5 w-3.5 fill-amber-400 text-amber-400" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono-data", children: l.rating }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: {
            color: "var(--ink-muted)"
          }, children: [
            "(",
            l.reviews,
            ")"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-8 md:col-span-2 font-mono-data text-sm", children: l.phone }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-4 md:col-span-1 flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center gap-1 rounded-full bg-primary/15 px-2.5 py-1 text-xs font-semibold text-primary", children: l.score }) })
      ] }, l.name)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-10 grid gap-6 text-sm md:grid-cols-3", style: {
      color: "var(--ink-muted)"
    }, children: [{
      k: "247",
      v: "leads surfaced this week in Italy alone"
    }, {
      k: "1.8s",
      v: "average time to load 100 scored leads"
    }, {
      k: "34%",
      v: "average reply rate using our templates"
    }].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-l-2 pl-4", style: {
      borderColor: "var(--ink-border)"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-3xl font-semibold text-white", children: s.k }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1", children: s.v })
    ] }, s.k)) })
  ] }) });
}
function HowItWorks() {
  const steps = [{
    icon: Target,
    title: "Pick your skill",
    desc: "Select your freelance category — web dev, design, copywriting, and 7 more."
  }, {
    icon: Map,
    title: "Choose your market",
    desc: "Target any city or country in the world. Filter by industry, size, signals."
  }, {
    icon: ChartLine,
    title: "Discover leads",
    desc: "Get a scored list of businesses that need exactly what you sell."
  }, {
    icon: Mail,
    title: "Reach out",
    desc: "Use ready-made templates — or our AI writer — to contact them in seconds."
  }];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { id: "how", className: "mx-auto max-w-7xl px-4 py-24 lg:px-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-2xl text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-3xl font-semibold tracking-tight md:text-4xl", children: "From zero to outreach in minutes" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-muted-foreground", children: "A simple workflow built around how freelancers actually find clients." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mt-14 grid gap-6 md:grid-cols-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute left-0 right-0 top-7 hidden h-px bg-border md:block" }),
      steps.map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative rounded-2xl border border-border bg-card p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-4 grid h-14 w-14 place-items-center rounded-xl bg-foreground text-background", children: /* @__PURE__ */ jsxRuntimeExports.jsx(s.icon, { className: "h-6 w-6" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono-data text-xs text-muted-foreground", children: [
          "STEP ",
          i + 1
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-1 font-display text-lg font-semibold", children: s.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm leading-relaxed text-muted-foreground", children: s.desc })
      ] }, s.title))
    ] })
  ] });
}
const AiOutreachFooter = () => {
  const [tone, setTone] = reactExports.useState("casual");
  const messages = {
    casual: "Hey Mario, saw your pizza spot has no site...",
    professional: "Dear Mario, I noticed Mario's Ristorante does not currently have a web presence...",
    bold: "Hey Mario, why doesn't Mario's Ristorante have a website yet? Your competitors in Naples are..."
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2 w-full mt-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between bg-[#080B14] p-1 rounded-lg border border-border/80", children: ["casual", "professional", "bold"].map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: (e) => {
      e.stopPropagation();
      setTone(t);
    }, className: `text-[9px] font-mono px-2 py-0.5 rounded transition-all capitalize flex-1 text-center ${tone === t ? "bg-primary text-white shadow-sm font-semibold" : "text-slate-400 hover:text-white hover:bg-slate-800/45"}`, children: t }, t)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full bg-[#080B14] border border-border rounded-xl p-2.5 font-mono text-[9px] text-slate-400 h-[60px] overflow-hidden select-none", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center text-[#64748B] mb-0.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "// Generated intro" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[8px] bg-primary/20 text-primary px-1 rounded uppercase tracking-wider font-semibold", children: "Active" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(motion.p, { initial: {
        opacity: 0,
        y: 3
      }, animate: {
        opacity: 1,
        y: 0
      }, exit: {
        opacity: 0,
        y: -3
      }, className: "mt-0.5 text-primary leading-tight font-medium", children: messages[tone] }, tone)
    ] })
  ] });
};
const getMockLeads = (craft, city) => {
  const leads = [{
    id: 1,
    name: `${city} Gourmet Kitchen`,
    type: "Restaurant & Catering",
    score: 94,
    issues: craft === "web" ? ["No website", "Only Facebook page link"] : craft === "design" ? ["Outdated 2012 layout", "Cluttered booking form"] : craft === "seo" ? ["Not visible on local search", "Missing Google Business profile reviews"] : ["No video presence", "Outdated food gallery"],
    phone: "+1 555-832-1920",
    email: `contact@${city.toLowerCase().replace(" ", "")}gourmet.com`,
    subject: craft === "web" ? `Website inquiry for ${city} Gourmet Kitchen` : craft === "design" ? `Branding update - ${city} Gourmet Kitchen` : craft === "seo" ? `Google visibility boost for ${city} Gourmet Kitchen` : `Promo video concepts for ${city} Gourmet Kitchen`,
    draft: craft === "web" ? `Hi Chef,

I love your menu but noticed customers can't order directly online. I'd love to build a quick, high-converting checkout site for you.

Best,
[Your Name]` : craft === "design" ? `Hello,

I love the dining vibe at Gourmet Kitchen! I noticed your online logo and branding could use a premium refresh to match that feel.

Best,
[Your Name]` : craft === "seo" ? `Hi Team,

I searched for restaurants in ${city} and couldn't find your kitchen on the first page. Let's optimize your profile to pull in more local customers.

Best,
[Your Name]` : `Hi Chef,

I saw your gorgeous dishes on Instagram. I can create a professional 30-second promo reel to drive reservations.

Best,
[Your Name]`
  }, {
    id: 2,
    name: `${city} Dental Care`,
    type: "Medical Practice",
    score: 87,
    issues: craft === "web" ? ["Non-responsive on mobile", "Broken appointment button"] : craft === "design" ? ["Stock-photo heavy landing page", "Hard to read fonts"] : craft === "seo" ? ["High competitor ranking", "No local schema mapping"] : ["Missing patient walkthrough video", "No video introduction"],
    phone: "+1 555-401-3829",
    email: `office@${city.toLowerCase().replace(" ", "")}dentalcare.com`,
    subject: craft === "web" ? `Mobile booking issue on your site` : craft === "design" ? `Modern UI facelift for ${city} Dental` : craft === "seo" ? `Patients can't find you on Google` : `Patient testimonial videos for ${city} Dental`,
    draft: craft === "web" ? `Hi Dr.,

I tried booking an appointment on my phone and the layout was cut off. I can fix this responsiveness issue so you don't lose patients.

Best,
[Your Name]` : craft === "design" ? `Dear Practice Manager,

I noticed your website uses standard stock photos. A custom illustrated interface would build much higher trust with patients.

Best,
[Your Name]` : craft === "seo" ? `Hello Dr.,

Your competitors are ranking above you for 'dentist in ${city}'. I can optimize your site structure to get you to #1.

Best,
[Your Name]` : `Dear Practice Manager,

We can film and edit 3 high-impact patient video testimonials to put on your home page to build instant trust.

Best,
[Your Name]`
  }, {
    id: 3,
    name: `${city} Auto Body`,
    type: "Car Service",
    score: 79,
    issues: craft === "web" ? ["Slow load speed (8.4s)", "Outdated HTML template"] : craft === "design" ? ["Unstructured service pricing table", "Low contrast buttons"] : craft === "seo" ? ["No Google Reviews linkage", "Low speed indexing penalty"] : ["No video gallery showing repairs", "Missing TikTok/Reels presence"],
    phone: "+1 555-901-7261",
    email: `info@${city.toLowerCase().replace(" ", "")}autobody.com`,
    subject: craft === "web" ? `Website loading speeds at ${city} Auto` : craft === "design" ? `UI revamp for your repair list` : craft === "seo" ? `Rankings check for local auto body repairs` : `Reels & Shorts promo for ${city} Auto`,
    draft: craft === "web" ? `Hi Manager,

Your page takes over 8 seconds to load, which causes visitors to leave. Let's rebuild a lightweight, lightning-fast static site.

Best,
[Your Name]` : craft === "design" ? `Hello,

Your services page is a bit hard to scan on mobile. I designed a cleaner table that makes it easy for clients to request quotes.

Best,
[Your Name]` : craft === "seo" ? `Hi Team,

I saw your business lacks backlinks from local directories. I can manage a citation campaign to raise your authority score.

Best,
[Your Name]` : `Hi Manager,

Let's capture high-quality 'before/after' transformation reels of your paint/dent jobs to build a massive TikTok following.

Best,
[Your Name]`
  }];
  return leads;
};
const FEATURES_LIST = [{
  id: 1,
  icon: Earth,
  title: "Global Lead Discovery",
  desc: "Find any business in any street in 150+ countries. Get access to verified pipelines of clients in seconds.",
  gridClass: "lg:col-start-1 lg:row-start-1 lg:col-span-1",
  connector: () => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-1/2 -right-3 w-6 h-0.5 border-t border-dashed border-primary/45 -translate-y-1/2 lg:block hidden z-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute top-[-2.5px] h-1.5 w-1.5 rounded-full bg-secondary shadow-[0_0_8px_var(--color-secondary)] animate-slide-right" }) }),
  footer: () => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 border-t border-border/60 pt-4 font-mono text-xs text-[#64748B] w-full", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Leads indexed" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white font-semibold", children: "2.4M+" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Countries covered" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white font-semibold", children: "150+" })
    ] })
  ] })
}, {
  id: 2,
  icon: ChartColumn,
  title: "Opportunity Scoring",
  desc: "0–100 scores based on how badly they need what you sell. Hot leads float to the top.",
  gridClass: "lg:col-start-2 lg:row-start-1 lg:col-span-1",
  connector: () => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-1/2 -right-3 w-6 h-0.5 border-t border-dashed border-primary/45 -translate-y-1/2 lg:block hidden z-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute top-[-2.5px] h-1.5 w-1.5 rounded-full bg-secondary shadow-[0_0_8px_var(--color-secondary)] animate-slide-right" }) }),
  footer: () => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 mt-4 w-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full bg-emerald-500/20 px-2.5 py-1 text-xs font-semibold text-emerald-400", children: "94 Hot Lead" }) })
}, {
  id: 3,
  icon: Phone,
  title: "Verified Contacts",
  desc: "Phone numbers, emails, and direct WhatsApp links copy-ready right next to every lead.",
  gridClass: "lg:col-start-3 lg:row-start-1 lg:col-span-1",
  connector: () => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute left-1/2 -bottom-3 w-0.5 h-6 border-l border-dashed border-primary/45 -translate-x-1/2 lg:block hidden z-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-[-2.5px] h-1.5 w-1.5 rounded-full bg-secondary shadow-[0_0_8px_var(--color-secondary)] animate-slide-down" }) }),
  footer: () => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-4 font-mono text-[10px] text-slate-400 bg-[#080B14] border border-border px-3 py-1.5 rounded-lg w-full justify-between", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "+234 802..." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-emerald-500 font-semibold", children: "✓ Verified" })
  ] })
}, {
  id: 4,
  icon: Sparkles,
  title: "AI Outreach (Pro)",
  desc: "Claude-powered personalized messages for every lead. Generates email, phone script, LinkedIn DM in seconds.",
  gridClass: "lg:col-start-3 lg:row-start-2 lg:col-span-1",
  connector: () => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-1/2 -left-3 w-6 h-0.5 border-t border-dashed border-primary/45 -translate-y-1/2 lg:block hidden z-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute top-[-2.5px] h-1.5 w-1.5 rounded-full bg-secondary shadow-[0_0_8px_var(--color-secondary)] animate-slide-left" }) }),
  footer: AiOutreachFooter
}, {
  id: 5,
  icon: Bookmark,
  title: "CRM Pipeline",
  desc: "Track leads from saved to won without complex CRM bloat. Simple, clean, and fast.",
  gridClass: "lg:col-start-2 lg:row-start-2 lg:col-span-1",
  connector: () => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-1/2 -left-3 w-6 h-0.5 border-t border-dashed border-primary/45 -translate-y-1/2 lg:block hidden z-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute top-[-2.5px] h-1.5 w-1.5 rounded-full bg-secondary shadow-[0_0_8px_var(--color-secondary)] animate-slide-left" }) }),
  footer: () => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1.5 mt-4 w-full", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300", children: "New" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] px-2 py-0.5 rounded-full bg-blue-900/30 text-blue-400 border border-blue-500/20", children: "Contacted" })
  ] })
}, {
  id: 6,
  icon: Globe,
  title: "Online Opportunities",
  desc: "LinkedIn, Indeed, Reddit remote opportunities consolidated for remote freelancers.",
  gridClass: "lg:col-start-1 lg:row-start-2 lg:col-span-1",
  connector: () => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute left-1/2 -bottom-3 w-0.5 h-6 border-l border-dashed border-primary/45 -translate-x-1/2 lg:block hidden z-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-[-2.5px] h-1.5 w-1.5 rounded-full bg-secondary shadow-[0_0_8px_var(--color-secondary)] animate-slide-down" }) }),
  footer: () => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-mono text-purple-400 bg-purple-500/10 px-2 py-1.5 rounded border border-purple-500/20 mt-4 text-center block w-full", children: "Remote channels auto-scraped" })
}, {
  id: 7,
  icon: Users,
  title: "All Freelancer Skills Covered",
  desc: "Whether you build websites, write copy, design brands, manage socials, edit video, or handle virtual tasks, we have custom opportunity models for you.",
  gridClass: "lg:col-start-1 lg:row-start-3 lg:col-span-3 lg:w-full lg:max-w-none",
  connector: () => null,
  footer: () => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5 mt-4 text-[9px] font-mono text-[#CBD5E1] w-full", children: ["Web Dev", "Design", "SEO", "Copywriting", "Video", "Photo", "VA", "Marketing", "App Dev"].map((tag) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-2 py-0.5 rounded bg-[#080B14] border border-border", children: tag }, tag)) })
}];
function Features() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { id: "features", className: "border-y border-border bg-[#0F172A]/30 py-24 select-none", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-4 lg:px-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-2xl text-center mb-16", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-mono text-[#64748B] mb-2 tracking-widest uppercase", children: "// what.we.give.you" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-4xl font-extrabold text-white", children: "Everything you need to get clients" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-slate-400", children: "No bloat. Just the tools freelancers actually use to win work." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden lg:grid gap-6 lg:grid-cols-3 auto-rows-[280px] relative z-10", children: FEATURES_LIST.map((card) => {
      const Icon = card.icon;
      const FooterComponent = card.footer;
      const ConnectorComponent = card.connector;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `relative rounded-2xl border border-border bg-[#0F172A]/80 p-6 shadow-card flex flex-col justify-between group hover:border-[#6366F1]/30 transition duration-300 z-10 ${card.gridClass}`, children: [
        card.id === 7 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-8 w-full h-full text-left", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "inline-grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary mb-3 group-hover:bg-primary group-hover:text-primary-foreground transition duration-300", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-5 w-5" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-base font-bold text-white mb-1.5", children: card.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-slate-400 leading-relaxed", children: card.desc })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 max-w-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FooterComponent, {}) })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "inline-grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary mb-3 group-hover:bg-primary group-hover:text-primary-foreground transition duration-300", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-5 w-5" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-base font-bold text-white mb-1.5", children: card.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-slate-400 leading-relaxed line-clamp-3", children: card.desc })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(FooterComponent, {})
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ConnectorComponent, {})
      ] }, card.id);
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:hidden relative w-full overflow-hidden py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-6 animate-ticker w-max hover:[animation-play-state:paused] cursor-pointer", children: [
      FEATURES_LIST.map((card) => {
        const Icon = card.icon;
        const FooterComponent = card.footer;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-[280px] shrink-0 rounded-2xl border border-border bg-[#0F172A]/80 p-6 shadow-card flex flex-col justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "inline-grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary mb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-5 w-5" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-base font-bold text-white mb-1.5", children: card.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-slate-400 leading-relaxed line-clamp-3", children: card.desc })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FooterComponent, {}) })
        ] }, `m1-${card.id}`);
      }),
      FEATURES_LIST.map((card) => {
        const Icon = card.icon;
        const FooterComponent = card.footer;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-[280px] shrink-0 rounded-2xl border border-border bg-[#0F172A]/80 p-6 shadow-card flex flex-col justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "inline-grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary mb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-5 w-5" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-base font-bold text-white mb-1.5", children: card.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-slate-400 leading-relaxed line-clamp-3", children: card.desc })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FooterComponent, {}) })
        ] }, `m2-${card.id}`);
      })
    ] }) })
  ] }) });
}
function LeadScannerSandbox() {
  const [craft, setCraft] = reactExports.useState("web");
  const [city, setCity] = reactExports.useState("London");
  const [isScanning, setIsScanning] = reactExports.useState(false);
  const [scanProgress, setScanProgress] = reactExports.useState(0);
  const [terminalLogs, setTerminalLogs] = reactExports.useState([]);
  const [scanComplete, setScanComplete] = reactExports.useState(false);
  const [copiedId, setCopiedId] = reactExports.useState(null);
  const [leads, setLeads] = reactExports.useState([]);
  const {
    t
  } = usePreferences();
  const handleDraftChange = (id, text) => {
    setLeads((prev) => prev.map((l) => l.id === id ? {
      ...l,
      draft: text
    } : l));
  };
  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2e3);
  };
  const startScan = () => {
    setIsScanning(true);
    setScanComplete(false);
    setScanProgress(0);
    setTerminalLogs([]);
    const logSequence = [`[INFO] Initializing LanceConnect engine...`, `[INFO] Target: ${craft.toUpperCase()} opportunities in ${city}...`, `[INFO] Fetching regional business directories...`, `[SCAN] Scraping active website meta tags & schema...`, `[MODEL] Analyzing mobile speed & Core Web Vitals...`, `[AI] Ranking target list by opportunity potential...`, `[SUCCESS] Analysis complete. 3 hot leads found!`];
    let currentLogIndex = 0;
    const interval = setInterval(() => {
      setScanProgress((prev) => {
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
          setTerminalLogs((logs) => [...logs, logSequence[currentLogIndex]]);
          currentLogIndex++;
        }
        return prev + 10;
      });
    }, 150);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { id: "sandbox", className: "border-b border-border bg-[#080B14] py-24 select-none", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-4 lg:px-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-3xl text-center mb-16", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-mono text-[#64748B] mb-2 tracking-widest uppercase", children: t("sandbox_eyebrow") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-4xl font-extrabold text-white", children: t("sandbox_title") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-slate-400", children: t("sandbox_sub") })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-8 lg:grid-cols-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-5 bg-[#0F172A]/80 border border-border rounded-2xl p-6 flex flex-col justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-mono text-[#64748B] uppercase tracking-wider block mb-3", children: t("sandbox_step_1") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2.5", children: [{
              id: "web",
              label: "Web Developer",
              icon: CodeXml
            }, {
              id: "design",
              label: "Designer",
              icon: Palette
            }, {
              id: "seo",
              label: "SEO Specialist",
              icon: ChartLine
            }, {
              id: "video",
              label: "Video Producer",
              icon: Play
            }].map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setCraft(item.id), className: `flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all ${craft === item.id ? "border-primary bg-primary/10 text-white font-semibold shadow-[0_0_15px_rgba(99,102,241,0.15)]" : "border-border/60 bg-[#080B14] text-slate-400 hover:text-white hover:border-border"}`, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(item.icon, { className: "h-4.5 w-4.5 text-primary shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs", children: item.label })
            ] }, item.id)) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-mono text-[#64748B] uppercase tracking-wider block mb-3", children: t("sandbox_step_2") }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: city, onChange: (e) => setCity(e.target.value), className: "w-full bg-[#080B14] border border-border/80 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-primary appearance-none cursor-pointer", children: ["London", "Lagos", "São Paulo", "Tokyo", "Buenos Aires"].map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: c, className: "bg-[#080B14] text-white", children: c }, c)) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400", children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "fill-current h-4 w-4", xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 20 20", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" }) }) })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: startScan, disabled: isScanning, className: `w-full relative overflow-hidden flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 text-sm font-semibold text-white shadow-lg transition-all duration-300 ${isScanning ? "opacity-85 cursor-not-allowed" : "hover:bg-primary/90 hover:scale-[1.01] hover:shadow-primary/25"}`, children: isScanning ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin text-white" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t("sandbox_running") })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-4 w-4 text-white animate-pulse" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t("sandbox_run") })
        ] }) }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-7 bg-[#0F172A]/40 border border-border rounded-2xl min-h-[420px] overflow-hidden flex flex-col", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-[#0F172A] border-b border-border/80 px-4 py-3 flex items-center justify-between text-xs text-slate-400", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-2 w-2 rounded-full bg-red-500/60" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-2 w-2 rounded-full bg-yellow-500/60" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-2 w-2 rounded-full bg-emerald-500/60" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono ml-2 text-[10px] text-slate-500", children: "console_output.sh" })
          ] }),
          scanComplete && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 text-[10px] font-mono text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1 w-1 bg-emerald-500 rounded-full animate-ping" }),
            "Live Leads Generated"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 p-6 flex flex-col justify-center", children: [
          !isScanning && !scanComplete && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center max-w-sm mx-auto space-y-4 py-8", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 w-12 rounded-2xl bg-[#0F172A]/80 border border-border/80 flex items-center justify-center mx-auto shadow-md", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "h-5 w-5 text-slate-400" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-sm font-semibold text-white", children: t("sandbox_ready_title") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-400 mt-1", children: t("sandbox_ready_desc") })
            ] })
          ] }),
          isScanning && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 flex-1 flex flex-col justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative h-28 flex items-center justify-center overflow-hidden", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute h-24 w-24 rounded-full border border-primary/20 flex items-center justify-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute h-16 w-16 rounded-full border border-primary/30" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute h-8 w-8 rounded-full border border-primary/45" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 border-t-2 border-primary rounded-full animate-spin", style: {
                  animationDuration: "1.2s"
                } })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 w-2 rounded-full bg-primary animate-ping" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-[#080B14] rounded-xl border border-border/80 p-4 font-mono text-[10px] text-slate-400 space-y-1.5 max-h-[140px] overflow-y-auto flex-1 flex flex-col justify-end", children: [
              terminalLogs.map((log, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary font-bold", children: `>` }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: log.includes("[SUCCESS]") ? "text-emerald-400 font-semibold" : log.includes("[SCAN]") ? "text-yellow-400" : "text-slate-300", children: log })
              ] }, idx)),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-primary mt-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3 w-3 animate-spin" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  "Scraping ",
                  scanProgress,
                  "%..."
                ] })
              ] })
            ] })
          ] }),
          scanComplete && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: leads.map((l) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-[#080B14]/80 border border-border/80 hover:border-primary/40 rounded-xl p-4 transition-all duration-300 flex flex-col gap-3 group", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-display text-sm font-bold text-white leading-tight", children: l.name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-0.5 rounded-full bg-primary/10 px-1.5 py-0.5 text-[9px] font-mono font-semibold text-primary", children: [
                    l.score,
                    " Match"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-slate-500 font-mono mt-0.5 block", children: [
                  l.type,
                  " · ",
                  city
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5 justify-end", children: l.issues.map((issue, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded-[4px] text-[8px] font-mono", children: [
                "⚠ ",
                issue
              ] }, idx)) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-[#0F172A] border border-border/60 rounded-lg p-2.5 flex flex-col gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center text-[9px] text-slate-400 font-mono", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  "Subject: ",
                  l.subject
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleCopy(l.id, `Subject: ${l.subject}

${l.draft}`), className: "flex items-center gap-1 hover:text-white transition duration-200", children: copiedId === l.id ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3 w-3 text-emerald-400" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-emerald-400", children: "Copied!" })
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "h-3 w-3" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Copy Template" })
                ] }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { value: l.draft, onChange: (e) => handleDraftChange(l.id, e.target.value), className: "bg-transparent border-0 font-mono text-[9px] text-slate-300 resize-none h-16 focus:outline-none focus:ring-0 leading-relaxed scrollbar-thin scrollbar-thumb-border" })
            ] })
          ] }, l.id)) })
        ] })
      ] })
    ] })
  ] }) });
}
function GlobalReach() {
  const cities = [{
    name: "Lagos",
    x: "50%",
    y: "58%",
    delay: 0
  }, {
    name: "London",
    x: "47%",
    y: "30%",
    delay: 0.3
  }, {
    name: "Mumbai",
    x: "68%",
    y: "50%",
    delay: 0.6
  }, {
    name: "New York",
    x: "30%",
    y: "36%",
    delay: 0.9
  }, {
    name: "São Paulo",
    x: "38%",
    y: "74%",
    delay: 1.2
  }, {
    name: "Tokyo",
    x: "83%",
    y: "40%",
    delay: 1.5
  }, {
    name: "Dubai",
    x: "60%",
    y: "45%",
    delay: 1.8
  }];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "relative overflow-hidden border-t border-border bg-[#080B14] py-16 select-none", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-7xl px-4 lg:px-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-8 lg:grid-cols-12 lg:items-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-mono text-[#64748B] mb-2 tracking-widest uppercase", children: "// we.are.everywhere" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display text-3xl font-extrabold text-white tracking-tight leading-tight", children: [
        "Freelancers in every country.",
        /* @__PURE__ */ jsxRuntimeExports.jsx("br", { className: "hidden sm:inline" }),
        " Leads in every city."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-sm text-slate-400 leading-relaxed max-w-md", children: "A truly global ecosystem matching local clients with global freelance talent. We scan 150+ countries in real-time." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 flex flex-wrap gap-2", children: cities.map((city) => /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 rounded-full bg-[#0F172A] border border-border px-3 py-1 text-xs text-slate-300 font-mono", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" }),
        city.name
      ] }, city.name)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:col-span-7", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mx-auto w-full h-[280px] md:h-[320px] border border-border bg-[#0F172A]/20 rounded-2xl overflow-hidden shadow-2xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-dot-pattern opacity-45" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { className: "absolute inset-0 w-full h-full text-slate-800/40", xmlns: "http://www.w3.org/2000/svg", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "0", y1: "50%", x2: "100%", y2: "50%", stroke: "currentColor", strokeWidth: "0.5", strokeDasharray: "4 4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "50%", y1: "0", x2: "50%", y2: "100%", stroke: "currentColor", strokeWidth: "0.5", strokeDasharray: "4 4" })
      ] }),
      cities.map((city, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute group", style: {
        top: city.y,
        left: city.x
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute inline-flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 animate-ping", style: {
          animationDelay: `${city.delay}s`,
          animationDuration: "3s"
        } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute inline-flex h-4.5 w-4.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/45 animate-pulse" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-secondary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-slate-950 border border-slate-800 rounded-lg py-1 px-2.5 text-[10px] font-mono font-medium text-white shadow-xl whitespace-nowrap", children: [
          city.name,
          " Hub"
        ] }) })
      ] }, city.name)),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-4 left-4 bg-slate-950/90 border border-slate-800/80 rounded-full px-4 py-1.5 text-[10px] text-slate-300 font-mono flex items-center gap-2 backdrop-blur shadow-2xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Scanning 150+ countries in real-time" })
      ] })
    ] }) })
  ] }) }) });
}
const CATEGORY_ICONS = {
  web_dev: CodeXml,
  designer: Palette,
  copywriter: PenTool,
  seo: ChartLine,
  social_media: Smartphone,
  video: Film,
  photography: Camera,
  marketing: Megaphone,
  app_dev: AppWindow,
  va: Handshake
};
function WhoFor() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mx-auto max-w-7xl px-4 py-24 lg:px-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-2xl text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-3xl font-semibold tracking-tight md:text-4xl", children: "Built for every freelancer" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-muted-foreground", children: "Whatever skill you sell, we'll help you find businesses that need it." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-5", children: CATEGORIES.map((c) => {
      const Icon = CATEGORY_ICONS[c.id] || Sparkles;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/freelancers/$slug", params: {
        slug: categorySlug(c.id)
      }, className: "group rounded-xl border border-border bg-card p-5 transition hover:border-foreground/30", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-primary h-8 w-8 flex items-center justify-center rounded-lg bg-primary/10 border border-primary/20 transition group-hover:bg-primary/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4.5 w-4.5 text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 font-display text-sm font-semibold text-white", children: c.label }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1.5 text-xs leading-relaxed text-muted-foreground", children: c.example }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary opacity-0 transition group-hover:opacity-100", children: [
          "See leads ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-3 w-3" })
        ] })
      ] }, c.id);
    }) })
  ] });
}
function categorySlug(id) {
  const map = {
    web_dev: "web-developers",
    designer: "designers",
    copywriter: "copywriters",
    seo: "seo-specialists",
    social_media: "social-media",
    video: "videographers",
    photography: "photographers",
    marketing: "marketers",
    app_dev: "app-developers",
    va: "virtual-assistants"
  };
  return map[id] ?? id;
}
function Testimonials() {
  const items = [{
    quote: "I found 3 new clients in my first week. The opportunity scoring tells me exactly which businesses to call first.",
    name: "Taiwo Adeyemi",
    role: "Web Developer",
    city: "Lagos, Nigeria",
    avatar: IMG.face1
  }, {
    quote: "As a copywriter, I never knew how to find leads. Now I have a full pipeline every Monday morning.",
    name: "Maria Silva",
    role: "Copywriter",
    city: "São Paulo, Brazil",
    avatar: IMG.face2
  }, {
    quote: "The phone scripts are gold. I went from zero cold calls to booking 2 meetings a day.",
    name: "James Kariuki",
    role: "SEO Specialist",
    city: "Nairobi, Kenya",
    avatar: IMG.face3
  }];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "border-t border-border bg-background py-24", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-4 lg:px-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-2xl text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground", children: "Customer stories" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-3 font-display text-3xl font-semibold tracking-tight md:text-4xl", children: "Freelancers in 50+ countries trust us" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-14 grid gap-6 md:grid-cols-3", children: items.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs("figure", { className: "flex flex-col overflow-hidden rounded-2xl border border-border bg-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: t.avatar, alt: t.name, className: "aspect-[4/3] w-full object-cover", loading: "lazy" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-1 flex-col p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-3 flex gap-0.5 text-amber-500", children: Array.from({
          length: 5
        }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-4 w-4 fill-current" }, i)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("blockquote", { className: "text-sm leading-relaxed text-foreground/90", children: [
          '"',
          t.quote,
          '"'
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("figcaption", { className: "mt-5 border-t border-border pt-4 text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground", children: t.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground", children: [
            t.role,
            " · ",
            t.city
          ] })
        ] })
      ] })
    ] }, t.name)) })
  ] }) });
}
function Pricing() {
  const {
    t,
    formatPrice,
    getCurrencySymbol
  } = usePreferences();
  const plans = [{
    name: t("plan_free"),
    price: 0,
    leads: "10",
    popular: false,
    cta: t("plan_cta_free"),
    features: [t("plan_free_feature_1"), t("plan_free_feature_2"), t("plan_free_feature_3")]
  }, {
    name: t("plan_individual"),
    price: 5,
    leads: "200",
    popular: true,
    cta: t("plan_cta_ind"),
    features: [t("plan_ind_feature_1"), t("plan_ind_feature_2"), t("plan_ind_feature_3"), t("plan_ind_feature_4"), t("plan_ind_feature_5")]
  }, {
    name: t("plan_company"),
    price: 20,
    leads: "Unlimited",
    popular: false,
    cta: t("plan_cta_comp"),
    features: [t("plan_comp_feature_1"), t("plan_comp_feature_2"), t("plan_comp_feature_3"), t("plan_comp_feature_4"), t("plan_comp_feature_5")]
  }];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { id: "pricing", className: "border-y border-border bg-[#0F172A]/30 py-24", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-4 lg:px-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-2xl text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-mono text-[#64748B] mb-2 tracking-widest uppercase", children: "// simple.pricing" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-4xl font-extrabold text-white tracking-tight", children: t("pricing_title") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-slate-400", children: t("pricing_sub") })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto", children: plans.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `relative rounded-2xl border bg-[#0F172A]/80 p-7 ${p.popular ? "border-primary shadow-[0_0_25px_rgba(99,102,241,0.2)] lg:-translate-y-3" : "border-border"}`, children: [
      p.popular && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white", children: "Most Popular" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-widest text-[#64748B]", children: p.name }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex items-baseline gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-display text-4xl font-extrabold text-white", children: [
          getCurrencySymbol(),
          formatPrice(p.price)
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-[#64748B]", children: t("plan_mo") })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-2 font-mono-data text-xs text-primary", children: [
        p.leads === "Unlimited" ? "Unlimited" : p.leads,
        " ",
        t("plan_leads_mo")
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-6 space-y-2.5 text-xs text-slate-300", children: p.features.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "mt-0.5 h-3.5 w-3.5 shrink-0 text-success" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: f })
      ] }, f)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/register", className: `mt-7 block rounded-lg py-2.5 text-center text-sm font-semibold transition ${p.popular ? "bg-primary text-white hover:bg-primary/95" : "border border-border bg-[#080B14] text-slate-300 hover:bg-accent"}`, children: p.cta })
    ] }, p.name)) })
  ] }) });
}
function CTA() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "px-4 py-20 lg:px-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-6xl overflow-hidden rounded-3xl p-14 text-center", style: {
    background: "var(--ink-bg)",
    color: "var(--ink-fg)"
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-3xl font-semibold tracking-tight md:text-5xl", children: "Start finding clients today" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mx-auto mt-4 max-w-xl text-base", style: {
      color: "var(--ink-muted)"
    }, children: "Join thousands of freelancers who've stopped waiting for work to come to them." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 flex flex-wrap items-center justify-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/register", className: "inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-white/90", children: [
        "Create free account ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/pricing", className: "inline-flex items-center gap-2 rounded-xl border px-6 py-3 text-sm font-semibold text-white hover:bg-white/10", style: {
        borderColor: "var(--ink-border)"
      }, children: "See pricing" })
    ] })
  ] }) });
}
function Stats() {
  const stats = [{
    k: "150+",
    v: "Countries covered"
  }, {
    k: "240k",
    v: "Businesses scored monthly"
  }, {
    k: "34%",
    v: "Average reply rate"
  }, {
    k: "4.8/5",
    v: "Customer satisfaction"
  }];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "relative overflow-hidden border-y border-border", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: IMG.team, alt: "", className: "h-full w-full object-cover" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-[color:var(--ink-bg)]/85" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mx-auto max-w-7xl px-4 py-20 lg:px-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-2xl text-center text-white", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] font-semibold uppercase tracking-[0.2em] text-white/70", children: "By the numbers" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-3 font-display text-3xl font-semibold tracking-tight md:text-4xl", children: "A real product, with real traction." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4", children: stats.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-4xl font-semibold text-white md:text-5xl", children: s.k }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-white/75", children: s.v })
      ] }, s.k)) })
    ] })
  ] });
}
function FAQ() {
  const faqs = [{
    q: "How is LanceConnect different from a job board?",
    a: "Job boards wait for clients to post. We do the opposite — we surface businesses who don't yet know they need you, and give you their contact details so you can reach out first."
  }, {
    q: "Do I need any sales experience?",
    a: "No. Every lead comes with a ready-made outreach template tuned to your skill — email, phone script, and DM. Pro adds an AI writer that personalises each message."
  }, {
    q: "Which countries do you cover?",
    a: "150+ countries. We have especially strong coverage of Nigeria, Italy, India, UK, France, Argentina, Malaysia, and Canada, with daily refreshed data."
  }, {
    q: "What if I don't find any leads?",
    a: "Every plan includes a 'no leads, no charge' guarantee in your first month. If your first 10 leads aren't useful, we refund you in full."
  }, {
    q: "Can I cancel anytime?",
    a: "Yes. No contracts. Cancel from your dashboard in one click. You keep access until the end of your billing period."
  }, {
    q: "Is my data private?",
    a: "Absolutely. We never share your account info, your saved leads, or your outreach history with anyone. Read our Privacy Policy for full details."
  }];
  const [open, setOpen] = reactExports.useState(0);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mx-auto max-w-4xl px-4 py-24 lg:px-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-2xl text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground", children: "FAQ" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-3 font-display text-3xl font-semibold tracking-tight md:text-4xl", children: "Questions, answered honestly" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-3 text-muted-foreground", children: [
        "Still curious? ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/contact", className: "text-primary underline-offset-4 hover:underline", children: "Talk to a human" }),
        "."
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-12 divide-y divide-border rounded-2xl border border-border bg-card", children: faqs.map((f, i) => {
      const isOpen = open === i;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setOpen(isOpen ? null : i), className: "flex w-full items-center justify-between gap-4 px-6 py-5 text-left", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-base font-semibold md:text-lg", children: f.q }),
          isOpen ? /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, { className: "h-4 w-4 shrink-0 text-muted-foreground" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4 shrink-0 text-muted-foreground" })
        ] }),
        isOpen && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-6 pb-6 text-sm leading-relaxed text-muted-foreground animate-fade-in", children: f.a })
      ] }, f.q);
    }) })
  ] });
}
const SplitComponent = () => /* @__PURE__ */ jsxRuntimeExports.jsxs(MarketingShell, { children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx(HeroWithMosaic, {}),
  /* @__PURE__ */ jsxRuntimeExports.jsx(StatsBar, {}),
  /* @__PURE__ */ jsxRuntimeExports.jsx(LogoStrip, {}),
  /* @__PURE__ */ jsxRuntimeExports.jsx(HeroCarousel, {}),
  /* @__PURE__ */ jsxRuntimeExports.jsx(ProductShowcase, {}),
  /* @__PURE__ */ jsxRuntimeExports.jsx(Stats, {}),
  /* @__PURE__ */ jsxRuntimeExports.jsx(HowItWorks, {}),
  /* @__PURE__ */ jsxRuntimeExports.jsx(Features, {}),
  /* @__PURE__ */ jsxRuntimeExports.jsx(LeadScannerSandbox, {}),
  /* @__PURE__ */ jsxRuntimeExports.jsx(GlobalReach, {}),
  /* @__PURE__ */ jsxRuntimeExports.jsx(WhoFor, {}),
  /* @__PURE__ */ jsxRuntimeExports.jsx(Testimonials, {}),
  /* @__PURE__ */ jsxRuntimeExports.jsx(Pricing, {}),
  /* @__PURE__ */ jsxRuntimeExports.jsx(BlogTeaser, {}),
  /* @__PURE__ */ jsxRuntimeExports.jsx(FAQ, {}),
  /* @__PURE__ */ jsxRuntimeExports.jsx(CTA, {})
] });
export {
  SplitComponent as component
};
