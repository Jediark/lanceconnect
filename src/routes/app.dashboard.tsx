import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Search,
  Mail,
  Sparkles,
  Loader2,
  X,
  MapPin,
  Copy,
  Star,
  Phone,
  Globe,
  Check,
  Download,
  Users,
  Target,
  MessageSquare,
  ArrowRight,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { CATEGORIES, COUNTRIES, MOCK_LEADS, type Lead } from "@/data/mockData";
import { COUNTRY_CITIES } from "@/data/countriesData";
import { usePipeline } from "@/contexts/PipelineContext";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { LeadsOverTimeChart, PipelineFunnelChart } from "@/components/dashboard/AnalyticsCharts";
import { LiveEventsTicker } from "@/components/dashboard/LiveEventsTicker";
import { GoalTracker } from "@/components/dashboard/GoalTracker";
import { GlobalHeatmap } from "@/components/dashboard/GlobalHeatmap";
import { QuickConnectModal } from "@/components/dashboard/QuickConnectModal";

export const Route = createFileRoute("/app/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — LanceConnect" }] }),
  component: Dashboard,
});

type ActivityItem = {
  id: string;
  action: string;
  entityType: string;
  metadata: any;
  createdAt: string;
};

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 70
      ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/20"
      : score >= 40
        ? "text-amber-400 bg-amber-400/10 border-amber-400/20"
        : "text-rose-400 bg-rose-400/10 border-rose-400/20";
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-bold ${color}`}
    >
      {score}
    </span>
  );
}

function Dashboard() {
  const { user } = useAuth();
  const { pipeline, savedIds, saveLead } = usePipeline();

  const [loading, setLoading] = useState(false);
  const [scansCount, setScansCount] = useState(0);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [totalLeadsCount, setTotalLeadsCount] = useState(0);
  const [savedThisMonth, setSavedThisMonth] = useState(0);
  const [contactedCountFromDb, setContactedCountFromDb] = useState(0);

  const [quickCity, setQuickCity] = useState("");
  const [quickCategory, setQuickCategory] = useState("web_dev");
  const [quickCountry, setQuickCountry] = useState("Nigeria");
  const [results, setResults] = useState<Lead[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const [detail, setDetail] = useState<Lead | null>(null);
  const [enriching, setEnriching] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [outreachDraft, setOutreachDraft] = useState("");
  const [selectedChannel, setSelectedChannel] = useState<
    "email" | "linkedin" | "whatsapp" | "phone_script"
  >("email");
  const [selectedTone, setSelectedTone] = useState<"professional" | "casual" | "bold">(
    "professional",
  );
  const [provider, setProvider] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);

  const [quickConnectOpen, setQuickConnectOpen] = useState(false);
  const [quickConnectLead, setQuickConnectLead] = useState<Lead | undefined>();

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  const totalSaved = pipeline.length;
  const contactedCount = pipeline.filter((l) => l.status === "contacted").length;
  const wonCount = pipeline.filter((l) => l.status === "won").length;
  const conversionRate = totalSaved > 0 ? Math.round((wonCount / totalSaved) * 100) : 0;
  const suggestedCities = COUNTRY_CITIES[quickCountry] || [];

  useEffect(() => {
    if (!user) return;
    setLoading(true);

    // Total leads discovered in system
    supabase
      .from("leads")
      .select("*", { count: "exact", head: true })
      .then(({ count, error }) => {
        if (!error && count !== null) setTotalLeadsCount(count);
      });

    // Leads saved this month by current user
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    supabase
      .from("user_leads")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("saved_at", startOfMonth.toISOString())
      .then(({ count, error }) => {
        if (!error && count !== null) setSavedThisMonth(count);
      });

    // Leads contacted by current user (status != 'new')
    supabase
      .from("user_leads")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .neq("status", "new")
      .then(({ count, error }) => {
        if (!error && count !== null) setContactedCountFromDb(count);
      });

    supabase
      .from("search_history")
      .select("id", { count: "exact" })
      .eq("user_id", user.id)
      .then(({ count, error }) => {
        if (!error && count !== null) setScansCount(count);
      });
    supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(6)
      .then(({ data, error }) => {
        if (error) console.error(error);
        if (data) {
          const mapped = data.map((d: any) => ({
            id: d.id,
            businessName: d.business_name,
            businessType: d.business_type,
            industry: d.industry,
            city: d.city,
            country: d.country,
            fullAddress: d.full_address,
            phone: d.phone || "",
            email: d.email || null,
            websiteUrl: d.website_url || null,
            hasWebsite: d.has_website || false,
            googleRating: Number(d.google_rating || 0),
            googleReviewCount: Number(d.google_review_count || 0),
            opportunityScore: Number(d.opportunity_score || 0),
            createdAt: d.created_at,
            source: d.source || "google_maps",
            savedAt: null,
            status: null,
          }));
          setResults(mapped); // No automatic fallback emails for database leads for integrity
        }
      });
    supabase
      .from("audit_log")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5)
      .then(({ data, error }) => {
        setLoading(false);
        if (data)
          setActivities(
            data.map((d: any) => ({
              id: d.id,
              action: d.action,
              entityType: d.entity_type,
              metadata: d.metadata || {},
              createdAt: d.created_at,
            })),
          );
      });
  }, [user]);

  const handleEnrich = async () => {
    if (!detail || !detail.websiteUrl) return;
    setEnriching(true);
    toast.info("Scraping website for verified contact email...");
    try {
      if (!user) {
        setEnriching(false);
        return;
      }

      const { data, error } = await supabase.functions.invoke("enrich-contact", {
        body: { leadId: detail.id },
      });
      if (error) throw error;
      if (data?.lead?.email) {
        setDetail((prev) => (prev ? { ...prev, email: data.lead.email } : null));
        setResults((prev) =>
          prev.map((l) => (l.id === detail.id ? { ...l, email: data.lead.email } : l)),
        );
        toast.success(`Scrape complete! Found: ${data.lead.email}`);
      } else {
        toast.warning("No public email address found on the website.");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to search website");
    } finally {
      setEnriching(false);
    }
  };

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!quickCity.trim()) {
      toast.error("Please enter a city name.");
      return;
    }
    setSearchLoading(true);
    if (!user) {
      setSearchLoading(false);
      return;
    }
    try {
      const q = CATEGORIES.find((c) => c.id === quickCategory)?.label || "local business";
      const { data, error } = await supabase.functions.invoke("search-leads", {
        body: { query: q, city: quickCity, country: quickCountry, limit: 12 },
      });
      if (error) throw error;
      const mapped = (data?.leads || []).map((d: any) => ({
        id: d.id,
        businessName: d.business_name,
        businessType: d.business_type,
        industry: d.industry,
        city: d.city,
        country: d.country,
        fullAddress: d.full_address,
        phone: d.phone || "",
        email: d.email || null,
        websiteUrl: d.website_url || null,
        hasWebsite: d.has_website || false,
        googleRating: Number(d.google_rating || 0),
        googleReviewCount: Number(d.google_review_count || 0),
        opportunityScore: Number(d.opportunity_score || 0),
        createdAt: d.created_at,
        source: d.source || "google_maps",
        savedAt: null,
        status: null,
      }));
      setResults(mapped);
      setScansCount((p) => p + 1); // Respect data integrity by showing real found data
      const { data: logData } = await supabase
        .from("audit_log")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5);
      if (logData)
        setActivities(
          logData.map((d: any) => ({
            id: d.id,
            action: d.action,
            entityType: d.entity_type,
            metadata: d.metadata || {},
            createdAt: d.created_at,
          })),
        );
      toast.success(`Found ${mapped.length} prospects in ${quickCity}!`);
    } catch (err: any) {
      console.error(err);
      toast.error("Search temporarily unavailable — please try again in a moment.");
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSaveLead = async (lead: Lead) => {
    setSavingId(lead.id);
    try {
      await saveLead(lead);
      toast.success(`Saved ${lead.businessName}!`);
    } catch {
      toast.error("Failed to save");
    } finally {
      setSavingId(null);
    }
  };

  const downloadCSV = () => {
    if (!results.length) return;
    const h = [
      "Business Name",
      "Type",
      "City",
      "Country",
      "Address",
      "Phone",
      "Email",
      "Website",
      "Score",
      "Rating",
      "Reviews",
    ];
    const rows = [
      h.join(","),
      ...results.map((l) =>
        [
          `"${l.businessName.replace(/"/g, '""')}"`,
          `"${l.businessType.replace(/"/g, '""')}"`,
          `"${l.city}"`,
          `"${l.country}"`,
          `"${l.fullAddress.replace(/"/g, '""')}"`,
          `"${l.phone || ""}"`,
          `"${l.email || ""}"`,
          `"${l.websiteUrl || ""}"`,
          l.opportunityScore,
          l.googleRating,
          l.googleReviewCount,
        ].join(","),
      ),
    ];
    const blob = new Blob([rows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `leads_${quickCity || "all"}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.success("CSV downloaded!");
  };

  const handleGenerate = async () => {
    if (!detail) return;
    setGenerating(true);
    setOutreachDraft("");
    try {
      const { data, error } = await supabase.functions.invoke("ai-outreach", {
        body: { leadId: detail.id, channel: selectedChannel, tone: selectedTone },
      });
      if (error) throw error;
      setOutreachDraft(data?.message || "Hi there...");
      setProvider(data?.model?.includes("claude") ? "Claude AI" : "Gemini");
    } catch (err: any) {
      toast.error(err.message || "Generation failed");
      setOutreachDraft(
        `Hi ${detail.businessName} team,\n\nI noticed your business in ${detail.city} and wanted to reach out...`,
      );
      setProvider("Template");
    } finally {
      setGenerating(false);
    }
  };

  const copyDraft = () => {
    navigator.clipboard.writeText(outreachDraft);
    toast.success("Copied!");
  };

  const leadsUsed = user?.leadsUsedThisMonth || 0;
  const leadsLimit = user?.leadsLimit || 10;
  const usagePct = Math.min(100, Math.round((leadsUsed / leadsLimit) * 100));

  const getScoreReasons = (lead: Lead) => {
    const r: { label: string; pts: number }[] = [];
    if (!lead.hasWebsite) r.push({ label: "No website", pts: 40 });
    else if (lead.googleRating < 4.0) r.push({ label: "Low rating", pts: 25 });
    if (lead.googleReviewCount < 15) r.push({ label: "Few reviews", pts: 20 });
    if (!lead.email && !lead.phone) r.push({ label: "No contact info", pts: 15 });
    return r;
  };

  return (
    <>
      <Header title="Dashboard" />

      <div className="px-4 py-6 lg:px-8 space-y-8">
        {/* Platform Philosophy Notice */}
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 flex flex-col sm:flex-row items-center justify-between gap-4 select-none">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 border border-primary/20 text-primary">
              <Sparkles className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground">
                LanceConnect Vision & Philosophy
              </p>
              <p className="text-[11px] text-muted-foreground leading-normal mt-0.5">
                Built by freelancers, for freelancers. Direct client contacts, 0% platform
                commissions, zero bidding wars.
              </p>
            </div>
          </div>
          <Link
            to="/freelancers"
            className="w-full sm:w-auto text-center shrink-0 rounded-lg border border-primary/30 bg-primary/10 px-3.5 py-1.5 text-[11px] font-bold text-primary hover:bg-primary/20 transition"
          >
            Browse Public Directory
          </Link>
        </div>

        {/* ═══ HERO SEARCH ═══ */}
        <section className="relative overflow-hidden rounded-2xl border border-border bg-card p-5 sm:p-8 md:p-10">
          {/* decorative dots */}
          <div className="absolute inset-0 bg-dot-pattern pointer-events-none opacity-40" />

          <div className="relative z-10 max-w-2xl">
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground leading-tight">
              {greeting},{" "}
              <span className="text-gradient-brand">
                {(user?.fullName || "Freelancer").split(" ")[0]}
              </span>
            </h2>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-md">
              Type any business type and any city. Get real contacts with phone numbers, emails, and
              websites in seconds.
            </p>
          </div>

          <form onSubmit={handleSearch} className="relative z-10 mt-6">
            <div className="grid gap-3 sm:grid-cols-4">
              <div>
                <label className="mb-1.5 block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Business Type
                </label>
                <select
                  value={quickCategory}
                  onChange={(e) => setQuickCategory(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Country
                </label>
                <select
                  value={quickCountry}
                  onChange={(e) => setQuickCountry(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition"
                >
                  {COUNTRIES.map((c) => (
                    <option key={c.code} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  City
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lagos, London..."
                  value={quickCity}
                  onChange={(e) => setQuickCity(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={searchLoading}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-sm font-bold text-white hover:brightness-110 transition disabled:opacity-60 cursor-pointer"
                >
                  {searchLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                  {searchLoading ? "Scanning..." : "Find Clients"}
                </button>
              </div>
            </div>

            {suggestedCities.length > 0 && (
              <div className="mt-3 flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] text-muted-foreground">Popular:</span>
                {suggestedCities.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => {
                      setQuickCity(c);
                    }}
                    className="rounded-full border border-primary bg-muted px-2.5 py-0.5 text-[11px] font-medium text-foreground hover:bg-primary hover:text-white transition cursor-pointer"
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}
          </form>
        </section>

        {/* ═══ STATS ROW ═══ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: "Total Discovered",
              value: totalLeadsCount,
              icon: Search,
              bg: "bg-primary",
              fg: "text-white",
            },
            {
              label: "Saved This Month",
              value: savedThisMonth,
              icon: Users,
              bg: "bg-success",
              fg: "text-white",
            },
            {
              label: "Leads Contacted",
              value: contactedCountFromDb,
              icon: MessageSquare,
              bg: "bg-warn",
              fg: "text-white",
            },
            {
              label: "Win Rate",
              value: `${conversionRate}%`,
              icon: Target,
              bg: "bg-hot",
              fg: "text-white",
            },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-border bg-card p-5 hover:border-primary transition group"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`grid h-9 w-9 place-items-center rounded-xl ${s.bg}`}>
                  <s.icon className={`h-4 w-4 ${s.fg}`} />
                </div>
                <span className="text-xs font-medium text-muted-foreground">{s.label}</span>
              </div>
              <p className="text-3xl font-extrabold text-foreground tracking-tight">{s.value}</p>
            </div>
          ))}
        </div>

        {/* ═══ ANALYTICS ROW ═══ */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-5 overflow-hidden">
            <h3 className="text-sm font-bold text-foreground mb-4">Leads Discovered</h3>
            <LeadsOverTimeChart />
          </div>
          <div className="rounded-2xl border border-border bg-card p-5 flex flex-col overflow-hidden">
            <h3 className="text-sm font-bold text-foreground mb-4">Conversion Pipeline</h3>
            <PipelineFunnelChart className="flex-1" />
          </div>
        </div>

        {/* ═══ HEATMAP ROW ═══ */}
        <GlobalHeatmap className="h-[300px]" />

        {/* ═══ MAIN CONTENT: RESULTS + SIDEBAR ═══ */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* ── Results area (2 cols) ── */}
          <div className="lg:col-span-2 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-foreground">Discovered Businesses</h3>
                <p className="text-xs text-muted-foreground">
                  {results.length} results found. Click any card to view details.
                </p>
              </div>
              {results.length > 0 && (
                <button
                  onClick={downloadCSV}
                  className="self-start sm:self-auto flex items-center gap-1.5 rounded-xl border border-border bg-card px-4 py-2 text-xs font-semibold text-foreground hover:bg-accent transition cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5" /> Export CSV
                </button>
              )}
            </div>

            {searchLoading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="relative">
                  <div className="h-14 w-14 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
                </div>
                <p className="text-sm text-muted-foreground">Scanning business directories...</p>
              </div>
            ) : results.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center rounded-2xl border border-dashed border-border bg-card/50">
                <div className="grid h-16 w-16 place-items-center rounded-2xl bg-primary/8 mb-4">
                  <Search className="h-7 w-7 text-primary/60" />
                </div>
                <p className="text-base font-semibold text-foreground">No results yet</p>
                <p className="text-sm text-muted-foreground mt-1 max-w-xs">
                  Search for any business type in any city above to discover clients.
                </p>
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {results.map((lead) => {
                  const isSaved = savedIds.has(lead.id);
                  return (
                    <div
                      key={lead.id}
                      className="group rounded-2xl border border-border bg-card p-5 hover:border-primary transition-all duration-200 cursor-pointer"
                      onClick={() => {
                        setDetail(lead);
                        setOutreachDraft("");
                      }}
                    >
                      {/* Top row */}
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="min-w-0 flex-1">
                          <h4 className="text-sm font-bold text-foreground truncate group-hover:text-primary transition">
                            {lead.businessName}
                          </h4>
                          <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                            {lead.businessType}
                          </p>
                        </div>
                        <ScoreBadge score={lead.opportunityScore} />
                      </div>

                      {/* Location */}
                      <p className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
                        <MapPin className="h-3 w-3 shrink-0" /> {lead.city}, {lead.country}
                      </p>

                      {/* Contact icons */}
                      <div className="flex items-center gap-3 mb-4">
                        <span
                          className={`flex items-center gap-1 text-[11px] ${lead.phone ? "text-emerald-400" : "text-muted-foreground/40"}`}
                        >
                          <Phone className="h-3 w-3" /> {lead.phone ? "Phone" : "No phone"}
                        </span>
                        <span
                          className={`flex items-center gap-1 text-[11px] ${lead.email ? "text-emerald-400" : "text-muted-foreground/40"}`}
                        >
                          <Mail className="h-3 w-3" /> {lead.email ? "Email" : "No email"}
                        </span>
                        <span
                          className={`flex items-center gap-1 text-[11px] ${lead.websiteUrl ? "text-emerald-400" : "text-muted-foreground/40"}`}
                        >
                          <Globe className="h-3 w-3" /> {lead.websiteUrl ? "Site" : "No site"}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col sm:flex-row gap-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => {
                            setQuickConnectLead(lead);
                            setQuickConnectOpen(true);
                          }}
                          className="w-full sm:flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-muted border border-border py-1.5 text-[11px] font-bold text-foreground hover:bg-accent transition cursor-pointer"
                        >
                          <Mail className="h-3 w-3" /> Quick Connect
                        </button>
                        <button
                          onClick={() => handleSaveLead(lead)}
                          disabled={isSaved || savingId === lead.id}
                          className="w-full sm:flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-success border border-success py-1.5 text-[11px] font-bold text-white hover:brightness-110 transition disabled:opacity-40 cursor-pointer"
                        >
                          {savingId === lead.id ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <Check className="h-3 w-3" />
                          )}
                          {isSaved ? "Saved" : "Save Lead"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── Right sidebar ── */}
          <div className="space-y-5">
            {/* Quota */}
            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-bold text-foreground">Monthly Quota</h4>
                <span className="rounded-full border border-primary/25 bg-primary/8 px-2.5 py-0.5 text-[10px] font-bold text-primary uppercase tracking-wider">
                  {user?.plan || "Free"}
                </span>
              </div>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-2xl font-extrabold text-foreground">{leadsUsed}</span>
                <span className="text-sm text-muted-foreground">/ {leadsLimit}</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-accent overflow-hidden mb-2">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-700 ease-out"
                  style={{ width: `${usagePct}%` }}
                />
              </div>
              <p className="text-[11px] text-muted-foreground">
                {Math.max(0, leadsLimit - leadsUsed)} searches remaining
              </p>
              {user?.plan === "free" && (
                <Link
                  to="/app/upgrade"
                  className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-xs font-bold text-white hover:brightness-110 transition cursor-pointer"
                >
                  Upgrade Plan
                </Link>
              )}
            </div>

            {/* Goal Tracker */}
            <GoalTracker current={contactedCount} target={user?.plan === "free" ? 10 : 50} />

            {/* Pipeline */}
            <div className="rounded-2xl border border-border bg-card p-5">
              <h4 className="text-sm font-bold text-foreground mb-4">Pipeline</h4>
              <div className="space-y-2.5">
                {[
                  {
                    label: "New",
                    count: pipeline.filter((l) => l.status === "new").length,
                    color: "#7C3AED",
                  },
                  { label: "Contacted", count: contactedCount, color: "#F59E0B" },
                  {
                    label: "Interested",
                    count: pipeline.filter((l) => l.status === "interested").length,
                    color: "#3B82F6",
                  },
                  { label: "Won", count: wonCount, color: "#10B981" },
                ].map((s) => (
                  <div key={s.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full" style={{ background: s.color }} />
                      <span className="text-sm text-muted-foreground">{s.label}</span>
                    </div>
                    <span className="text-sm font-bold text-foreground">{s.count}</span>
                  </div>
                ))}
              </div>
              <Link
                to="/app/pipeline"
                className="mt-4 flex items-center justify-center gap-1.5 rounded-xl border border-border bg-background py-2 text-xs font-semibold text-foreground hover:bg-accent transition cursor-pointer"
              >
                View Pipeline <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            {/* Newsletter Subscription */}
            <div className="rounded-2xl border border-border bg-card p-5">
              <h4 className="text-sm font-bold text-foreground mb-2 flex items-center gap-1.5">
                <Mail className="h-4 w-4 text-primary" /> Subscribe to Leads
              </h4>
              <p className="text-[11px] text-muted-foreground mb-3">
                Get weekly premium lead drops, cold email scripts, and marketing updates.
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const input = e.currentTarget.elements.namedItem(
                    "newsletter-email",
                  ) as HTMLInputElement;
                  if (input && input.value) {
                    toast.success(`Subscribed ${input.value} to weekly lead drops!`);
                    input.value = "";
                  }
                }}
                className="space-y-2"
              >
                <input
                  type="email"
                  name="newsletter-email"
                  required
                  placeholder="name@example.com"
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <button
                  type="submit"
                  className="w-full rounded-xl bg-primary py-2 text-xs font-bold text-white hover:brightness-110 transition cursor-pointer"
                >
                  Subscribe
                </button>
              </form>
            </div>

            {/* Activity */}
            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-bold text-foreground mb-4">Live Feed</h4>
                <div className="flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                    Live
                  </span>
                </div>
              </div>
              <LiveEventsTicker />
            </div>
          </div>
        </div>
      </div>

      {/* ═══ DETAIL MODAL ═══ */}
      {detail && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setDetail(null)}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />
          <div
            className="relative w-full max-w-md rounded-2xl border border-[rgba(124,58,237,0.2)] bg-card animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between p-6 pb-0">
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-extrabold text-foreground truncate">
                  {detail.businessName}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {detail.businessType || "Local Business"}
                </p>
              </div>
              <button
                onClick={() => setDetail(null)}
                className="grid h-8 w-8 place-items-center rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-6 space-y-5 max-h-[60vh] sm:max-h-[70vh] overflow-y-auto">
              {/* Contact info */}
              <div className="space-y-2">
                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 shrink-0 text-muted-foreground/60" />
                  {detail.fullAddress || `${detail.city}, ${detail.country}`}
                </p>
                <div className="flex items-center justify-between">
                  <p className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4 shrink-0 text-muted-foreground/60" />
                    {detail.phone || "No phone"}
                  </p>
                  {detail.phone && (
                    <button
                      onClick={() => {
                        navigator.clipboard?.writeText(detail.phone);
                        toast.success("Copied!");
                      }}
                      className="rounded-lg border border-border px-2 py-0.5 text-[10px] text-muted-foreground hover:text-foreground transition cursor-pointer"
                    >
                      <Copy className="inline h-2.5 w-2.5 mr-0.5" />
                      Copy
                    </button>
                  )}
                </div>
                <div className="flex items-center justify-between gap-2">
                  <p className="flex items-center gap-2 text-sm text-muted-foreground flex-1 truncate">
                    <Mail className="h-4 w-4 shrink-0 text-muted-foreground/60" />
                    {detail.email || "Not publicly listed"}
                  </p>
                  {!detail.email && detail.websiteUrl && (
                    <button
                      onClick={handleEnrich}
                      disabled={enriching}
                      className="rounded-lg border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] text-primary hover:bg-primary/20 disabled:opacity-50 transition cursor-pointer shrink-0"
                    >
                      {enriching ? (
                        <Loader2 className="h-2.5 w-2.5 animate-spin" />
                      ) : (
                        "⚡ Find Email"
                      )}
                    </button>
                  )}
                </div>
                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Globe className="h-4 w-4 shrink-0 text-muted-foreground/60" />
                  {detail.websiteUrl ? (
                    <a
                      href={detail.websiteUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary hover:underline truncate"
                    >
                      {detail.websiteUrl}
                    </a>
                  ) : (
                    "No website"
                  )}
                </p>
                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Star className="h-4 w-4 shrink-0 fill-amber-400 text-amber-400" />
                  {detail.googleRating} rating · {detail.googleReviewCount} reviews
                </p>
              </div>

              {/* Opportunity */}
              {getScoreReasons(detail).length > 0 && (
                <div>
                  <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Opportunity Signals
                  </p>
                  <div className="space-y-1.5">
                    {getScoreReasons(detail).map((r) => (
                      <div
                        key={r.label}
                        className="flex items-center justify-between rounded-xl bg-emerald-500/8 border border-emerald-500/15 px-3 py-2 text-xs text-emerald-400"
                      >
                        <span className="flex items-center gap-1.5">
                          <Check className="h-3 w-3" />
                          {r.label}
                        </span>
                        <span className="font-bold">+{r.pts}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* AI Generator */}
              <div className="border-t border-border pt-4">
                <h4 className="text-sm font-bold text-foreground flex items-center gap-1.5 mb-3">
                  <Sparkles className="h-4 w-4 text-primary" /> AI Outreach
                </h4>
                {outreachDraft ? (
                  <div className="space-y-3">
                    <textarea
                      value={outreachDraft}
                      onChange={(e) => setOutreachDraft(e.target.value)}
                      className="w-full h-32 rounded-xl border border-border bg-background p-3 text-sm text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <span className="text-[10px] text-muted-foreground">{provider}</span>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => setOutreachDraft("")}
                          className="rounded-lg border border-border px-3 py-1.5 text-[11px] text-muted-foreground hover:text-foreground cursor-pointer transition"
                        >
                          Reset
                        </button>
                        <button
                          onClick={copyDraft}
                          className="rounded-lg bg-primary px-3 py-1.5 text-[11px] font-bold text-white hover:brightness-110 cursor-pointer transition"
                        >
                          Copy
                        </button>
                        {selectedChannel === "whatsapp" && detail.phone && (
                          <a
                            href={`https://wa.me/${detail.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(outreachDraft)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-lg bg-emerald-600 px-3 py-1.5 text-[11px] font-bold text-white hover:bg-emerald-700 cursor-pointer transition"
                          >
                            WhatsApp
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <select
                        value={selectedChannel}
                        onChange={(e) => setSelectedChannel(e.target.value as any)}
                        className="rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground"
                      >
                        <option value="email">Email</option>
                        <option value="linkedin">LinkedIn</option>
                        <option value="whatsapp">WhatsApp</option>
                        <option value="phone_script">Phone Script</option>
                      </select>
                      <select
                        value={selectedTone}
                        onChange={(e) => setSelectedTone(e.target.value as any)}
                        className="rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground"
                      >
                        <option value="professional">Professional</option>
                        <option value="casual">Casual</option>
                        <option value="bold">Bold</option>
                      </select>
                    </div>
                    <button
                      onClick={handleGenerate}
                      disabled={generating}
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-sm font-bold text-white hover:brightness-110 transition disabled:opacity-50 cursor-pointer"
                    >
                      {generating ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4" />
                          Generate Pitch
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 pt-0">
              <button
                onClick={() => handleSaveLead(detail)}
                disabled={savedIds.has(detail.id)}
                className="w-full rounded-xl bg-primary py-2.5 text-sm font-bold text-white hover:brightness-110 transition disabled:opacity-40 cursor-pointer"
              >
                {savedIds.has(detail.id) ? "Already Saved" : "Save to Pipeline"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ QUICK CONNECT MODAL ═══ */}
      <QuickConnectModal
        open={quickConnectOpen}
        onOpenChange={setQuickConnectOpen}
        lead={quickConnectLead}
      />
    </>
  );
}
