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
  X,
  Shield,
} from "lucide-react";
import { CATEGORIES, COUNTRIES, MOCK_FREELANCERS, type DirectoryFreelancer } from "@/data/mockData";
import { IMG } from "@/data/content";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

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
  "mc_events",
];

const B2B_IDS = [
  "tutor",
  "parent_tutor",
  "african_food_export",
  "restaurant_supplier",
  "product_export",
  "b2b_trade",
  "human_capital",
  "training_recruitment",
];

const WHOLESALE_CATEGORIES = ["african_food_export", "restaurant_supplier", "product_export", "b2b_trade"];

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

function FreelancerDirectoryPage() {
  const { user } = useAuth();
  const [freelancers, setFreelancers] = useState<DirectoryFreelancer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter States — filtering happens instantly on every change
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [maxRate, setMaxRate] = useState<string>("all");

  // Report Modal States
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportedFreelancer, setReportedFreelancer] = useState<{ id: string; name: string } | null>(null);
  const [reportReason, setReportReason] = useState<string>("fake_profile");
  const [reportDescription, setReportDescription] = useState("");
  const [submittingReport, setSubmittingReport] = useState(false);

  const handleOpenReportModal = (id: string, name: string) => {
    if (!user) {
      toast.error("You must be logged in to report a profile.");
      return;
    }
    setReportedFreelancer({ id, name });
    setReportReason("fake_profile");
    setReportDescription("");
    setReportModalOpen(true);
  };

  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !reportedFreelancer) return;

    setSubmittingReport(true);
    try {
      const { error } = await supabase.from("reports").insert({
        reporter_id: user.id,
        reported_user_id: reportedFreelancer.id,
        reason: reportReason,
        description: reportDescription,
      });

      if (error) throw error;
      toast.success("Thank you. The report has been submitted for review.");
      setReportModalOpen(false);
    } catch (err: any) {
      console.error("Error submitting report:", err);
      toast.error(err.message || "Failed to submit report. Please try again.");
    } finally {
      setSubmittingReport(false);
    }
  };

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
      if (data && data.length > 0) {
        setFreelancers(data);
      } else {
        setFreelancers(MOCK_FREELANCERS);
      }
    } catch (err: any) {
      console.error("Error fetching freelancers, falling back to mock data:", err);
      setFreelancers(MOCK_FREELANCERS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFreelancers();
  }, []);

  // Filter out profiles where is_featured is true from regular directory list and sort them specifically
  const getFeaturedOrderWeight = (f: DirectoryFreelancer) => {
    const name = f.full_name.toLowerCase();
    const cat = f.freelancer_category;
    if (name.includes("trendtactics") && cat === "web_dev") return 1;
    if (name.includes("akinola") && cat === "mc_events") return 2;
    if (name.includes("edvoura") && cat === "tutor") return 3;
    if (name.includes("moorel") || name.includes("jemoorel")) return 4;
    if (name.includes("emmanuel") && name.includes("edward")) return 5;
    return 6;
  };

  const featuredFreelancers = freelancers
    .filter((f) => f.is_featured && !f.is_flagged)
    .sort((a, b) => getFeaturedOrderWeight(a) - getFeaturedOrderWeight(b));
  const regularFreelancers = freelancers.filter((f) => !f.is_featured);

  const filteredFreelancers = regularFreelancers.filter((f) => {
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
          <div className="absolute inset-0 bg-[#020b21]/75" />
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

      {/* Featured Members Section */}
      {!loading && featuredFreelancers.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pt-12 pb-6 lg:px-8 bg-background">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
                <span className="text-amber-500 animate-pulse">⭐</span> Featured Members
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                Top-tier verified professionals with outstanding track records
              </p>
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredFreelancers.map((free) => (
              <div
                key={free.id}
                className="relative rounded-3xl border border-primary/20 bg-card p-6 shadow-[0_0_20px_rgba(6,182,212,0.08)] hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] transition duration-300 flex flex-col justify-between group hover:border-primary/40 overflow-hidden"
              >
                
                <div>
                  {/* Bio Info Header */}
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-primary/40 shrink-0 bg-primary/15 flex items-center justify-center font-bold text-primary text-sm relative">
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
                      {/* Small crown or star badge */}
                      <span className="absolute -bottom-1 -right-1 bg-amber-500 rounded-full p-0.5 shadow-sm text-[8px] leading-none">
                        ⭐
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display font-bold text-foreground text-sm leading-snug truncate group-hover:text-primary transition-colors flex items-center gap-1.5 flex-wrap">
                        {free.full_name}
                        {free.is_verified && (
                          <span className="inline-flex items-center gap-0.5 rounded bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-semibold text-emerald-500" title="Verified Member">
                            ✅ Verified
                          </span>
                        )}
                        {free.is_supporter && (
                          <span className="inline-flex items-center gap-0.5 rounded bg-rose-500/10 px-1.5 py-0.5 text-[9px] font-semibold text-rose-500" title="LanceConnect Supporter">
                            ❤️ Supporter
                          </span>
                        )}
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
                        {WHOLESALE_CATEGORIES.includes(free.freelancer_category) ? (
                          <span className="flex items-center text-emerald-500 font-semibold">
                            Wholesale / Custom Quote
                          </span>
                        ) : free.hourly_rate ? (
                          <span className="flex items-center text-emerald-500 font-semibold">
                            <DollarSign className="h-3 w-3 shrink-0" />
                            {free.hourly_rate}/hr
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  {/* Tagline */}
                  {free.tagline && (
                    <p className="mt-3 text-xs font-semibold text-foreground italic leading-tight">
                      "{free.tagline}"
                    </p>
                  )}

                  {/* Bio Description */}
                  <p className="mt-2 text-xs text-muted-foreground leading-normal line-clamp-3">
                    {free.bio || "No bio description provided."}
                  </p>
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

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleOpenReportModal(free.id, free.full_name)}
                      className="text-[10px] font-medium text-slate-500 hover:text-red-400 transition flex items-center gap-0.5"
                    >
                      Report ⚑
                    </button>
                    <Link
                      to="/freelancers/$slug"
                      params={{ slug: free.username || free.id }}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                    >
                      View profile <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

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
                      <h3 className="font-display font-bold text-foreground text-sm leading-snug truncate group-hover:text-primary transition-colors flex items-center gap-1.5 flex-wrap">
                        {free.full_name}
                        {free.is_verified && (
                          <span className="inline-flex items-center gap-0.5 rounded bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-semibold text-emerald-500" title="Verified Member">
                            ✅ Verified
                          </span>
                        )}
                        {free.is_supporter && (
                          <span className="inline-flex items-center gap-0.5 rounded bg-rose-500/10 px-1.5 py-0.5 text-[9px] font-semibold text-rose-500" title="LanceConnect Supporter">
                            ❤️ Supporter
                          </span>
                        )}
                        {free.is_flagged && (
                          <span className="inline-flex items-center gap-0.5 rounded bg-amber-500/10 px-1.5 py-0.5 text-[9px] font-semibold text-amber-500" title="Profile Under Review">
                            ⚠️ Under Review
                          </span>
                        )}
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
                        {WHOLESALE_CATEGORIES.includes(free.freelancer_category) ? (
                          <span className="flex items-center text-emerald-500 font-semibold">
                            Wholesale / Custom Quote
                          </span>
                        ) : free.hourly_rate ? (
                          <span className="flex items-center text-emerald-500 font-semibold">
                            <DollarSign className="h-3 w-3 shrink-0" />
                            {free.hourly_rate}/hr
                          </span>
                        ) : null}
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

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleOpenReportModal(free.id, free.full_name)}
                      className="text-[10px] font-medium text-slate-500 hover:text-red-400 transition flex items-center gap-0.5"
                    >
                      Report ⚑
                    </button>
                    <Link
                      to="/freelancers/$slug"
                      params={{ slug: free.username || free.id }}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                    >
                      View profile <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
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

      {/* Report Modal */}
      {reportModalOpen && reportedFreelancer && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setReportModalOpen(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-slate-300"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2 text-amber-500 mb-4">
              <Shield className="h-6 w-6" />
              <h3 className="text-lg font-bold text-foreground">Report Profile</h3>
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              You are reporting the profile of <strong>{reportedFreelancer.name}</strong>. Please provide details to help our moderation team review this account.
            </p>
            <form onSubmit={handleSubmitReport} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Reason for Report
                </label>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-mono text-foreground focus:border-primary focus:outline-none cursor-pointer"
                >
                  <option value="fake_profile">Fake/Inaccurate Profile</option>
                  <option value="scam">Scam / Fraudulent Activity</option>
                  <option value="harassment">Harassment / Abuse</option>
                  <option value="impersonation">Impersonation</option>
                  <option value="other">Other Reason</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Additional Details
                </label>
                <textarea
                  value={reportDescription}
                  onChange={(e) => setReportDescription(e.target.value)}
                  placeholder="Describe the issue in detail..."
                  rows={4}
                  className="w-full rounded-xl border border-border bg-background p-3 text-xs font-mono text-foreground placeholder-slate-500 focus:border-primary focus:outline-none"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReportModalOpen(false)}
                  className="rounded-xl border border-border px-4 py-2 text-xs font-semibold text-foreground hover:bg-accent transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingReport}
                  className="rounded-xl bg-red-500 hover:bg-red-600 text-white px-4 py-2 text-xs font-semibold shadow-md transition flex items-center gap-1 disabled:opacity-50"
                >
                  {submittingReport ? "Submitting..." : "Submit Report"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </MarketingShell>
  );
}
