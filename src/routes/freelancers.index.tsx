import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import {
  Star,
  MapPin,
  Search,
  ArrowRight,
  ExternalLink,
  Globe,
  Github,
  Linkedin,
  Twitter,
  Sparkles,
  DollarSign,
  Filter,
  RefreshCw,
} from "lucide-react";
import { CATEGORIES, COUNTRIES } from "@/data/mockData";
import { IMG } from "@/data/content";

const FREELANCE_IDS = [
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
];

const B2B_IDS = [
  "tutor",
  "african_food_export",
  "restaurant_supplier",
  "product_export",
  "b2b_trade",
  "corporate_training",
];

export const Route = createFileRoute("/freelancers/")({
  head: () => ({
    meta: [
      { title: "Hire Global Freelancers — LanceConnect" },
      {
        name: "description",
        content:
          "Browse our directory of top-tier verified freelancers. Hire web developers, designers, copywriters, and marketers directly off-platform.",
      },
      { property: "og:title", content: "LanceConnect Freelancer Directory" },
      {
        property: "og:description",
        content:
          "Find the perfect skills for your business and outbound outreach. Hire directly without agency markup fees.",
      },
    ],
  }),
  component: FreelancerDirectoryPage,
});

type DirectoryFreelancer = {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  freelancer_category: string;
  bio: string | null;
  website_url: string | null;
  country: string | null;
  city: string | null;
  username: string | null;
  hourly_rate: number | null;
  portfolio_projects: any[] | null;
  contact_email: string | null;
  contact_phone: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  dribbble_url: string | null;
  twitter_url: string | null;
  created_at: string;
};

function FreelancerDirectoryPage() {
  const [freelancers, setFreelancers] = useState<DirectoryFreelancer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter States — filtering happens instantly on every change
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [maxRate, setMaxRate] = useState<string>("all");

  const handleFindFreelancers = () => {
    const el = document.getElementById("freelancer-results");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleReset = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedCountry("all");
    setMaxRate("all");
  };

  const fetchFreelancers = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from("freelancer_directory")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setFreelancers(data || []);
    } catch (err: any) {
      console.error("Error fetching freelancers:", err);
      setError("Failed to load freelancer directory. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFreelancers();
  }, []);

  const filteredFreelancers = freelancers.filter((f) => {
    // 1. Search Query
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      f.full_name.toLowerCase().includes(query) ||
      (f.bio && f.bio.toLowerCase().includes(query)) ||
      (f.city && f.city.toLowerCase().includes(query)) ||
      (f.freelancer_category && f.freelancer_category.toLowerCase().includes(query));

    // 2. Category
    const matchesCategory =
      selectedCategory === "all" || f.freelancer_category === selectedCategory;

    // 3. Country
    const matchesCountry = selectedCountry === "all" || f.country === selectedCountry;

    // 4. Hourly Rate
    let matchesRate = true;
    if (maxRate !== "all") {
      const rate = f.hourly_rate || 0;
      if (maxRate === "under25") matchesRate = rate <= 25;
      else if (maxRate === "25to50") matchesRate = rate > 25 && rate <= 50;
      else if (maxRate === "50to100") matchesRate = rate > 50 && rate <= 100;
      else if (maxRate === "above100") matchesRate = rate > 100;
    }

    return matchesSearch && matchesCategory && matchesCountry && matchesRate;
  });

  const getCategoryLabel = (id: string) => {
    const cat = CATEGORIES.find((c) => c.id === id);
    return cat ? `${cat.emoji} ${cat.label}` : id;
  };

  return (
    <MarketingShell>
      {/* Premium Dark Header */}
      <section className="relative overflow-hidden border-b border-border bg-[#020b21] py-16 text-center select-none text-white">
        <div className="absolute inset-0 z-0 select-none pointer-events-none">
          <img
            src={IMG.heroLaptop}
            className="w-full h-full object-cover opacity-35"
            alt=""
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#020b21]/95 via-[#020b21]/80 to-[#020b21]/40" />
        </div>
        <div className="relative mx-auto max-w-4xl px-4 lg:px-8 z-10">
          <p className="text-xs font-mono text-slate-400 mb-2 tracking-widest uppercase flex items-center justify-center gap-1.5">
            // public.freelancer.directory
          </p>
          <h1 className="font-display text-4xl font-extrabold sm:text-5xl tracking-tight leading-tight text-white">
            Connect Directly with Premium{" "}
            <span className="text-cyan-400 font-extrabold drop-shadow-[0_0_12px_rgba(34,211,238,0.6)]">
              Freelancers.
            </span>
          </h1>
          <p className="mt-4 text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            Search top global independent builders. View their verified portfolio projects and reach
            them directly on email, phone, or website without middleman markup fees.
          </p>
        </div>
      </section>

      {/* Advanced Filter Panel */}
      <section className="bg-card/40 border-b border-border py-6 select-none backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 lg:px-8 space-y-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5 items-center">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search by name, bio, city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-border bg-background pl-9 pr-4 py-2 text-xs font-mono text-foreground placeholder-slate-500 focus:border-primary focus:outline-none transition h-[38px]"
              />
            </div>

            {/* Category Select */}
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-mono text-foreground focus:border-primary focus:outline-none cursor-pointer h-[38px]"
              >
                <option value="all">All Skills</option>
                <optgroup label="Freelance Services" className="text-primary font-bold">
                  {CATEGORIES.filter((c) => FREELANCE_IDS.includes(c.id)).map((c) => (
                    <option key={c.id} value={c.id} className="font-mono text-foreground">
                      {c.label}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="B2B & Niche Industries" className="text-emerald-500 font-bold">
                  {CATEGORIES.filter((c) => B2B_IDS.includes(c.id)).map((c) => (
                    <option key={c.id} value={c.id} className="font-mono text-foreground">
                      {c.label}
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>

            {/* Country Select */}
            <div className="relative">
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-mono text-foreground focus:border-primary focus:outline-none cursor-pointer h-[38px]"
              >
                <option value="all">All Countries</option>
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.name}>
                    {c.flag} {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Hourly Rate Select */}
            <div className="relative">
              <select
                value={maxRate}
                onChange={(e) => setMaxRate(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-mono text-foreground focus:border-primary focus:outline-none cursor-pointer h-[38px]"
              >
                <option value="all">Any Hourly Rate</option>
                <option value="under25">Under $25 / hr</option>
                <option value="25to50">$25 - $50 / hr</option>
                <option value="50to100">$50 - $100 / hr</option>
                <option value="above100">Over $100 / hr</option>
              </select>
            </div>

            {/* Find Freelancers Button — scrolls to results */}
            <div className="relative">
              <button
                type="button"
                onClick={handleFindFreelancers}
                className="w-full rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs py-2.5 h-[38px] transition duration-200 shadow-[0_0_15px_rgba(6,182,212,0.4)] hover:shadow-[0_0_22px_rgba(6,182,212,0.6)] flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider border border-cyan-400/20"
              >
                <Search className="h-4 w-4" /> Find Freelancers
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Directory Grid */}
      <section id="freelancer-results" className="mx-auto max-w-7xl px-4 py-12 lg:px-8 bg-background min-h-[400px] scroll-mt-24">
        {loading ? (
          /* Dynamic Skeleton Loaders */
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="rounded-3xl border border-border bg-card p-6 space-y-4 animate-pulse"
              >
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-slate-800" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-1/2 bg-slate-800 rounded" />
                    <div className="h-3 w-1/3 bg-slate-800 rounded" />
                  </div>
                </div>
                <div className="h-3 w-full bg-slate-800 rounded" />
                <div className="h-3 w-4/5 bg-slate-800 rounded" />
                <div className="h-9 w-full bg-slate-800 rounded-xl" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-16 border border-dashed border-red-500/20 rounded-3xl bg-red-950/10">
            <p className="text-sm text-red-500 font-mono">{error}</p>
            <button
              onClick={fetchFreelancers}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/95 transition cursor-pointer"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Retry Load
            </button>
          </div>
        ) : filteredFreelancers.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-border rounded-3xl bg-card/40">
            <p className="text-sm text-muted-foreground font-mono">
              No freelancers found matching those parameters.
            </p>
            <button
              onClick={handleReset}
              className="mt-3 text-xs font-semibold text-cyan-400 hover:text-cyan-350 hover:underline cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredFreelancers.map((free) => (
              <div
                key={free.id}
                className="rounded-3xl border border-border bg-card p-6 shadow-card hover:shadow-card-hover transition duration-300 flex flex-col justify-between group hover:border-primary/20"
              >
                <div>
                  {/* Bio Info Header */}
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-primary/20 shrink-0 bg-primary/10 flex items-center justify-center font-bold text-primary text-sm">
                      {free.avatar_url ? (
                        <img
                          src={free.avatar_url}
                          alt={free.full_name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        free.full_name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2)
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display font-bold text-foreground text-sm leading-snug truncate group-hover:text-primary transition-colors">
                        {free.full_name}
                      </h3>
                      <p className="text-[11px] text-primary font-medium mt-0.5 leading-none">
                        {getCategoryLabel(free.freelancer_category)}
                      </p>

                      {/* Location & Rate Row */}
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1 text-[10px] font-mono text-muted-foreground">
                        {(free.city || free.country) && (
                          <span className="flex items-center gap-0.5">
                            <MapPin className="h-3 w-3 shrink-0 text-slate-500" />
                            {free.city ? `${free.city}, ` : ""}
                            {free.country}
                          </span>
                        )}
                        {free.hourly_rate && (
                          <span className="flex items-center text-emerald-500 font-semibold">
                            <DollarSign className="h-3 w-3 shrink-0" />
                            {free.hourly_rate}/hr
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Bio Description */}
                  <p className="mt-4 text-xs text-muted-foreground leading-normal line-clamp-3">
                    {free.bio || "No bio description provided."}
                  </p>

                  {/* Portfolio Projects Count Badge */}
                  {free.portfolio_projects && free.portfolio_projects.length > 0 && (
                    <div className="mt-4 flex items-center gap-1.5">
                      <span className="rounded-lg bg-background border border-border px-2 py-0.5 text-[9px] font-mono text-slate-500">
                        📁 {free.portfolio_projects.length} Case Studies
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Action Link */}
                <div className="mt-6 pt-4 border-t border-border/40 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {free.github_url && (
                      <a
                        href={free.github_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-slate-500 hover:text-white transition"
                      >
                        <Github className="h-3.5 w-3.5" />
                      </a>
                    )}
                    {free.linkedin_url && (
                      <a
                        href={free.linkedin_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-slate-500 hover:text-white transition"
                      >
                        <Linkedin className="h-3.5 w-3.5" />
                      </a>
                    )}
                    {free.twitter_url && (
                      <a
                        href={free.twitter_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-slate-500 hover:text-white transition"
                      >
                        <Twitter className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>

                  <Link
                    to="/freelancers/$slug"
                    params={{ slug: free.username || free.id }}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                  >
                    View profile <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Directory CTA */}
      <section className="px-4 pb-20 lg:px-8 bg-background">
        <div className="mx-auto max-w-5xl rounded-3xl border border-border bg-card p-12 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-cyan-500/5 pointer-events-none" />
          <h3 className="font-display text-2xl font-bold relative z-10 flex items-center justify-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-500" /> Are you a freelance builder?
          </h3>
          <p className="mt-3 text-sm text-muted-foreground max-w-lg mx-auto relative z-10">
            List your skills, hourly rate, and portfolio link in the public directory to get direct
            inquiries from founders and agencies looking to hire.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3 relative z-10">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition shadow-lg"
            >
              Get Listed Today <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
