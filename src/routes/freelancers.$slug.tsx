import { useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { MarketingShell, PageHeader } from "@/components/marketing/MarketingShell";
import { FREELANCER_CATEGORIES } from "@/data/content";
import { CATEGORIES } from "@/data/mockData";
import { supabase } from "@/lib/supabase";
import {
  ArrowRight,
  AlertCircle,
  Building2,
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
  MapPin,
  DollarSign,
  Mail,
  Phone,
  Globe,
  Github,
  Linkedin,
  Twitter,
  ArrowLeft,
  Star,
  ExternalLink,
  ShieldCheck,
  GraduationCap,
  Leaf,
  Utensils,
  Package,
  Factory,
  BookOpen,
  Heart,
  Award,
  CheckCircle,
  Lightbulb,
  Trophy,
  Hammer,
  Sparkles,
  Clock,
  Mic,
  Volume2,
  Play,
} from "lucide-react";

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  "web-developers": <Code className="h-5 w-5 text-primary" />,
  designers: <Palette className="h-5 w-5 text-primary" />,
  copywriters: <PenTool className="h-5 w-5 text-primary" />,
  "seo-specialists": <TrendingUp className="h-5 w-5 text-primary" />,
  "social-media": <MessageSquare className="h-5 w-5 text-primary" />,
  videographers: <Video className="h-5 w-5 text-primary" />,
  photographers: <Camera className="h-5 w-5 text-primary" />,
  marketers: <Megaphone className="h-5 w-5 text-primary" />,
  "app-developers": <Smartphone className="h-5 w-5 text-primary" />,
  "virtual-assistants": <Users className="h-5 w-5 text-primary" />,
  "online-tutors": <GraduationCap className="h-5 w-5 text-primary" />,
  "african-food-export": <Leaf className="h-5 w-5 text-primary" />,
  "restaurant-suppliers": <Utensils className="h-5 w-5 text-primary" />,
  "product-export": <Package className="h-5 w-5 text-primary" />,
  "b2b-trade": <Factory className="h-5 w-5 text-primary" />,
  "corporate-training": <BookOpen className="h-5 w-5 text-primary" />,
};

const WHOLESALE_CATEGORIES = ["african_food_export", "restaurant_supplier", "product_export", "b2b_trade"];

export const Route = createFileRoute("/freelancers/$slug")({
  loader: async ({ params }) => {
    // 1. Check if slug is a static marketing category landing page
    const cat = FREELANCER_CATEGORIES.find((c) => c.slug === params.slug);
    if (cat) {
      return { type: "category" as const, cat, freelancer: null };
    }

    // 2. Otherwise, treat as vanity username or ID and query public freelancer view
    let query = supabase.from("freelancer_directory").select("*");
    if (params.slug.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
      query = query.eq("id", params.slug);
    } else {
      query = query.eq("username", params.slug);
    }

    const { data: freelancer, error } = await query.maybeSingle();
    if (error || !freelancer) {
      throw notFound();
    }
    return { type: "freelancer" as const, cat: null, freelancer };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [] };
    if (loaderData.type === "category") {
      const { cat } = loaderData;
      return {
        meta: [
          { title: `Find clients as a ${cat.label.toLowerCase()} — LanceConnect` },
          { name: "description", content: cat.tagline },
          { property: "og:title", content: `For ${cat.label}` },
          { property: "og:description", content: cat.tagline },
          { property: "og:image", content: cat.image },
        ],
      };
    } else {
      const { freelancer } = loaderData;
      return {
        meta: [
          { title: `${freelancer.full_name} — Professional Freelancer` },
          {
            name: "description",
            content:
              freelancer.bio ||
              `View portfolio, case studies, and contact details for ${freelancer.full_name} directly on LanceConnect.`,
          },
          { property: "og:title", content: `${freelancer.full_name} Profile` },
          { property: "og:description", content: freelancer.bio || "Hire directly off-platform." },
        ],
      };
    }
  },
  notFoundComponent: () => (
    <MarketingShell>
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="font-display text-3xl font-bold">Profile or Category not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The resource you are trying to reach does not exist or has been made private.
        </p>
        <Link to="/freelancers" className="mt-5 inline-block text-primary hover:underline">
          ← Back to Directory
        </Link>
      </div>
    </MarketingShell>
  ),
  errorComponent: ({ reset }) => (
    <MarketingShell>
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <p>Something went wrong loading this profile.</p>
        <button
          onClick={reset}
          className="mt-3 rounded bg-primary px-4 py-2 text-sm text-primary-foreground"
        >
          Retry
        </button>
      </div>
    </MarketingShell>
  ),
  component: FreelancerSlugPage,
});

function FreelancerSlugPage() {
  const data = Route.useLoaderData();
  if (!data) return null;

  if (data.type === "category") {
    const { cat } = data;
    const others = FREELANCER_CATEGORIES.filter((c) => c.slug !== cat.slug).slice(0, 4);
    return (
      <MarketingShell>
        <PageHeader
          eyebrow={`For ${cat.label}`}
          title={cat.tagline}
          subtitle={cat.description}
          image={cat.image}
        />

        <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8 grid gap-10 lg:grid-cols-2">
          <div>
            <div className="inline-grid h-12 w-12 place-items-center rounded-xl bg-warn/15 text-warn">
              <AlertCircle className="h-6 w-6" />
            </div>
            <h2 className="mt-4 font-display text-3xl font-bold">What we detect</h2>
            <p className="mt-3 text-muted-foreground">
              LanceConnect's scoring engine specifically looks for the signals that mean a business
              is ready to hire {cat.label.toLowerCase()}:
            </p>
            <ul className="mt-5 space-y-2">
              {cat.problems.map((p: string) => (
                <li
                  key={p}
                  className="flex gap-3 rounded-xl border border-border bg-card p-3 text-sm"
                >
                  <span className="text-primary">●</span>
                  {p}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="inline-grid h-12 w-12 place-items-center rounded-xl bg-success/15 text-success">
              <Building2 className="h-6 w-6" />
            </div>
            <h2 className="mt-4 font-display text-3xl font-bold">Example leads</h2>
            <p className="mt-3 text-muted-foreground">
              A snapshot of the kind of businesses you'll see on day one.
            </p>
            <div className="mt-5 space-y-3">
              {cat.sampleBusinesses.map((b: { name: string; reason: string }) => (
                <div key={b.name} className="rounded-xl border border-border bg-card p-4">
                  <p className="font-semibold">{b.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    <span className="text-primary">Why:</span> {b.reason}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 pb-16 lg:px-8">
          <div className="mx-auto max-w-5xl rounded-3xl bg-primary p-10 text-center text-primary-foreground">
            <h2 className="font-display text-3xl font-bold">
              Start with 10 free {cat.label.toLowerCase()} leads.
            </h2>
            <p className="mt-2 text-primary-foreground/90">
              No credit card. Pick your city and they're in your dashboard in seconds.
            </p>
            <Link
              to="/register"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-card px-6 py-3 text-sm font-semibold text-primary hover:scale-105 transition"
            >
              Get my leads <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-20 lg:px-8">
          <h3 className="font-display text-xl font-bold">Other crafts we serve</h3>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {others.map((o) => (
              <Link
                key={o.slug}
                to="/freelancers/$slug"
                params={{ slug: o.slug }}
                className="group rounded-xl border border-border bg-card p-4 hover:border-primary"
              >
                <div className="mb-2 text-primary">
                  {CATEGORY_ICONS[o.slug] || <Code className="h-5 w-5" />}
                </div>
                <p className="mt-2 font-display font-semibold group-hover:text-primary">
                  {o.label}
                </p>
                <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{o.tagline}</p>
              </Link>
            ))}
          </div>
        </section>
      </MarketingShell>
    );
  }

  // Otherwise, render the public Freelancer profile detail page!
  const { freelancer } = data;
  const [flyerExpanded, setFlyerExpanded] = useState(false);
  const [bannerExpanded, setBannerExpanded] = useState(false);

  const isJemoorel = freelancer.username === "jemoorel-uk" || freelancer.contact_email === "info@jemoorel.co.uk";
  const isTrendtactics = freelancer.username === "trendtactics-digital" || freelancer.username === "akinola-web" || freelancer.contact_email === "info@trendtacticsdigital.com" || freelancer.contact_email === "akinola.web@trendtacticsdigital.com";
  const isEdvoura = freelancer.username === "edvoura-learning-hub" || freelancer.username === "akinola-tutor" || freelancer.contact_email === "edvouralearninghub@gmail.com" || freelancer.contact_email === "akinola.tutor@edvouralearninghub.com";
  const isAkinolaMC = freelancer.username === "akinola-olujobi" || freelancer.username === "akinola-mc" || freelancer.contact_email === "connect@akinolaolujobi.com" || freelancer.contact_email === "akinola.mc@akinolaolujobi.com";

  const getCategoryLabel = (id: string) => {
    const cat = CATEGORIES.find((c) => c.id === id);
    return cat ? `${cat.emoji} ${cat.label}` : id;
  };

  // Safe WhatsApp Link Generator
  const getWhatsAppLink = (phone: string, name: string) => {
    const cleanPhone = phone.replace(/[^0-9+]/g, "");
    const message = encodeURIComponent(
      `Hi ${name}, I saw your profile on LanceConnect and would love to discuss a project with you!`,
    );
    return `https://wa.me/${cleanPhone.replace("+", "")}?text=${message}`;
  };

  return (
    <MarketingShell>
      {/* Detail Layout Container */}
      <div className="bg-background min-h-screen py-10">
        <div className="mx-auto max-w-6xl px-4 lg:px-8">
          {/* Back Button */}
          <Link
            to="/freelancers"
            className="inline-flex items-center gap-2 text-xs font-mono text-muted-foreground hover:text-foreground mb-8 transition"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Freelancers Directory
          </Link>

          {/* Profile Header Grid */}
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Left/Main Content Column (Bio & Case Studies) */}
            <div className="lg:col-span-2 space-y-8">
              {/* Profile Card */}
              <div className="rounded-3xl border border-border bg-card p-6 md:p-8 shadow-card flex flex-col md:flex-row gap-6 items-start">
                <div className="h-20 w-20 rounded-full overflow-hidden border-2 border-primary/20 shrink-0 bg-primary/10 flex items-center justify-center font-bold text-primary text-xl">
                  {freelancer.avatar_url ? (
                    <img
                      src={freelancer.avatar_url}
                      alt={freelancer.full_name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    freelancer.full_name
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)
                  )}
                </div>
                <div className="flex-1 space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="font-display font-extrabold text-2xl tracking-tight text-foreground">
                      {freelancer.full_name}
                    </h1>
                    <span className="inline-flex items-center gap-1 rounded bg-primary/10 border border-primary/20 px-2 py-0.5 text-[9px] font-mono text-primary font-bold">
                      <ShieldCheck className="h-3 w-3" /> Verified Builder
                    </span>
                  </div>
                  <p className="text-xs font-mono text-primary font-semibold uppercase tracking-wider leading-none">
                    {getCategoryLabel(freelancer.freelancer_category)}
                  </p>
                  {freelancer.tagline && (
                    <p className="text-xs text-slate-700 dark:text-slate-300 font-medium italic mt-1.5">
                      "{freelancer.tagline}"
                    </p>
                  )}

                  {/* Meta Details */}
                  <div className="flex flex-wrap gap-4 text-xs font-mono text-muted-foreground">
                    {(freelancer.city || freelancer.country) && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4 text-slate-500" />
                        {freelancer.city ? `${freelancer.city}, ` : ""}
                        {freelancer.country}
                      </span>
                    )}
                    {WHOLESALE_CATEGORIES.includes(freelancer.freelancer_category) ? (
                      <span className="flex items-center text-emerald-500 font-semibold">
                        Wholesale / Custom Quote
                      </span>
                    ) : freelancer.hourly_rate ? (
                      <span className="flex items-center text-emerald-500 font-semibold">
                        <DollarSign className="h-4 w-4" />
                        {freelancer.hourly_rate} USD / hr
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>

              {isJemoorel ? (
                <div className="space-y-8 animate-fade-in">
                  {/* Core Corporate Banner */}
                  <div className="rounded-3xl border border-border bg-card p-6 md:p-8 shadow-card flex flex-col md:flex-row gap-8 items-center md:items-start">
                    <img
                      src="/assets/freelancers/jemoorel_logo.jpg"
                      alt="Je'moorel Logo"
                      className="w-32 h-32 rounded-2xl border border-border bg-[#fff9f2] shrink-0 object-contain p-2 shadow-sm"
                    />
                    <div className="space-y-4 text-center md:text-left">
                      <h2 className="font-display text-xl font-bold text-foreground">
                        Je'moorel UK Ltd
                      </h2>
                      <p className="text-xs font-mono font-bold text-emerald-500 uppercase tracking-widest leading-none">
                        Quality Food. Transformational Learning.
                      </p>
                      <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                        Jemoorel UK Ltd is a B2B B2B agency committed to improving lives through quality food supply and transformational learning. We bridge premium African food distribution with workforce development & leadership training to deliver lasting value and strengthen global communities.
                      </p>
                    </div>
                  </div>

                  {/* Story & Mission Grid */}
                  <div className="grid gap-6 md:grid-cols-2">
                    {/* Story Card */}
                    <div className="rounded-3xl border border-border bg-card p-6 shadow-card space-y-3">
                      <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2">
                        📖 Our Story
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        Founded with a vision to create impact that lasts, Jemoorel UK Ltd was built on the belief that everyone deserves access to quality resources, practical skills, and real opportunities. Led by <strong>Margaret Ogunleye</strong>, a leadership and workforce development professional, the company combines expertise, passion, and purpose to deliver solutions that make a real difference.
                      </p>
                    </div>

                    {/* Mission Card */}
                    <div className="rounded-3xl border border-border bg-card p-6 shadow-card space-y-3">
                      <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2">
                        🎯 Our Mission
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        To empower individuals, families, and organisations through quality food supply and transformational learning that promote growth, self-reliance, and a better future. We don't just deliver products or training — we deliver transformation, opportunity, and lasting impact.
                      </p>
                    </div>
                  </div>

                  {/* Deliverables Checklist */}
                  <div className="rounded-3xl border border-border bg-card p-6 md:p-8 shadow-card space-y-6">
                    <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2 border-b border-border/40 pb-3">
                      📦 We Deliver (Bulk & Wholesale Services)
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                      {[
                        "Wholesale Palm Oil",
                        "African Food Products",
                        "Bulk Sourcing & Supply",
                        "Cooked Food Delivery",
                        "Catering & Events Anchor",
                        "AI Training & Development",
                        "Leadership & Workforce Training",
                        "Learning & L&D Solutions",
                        "Business Growth Support",
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300 font-medium">
                          <CheckCircle className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Values Grid */}
                  <div className="rounded-3xl border border-border bg-card p-6 md:p-8 shadow-card space-y-6">
                    <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2 border-b border-border/40 pb-3">
                      🤝 Our Core Values
                    </h3>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
                      {[
                        {
                          title: "People First",
                          desc: "We put people at the heart of everything we do.",
                          icon: <Users className="h-5 w-5 text-emerald-500" />,
                        },
                        {
                          title: "Quality",
                          desc: "Excellence in our products, training, and services.",
                          icon: <Award className="h-5 w-5 text-amber-500" />,
                        },
                        {
                          title: "Growth",
                          desc: "Continuous learning, development, and improvement.",
                          icon: <TrendingUp className="h-5 w-5 text-cyan-500" />,
                        },
                        {
                          title: "Integrity",
                          desc: "We operate with honesty, transparency, and accountability.",
                          icon: <ShieldCheck className="h-5 w-5 text-rose-500" />,
                        },
                        {
                          title: "Community Impact",
                          desc: "We are passionate about building stronger communities.",
                          icon: <Heart className="h-5 w-5 text-pink-500" />,
                        },
                      ].map((value, idx) => (
                        <div key={idx} className="space-y-2 text-center sm:text-left">
                          <div className="inline-grid h-10 w-10 place-items-center rounded-xl bg-slate-500/5 border border-border">
                            {value.icon}
                          </div>
                          <h4 className="font-display font-semibold text-xs text-foreground leading-tight">{value.title}</h4>
                          <p className="text-[10px] text-muted-foreground leading-normal">{value.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Product Catalogue Gallery */}
                  <div className="rounded-3xl border border-border bg-card p-6 md:p-8 shadow-card space-y-6">
                    <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2 border-b border-border/40 pb-3">
                      🌍 Wholesale Sourcing Catalogue
                    </h3>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {[
                        {
                          title: "Jerry Cans of Premium Palm Oil",
                          image: "/assets/freelancers/jemoorel_food_1.jpg",
                          desc: "Premium grade red palm oil, imported directly and securely sealed in containers for bulk distribution.",
                        },
                        {
                          title: "Egusi (Melon Seeds)",
                          image: "/assets/freelancers/jemoorel_food_2.jpg",
                          desc: "Hand-peeled, clean, high-grade egusi seeds packaged in bulk for UK wholesale markets.",
                        },
                        {
                          title: "Smoked Fish & Meat",
                          image: "/assets/freelancers/jemoorel_food_3.jpg",
                          desc: "Traditional flavor wood-smoked dry fish and protein sources, packaged under high hygiene standards.",
                        },
                        {
                          title: "Stockfish Heads & Pieces",
                          image: "/assets/freelancers/jemoorel_food_4.jpg",
                          desc: "Dry stockfish parts sourced directly for authentic African seasonings and traditional soup recipes.",
                        },
                        {
                          title: "Dried Crayfish",
                          image: "/assets/freelancers/jemoorel_food_5.jpg",
                          desc: "Whole dry crayfish/shrimps, clean and securely packed in bulk quantities.",
                        },
                      ].map((product, idx) => (
                        <div key={idx} className="rounded-2xl border border-border bg-background p-3 flex flex-col justify-between hover:border-slate-700 transition">
                          <div className="aspect-[4/3] w-full rounded-xl overflow-hidden mb-3 border border-border/40 relative">
                            <img
                              src={product.image}
                              alt={product.title}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div>
                            <h4 className="font-display font-semibold text-xs text-foreground truncate">{product.title}</h4>
                            <p className="text-[10px] text-muted-foreground mt-1 leading-relaxed">{product.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Collapsible Official About Flyer */}
                  <div className="rounded-3xl border border-border bg-card p-6 md:p-8 shadow-card space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-display text-base font-bold text-foreground">
                        📄 Official Corporate Flyer
                      </h3>
                      <button
                        onClick={() => setFlyerExpanded(!flyerExpanded)}
                        className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-primary font-semibold hover:bg-accent transition cursor-pointer"
                      >
                        {flyerExpanded ? "Hide Flyer" : "View Full Flyer"}
                      </button>
                    </div>
                    {flyerExpanded && (
                      <div className="rounded-2xl overflow-hidden border border-border bg-[#fff9f2] p-4 flex justify-center animate-fade-in">
                        <img
                          src="/assets/freelancers/jemoorel_about_flyer.jpg"
                          alt="Je'moorel Corporate Flyer"
                          className="max-w-full h-auto rounded-xl shadow-lg border border-border/20"
                        />
                      </div>
                    )}
                  </div>
                </div>
              ) : isTrendtactics ? (
                <div className="space-y-8 animate-fade-in">
                  {/* Core Corporate Banner */}
                  <div className="rounded-3xl border border-border bg-card p-6 md:p-8 shadow-card flex flex-col md:flex-row gap-8 items-center md:items-start">
                    <div className="w-32 h-32 rounded-2xl border border-border bg-[#061226] shrink-0 flex items-center justify-center p-2 shadow-sm font-black text-cyan-400 text-3xl font-display uppercase tracking-wider relative overflow-hidden">
                      <span>TD</span>
                    </div>
                    <div className="space-y-4 text-center md:text-left">
                      <h2 className="font-display text-xl font-bold text-foreground">
                        Trendtactics Digital
                      </h2>
                      <p className="text-xs font-mono font-bold text-cyan-500 uppercase tracking-widest leading-none">
                        Transforming Brands. Crafting Legacies.
                      </p>
                      <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                        Trendtactics Digital is a global digital growth agency specializing in high-performing web engineering, branding, UI/UX designs, and bespoke web solutions that attract customers, build trust, and drive growth. We engineer modern digital ecosystems to scale businesses and help them stand out online.
                      </p>
                    </div>
                  </div>

                  {/* Story & Mission Grid */}
                  <div className="grid gap-6 md:grid-cols-2">
                    {/* Story Card */}
                    <div className="rounded-3xl border border-border bg-card p-6 shadow-card space-y-3">
                      <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2">
                        📖 Our Story
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        What started as a digital growth mission by <strong>Akinola Olujobi</strong> has evolved into a global powerhouse. At Trendtactics Digital, we combine strategic marketing, creative excellence, and cutting-edge technology to engineer digital ecosystems that turn ambitious ideas into measurable market success.
                      </p>
                    </div>

                    {/* Mission Card */}
                    <div className="rounded-3xl border border-border bg-card p-6 shadow-card space-y-3">
                      <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2">
                        🎯 Our Mission
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        To help businesses grow by building high-performing, fast, and secure digital assets. We don't just write code — we design conversion-focused platforms that capture audience attention and deliver massive return on investment.
                      </p>
                    </div>
                  </div>

                  {/* Services Checklist */}
                  <div className="rounded-3xl border border-border bg-card p-6 md:p-8 shadow-card space-y-6">
                    <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2 border-b border-border/40 pb-3">
                      💼 Our Core Web Services
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                      {[
                        "Business Websites",
                        "E-Commerce Stores",
                        "Custom Web Applications",
                        "UI/UX Design Systems",
                        "SEO Optimization",
                        "AI Tool Integrations",
                        "Landing Pages",
                        "Portfolios & Blogs",
                        "Performance Audits",
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300 font-medium">
                          <CheckCircle className="h-4.5 w-4.5 text-cyan-500 shrink-0" />
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Values Grid */}
                  <div className="rounded-3xl border border-border bg-card p-6 md:p-8 shadow-card space-y-6">
                    <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2 border-b border-border/40 pb-3">
                      🤝 Our Core Values
                    </h3>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {[
                        {
                          title: "Innovation",
                          desc: "We build using the latest frontend frameworks, animations, and AI systems.",
                          icon: <Lightbulb className="h-5 w-5 text-cyan-400" />,
                        },
                        {
                          title: "Results-Driven",
                          desc: "Every design choice is made to maximize user conversion and business growth.",
                          icon: <TrendingUp className="h-5 w-5 text-emerald-400" />,
                        },
                        {
                          title: "Client-Focused",
                          desc: "We prioritize clean communication, quick delivery, and dedicated support.",
                          icon: <Users className="h-5 w-5 text-purple-400" />,
                        },
                      ].map((value, idx) => (
                        <div key={idx} className="space-y-2 text-center sm:text-left">
                          <div className="inline-grid h-10 w-10 place-items-center rounded-xl bg-slate-500/5 border border-border">
                            {value.icon}
                          </div>
                          <h4 className="font-display font-semibold text-xs text-foreground leading-tight">{value.title}</h4>
                          <p className="text-[10px] text-muted-foreground leading-normal">{value.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Portfolio Gallery */}
                  <div className="rounded-3xl border border-border bg-card p-6 md:p-8 shadow-card space-y-6">
                    <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2 border-b border-border/40 pb-3">
                      🚀 Featured Web Portfolio
                    </h3>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {[
                        {
                          title: "Midway Health Inc.",
                          url: "https://midwayhealthinc.com",
                          desc: "Premium healthcare services portal designed for secure scheduling, patient inquiries, and resources.",
                        },
                        {
                          title: "AllenGreen Transportation",
                          url: "https://allengreentransportation.com",
                          desc: "Professional logistics platform featuring detailed fleet directories, freight listings, and booking channels.",
                        },
                        {
                          title: "Edvoura Learning Hub",
                          url: "https://edvouralearninghub.com",
                          desc: "Modern global tutoring portal featuring parent dashboards and academic progress indicators.",
                        },
                        {
                          title: "VocalEdge AI Assistant",
                          url: "https://vocaledge.vercel.app",
                          desc: "AI assistant featuring vocal separations, choir stem exports, and transcript tools.",
                        },
                        {
                          title: "Christ The Haven School",
                          url: "https://christthehavenschool.com",
                          desc: "Premium school website linking parents and students with assignments and notices.",
                        },
                        {
                          title: "Maingrace Global Limited",
                          url: "https://www.maingracegloballimited.com/",
                          desc: "Consultancy website outlining international trade resources and advisory services.",
                        },
                      ].map((project, idx) => (
                        <div key={idx} className="rounded-2xl border border-border bg-background p-4 flex flex-col justify-between hover:border-cyan-500 transition">
                          <div>
                            <h4 className="font-display font-bold text-xs text-foreground">{project.title}</h4>
                            <p className="text-[10px] text-muted-foreground mt-2 leading-relaxed">{project.desc}</p>
                          </div>
                          <a href={project.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[10px] text-cyan-400 font-mono mt-4 hover:underline">
                            Explore website <ExternalLink className="h-2.5 w-2.5" />
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Collapsible Flyer */}
                  <div className="rounded-3xl border border-border bg-card p-6 md:p-8 shadow-card space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-display text-base font-bold text-foreground">
                        📄 Service Flyer & Business Card
                      </h3>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setFlyerExpanded(!flyerExpanded);
                            setBannerExpanded(false);
                          }}
                          className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-primary font-semibold hover:bg-accent transition cursor-pointer"
                        >
                          {flyerExpanded ? "Hide Flyer" : "View Flyer"}
                        </button>
                        <button
                          onClick={() => {
                            setBannerExpanded(!bannerExpanded);
                            setFlyerExpanded(false);
                          }}
                          className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-primary font-semibold hover:bg-accent transition cursor-pointer"
                        >
                          {bannerExpanded ? "Hide Banner" : "View Banner"}
                        </button>
                      </div>
                    </div>
                    {flyerExpanded && (
                      <div className="rounded-2xl overflow-hidden border border-border bg-[#0A1E3F] p-4 flex justify-center animate-fade-in">
                        <img
                          src="/assets/freelancers/trendtactics_flyer.jpg"
                          alt="Trendtactics Flyer"
                          className="max-w-full h-auto rounded-xl shadow-lg border border-border/20"
                        />
                      </div>
                    )}
                    {bannerExpanded && (
                      <div className="rounded-2xl overflow-hidden border border-border bg-[#0A1E3F] p-4 flex justify-center animate-fade-in">
                        <img
                          src="/assets/freelancers/trendtactics_banner.png"
                          alt="Trendtactics Banner"
                          className="max-w-full h-auto rounded-xl shadow-lg border border-border/20"
                        />
                      </div>
                    )}
                  </div>
                </div>
              ) : isEdvoura ? (
                <div className="space-y-8 animate-fade-in">
                  {/* Core Corporate Banner */}
                  <div className="rounded-3xl border border-border bg-card p-6 md:p-8 shadow-card flex flex-col md:flex-row gap-8 items-center md:items-start">
                    <div className="w-32 h-32 rounded-2xl border border-border bg-[#0A1E3F] shrink-0 flex items-center justify-center p-2 shadow-sm font-black text-yellow-400 text-3xl font-display uppercase tracking-wider relative overflow-hidden">
                      <GraduationCap className="h-16 w-16 text-yellow-400" />
                    </div>
                    <div className="space-y-4 text-center md:text-left">
                      <h2 className="font-display text-xl font-bold text-foreground">
                        Edvoura Learning Hub
                      </h2>
                      <p className="text-xs font-mono font-bold text-yellow-500 uppercase tracking-widest leading-none">
                        Where Learners' Dreams Come True.
                      </p>
                      <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                        Edvoura is a premium global learning ecosystem bridging educational gaps with expert online tutoring, personalized homework tracking, interactive gamified dashboards, and curriculum prep (SAT, WAEC, JAMB) for international success.
                      </p>
                    </div>
                  </div>

                  {/* Story & Mission Grid */}
                  <div className="grid gap-6 md:grid-cols-2">
                    {/* Story Card */}
                    <div className="rounded-3xl border border-border bg-card p-6 shadow-card space-y-3">
                      <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2">
                        📖 Our Story
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        Founded by <strong>Akinola Olujobi</strong> to deliver quality 1-on-1 tutoring, Edvoura replaces rigid classroom lists with personalized dashboards. We help K-12 students around the world build confidence, master concepts, and prepare for international academic qualifications.
                      </p>
                    </div>

                    {/* Mission Card */}
                    <div className="rounded-3xl border border-border bg-card p-6 shadow-card space-y-3">
                      <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2">
                        🎯 Our Mission
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        To unlock every child's potential. We connect students with the world's finest tutors to deliver highly interactive sessions, ensuring academic excellence and an organic love for learning.
                      </p>
                    </div>
                  </div>

                  {/* Learning Areas Grid */}
                  <div className="rounded-3xl border border-border bg-card p-6 md:p-8 shadow-card space-y-6">
                    <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2 border-b border-border/40 pb-3">
                      ✏️ Curated Learning Areas
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                      {[
                        "Numeracy & Mathematics",
                        "Literacy & English",
                        "General Science",
                        "General Knowledge",
                        "Core Life Skills",
                        "Critical Thinking Skills",
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300 font-medium">
                          <CheckCircle className="h-4.5 w-4.5 text-yellow-500 shrink-0" />
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* K-12 Program Bands */}
                  <div className="rounded-3xl border border-border bg-card p-6 md:p-8 shadow-card space-y-6">
                    <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2 border-b border-border/40 pb-3">
                      🎓 Age-Based Learning Programs
                    </h3>
                    <div className="grid gap-6 md:grid-cols-3">
                      {[
                        {
                          band: "Explorer Band (Grades 1-3)",
                          desc: "Learning feels like playtime. Gamified sticker books, interactive subject games, and visual reward gardens.",
                          icon: <Sparkles className="h-6 w-6 text-yellow-500" />,
                        },
                        {
                          band: "Builder Band (Grades 4-6)",
                          desc: "Building mastery and consistency. Subject-level badge walls, milestone checklists, homework and quiz hubs.",
                          icon: <Hammer className="h-6 w-6 text-emerald-500" />,
                        },
                        {
                          band: "Achiever Band (Grades 7-12)",
                          desc: "College prep command center. High-performance study dashboard tailored for WAEC, JAMB, SAT, and NECO exams.",
                          icon: <Trophy className="h-6 w-6 text-rose-500" />,
                        },
                      ].map((prog, idx) => (
                        <div key={idx} className="rounded-2xl border border-border bg-background p-5 space-y-3">
                          <div className="inline-grid h-10 w-10 place-items-center rounded-xl bg-slate-500/5 border border-border">
                            {prog.icon}
                          </div>
                          <h4 className="font-display font-semibold text-xs text-foreground leading-tight">{prog.band}</h4>
                          <p className="text-[10px] text-muted-foreground leading-normal">{prog.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Testimonials */}
                  <div className="rounded-3xl border border-border bg-card p-6 md:p-8 shadow-card space-y-6">
                    <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2 border-b border-border/40 pb-3">
                      🌟 What Parents Say
                    </h3>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {[
                        {
                          quote: "Edvoura matched me with a specialist for my AP Calculus prep. The sessions are world-class, and the dashboard tools are better than anything I've seen in Canada.",
                          author: "Sarah Jenkins",
                          location: "Toronto, Canada",
                        },
                        {
                          quote: "My daughter loves the Explorer Band. The stickers and games keep her engaged for hours while she masters Mandarin and English simultaneously.",
                          author: "Wei Zhang",
                          location: "Shanghai, China",
                        },
                        {
                          quote: "We use the platform for weekend intensive sessions. The quality of tutors available at any time is incredible. High-performance learning at its best.",
                          author: "David Miller",
                          location: "Houston, USA",
                        },
                      ].map((item, idx) => (
                        <div key={idx} className="rounded-xl border border-border bg-background p-4 flex flex-col justify-between">
                          <p className="text-[10px] text-slate-700 dark:text-slate-300 italic leading-relaxed">"{item.quote}"</p>
                          <div className="mt-4 pt-3 border-t border-border/40">
                            <p className="text-[10px] font-bold text-foreground leading-none">{item.author}</p>
                            <p className="text-[8px] text-muted-foreground mt-0.5">{item.location}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Collapsible Flyer */}
                  <div className="rounded-3xl border border-border bg-card p-6 md:p-8 shadow-card space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-display text-base font-bold text-foreground">
                        📄 Service Flyer
                      </h3>
                      <button
                        onClick={() => setFlyerExpanded(!flyerExpanded)}
                        className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-primary font-semibold hover:bg-accent transition cursor-pointer"
                      >
                        {flyerExpanded ? "Hide Flyer" : "View Flyer"}
                      </button>
                    </div>
                    {flyerExpanded && (
                      <div className="rounded-2xl overflow-hidden border border-border bg-[#0A1E3F] p-4 flex justify-center animate-fade-in">
                        <img
                          src="/assets/freelancers/edvoura_flyer.jpg"
                          alt="Edvoura Flyer"
                          className="max-w-full h-auto rounded-xl shadow-lg border border-border/20"
                        />
                      </div>
                    )}
                  </div>
                </div>
              ) : isAkinolaMC ? (
                <div className="space-y-8 animate-fade-in">
                  {/* Core Corporate Banner */}
                  <div className="rounded-3xl border border-border bg-card p-6 md:p-8 shadow-card flex flex-col md:flex-row gap-8 items-center md:items-start">
                    <div className="w-32 h-32 rounded-2xl border border-border bg-[#111] shrink-0 flex items-center justify-center p-2 shadow-sm font-black text-amber-500 text-3xl font-display uppercase tracking-wider relative overflow-hidden">
                      <Mic className="h-16 w-16 text-amber-500" />
                    </div>
                    <div className="space-y-4 text-center md:text-left">
                      <h2 className="font-display text-xl font-bold text-foreground">
                        Akinola Olujobi
                      </h2>
                      <p className="text-xs font-mono font-bold text-amber-500 uppercase tracking-widest leading-none">
                        Your Story. Clearly Delivered.
                      </p>
                      <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                        Akinola Olujobi is a premium Master of Ceremonies, event host, and strategic anchor providing elite stage presence and eloquent delivery for corporate galas, high-stakes summits, conferences, and high-profile social events globally.
                      </p>
                    </div>
                  </div>

                  {/* Story & Mission Grid */}
                  <div className="grid gap-6 md:grid-cols-2">
                    {/* Story Card */}
                    <div className="rounded-3xl border border-border bg-card p-6 shadow-card space-y-3">
                      <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2">
                        🎙️ Professional Speaker & MC
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        With an articulate command of English, dynamic stage presence, and a deep understanding of corporate event flows, <strong>Akinola Olujobi</strong> ensures that every event is anchored with elite prestige and absolute clarity.
                      </p>
                    </div>

                    {/* Mission Card */}
                    <div className="rounded-3xl border border-border bg-card p-6 shadow-card space-y-3">
                      <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2">
                        🎯 Event Philosophy
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        "Your story. My signature." Every audience engagement is crafted to deliver key brand messages clearly, maintaining high energy, decorum, and seamless transitions from start to finish.
                      </p>
                    </div>
                  </div>

                  {/* Services Checklist */}
                  <div className="rounded-3xl border border-border bg-card p-6 md:p-8 shadow-card space-y-6">
                    <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2 border-b border-border/40 pb-3">
                      🎤 MC & Speaking Event Formats
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                      {[
                        "Corporate Galas & Awards",
                        "High-Stakes Summits",
                        "Press Conferences",
                        "Strategic Event Anchoring",
                        "Panel Moderation",
                        "Keynote Speaking",
                        "High-Profile Social events",
                        "B2B Product Launches",
                        "Global Conferences",
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300 font-medium">
                          <CheckCircle className="h-4.5 w-4.5 text-amber-500 shrink-0" />
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* MC Quality Grids */}
                  <div className="rounded-3xl border border-border bg-card p-6 md:p-8 shadow-card space-y-6">
                    <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2 border-b border-border/40 pb-3">
                      ✨ Signature Hosting Traits
                    </h3>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {[
                        {
                          title: "Elite Stage Presence",
                          desc: "Commanding attention and steering focus to the hosts, speakers, and awardees.",
                          icon: <Award className="h-5 w-5 text-amber-500" />,
                        },
                        {
                          title: "Eloquent & Articulate",
                          desc: "Delivering words with clarity, precise pronunciation, and absolute professional poise.",
                          icon: <Volume2 className="h-5 w-5 text-yellow-500" />,
                        },
                        {
                          title: "Timing & Adaptability",
                          desc: "Keeping event timelines strictly on-track while managing unexpected stage changes smoothly.",
                          icon: <Clock className="h-5 w-5 text-cyan-500" />,
                        },
                      ].map((value, idx) => (
                        <div key={idx} className="space-y-2 text-center sm:text-left">
                          <div className="inline-grid h-10 w-10 place-items-center rounded-xl bg-slate-500/5 border border-border">
                            {value.icon}
                          </div>
                          <h4 className="font-display font-semibold text-xs text-foreground leading-tight">{value.title}</h4>
                          <p className="text-[10px] text-muted-foreground leading-normal">{value.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Collapsible Card */}
                  <div className="rounded-3xl border border-border bg-card p-6 md:p-8 shadow-card space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-display text-base font-bold text-foreground">
                        📄 Business Card & Event Banner
                      </h3>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setFlyerExpanded(!flyerExpanded);
                            setBannerExpanded(false);
                          }}
                          className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-primary font-semibold hover:bg-accent transition cursor-pointer"
                        >
                          {flyerExpanded ? "Hide Card" : "View Business Card"}
                        </button>
                        <button
                          onClick={() => {
                            setBannerExpanded(!bannerExpanded);
                            setFlyerExpanded(false);
                          }}
                          className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-primary font-semibold hover:bg-accent transition cursor-pointer"
                        >
                          {bannerExpanded ? "Hide Banner" : "View Event Banner"}
                        </button>
                      </div>
                    </div>
                    {flyerExpanded && (
                      <div className="rounded-2xl overflow-hidden border border-border bg-[#111] p-4 flex justify-center animate-fade-in">
                        <img
                          src="/assets/freelancers/akinola_mc_card.jpg"
                          alt="Akinola MC Card"
                          className="max-w-full h-auto rounded-xl shadow-lg border border-border/20"
                        />
                      </div>
                    )}
                    {bannerExpanded && (
                      <div className="rounded-2xl overflow-hidden border border-border bg-[#111] p-4 flex justify-center animate-fade-in">
                        <img
                          src="/assets/freelancers/akinola_mc_banner.jpg"
                          alt="Akinola MC Banner"
                          className="max-w-full h-auto rounded-xl shadow-lg border border-border/20"
                        />
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  {/* Bio Summary */}
                  <div className="rounded-3xl border border-border bg-card p-6 md:p-8 shadow-card space-y-4">
                    <h2 className="font-display text-lg font-bold text-foreground">
                      // about.freelancer
                    </h2>
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                      {freelancer.bio || "No detailed bio has been uploaded by the freelancer."}
                    </p>
                  </div>

                  {/* Case Studies Grid */}
                  <div className="space-y-4">
                    <h2 className="font-display text-lg font-bold text-foreground px-1">
                      // work.showcase
                    </h2>

                    {!freelancer.portfolio_projects || freelancer.portfolio_projects.length === 0 ? (
                      <div className="rounded-3xl border border-dashed border-border bg-card/40 p-10 text-center select-none">
                        <p className="text-xs text-muted-foreground font-mono">
                          No case studies uploaded for this profile yet.
                        </p>
                      </div>
                    ) : (
                      <div className="grid gap-6 sm:grid-cols-2">
                        {freelancer.portfolio_projects.map((proj: any, idx: number) => (
                          <div
                            key={idx}
                            className="rounded-3xl border border-border bg-card p-4 shadow-card flex flex-col justify-between hover:border-slate-700 transition"
                          >
                            <div>
                              {proj.image && (
                                <div className="aspect-[16/9] w-full rounded-2xl overflow-hidden mb-3.5 border border-border/40 relative group">
                                  <img
                                    src={proj.image}
                                    alt={proj.title}
                                    className="h-full w-full object-cover transition duration-300 group-hover:scale-103"
                                  />
                                </div>
                              )}
                              <h3 className="font-display font-bold text-foreground text-sm truncate leading-snug">
                                {proj.title}
                              </h3>
                              <p className="text-xs text-muted-foreground mt-2 leading-relaxed line-clamp-3">
                                {proj.desc}
                              </p>
                            </div>
                            {proj.link && (
                              <div className="mt-4 pt-3 border-t border-border/40 flex justify-end">
                                <a
                                  href={proj.link}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                                >
                                  Explore project <ExternalLink className="h-3 w-3" />
                                </a>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Right Side Column (Contact Details Panel) */}
            <div className="space-y-6">
              {/* Connect Widget */}
              <div className="rounded-3xl border border-border bg-card p-6 md:p-8 shadow-card space-y-6">
                <h2 className="font-display text-lg font-bold text-foreground">// hire.directly</h2>
                <p className="text-xs text-muted-foreground leading-normal">
                  All contracts are managed directly between you and the{" "}
                  {WHOLESALE_CATEGORIES.includes(freelancer.freelancer_category) ? "supplier" : "freelancer"}.
                  LanceConnect takes 0% commissions or fees.
                </p>

                <div className="space-y-3">
                  {/* Email Button */}
                  <a
                    href={`mailto:${freelancer.contact_email || freelancer.email}`}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-xs font-bold text-primary-foreground hover:bg-primary/95 transition shadow-sm cursor-pointer"
                  >
                    <Mail className="h-4 w-4 shrink-0" />{" "}
                    {WHOLESALE_CATEGORIES.includes(freelancer.freelancer_category)
                      ? "Email Supplier"
                      : "Email Freelancer"}
                  </a>

                  {/* WhatsApp/Phone Button */}
                  {freelancer.contact_phone && (
                    <a
                      href={getWhatsAppLink(freelancer.contact_phone, freelancer.full_name)}
                      target="_blank"
                      rel="noreferrer"
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] text-white hover:bg-[#20ba59] px-4 py-3 text-xs font-bold transition shadow-sm cursor-pointer"
                    >
                      <MessageSquare className="h-4 w-4 shrink-0" />{" "}
                      {WHOLESALE_CATEGORIES.includes(freelancer.freelancer_category)
                        ? "WhatsApp Supplier"
                        : "WhatsApp Message"}
                    </a>
                  )}

                  {/* Website Button */}
                  {freelancer.website_url && (
                    <a
                      href={
                        freelancer.website_url.startsWith("http")
                          ? freelancer.website_url
                          : `https://${freelancer.website_url}`
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-background border border-border hover:border-slate-600 hover:bg-accent px-4 py-3 text-xs font-bold transition shadow-sm cursor-pointer text-foreground"
                    >
                      <Globe className="h-4 w-4 shrink-0 text-slate-400" /> Personal Website
                    </a>
                  )}
                </div>

                {/* Social icons row */}
                <div className="flex items-center justify-center gap-3 pt-4 border-t border-border/40 select-none">
                  {freelancer.github_url && (
                    <a
                      href={freelancer.github_url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 border border-border bg-background rounded-xl text-slate-400 hover:text-white hover:border-slate-700 transition"
                      title="GitHub"
                    >
                      <Github className="h-4 w-4" />
                    </a>
                  )}
                  {freelancer.linkedin_url && (
                    <a
                      href={freelancer.linkedin_url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 border border-border bg-background rounded-xl text-slate-400 hover:text-white hover:border-slate-700 transition"
                      title="LinkedIn"
                    >
                      <Linkedin className="h-4 w-4" />
                    </a>
                  )}
                  {freelancer.twitter_url && (
                    <a
                      href={freelancer.twitter_url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 border border-border bg-background rounded-xl text-slate-400 hover:text-white hover:border-slate-700 transition"
                      title="Twitter/X"
                    >
                      <Twitter className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>

              {/* Safety/Traction Notice */}
              <div className="rounded-3xl border border-border bg-card/60 p-6 shadow-card space-y-3 font-mono text-[10px] leading-relaxed text-muted-foreground select-none">
                <p>💡 **Quick Tips:**</p>
                <p>
                  1. Always establish clear project milestones and payment criteria before starting
                  work.
                </p>
                <p>2. Ask for visual work drafts or Loom recordings to check progress weekly.</p>
                <p>3. Utilize escrow solutions for large corporate contracts.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MarketingShell>
  );
}
