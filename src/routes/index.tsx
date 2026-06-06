import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";
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
} from "lucide-react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { HeroCarousel } from "@/components/marketing/HeroCarousel";
import { CATEGORIES } from "@/data/mockData";
import { IMG, BLOG_POSTS } from "@/data/content";
import { usePreferences } from "@/contexts/PreferencesContext";
import useEmblaCarousel from "embla-carousel-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LanceConnect — The Meeting Point for Freelancers and Clients" },
      {
        name: "description",
        content:
          "LanceConnect finds businesses that need your skills anywhere in the world, and hands you their contact details.",
      },
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
      <Pricing />
      <BlogTeaser />
      <FAQ />
      <CTA />
    </MarketingShell>
  ),
});
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

const MapVisual = () => (
  <div className="relative w-full h-full flex items-center justify-center bg-transparent overflow-hidden">
    <div className="absolute inset-0 bg-dot-pattern opacity-35 dark:opacity-45" />
    <div className="absolute w-[180px] h-[180px] rounded-full border border-blue-500/20 flex items-center justify-center animate-ping duration-[4s] pointer-events-none" />
    <div className="absolute w-[280px] h-[280px] rounded-full border border-blue-500/10 flex items-center justify-center animate-ping duration-[6s] pointer-events-none" />

    <motion.div
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      className="absolute top-[20%] left-[28%] flex flex-col items-center"
    >
      <MapPin className="h-5 w-5 text-red-500 fill-red-500/30 drop-shadow-md" />
      <span className="bg-slate-950 border border-slate-800 text-white text-[8px] font-mono px-1.5 py-0.5 rounded shadow mt-1">
        Lyon, FR
      </span>
    </motion.div>

    <motion.div
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
      className="absolute top-[40%] left-[52%] flex flex-col items-center"
    >
      <MapPin className="h-6 w-6 text-primary fill-primary/30 drop-shadow-lg" />
      <span className="bg-slate-950 border border-slate-800 text-white text-[9px] font-mono px-2 py-0.5 rounded shadow-lg mt-1 font-bold">
        Naples, IT
      </span>
    </motion.div>

    <motion.div
      animate={{ y: [0, -5, 0] }}
      transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
      className="absolute bottom-[20%] left-[18%] flex flex-col items-center"
    >
      <MapPin className="h-5 w-5 text-emerald-500 fill-emerald-500/30 drop-shadow-md" />
      <span className="bg-slate-950 border border-slate-800 text-white text-[8px] font-mono px-1.5 py-0.5 rounded shadow mt-1">
        Lagos, NG
      </span>
    </motion.div>

    <motion.div
      animate={{ y: [0, -7, 0] }}
      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.9 }}
      className="absolute top-[28%] right-[22%] flex flex-col items-center"
    >
      <MapPin className="h-5 w-5 text-amber-500 fill-amber-500/30 drop-shadow-md" />
      <span className="bg-slate-950 border border-slate-800 text-white text-[8px] font-mono px-1.5 py-0.5 rounded shadow mt-1">
        Toronto, CA
      </span>
    </motion.div>
  </div>
);

const CardFrame = ({
  children,
  themeColor,
  title,
}: {
  children: React.ReactNode;
  themeColor: keyof typeof THEMES;
  title: string;
}) => {
  return (
    <div className="w-[300px] sm:w-[335px] h-[215px] rounded-2xl border bg-white/85 dark:bg-slate-900/85 border-slate-200/80 dark:border-slate-800/60 shadow-xl overflow-hidden flex flex-col backdrop-blur-md transition-colors duration-300">
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-100/50 dark:bg-slate-950/45 border-b border-slate-200/80 dark:border-slate-800/60">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-red-400/80" />
          <span className="h-2 w-2 rounded-full bg-amber-400/80" />
          <span className="h-2 w-2 rounded-full bg-emerald-400/80" />
        </div>
        <span className="text-[10px] font-mono font-medium text-slate-500 dark:text-slate-400">
          {title}
        </span>
        <span className="w-8" />
      </div>
      <div className="flex-1 p-4 overflow-hidden text-left relative flex flex-col justify-center">
        {children}
      </div>
    </div>
  );
};

function HeroWithMosaic() {
  const { t } = usePreferences();
  const [emblaRef, embla] = useEmblaCarousel({ loop: true, align: "start" });
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!embla) return;
    const onSelect = () => setIndex(embla.selectedScrollSnap());
    embla.on("select", onSelect);
    const id = setInterval(() => embla.scrollNext(), 6500);
    return () => {
      embla.off("select", onSelect);
      clearInterval(id);
    };
  }, [embla]);

  return (
    <section className="relative overflow-hidden border-b border-border bg-[#020b21] transition-colors duration-300">
      <div ref={emblaRef} className="overflow-hidden w-full">
        <div className="flex">
          {SLIDES_DATA.map((slide, idx) => {
            const isActive = idx === index;
            return (
              <div
                key={idx}
                className="min-w-0 shrink-0 grow-0 basis-full relative min-h-[500px] lg:min-h-[560px] flex items-center overflow-hidden"
              >
                <div className="absolute inset-0 z-0 select-none pointer-events-none bg-[#020b21]">
                  <div className="absolute inset-0 bg-[#020b21] opacity-80 mix-blend-multiply" />
                  <img
                    src={slide.bgImg}
                    className={`w-full h-full object-cover opacity-35 transition-transform duration-1000 ${isActive ? "scale-100" : "scale-105"}`}
                    alt=""
                  />
                </div>

                <div className="relative mx-auto max-w-7xl w-full px-4 lg:px-8 pt-8 pb-12 lg:pt-10 lg:pb-16 z-10">
                  <div className="grid gap-12 lg:grid-cols-2 items-center">
                    <div className="text-left z-10">
                      <motion.p
                        initial={{ opacity: 0, y: 15 }}
                        animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-xs font-mono font-bold tracking-widest uppercase text-slate-400 mb-3"
                      >
                        {slide.eyebrow}
                      </motion.p>

                      <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="font-display text-4xl font-black text-white sm:text-5xl lg:text-6xl leading-[1.1] tracking-tight"
                      >
                        {slide.title}
                      </motion.h1>

                      <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="mt-6 text-base text-slate-200 max-w-lg leading-relaxed font-medium"
                      >
                        {slide.sub}
                      </motion.p>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="mt-8 flex flex-wrap gap-4"
                      >
                        <Link
                          to="/register"
                          className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]"
                        >
                          {t("hero_cta_leads")} <ArrowRight className="h-4 w-4" />
                        </Link>
                        <Link
                          to="/how-it-works"
                          className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/60 px-6 py-3.5 text-sm font-medium hover:bg-slate-800 transition text-white hover:scale-[1.02]"
                        >
                          <Play className="h-4 w-4 text-slate-400" />{" "}
                          {t("hero_cta_demo")}
                        </Link>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={isActive ? { opacity: 1 } : { opacity: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                        className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-xs font-mono text-slate-400"
                      >
                        <span className="flex items-center gap-1.5">
                          <CheckCircle2 className="h-4 w-4 text-emerald-500" /> No credit card
                        </span>
                        <span className="flex items-center gap-1.5">
                          <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Instant access
                        </span>
                        <span className="flex items-center gap-1.5">
                          <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Cancel anytime
                        </span>
                      </motion.div>
                    </div>

                    <div className="relative h-[380px] sm:h-[460px] w-full flex items-center justify-center select-none overflow-visible lg:mt-0 mt-8">
                      <div
                        className="absolute bottom-4 w-[340px] h-[340px] rounded-full bg-gradient-to-b from-primary/30 to-transparent border border-primary/20 opacity-70 shadow-2xl transition-all duration-500"
                        style={{ transform: "rotateX(72deg) translateY(60px)" }}
                      >
                        <div className="absolute inset-4 rounded-full border border-primary/20 bg-primary/5 animate-pulse" />
                      </div>

                      <motion.div
                        animate={isActive ? { y: [-8, 8, -8] } : { y: 0 }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                        className="relative z-10 transition-transform duration-500 scale-90 sm:scale-100"
                        style={{
                          transformStyle: "preserve-3d",
                          transform:
                            "perspective(1000px) rotateY(-18deg) rotateX(12deg) rotateZ(1deg)",
                        }}
                      >
                        <CardFrame themeColor={slide.themeColor} title={slide.mockLead.tag}>
                          {slide.themeColor === "emerald" && (
                            <div className="space-y-2.5">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                                    {slide.mockLead.name}
                                  </h3>
                                  <p className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                                    <MapPin className="h-3 w-3 text-slate-400" />{" "}
                                    {slide.mockLead.city} · Bakery
                                  </p>
                                </div>
                                <div className="flex items-center gap-1 text-[10px] font-bold bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20">
                                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" /> 4.9
                                  (412)
                                </div>
                              </div>
                              <div className="border-t border-slate-100 dark:border-slate-800/50 pt-2 flex flex-col gap-1.5">
                                {slide.mockLead.details.map((d, i) => (
                                  <div
                                    key={i}
                                    className="flex items-center gap-1.5 text-[10px] text-red-600 dark:text-red-400 font-semibold"
                                  >
                                    <span className="h-1.5 w-1.5 rounded-full bg-red-500" /> {d}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {slide.themeColor === "blue" && (
                            <div className="absolute inset-0 overflow-hidden rounded-b-2xl">
                              <MapVisual />
                            </div>
                          )}

                          {slide.themeColor === "purple" && (
                            <div className="space-y-2 text-[10px] font-mono flex-1 flex flex-col justify-center text-slate-700 dark:text-slate-300">
                              <div className="flex border-b border-slate-100 dark:border-slate-800/50 pb-1">
                                <span className="text-slate-400 w-8 flex-shrink-0">To:</span>
                                <span className="font-semibold text-slate-900 dark:text-white truncate">
                                  mario@pizzanapoli.it
                                </span>
                              </div>
                              <div className="flex border-b border-slate-100 dark:border-slate-800/50 pb-1">
                                <span className="text-slate-400 w-8 flex-shrink-0">Sub:</span>
                                <span className="font-semibold text-slate-900 dark:text-white truncate">
                                  Website opportunity - Napoli
                                </span>
                              </div>
                              <p className="mt-1 leading-normal italic text-[9px] line-clamp-3">
                                {slide.mockLead.details[1]}
                              </p>
                              <div className="flex justify-between items-center mt-1 border-t border-slate-100 dark:border-slate-800/50 pt-1">
                                <span className="text-[8px] bg-purple-500/10 text-purple-600 dark:text-purple-400 px-1.5 py-0.5 rounded font-bold">
                                  ✦ Claude 3.5
                                </span>
                                <span className="text-[8px] text-slate-400">Word count: 48</span>
                              </div>
                            </div>
                          )}

                          {slide.themeColor === "amber" && (
                            <div className="grid grid-cols-3 gap-2 h-full items-center">
                              <div className="rounded-xl border border-slate-200/80 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-950/20 p-2 text-center h-[125px] flex flex-col justify-between">
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                                  Saved
                                </span>
                                <div className="bg-white dark:bg-slate-900 rounded-lg p-1.5 shadow-sm border border-slate-200/50 dark:border-slate-800/30 text-[8px] font-semibold text-slate-800 dark:text-slate-200 truncate">
                                  Dental Clinic
                                </div>
                                <span className="text-[8px] text-slate-400">1 lead</span>
                              </div>
                              <div className="rounded-xl border border-slate-200/80 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-950/20 p-2 text-center h-[125px] flex flex-col justify-between">
                                <span className="text-[9px] font-bold text-blue-500 dark:text-blue-400 uppercase tracking-wider">
                                  Contacted
                                </span>
                                <div className="bg-white dark:bg-slate-900 rounded-lg p-1.5 shadow-sm border border-slate-200/50 dark:border-slate-800/30 text-[8px] font-semibold text-slate-800 dark:text-slate-200 truncate">
                                  Smith Plumbers
                                </div>
                                <span className="text-[8px] text-slate-400">1 lead</span>
                              </div>
                              <div className="rounded-xl border border-emerald-500/30 dark:border-emerald-500/20 bg-emerald-50/30 dark:bg-emerald-500/5 p-2 text-center h-[125px] flex flex-col justify-between shadow-lg shadow-emerald-500/5">
                                <span className="text-[9px] font-bold text-emerald-500 dark:text-emerald-400 uppercase tracking-wider">
                                  Won
                                </span>
                                <div className="bg-emerald-500/10 dark:bg-emerald-500/20 rounded-lg p-1.5 border border-emerald-500/30 text-[8px] font-extrabold text-emerald-700 dark:text-emerald-400 truncate shadow-sm">
                                  Lagos Salon
                                </div>
                                <span className="text-[8px] text-emerald-500 font-bold">
                                  +$4,200
                                </span>
                              </div>
                            </div>
                          )}
                        </CardFrame>

                        <motion.div
                          animate={isActive ? { y: [-5, 5, -5] } : { y: 0 }}
                          transition={{
                            duration: 4.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 0.5,
                          }}
                          className="absolute -top-10 -right-8 z-20 flex flex-col items-center"
                        >
                          <img
                            src={slide.profileImg}
                            className={`w-14 h-14 rounded-full border-2 object-cover shadow-lg ${slide.themeColor === "emerald" ? "border-emerald-500" : slide.themeColor === "blue" ? "border-blue-500" : slide.themeColor === "purple" ? "border-purple-500" : "border-amber-500"}`}
                            alt=""
                          />
                          <div className="mt-1.5 bg-slate-900/90 dark:bg-slate-950/90 text-white text-[8px] font-mono px-2 py-0.5 rounded border border-slate-800 whitespace-nowrap shadow-md">
                            {slide.profileName}
                          </div>
                        </motion.div>

                        {slide.pills.map((pill, pIdx) => {
                          const isFirst = pIdx === 0;
                          const isSecond = pIdx === 1;
                          return (
                            <motion.div
                              key={pIdx}
                              animate={
                                isActive
                                  ? {
                                      y: [
                                        isFirst ? -6 : isSecond ? 6 : -4,
                                        isFirst ? 6 : isSecond ? -6 : 4,
                                        isFirst ? -6 : isSecond ? 6 : -4,
                                      ],
                                    }
                                  : { y: 0 }
                              }
                              transition={{
                                duration: isFirst ? 4 : isSecond ? 4.8 : 5.2,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: pIdx * 0.4,
                              }}
                              className={`absolute z-20 font-bold text-[9px] sm:text-[10px] px-2.5 py-1 rounded-full shadow-lg border backdrop-blur-sm ${
                                isFirst
                                  ? "-top-6 -left-8 bg-emerald-500/95 text-white border-emerald-400"
                                  : isSecond
                                    ? "-bottom-4 -left-6 bg-slate-900/95 dark:bg-white/95 text-white dark:text-slate-950 border-slate-700/50 dark:border-slate-200"
                                    : "top-1/2 -translate-y-1/2 -right-12 bg-primary/95 text-white border-primary/45"
                              }`}
                            >
                              {pill}
                            </motion.div>
                          );
                        })}
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {SLIDES_DATA.map((_, i) => (
          <button
            key={i}
            onClick={() => embla?.scrollTo(i)}
            className={`h-2 rounded-full transition-all duration-300 ${i === index ? "w-8 bg-slate-900 dark:bg-white" : "w-2 bg-slate-300 dark:bg-slate-700"}`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
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
              <p className="font-mono-data text-2xl font-bold text-primary">
                {counts.leads || s.k}
              </p>
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
  const steps = [
    {
      icon: Target,
      title: "Pick your skill",
      desc: "Select your freelance category — web dev, design, copywriting, and 7 more.",
    },
    {
      icon: Map,
      title: "Choose your market",
      desc: "Target any city or country in the world. Filter by industry, size, signals.",
    },
    {
      icon: LineChart,
      title: "Discover leads",
      desc: "Get a scored list of businesses that need exactly what you sell.",
    },
    {
      icon: Mail,
      title: "Reach out",
      desc: "Use ready-made templates — or our AI writer — to contact them in seconds.",
    },
  ];
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);

  return (
    <section
      ref={containerRef}
      id="how"
      className="relative overflow-hidden border-y border-border py-24 text-white"
    >
      <motion.div
        className="absolute inset-0 z-0 bg-cover bg-center opacity-35 dark:opacity-50"
        style={{
          backgroundImage: "url('/assets/freelancers/freelancer_5.jpg')",
          y,
          height: "130%",
          top: "-15%",
        }}
      />
      <div className="absolute inset-0 bg-[#020b21] opacity-80 mix-blend-multiply z-10" />
      <div className="relative mx-auto max-w-7xl px-4 lg:px-8 z-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
            // quick.workflow
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight md:text-4xl text-white">
            From zero to outreach in minutes
          </h2>
          <p className="mt-3 text-slate-300">
            A simple workflow built around how freelancers actually find clients.
          </p>
        </div>
        <div className="relative mt-14 grid gap-6 md:grid-cols-4">
          <div className="absolute left-0 right-0 top-7 hidden h-px bg-border/40 md:block" />
          {steps.map((s, i) => (
            <div
              key={s.title}
              className="relative rounded-2xl border border-blue-900/30 bg-[#131c31] p-6 shadow-card hover:shadow-card-hover transition duration-300"
            >
              <div className="mb-4 grid h-14 w-14 place-items-center rounded-xl bg-[#1e293b] text-white">
                <s.icon className="h-6 w-6" />
              </div>
              <p className="font-mono-data text-xs text-blue-400 font-bold">STEP {i + 1}</p>
              <h3 className="mt-1 font-display text-lg font-semibold text-white">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-100">{s.desc}</p>
            </div>
          ))}
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
      <div className="absolute left-1/2 -bottom-3 w-0.5 h-6 border-l border-dashed border-primary/45 -translate-x-1/2 lg:block hidden z-0">
        <span className="absolute left-[-2.5px] h-1.5 w-1.5 rounded-full bg-secondary shadow-[0_0_8px_var(--color-secondary)] animate-slide-down" />
      </div>
    ),
    footer: () => (
      <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 px-2 py-1.5 rounded border border-purple-500/20 mt-4 text-center block w-full">
        Remote channels auto-scraped
      </span>
    ),
  },
  {
    id: 7,
    icon: Users,
    title: "All Freelancer Skills Covered",
    desc: "Whether you build websites, write copy, design brands, manage socials, edit video, or handle virtual tasks, we have custom opportunity models for you.",
    gridClass: "lg:col-start-1 lg:row-start-3 lg:col-span-3 lg:w-full lg:max-w-none",
    connector: () => null,
    footer: () => (
      <div className="flex flex-wrap gap-1.5 mt-4 text-[9px] font-mono text-slate-800 dark:text-slate-200 w-full">
        {[
          "Web Dev",
          "Design",
          "SEO",
          "Copywriting",
          "Video",
          "Photo",
          "VA",
          "Marketing",
          "App Dev",
          "Tutoring",
          "Food Export",
          "B2B Trade",
        ].map((tag) => (
          <span
            key={tag}
            className="px-2 py-0.5 rounded bg-background border border-border text-slate-900 dark:text-slate-100"
          >
            {tag}
          </span>
        ))}
      </div>
    ),
  },
];

function Features() {
  return (
    <section id="features" className="border-y border-border bg-background py-24 select-none">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <p className="text-xs font-mono text-[#64748B] mb-2 tracking-widest uppercase">
            // what.we.give.you
          </p>
          <h2 className="font-display text-4xl font-extrabold text-foreground">
            Everything you need to get clients
          </h2>
          <p className="mt-4 text-muted-foreground">
            No bloat. Just the tools freelancers actually use to win work.
          </p>
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
                className={`relative rounded-2xl border border-border bg-card p-6 shadow-card flex flex-col justify-between group hover:border-[#6366F1]/30 transition duration-300 z-10 ${card.gridClass}`}
              >
                {card.id === 7 ? (
                  <div className="flex items-center justify-between gap-8 w-full h-full text-left">
                    <div className="max-w-md">
                      <div className="inline-grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary mb-3 group-hover:bg-primary group-hover:text-primary-foreground transition duration-300">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="font-display text-lg font-bold text-slate-950 dark:text-white mb-2">
                        {card.title}
                      </h3>
                      <p className="text-xs md:text-sm text-slate-900 dark:text-slate-200 leading-relaxed">
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
                      <h3 className="font-display text-lg font-bold text-slate-950 dark:text-white mb-2">
                        {card.title}
                      </h3>
                      <p className="text-xs md:text-sm text-slate-900 dark:text-slate-200 leading-relaxed line-clamp-3">
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
                  className="w-[280px] shrink-0 rounded-2xl border border-border bg-card p-6 shadow-card flex flex-col justify-between"
                >
                  <div>
                    <div className="inline-grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary mb-3">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-display text-lg font-bold text-slate-950 dark:text-white mb-2">
                      {card.title}
                    </h3>
                    <p className="text-xs md:text-sm text-slate-900 dark:text-slate-200 leading-relaxed line-clamp-3">
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
                  className="w-[280px] shrink-0 rounded-2xl border border-border bg-card p-6 shadow-card flex flex-col justify-between"
                >
                  <div>
                    <div className="inline-grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary mb-3">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-display text-lg font-bold text-slate-955 dark:text-white mb-2">
                      {card.title}
                    </h3>
                    <p className="text-xs md:text-sm text-slate-900 dark:text-slate-200 leading-relaxed line-clamp-3">
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
                <span
                  key={city.name}
                  className="inline-flex items-center gap-1.5 rounded-full bg-card border border-border px-3 py-1 text-xs text-slate-800 dark:text-slate-300 font-mono font-medium"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {city.name}
                </span>
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
  const items = [
    {
      quote:
        "I found 3 new clients in my first week. The opportunity scoring tells me exactly which businesses to call first.",
      name: "Taiwo Adeyemi",
      role: "Web Developer",
      city: "Lagos, Nigeria",
      avatar: IMG.face1,
    },
    {
      quote:
        "As a copywriter, I never knew how to find leads. Now I have a full pipeline every Monday morning.",
      name: "Maria Silva",
      role: "Copywriter",
      city: "São Paulo, Brazil",
      avatar: IMG.face2,
    },
    {
      quote: "The phone scripts are gold. I went from zero cold calls to booking 2 meetings a day.",
      name: "James Kariuki",
      role: "SEO Specialist",
      city: "Nairobi, Kenya",
      avatar: IMG.face3,
    },
  ];
  return (
    <section className="border-t border-border bg-background py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Customer stories
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight md:text-4xl">
            Freelancers in 50+ countries trust us
          </h2>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {items.map((t) => (
            <figure
              key={t.name}
              className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card"
            >
              <img
                src={t.avatar}
                alt={t.name}
                className="aspect-[4/3] w-full object-cover object-top"
                loading="lazy"
              />
              <div className="flex flex-1 flex-col p-6">
                <div className="mb-3 flex gap-0.5 text-amber-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <blockquote className="text-sm leading-relaxed text-foreground/90">
                  "{t.quote}"
                </blockquote>
                <figcaption className="mt-5 border-t border-border pt-4 text-xs">
                  <p className="font-semibold text-foreground">{t.name}</p>
                  <p className="text-muted-foreground">
                    {t.role} · {t.city}
                  </p>
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
    {
      name: t("plan_free"),
      price: 0,
      leads: "10",
      popular: false,
      cta: t("plan_cta_free"),
      features: [t("plan_free_feature_1"), t("plan_free_feature_2"), t("plan_free_feature_3")],
    },
    {
      name: t("plan_individual"),
      price: 7,
      leads: "200",
      popular: true,
      cta: t("plan_cta_ind"),
      features: [
        t("plan_ind_feature_1"),
        t("plan_ind_feature_2"),
        t("plan_ind_feature_3"),
        t("plan_ind_feature_4"),
        t("plan_ind_feature_5"),
      ],
    },
    {
      name: t("plan_company"),
      price: 20,
      leads: "Unlimited",
      popular: false,
      cta: t("plan_cta_comp"),
      features: [
        t("plan_comp_feature_1"),
        t("plan_comp_feature_2"),
        t("plan_comp_feature_3"),
        t("plan_comp_feature_4"),
        t("plan_comp_feature_5"),
      ],
    },
  ];
  return (
    <div className="mx-auto max-w-7xl px-4 py-24 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-mono text-[#64748B] mb-2 tracking-widest uppercase">
          // simple.pricing
        </p>
        <h2 className="font-display text-4xl font-extrabold text-foreground tracking-tight">
          {t("pricing_title")}
        </h2>
        <p className="mt-4 text-muted-foreground">{t("pricing_sub")}</p>
      </div>
      <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
        {plans.map((p) => (
          <div
            key={p.name}
            className={`relative rounded-2xl border bg-card/85 p-7 transition hover:shadow-card-hover ${p.popular ? "border-primary shadow-[0_0_25px_rgba(99,102,241,0.15)] lg:-translate-y-3" : "border-border"}`}
          >
            {p.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                Most Popular
              </span>
            )}
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              {p.name}
            </p>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="font-display text-4xl font-extrabold text-foreground">
                {getCurrencySymbol()}
                {formatPrice(p.price)}
              </span>
              <span className="text-xs text-muted-foreground">{t("plan_mo")}</span>
            </div>
            <p className="mt-2 font-mono-data text-xs text-primary font-semibold">
              {p.leads === "Unlimited" ? "Unlimited" : p.leads} {t("plan_leads_mo")}
            </p>
            <ul className="mt-6 space-y-2.5 text-xs text-muted-foreground">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <Link
              to="/register"
              className={`mt-7 block rounded-lg py-2.5 text-center text-sm font-semibold transition ${p.popular ? "bg-primary text-white hover:bg-primary/95" : "border border-border bg-background text-foreground hover:bg-accent"}`}
            >
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
