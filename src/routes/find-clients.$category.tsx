import { createFileRoute, Link, notFound, redirect } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { CATEGORIES } from "@/data/mockData";
import { FREELANCER_CATEGORIES } from "@/data/content";
import { MaskedLeadCard, type LeadData } from "@/components/marketing/SEOLeadCard";
import {
  isKnownCity,
  isKnownSkill,
  isStaticPage,
  formatCityName,
  getCountry,
  COUNTRY_FLAG,
  US_STATE_MAP,
  SKILL_CONFIG,
  TOP_CITIES,
  ALL_SKILL_SLUGS,
  getSkillLabel,
  getMockLeadsForCity,
  getMockLeadsForSkill,
} from "@/data/dynamicRouteData";
import {
  Code,
  Palette,
  PenTool,
  TrendingUp,
  MessageSquare,
  Video,
  Camera,
  Megaphone,
  Smartphone,
  Users,
  GraduationCap,
  Leaf,
  Utensils,
  Package,
  Factory,
  BookOpen,
  ArrowRight,
  CheckCircle,
  MapPin,
  Sparkles,
  Building2,
  AlertTriangle,
  Globe,
  Zap,
  Star,
  Search,
} from "lucide-react";

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  "local_business": <Building2 className="h-6 w-6 text-primary" />,
  "web_dev": <Code className="h-6 w-6 text-primary" />,
  "designer": <Palette className="h-6 w-6 text-primary" />,
  "copywriter": <PenTool className="h-6 w-6 text-primary" />,
  "seo": <TrendingUp className="h-6 w-6 text-primary" />,
  "social_media": <MessageSquare className="h-6 w-6 text-primary" />,
  "video": <Video className="h-6 w-6 text-primary" />,
  "photography": <Camera className="h-6 w-6 text-primary" />,
  "marketing": <Megaphone className="h-6 w-6 text-primary" />,
  "app_dev": <Smartphone className="h-6 w-6 text-primary" />,
  "va": <Users className="h-6 w-6 text-primary" />,
  "tutor": <GraduationCap className="h-6 w-6 text-primary" />,
  "parent_tutor": <GraduationCap className="h-6 w-6 text-primary" />,
  "african_food_export": <Leaf className="h-6 w-6 text-primary" />,
  "restaurant_supplier": <Utensils className="h-6 w-6 text-primary" />,
  "product_export": <Package className="h-6 w-6 text-primary" />,
  "b2b_trade": <Factory className="h-6 w-6 text-primary" />,
  "human_capital": <BookOpen className="h-6 w-6 text-primary" />,
  "training_recruitment": <BookOpen className="h-6 w-6 text-primary" />,
};

// Map route slug to category ID
const SLUG_TO_ID: Record<string, string> = {
  "local-business": "local_business",
  "web-developers": "web_dev",
  "web-development": "web_dev",
  "designers": "designer",
  "copywriters": "copywriter",
  "seo-specialists": "seo",
  "seo-specialist": "seo",
  "seo": "seo",
  "social-media": "social_media",
  "videographers": "video",
  "photographers": "photography",
  "marketers": "marketing",
  "app-developers": "app_dev",
  "virtual-assistants": "va",
  "online-tutors": "tutor",
  "parent-tutors": "parent_tutor",
  "parent-tutor": "parent_tutor",
  "african-food-export": "african_food_export",
  "restaurant-suppliers": "restaurant_supplier",
  "restaurant-supplier": "restaurant_supplier",
  "product-export": "product_export",
  "product-import-export": "product_export",
  "b2b-trade": "b2b_trade",
  "human-capital": "human_capital",
  "human-capital-development": "human_capital",
  "training-recruitment": "training_recruitment",
};

const CATEGORY_SEO: Record<string, { keywords: string }> = {
  "web-developers": { keywords: "find web development clients, web design leads, hire freelance developers, get web design projects, local business websites, lanceconnect web dev" },
  "web-development": { keywords: "find web development clients, web design leads, hire freelance developers, get web design projects, local business websites, lanceconnect web dev" },
  "designers": { keywords: "find graphic design clients, freelance designer leads, brand identity projects, logo design clients, creative portfolio leads, lanceconnect graphic design" },
  "copywriters": { keywords: "copywriting clients, freelance writer leads, content writing projects, business blog writing, website copywriting, copywriter client finder" },
  "seo-specialists": { keywords: "find seo clients, seo agency leads, local seo clients, search engine optimization projects, get seo work, seo freelancer helper" },
  "seo-specialist": { keywords: "find seo clients, seo agency leads, local seo clients, search engine optimization projects, get seo work, seo freelancer helper" },
  "seo": { keywords: "find seo clients, seo agency leads, local seo clients, search engine optimization projects, get seo work, seo freelancer helper" },
  "social-media": { keywords: "social media manager clients, instagram marketer leads, facebook ads clients, social media management projects, lanceconnect social media" },
  "videographers": { keywords: "video production clients, videography leads, commercial video projects, video editing clients, freelance videographer" },
  "photographers": { keywords: "find photography clients, food photography leads, real estate photography, commercial photographer leads, photography projects" },
  "marketers": { keywords: "digital marketing clients, B2B marketing leads, marketing consultant projects, run ads clients, marketing client finder" },
  "app-developers": { keywords: "app development clients, mobile app leads, iOS android developer projects, hire app developers, custom software leads" },
  "virtual-assistants": { keywords: "virtual assistant clients, freelance VA leads, administrative support projects, outsource admin work, hire virtual assistants" },
  "online-tutors": { keywords: "online tutoring clients, find tutoring students, online teacher leads, remote tutoring jobs, language tutor clients" },
  "parent-tutors": { keywords: "tutor matching service, find home tutors, private tutoring for kids, local tutor matching, math tutor parents" },
  "parent-tutor": { keywords: "tutor matching service, find home tutors, private tutoring for kids, local tutor matching, math tutor parents" },
  "african-food-export": { keywords: "african food importers, wholesale palm oil buyers, ethnic food distributors UK, export food to London, african food wholesalers" },
  "restaurant-suppliers": { keywords: "restaurant food suppliers, fresh produce wholesale, local kitchen supply, B2B restaurant supplier, restaurant ingredients wholesale" },
  "restaurant-supplier": { keywords: "restaurant food suppliers, fresh produce wholesale, local kitchen supply, B2B restaurant supplier, restaurant ingredients wholesale" },
  "product-export": { keywords: "product importers, global trade distributors, wholesale export buyers, international B2B sales, import export trade leads" },
  "product-import-export": { keywords: "product importers, global trade distributors, wholesale export buyers, international B2B sales, import export trade leads" },
  "b2b-trade": { keywords: "B2B trade partners, raw material procurement, manufacturing wholesale suppliers, industrial supply chain leads, factory procurement" },
  "human-capital": { keywords: "corporate training clients, HR talent development, leadership workshop leads, workforce L&D proposal, corporate upskilling" },
  "human-capital-development": { keywords: "corporate training clients, HR talent development, leadership workshop leads, workforce L&D proposal, corporate upskilling" },
  "training-recruitment": { keywords: "staffing agency clients, recruitment partner leads, hire recruitment firm, talent acquisition projects, company staffing needs" },
};

export const Route = createFileRoute("/find-clients/$category")({
  beforeLoad: ({ params }) => {
    // Never intercept the 6 static pages (safety net)
    if (isStaticPage(params.category)) return;
    if (params.category === "web-development") {
      throw redirect({
        to: "/find-clients/$category",
        params: { category: "web-developers" },
        replace: true,
      });
    }
    if (params.category === "seo-specialist") {
      throw redirect({
        to: "/find-clients/$category",
        params: { category: "seo-specialists" },
        replace: true,
      });
    }
    if (params.category === "seo") {
      throw redirect({
        to: "/find-clients/$category",
        params: { category: "seo-specialists" },
        replace: true,
      });
    }
    if (params.category === "parent-tutor") {
      throw redirect({
        to: "/find-clients/$category",
        params: { category: "parent-tutors" },
        replace: true,
      });
    }
    if (params.category === "restaurant-supplier") {
      throw redirect({
        to: "/find-clients/$category",
        params: { category: "restaurant-suppliers" },
        replace: true,
      });
    }
    if (params.category === "product-import-export") {
      throw redirect({
        to: "/find-clients/$category",
        params: { category: "product-export" },
        replace: true,
      });
    }
    if (params.category === "human-capital-development") {
      throw redirect({
        to: "/find-clients/$category",
        params: { category: "human-capital" },
        replace: true,
      });
    }
  },
  loader: async ({ params }) => {
    const slug = params.category;

    // ── Dynamic City or Skill detection ──────────────────────────────
    if (isKnownCity(slug)) {
      const cityName = formatCityName(slug);
      const countryName = getCountry(slug);
      const usState = US_STATE_MAP[slug];
      const displayLocation = usState
        ? `${cityName}, ${usState}`
        : countryName
        ? `${cityName}, ${countryName}`
        : cityName;
      return {
        pageType: "city" as const,
        slug,
        cityName,
        countryName,
        usState,
        displayLocation,
        flag: COUNTRY_FLAG[countryName] || "🌍",
        // generic fields to satisfy TS (unused for city/skill pages)
        categoryId: slug,
        label: cityName,
        emoji: COUNTRY_FLAG[countryName] || "🌍",
        content: null as any,
      };
    }

    if (isKnownSkill(slug)) {
      const config = SKILL_CONFIG[slug];
      return {
        pageType: "skill" as const,
        slug,
        skillConfig: config,
        cityName: "",
        countryName: "",
        usState: undefined,
        displayLocation: "",
        flag: "",
        categoryId: config.category,
        label: config.label,
        emoji: "💼",
        content: null as any,
      };
    }
    // ── End dynamic detection — fall through to generic handler ──────

    const categoryId = SLUG_TO_ID[params.category] || params.category;
    
    // Find category info in content.ts categories
    const catContent = FREELANCER_CATEGORIES.find(
      (c) => c.slug === params.category || SLUG_TO_ID[c.slug] === categoryId
    );

    // Find category info in mockData categories
    let mockCat = CATEGORIES.find((c) => c.id === categoryId);

    if (!mockCat) {
      // Create a default category object dynamically from the slug
      const formattedLabel = params.category
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      
      mockCat = {
        id: categoryId,
        emoji: "💼",
        label: formattedLabel,
        example: `Find businesses needing ${formattedLabel.toLowerCase()} services`,
      };
    }

    const isLocalBusiness = categoryId === "local_business" || params.category === "local-business";

    return {
      pageType: "generic" as const,
      categoryId,
      label: mockCat.label,
      emoji: mockCat.emoji || "💼",
      content: catContent || (isLocalBusiness ? {
        slug: params.category,
        label: mockCat.label,
        emoji: mockCat.emoji || "🏪",
        image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&q=80",
        tagline: "Find verified B2B leads looking for local services, storefront upgrades, and custom SEO.",
        description: "Get real-time alerts when dry cleaners, bakeries, salons, and restaurants in your city show high opportunity buying signals.",
        problems: [
          "Lacking modern online appointment scheduling",
          "Missing or broken local search optimization (Google My Business)",
          "No social media presence to engage local community",
          "Website not optimized for mobile customers",
        ],
        sampleBusinesses: [
          { name: "Lagos Premium Dry Cleaners", reason: "No local map listing and outdated contact info" },
          { name: "Seattle Daily Bakery", reason: "Missing online pre-order system for morning rush" }
        ]
      } : {
        slug: params.category,
        label: mockCat.label,
        emoji: mockCat.emoji || "💼",
        image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&q=80",
        tagline: `Find verified B2B leads looking for ${mockCat.label.toLowerCase()} services.`,
        description: `Get real-time alerts when local businesses in your city show high opportunity buying signals.`,
        problems: [
          "No active marketing presence online",
          "Missing or broken core digital infrastructure",
          "Failing to capture high-intent local search queries",
          "Lacking modern optimization and booking features",
        ],
        sampleBusinesses: [
          { name: "Global Commerce Group", reason: "Zero organic search visibility in target markets" },
          { name: "Metropolitan Services", reason: "Outdated contact channels and no scheduling portal" }
        ]
      })
    };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) return { meta: [] };
    const categoryKey = params.category || "";

    if (loaderData.pageType === "city") {
      const { displayLocation, countryName } = loaderData;
      return {
        meta: [
          { title: `Find Freelance Clients in ${displayLocation} — LanceConnect` },
          { name: "description", content: `Find businesses in ${displayLocation} that need freelancers. Get verified phone numbers and emails. 10 free leads, no credit card.` },
          { name: "keywords", content: `find clients in ${displayLocation}, freelance leads ${displayLocation}, get clients ${countryName}` },
          { property: "og:title", content: `Find Clients in ${displayLocation} — LanceConnect` },
        ],
      };
    }

    if (loaderData.pageType === "skill") {
      const { skillConfig } = loaderData;
      return {
        meta: [
          { title: `Find Clients as a ${skillConfig.label} — LanceConnect` },
          { name: "description", content: `${skillConfig.description} Get direct contact details for businesses that need you. 10 free leads.` },
          { name: "keywords", content: skillConfig.keywords },
          { property: "og:title", content: `Find ${skillConfig.label} Clients — LanceConnect` },
        ],
      };
    }

    const { label, content } = loaderData;
    const seoInfo = CATEGORY_SEO[categoryKey] || { keywords: `find ${label.toLowerCase()} clients, ${label.toLowerCase()} leads, B2B ${label.toLowerCase()}` };
    return {
      meta: [
        { title: `How to Find ${label} Clients in 150+ Countries — LanceConnect` },
        {
          name: "description",
          content: `Discover high-intent B2B leads and clients for ${label.toLowerCase()} services. Browse local business opportunities with real-time scoring.`,
        },
        {
          name: "keywords",
          content: seoInfo.keywords,
        },
        { property: "og:title", content: `Find ${label} Clients Worldwide | LanceConnect` },
        { property: "og:description", content: content?.tagline },
        { property: "og:image", content: content?.image },
        { property: "og:type", content: "website" },
      ],
    };
  },
  component: CategoryLandingPage,
});

function CategoryLandingPage() {
  const loaderData = Route.useLoaderData();

  // ── City page ────────────────────────────────────────────────────────────
  if (loaderData.pageType === "city") {
    return <CityPage data={loaderData} />;
  }

  // ── Skill page ───────────────────────────────────────────────────────────
  if (loaderData.pageType === "skill") {
    return <SkillPage data={loaderData} />;
  }

  // ── Generic / existing category page ────────────────────────────────────
  const { categoryId, label, emoji, content } = loaderData;
  const otherCategories = CATEGORIES.filter((c) => c.id !== categoryId).slice(0, 4);

  return (
    <MarketingShell>
      {/* Dynamic structured data JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: `How to Find ${label} Clients — LanceConnect`,
            description: content.tagline,
            breadcrumb: {
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Home",
                  item: "https://lanceconnect.vercel.app",
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Find Clients",
                  item: `https://lanceconnect.vercel.app/find-clients/${content.slug}`,
                },
              ],
            },
          }),
        }}
      />

      {/* Hero Header */}
      <section className="relative overflow-hidden border-b border-border bg-[#020b21] py-24 text-white">
        <div className="absolute inset-0 z-0 select-none pointer-events-none">
          <img
            src={content.image}
            className="w-full h-full object-cover opacity-20"
            alt=""
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#020b21]" />
        </div>
        <div className="relative mx-auto max-w-5xl px-4 lg:px-8 z-10 text-center space-y-6">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full bg-primary/20 border border-primary/30 px-3.5 py-1 text-xs font-semibold text-primary">
            {CATEGORY_ICONS[categoryId] || emoji}
            <span>{label} Opportunity Hub</span>
          </div>
          <h1 className="font-display text-4xl font-extrabold sm:text-5xl lg:text-6xl tracking-tight max-w-4xl mx-auto leading-tight">
            Find High-Paying <span className="text-primary">{label}</span> Clients Globally.
          </h1>
          <p className="mt-4 text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {content.tagline} LanceConnect scans businesses across 150+ countries to surface those needing your specific expertise.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 hover:scale-[1.02] transition shadow-md"
            >
              Get Started for Free <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-xl bg-card border border-border px-6 py-3 text-sm font-semibold text-foreground hover:bg-accent transition"
            >
              Learn How it Works
            </Link>
          </div>
        </div>
      </section>

      {/* Signal Detection Section */}
      <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8 bg-background">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Left Side: Buying Signals */}
          <div className="space-y-6">
            <div className="inline-grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary">
              <Sparkles className="h-6 w-6" />
            </div>
            <h2 className="font-display text-3xl font-bold tracking-tight">
              AI-Powered Buying Signals We Monitor
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              We monitor millions of local businesses daily, tracking dozens of key parameters. When a business shows a gap that maps to your skill, we score it instantly.
            </p>
            <div className="space-y-3.5">
              {content.problems.map((prob: string, idx: number) => (
                <div
                  key={idx}
                  className="flex gap-3 rounded-2xl border border-border bg-card/50 p-4 text-sm hover:border-primary/20 transition duration-300"
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-[10px] font-bold">
                    {idx + 1}
                  </span>
                  <div>
                    <p className="font-semibold text-foreground">Gap Detected</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{prob}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side: Example leads */}
          <div className="space-y-6">
            <div className="inline-grid h-12 w-12 place-items-center rounded-2xl bg-emerald-500/10 text-emerald-500">
              <Building2 className="h-6 w-6" />
            </div>
            <h2 className="font-display text-3xl font-bold tracking-tight">
              Sample B2B Opportunities
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Below are typical examples of businesses scored and parsed in our directory right now.
            </p>
            <div className="space-y-3.5">
              {content.sampleBusinesses.map((biz: any, idx: number) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-border bg-card p-5 space-y-3 shadow-sm hover:border-emerald-500/30 transition duration-300"
                >
                  <div className="flex justify-between items-start">
                    <p className="font-bold text-foreground">{biz.name}</p>
                    <span className="inline-flex items-center gap-1 rounded bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-500">
                      Opportunity Score: 92/100
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    <span className="font-semibold text-primary">Opportunity:</span> {biz.reason}
                  </p>
                  <div className="flex gap-2 text-[10px] font-mono text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-slate-500" />
                      Lagos, Nigeria
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section className="border-t border-border bg-card/30 py-20">
        <div className="mx-auto max-w-5xl px-4 lg:px-8 text-center space-y-6">
          <h2 className="font-display text-3xl font-bold tracking-tight text-foreground">
            Stop Cold Pitching. Start Opportunity Matching.
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm leading-relaxed">
            Instead of emailing thousands of random businesses, LanceConnect gives you the exact lists of clients who are missing what you sell. Pitch with precision.
          </p>
          <div className="grid gap-6 sm:grid-cols-3 pt-6">
            <div className="p-5 bg-card border border-border rounded-2xl text-left space-y-2">
              <h3 className="font-bold text-base">150+ Countries</h3>
              <p className="text-xs text-muted-foreground">Find clients locally in Lagos, London, or expand to cities in America, Asia, and beyond.</p>
            </div>
            <div className="p-5 bg-card border border-border rounded-2xl text-left space-y-2">
              <h3 className="font-bold text-base">Opportunity Scoring</h3>
              <p className="text-xs text-muted-foreground">Focus only on leads with scores above 80/100, showing critical web or service gaps.</p>
            </div>
            <div className="p-5 bg-card border border-border rounded-2xl text-left space-y-2">
              <h3 className="font-bold text-base">1 Click Outreach</h3>
              <p className="text-xs text-muted-foreground">Generate tailored cold emails or WhatsApp pitches optimized for the specific lead using AI.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Box */}
      <section className="px-4 py-20 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-3xl bg-primary p-10 text-center text-primary-foreground shadow-xl">
          <h2 className="font-display text-3xl font-extrabold">
            Ready to find your next {label.toLowerCase()} client?
          </h2>
          <p className="mt-2 text-primary-foreground/90 text-sm max-w-md mx-auto">
            Sign up today and get 10 free B2B lead searches with full contact details (email, phone, social links).
          </p>
          <Link
            to="/register"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-card px-6 py-3.5 text-sm font-semibold text-primary hover:scale-105 transition shadow-md"
          >
            Start Finding Clients <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Other Categories Links */}
      <section className="mx-auto max-w-7xl px-4 pb-24 lg:px-8 border-t border-border/10 pt-16">
        <h3 className="font-display text-xl font-bold mb-6 text-foreground">Explore Other Industries</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {otherCategories.map((o) => (
            <Link
              key={o.id}
              to="/find-clients/$category"
              params={{ category: o.id.replace("_", "-") }}
              className="group rounded-2xl border border-border bg-card p-5 hover:border-primary transition duration-300 shadow-sm"
            >
              <div className="mb-3 p-2 bg-primary/10 rounded-xl w-fit text-primary">
                {CATEGORY_ICONS[o.id] || o.emoji}
              </div>
              <p className="font-display font-semibold group-hover:text-primary transition-colors text-foreground">
                {o.label}
              </p>
              <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2">{o.example}</p>
            </Link>
          ))}
        </div>
      </section>
    </MarketingShell>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// DYNAMIC CITY PAGE TEMPLATE
// ═══════════════════════════════════════════════════════════════════════════
function CityPage({ data }: { data: any }) {
  const { slug, cityName, countryName, usState, displayLocation, flag } = data;
  const supabaseUrl =
    import.meta.env.VITE_SUPABASE_URL || "https://rpaodsmwhmzyhopvkwjt.supabase.co";

  const [leads, setLeads] = useState<LeadData[]>(
    getMockLeadsForCity(cityName, countryName)
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`${supabaseUrl}/functions/v1/public-leads`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ city: cityName }),
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.leads?.length) setLeads(d.leads);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [cityName]);

  const registerUrl = `/register?city=${encodeURIComponent(cityName)}&country=${encodeURIComponent(countryName)}`;
  const regionLabel = usState ? `${cityName}, ${usState}, ${countryName}` : displayLocation;

  // Skills to show on city page
  const skillLinks = ALL_SKILL_SLUGS.slice(0, 12);

  return (
    <MarketingShell>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border bg-[#020b21] py-20 lg:py-28">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-transparent to-primary/10 pointer-events-none" />
        <div className="relative mx-auto max-w-5xl px-4 lg:px-8 text-center z-10">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-400 font-mono uppercase tracking-wider mb-6">
            {flag} {regionLabel}
          </span>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
            Find Clients in{" "}
            <span className="text-primary">{displayLocation}</span>
          </h1>
          <p className="mt-5 text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Discover businesses in {displayLocation} that need your freelance skills — with verified contacts and opportunity scores.
          </p>
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <Link
              to={registerUrl as any}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]"
            >
              Get Free Leads in {cityName} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-mono text-slate-400 pt-4 justify-center">
            <span className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4 text-emerald-500" /> No credit card</span>
            <span className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4 text-emerald-500" /> Instant access</span>
            <span className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4 text-emerald-500" /> 10 free leads</span>
          </div>
        </div>
      </section>

      {/* Live Lead Cards */}
      <section className="bg-background py-20 border-b border-border">
        <div className="mx-auto max-w-6xl px-4 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Real leads from {cityName}</p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight md:text-4xl">Businesses waiting for your services</h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto text-sm">
              These are real businesses in {displayLocation} scored by how urgently they need freelance help.
            </p>
          </div>
          {loading ? (
            <div className="grid gap-6 md:grid-cols-3">
              {[0,1,2].map(i => (
                <div key={i} className="rounded-2xl border border-border bg-card/50 h-56 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-3">
              {leads.map((lead, idx) => (
                <MaskedLeadCard key={idx} lead={lead} registerUrl={registerUrl} />
              ))}
            </div>
          )}
          <div className="text-center mt-10">
            <Link
              to={registerUrl as any}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition"
            >
              Sign up to see all {cityName} leads <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why This City */}
      <section className="bg-muted/30 py-20 border-b border-border">
        <div className="mx-auto max-w-5xl px-4 lg:px-8">
          <h2 className="font-display text-2xl font-bold tracking-tight md:text-3xl text-center mb-12">
            Why freelance in {displayLocation}?
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: TrendingUp, title: "Growing Economy", desc: `${displayLocation} has a rapidly expanding business ecosystem with increasing demand for digital services.` },
              { icon: Building2, title: "Dense SME Market", desc: "Thousands of small businesses still lack websites, social media, or professional services." },
              { icon: Globe, title: "Low Digital Adoption", desc: "Most businesses rely on word-of-mouth — a massive opportunity for freelancers." },
            ].map((item, idx) => (
              <div key={idx} className="rounded-2xl border border-border bg-card p-6 text-center shadow-card hover:shadow-card-hover transition duration-300">
                <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-xl bg-primary/10 border border-primary/20">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-display text-sm font-bold text-foreground">{item.title}</h3>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Find by skill in this city */}
      <section className="bg-background py-16 border-b border-border">
        <div className="mx-auto max-w-4xl px-4 lg:px-8 text-center">
          <h2 className="font-display text-xl font-bold tracking-tight md:text-2xl mb-8">
            Find {cityName} clients as a:
          </h2>
          <div className="flex flex-wrap gap-3 justify-center">
            {skillLinks.map((skillSlug) => (
              <Link
                key={skillSlug}
                to={`/find-clients/${skillSlug}/${slug}` as any}
                className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-accent hover:border-primary/30 transition-all duration-200 hover:-translate-y-0.5"
              >
                {getSkillLabel(skillSlug)}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-[#020b21] py-20">
        <div className="mx-auto max-w-3xl px-4 lg:px-8 text-center">
          <Zap className="h-8 w-8 text-primary mx-auto mb-4" />
          <h2 className="font-display text-3xl font-bold text-white tracking-tight md:text-4xl">
            Start finding clients in {cityName} today
          </h2>
          <p className="mt-4 text-slate-400 max-w-xl mx-auto">
            Join freelancers already using LanceConnect to win local business contracts in {displayLocation}.
          </p>
          <Link
            to={registerUrl as any}
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-4 text-base font-semibold text-primary-foreground hover:bg-primary/90 transition shadow-lg shadow-primary/25 hover:scale-[1.02]"
          >
            Get 10 Free Leads <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </MarketingShell>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// DYNAMIC SKILL PAGE TEMPLATE
// ═══════════════════════════════════════════════════════════════════════════
function SkillPage({ data }: { data: any }) {
  const { slug, skillConfig } = data;
  const registerUrl = `/register?category=${skillConfig.category}`;

  return (
    <MarketingShell>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border bg-[#020b21] py-20 lg:py-28">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-primary/10 pointer-events-none" />
        <div className="relative mx-auto max-w-5xl px-4 lg:px-8 text-center z-10">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-semibold text-primary font-mono uppercase tracking-wider mb-6">
            💼 {skillConfig.label}
          </span>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
            Find Clients as a{" "}
            <span className="text-primary">{skillConfig.label}</span>
          </h1>
          <p className="mt-5 text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            {skillConfig.description} Get direct contact details. 10 free leads, no credit card.
          </p>
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <Link
              to={registerUrl as any}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]"
            >
              Get 10 Free {skillConfig.label} Leads <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-mono text-slate-400 pt-4 justify-center">
            <span className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4 text-emerald-500" /> No credit card</span>
            <span className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4 text-emerald-500" /> Instant access</span>
            <span className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4 text-emerald-500" /> 10 free leads</span>
          </div>
        </div>
      </section>

      {/* Niche Cards */}
      <section className="bg-background py-20 border-b border-border">
        <div className="mx-auto max-w-6xl px-4 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Who needs you right now</p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight md:text-4xl">Businesses that need a {skillConfig.label}</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {skillConfig.niches.map((niche: any, idx: number) => (
              <div key={idx} className="rounded-2xl border border-border bg-card p-6 hover:border-primary/30 transition duration-300 shadow-sm">
                <span className="text-3xl block mb-4">{niche.icon}</span>
                <h3 className="font-display font-bold text-foreground mb-2">{niche.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{niche.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Cities for this skill */}
      <section className="bg-muted/30 py-16 border-b border-border">
        <div className="mx-auto max-w-4xl px-4 lg:px-8 text-center">
          <h2 className="font-display text-xl font-bold tracking-tight md:text-2xl mb-8">
            Find {skillConfig.label} clients in:
          </h2>
          <div className="flex flex-wrap gap-3 justify-center">
            {[
              { label: "Lagos", to: `/find-clients/${slug}/lagos` },
              { label: "London", to: `/find-clients/${slug}/london` },
              { label: "Dubai", to: `/find-clients/${slug}/dubai` },
              ...TOP_CITIES.slice(0, 8).map((city) => ({
                label: formatCityName(city),
                to: `/find-clients/${slug}/${city}`,
              })),
            ].map((c) => (
              <Link
                key={c.label}
                to={c.to as any}
                className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-accent hover:border-primary/30 transition-all duration-200 hover:-translate-y-0.5 flex items-center gap-1.5"
              >
                <MapPin className="h-3 w-3 text-muted-foreground" /> {c.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-[#020b21] py-20">
        <div className="mx-auto max-w-3xl px-4 lg:px-8 text-center">
          <Sparkles className="h-8 w-8 text-primary mx-auto mb-4" />
          <h2 className="font-display text-3xl font-bold text-white tracking-tight md:text-4xl">
            Stop waiting. Start winning {skillConfig.label} clients.
          </h2>
          <p className="mt-4 text-slate-400 max-w-xl mx-auto">
            LanceConnect scans millions of businesses and hands you the ones that need exactly what you offer.
          </p>
          <Link
            to={registerUrl as any}
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-4 text-base font-semibold text-primary-foreground hover:bg-primary/90 transition shadow-lg shadow-primary/25 hover:scale-[1.02]"
          >
            Get 10 Free Leads <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </MarketingShell>
  );
}
