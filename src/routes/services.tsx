import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketingShell, PageHeader } from "@/components/marketing/MarketingShell";
import { CATEGORIES } from "@/data/mockData";
import { IMG } from "@/data/content";
import { useState } from "react";
import { toast } from "sonner";
import {
  Code2,
  Palette,
  PenTool,
  LineChart,
  Smartphone,
  Film,
  Camera,
  Megaphone,
  AppWindow,
  Handshake,
  GraduationCap,
  Leaf,
  Utensils,
  Package,
  Factory,
  Brain,
  Target,
  Users,
  Sparkles,
  ArrowRight,
  Search,
  Compass,
  Plus,
  Minus,
  HelpCircle,
  Send,
  CheckCircle2,
  MailCheck,
} from "lucide-react";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Service Directories — LanceConnect" },
      {
        name: "description",
        content:
          "Browse specialized lead directories for 18+ freelancing and niche trade categories across 150+ countries.",
      },
      { property: "og:title", content: "LanceConnect Services" },
    ],
  }),
  component: ServicesPage,
});

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

function ServicesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Suggestion Form States
  const [suggestName, setSuggestName] = useState("");
  const [suggestEmail, setSuggestEmail] = useState("");
  const [suggestNiche, setSuggestNiche] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSuggestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!suggestName || !suggestEmail || !suggestNiche) {
      toast.error("Please fill in all fields.");
      return;
    }
    setSubmitted(true);
    toast.success("Thank you! Your custom directory request has been sent.");
  };

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  // Live Categorization & Search
  const filteredCategories = CATEGORIES.filter((c) => {
    const matchesSearch =
      c.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.example.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeTab === "all") return matchesSearch;
    if (activeTab === "digital") {
      return (
        matchesSearch &&
        [
          "web_dev",
          "designer",
          "copywriter",
          "seo",
          "social_media",
          "video",
          "photography",
          "marketing",
          "app_dev",
          "va",
        ].includes(c.id)
      );
    }
    if (activeTab === "trade") {
      return (
        matchesSearch &&
        ["african_food_export", "restaurant_supplier", "product_export", "b2b_trade"].includes(c.id)
      );
    }
    if (activeTab === "consulting") {
      return (
        matchesSearch &&
        ["tutor", "human_capital", "training_recruitment", "parent_tutor"].includes(c.id)
      );
    }
    return matchesSearch;
  });

  const stats = [
    { value: "18+", label: "Specialized Industries", desc: "Digital creators to physical B2B trade" },
    { value: "150+", label: "Countries Covered", desc: "Local scanners active on 6 continents" },
    { value: "45K+", label: "Verified Client Leads", desc: "Scraped, checked, and updated daily" },
    { value: "98.4%", label: "Contact Accuracy", desc: "Double-checked to eliminate bounces" },
  ];

  const steps = [
    {
      num: "01",
      title: "Select Your Niche",
      desc: "Browse our 18+ targeted trade and freelance directories to find your specific vertical.",
    },
    {
      num: "02",
      title: "View Active Opportunities",
      desc: "Our AI crawler filters out low-value listings, highlighting businesses ready to buy.",
    },
    {
      num: "03",
      title: "Pitch & Close Deals",
      desc: "Grab email templates tailored to each client's specific business weaknesses and hit send.",
    },
  ];

  const faqs = [
    {
      q: "How often are the client leads updated?",
      a: "Our automated crawlers check local business directories, search engines, and social signals every 24 hours to index newly active companies, ensuring you receive fresh opportunities daily.",
    },
    {
      q: "Are the contact details verified?",
      a: "Yes. Every lead is double-checked using domain MX audits for email validation and dialer checks for telephone line connectivity to save you time and prevent bouncebacks.",
    },
    {
      q: "Can I export directories for my outreach tools?",
      a: "Absolutely. Premium plan members can export full categories as CSV or JSON files to feed directly into outbound sequence systems like HubSpot, Lemlist, or Instantly.",
    },
    {
      q: "What if I sell a custom service not listed here?",
      a: "We regularly build custom lead-matching scrapers and filters for our users. You can suggest a custom category in the interactive form below, and our engineering team will build it.",
    },
  ];

  return (
    <MarketingShell>
      <PageHeader
        eyebrow="Services"
        title="Directories for every craft & trade."
        subtitle="Select a category to view verified client leads, local opportunities, and custom templates."
        image={IMG.workspace}
      />

      {/* SECTION 1: Stats Bar */}
      <section className="mx-auto max-w-7xl px-4 py-8 lg:px-8 -mt-10 relative z-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 bg-card border border-border/80 rounded-2xl p-6 shadow-xl backdrop-blur-md">
          {stats.map((s, idx) => (
            <div
              key={idx}
              className="text-center sm:text-left p-4 border-b border-border/40 last:border-0 sm:border-b-0 sm:border-r last:sm:border-r-0 border-dashed"
            >
              <p className="font-display text-3xl font-black text-primary tracking-tight">
                {s.value}
              </p>
              <p className="text-xs font-bold text-foreground mt-1">{s.label}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 2: Search & Live Directory Grid */}
      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8 bg-background">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="font-display text-2xl font-bold tracking-tight md:text-3xl text-foreground">
            Explore Directories
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Search our databases or filter by industry type to inspect current local opportunities.
          </p>

          {/* Search Box */}
          <div className="relative mt-8 max-w-lg mx-auto">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-4 w-4 text-muted-foreground" />
            </div>
            <input
              type="text"
              placeholder="Search category (e.g. Developer, Supplier, Export...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-input bg-card py-3 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary/30 shadow-sm"
            />
          </div>

          {/* Tab Filters */}
          <div className="flex flex-wrap justify-center gap-1.5 mt-6">
            {[
              { id: "all", label: "All Directories" },
              { id: "digital", label: "Digital & Creative" },
              { id: "trade", label: "Trade & Export" },
              { id: "consulting", label: "Education & Consulting" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-full px-4 py-1.5 text-xs font-mono font-bold transition cursor-pointer select-none ${
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground shadow"
                    : "border border-border bg-card text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Directory Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredCategories.map((c) => {
            const Icon = CATEGORY_ICONS[c.id] || Sparkles;
            return (
              <Link
                to="/freelancers/$slug"
                params={{ slug: categorySlug(c.id) }}
                key={c.id}
                className="group rounded-2xl border border-border bg-card p-6 transition hover:border-foreground/30 hover:shadow-card-hover flex flex-col justify-between hover:-translate-y-0.5 duration-200"
              >
                <div>
                  <div className="text-primary h-10 w-10 flex items-center justify-center rounded-xl bg-primary/10 border border-primary/20 transition group-hover:bg-primary/20">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="mt-5 font-display text-base font-bold text-foreground">
                    {c.label}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    {c.example}
                  </p>
                </div>
                <div className="mt-6">
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary group-hover:underline">
                    Explore Directory <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Search Empty State */}
        {filteredCategories.length === 0 && (
          <div className="text-center py-16 bg-card rounded-2xl border border-dashed border-border/80 max-w-md mx-auto shadow-sm">
            <Compass className="h-10 w-10 text-muted-foreground/60 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-foreground">No directories matched</h3>
            <p className="text-xs text-muted-foreground mt-1 px-4">
              We couldn't find any directories matching your filter. Submit a custom directory request below, and we will look into adding it!
            </p>
          </div>
        )}
      </section>

      {/* SECTION 3: 3-Step Walkthrough */}
      <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8 bg-card rounded-3xl border border-border/50 my-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-display text-2xl font-bold md:text-3xl text-foreground">
            How to win clients using directories
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            A simple, step-by-step walkthrough to start booking clients in 150+ countries.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3 relative">
          {/* Connector line (desktop only) */}
          <div className="hidden lg:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-border/40 z-0 border-dashed" />

          {steps.map((step, idx) => (
            <div key={idx} className="relative z-10 flex flex-col items-center text-center px-4 group">
              <div className="h-12 w-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-mono text-xs font-bold text-primary mb-6 transition group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-105 duration-200">
                {step.num}
              </div>
              <h3 className="font-display text-lg font-bold text-foreground">{step.title}</h3>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground max-w-xs">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 4: FAQs */}
      <section className="mx-auto max-w-4xl px-4 py-20 bg-background">
        <div className="text-center mb-12">
          <HelpCircle className="h-8 w-8 text-primary mx-auto mb-3" />
          <h2 className="font-display text-2xl font-bold md:text-3xl text-foreground">
            Frequently Asked Questions
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Got questions about our specialized lead databases? We've got answers.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="bg-card border border-border/80 rounded-xl overflow-hidden transition"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between p-5 text-left font-display font-bold text-sm text-foreground hover:bg-accent/40 cursor-pointer select-none"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <Minus className="h-4 w-4 text-primary shrink-0 ml-4" />
                  ) : (
                    <Plus className="h-4 w-4 text-muted-foreground shrink-0 ml-4" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-muted-foreground leading-relaxed border-t border-border/30 pt-4 bg-accent/10">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 5: Interactive Custom Niche Suggestion Form */}
      <section
        className="bg-parallax relative min-h-[350px] w-full flex items-center justify-center rounded-3xl my-12 overflow-hidden px-4 py-12"
        style={{ backgroundImage: "url('/assets/freelancers/freelancer_15.jpg')" }}
      >
        <div className="absolute inset-0 bg-[#020b21] opacity-85 mix-blend-multiply z-0" />
        <div className="relative z-10 w-full max-w-xl text-center text-white">
          {!submitted ? (
            <>
              <p className="text-xs font-mono text-primary uppercase tracking-widest">
                // trade.and.service.intelligence
              </p>
              <h3 className="mt-4 font-display text-2xl font-bold tracking-tight text-white">
                Need a custom lead category?
              </h3>
              <p className="mt-2 text-sm text-slate-300 mb-8 max-w-md mx-auto">
                Tell us about your target clients. We regularly build new custom filters and scrapper scripts.
              </p>

              <form
                onSubmit={handleSuggestSubmit}
                className="bg-card/45 backdrop-blur-md border border-white/10 rounded-2xl p-6 text-left space-y-4 shadow-xl"
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-300 mb-1">
                      Your Name
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. John Doe"
                      value={suggestName}
                      onChange={(e) => setSuggestName(e.target.value)}
                      className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-primary outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-300 mb-1">
                      Email Address
                    </label>
                    <input
                      required
                      type="email"
                      placeholder="e.g. john@example.com"
                      value={suggestEmail}
                      onChange={(e) => setSuggestEmail(e.target.value)}
                      className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-primary outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-300 mb-1">
                    Describe target clients / directories you need
                  </label>
                  <textarea
                    required
                    placeholder="e.g. 'SaaS founders in Austin, TX' or 'Industrial coffee bean wholesalers in Brazil'"
                    value={suggestNiche}
                    onChange={(e) => setSuggestNiche(e.target.value)}
                    rows={3}
                    className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-primary outline-none resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary/95 transition shadow-lg cursor-pointer"
                >
                  Submit Request <Send className="h-3.5 w-3.5" />
                </button>
              </form>
            </>
          ) : (
            <div className="bg-card/45 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-xl text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="h-12 w-12 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto">
                <MailCheck className="h-6 w-6 text-emerald-400" />
              </div>
              <h3 className="font-display text-xl font-bold text-white">Request Received!</h3>
              <p className="text-xs text-slate-300 leading-relaxed max-w-sm mx-auto">
                Thanks, {suggestName}! We have logged your request for the <strong>"{suggestNiche}"</strong> directory. Our team will review the target parameters and notify you via email at {suggestEmail}.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setSuggestNiche("");
                }}
                className="inline-flex items-center gap-1.5 text-xs text-primary font-bold hover:underline"
              >
                Submit another request <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          )}
        </div>
      </section>
    </MarketingShell>
  );
}
