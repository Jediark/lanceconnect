import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Search, TrendingUp, Compass, Activity, CheckCircle, Flame, Mail, Sparkles, Loader2, X, MapPin, Copy, Star, Phone, Globe, Check, Map, Download, Users, BarChart3, Target, MessageSquare } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { CATEGORIES, COUNTRIES, MOCK_LEADS, type Lead } from "@/data/mockData";
import { usePipeline } from "@/contexts/PipelineContext";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { OpportunityScore } from "@/components/ui/OpportunityScore";

const COUNTRY_CITIES: Record<string, string[]> = {
  "Nigeria": ["Lagos", "Abuja", "Port Harcourt", "Ibadan", "Kano"],
  "Italy": ["Rome", "Milan", "Naples", "Florence", "Venice", "Turin"],
  "United Kingdom": ["London", "Manchester", "Birmingham", "Edinburgh", "Glasgow"],
  "Argentina": ["Buenos Aires", "Córdoba", "Rosario", "Mendoza"],
  "India": ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai"],
  "Canada": ["Toronto", "Vancouver", "Montreal", "Calgary", "Ottawa"],
  "France": ["Paris", "Marseille", "Lyon", "Toulouse", "Nice"],
  "Malaysia": ["Kuala Lumpur", "Penang", "Johor Bahru", "Ipoh"],
  "United States": ["New York", "Los Angeles", "Chicago", "Houston", "San Francisco"],
  "Germany": ["Berlin", "Munich", "Hamburg", "Frankfurt", "Cologne"],
  "Brazil": ["São Paulo", "Rio de Janeiro", "Brasília", "Salvador"],
  "Spain": ["Madrid", "Barcelona", "Valencia", "Seville", "Bilbao"],
  "Mexico": ["Mexico City", "Guadalajara", "Monterrey", "Cancún"],
  "South Africa": ["Johannesburg", "Cape Town", "Durban", "Pretoria"],
  "Kenya": ["Nairobi", "Mombasa", "Kisumu", "Nakuru"],
  "Australia": ["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide"],
};

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

function Dashboard() {
  const { user } = useAuth();
  const { pipeline, savedIds, saveLead } = usePipeline();

  const [loading, setLoading] = useState(false);
  const [scansCount, setScansCount] = useState(0);
  const [activities, setActivities] = useState<ActivityItem[]>([]);

  const [quickCity, setQuickCity] = useState("");
  const [quickCategory, setQuickCategory] = useState("web_dev");
  const [quickCountry, setQuickCountry] = useState("Nigeria");
  const [results, setResults] = useState<Lead[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const [detail, setDetail] = useState<Lead | null>(null);
  const [generating, setGenerating] = useState(false);
  const [outreachDraft, setOutreachDraft] = useState("");
  const [selectedChannel, setSelectedChannel] = useState<"email" | "linkedin" | "whatsapp" | "phone_script">("email");
  const [selectedTone, setSelectedTone] = useState<"professional" | "casual" | "bold">("professional");
  const [provider, setProvider] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  const totalSaved = pipeline.length;
  const contactedCount = pipeline.filter((l) => l.status === "contacted").length;
  const wonCount = pipeline.filter((l) => l.status === "won").length;
  const conversionRate = totalSaved > 0 ? Math.round((wonCount / totalSaved) * 100) : 0;

  const suggestedCities = COUNTRY_CITIES[quickCountry] || [];

  useEffect(() => {
    if (!user) return;

    if (user.id === "user-1") {
      setScansCount(14);
      setResults(MOCK_LEADS.slice(0, 4));
      setActivities([
        { id: "1", action: "lead.searched", entityType: "lead", metadata: { query: "Web Developer", city: "London" }, createdAt: new Date(Date.now() - 3600000).toISOString() },
        { id: "2", action: "pipeline.lead_saved", entityType: "lead", metadata: { business_name: "Apex Design Agency", status: "new" }, createdAt: new Date(Date.now() - 7200000).toISOString() },
        { id: "3", action: "ai.message_generated", entityType: "lead", metadata: { business_name: "Café Nero" }, createdAt: new Date(Date.now() - 86400000).toISOString() },
      ]);
      return;
    }

    setLoading(true);
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
      .limit(4)
      .then(({ data, error }) => {
        if (error) console.error("Error fetching initial leads:", error);
        if (data) {
          const mapped = data.map((dbLead: any) => ({
            id: dbLead.id,
            businessName: dbLead.business_name,
            businessType: dbLead.business_type,
            industry: dbLead.industry,
            city: dbLead.city,
            country: dbLead.country,
            fullAddress: dbLead.full_address,
            phone: dbLead.phone || "",
            email: dbLead.email || null,
            websiteUrl: dbLead.website_url || null,
            hasWebsite: dbLead.has_website || false,
            googleRating: Number(dbLead.google_rating || 0),
            googleReviewCount: Number(dbLead.google_review_count || 0),
            opportunityScore: Number(dbLead.opportunity_score || 0),
            createdAt: dbLead.created_at,
            source: dbLead.source || "google_maps",
            savedAt: null,
            status: null,
          }));
          setResults(mapped);
        }
      });

    supabase
      .from("audit_log")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(6)
      .then(({ data, error }) => {
        setLoading(false);
        if (error) console.error("Error fetching audit logs:", error);
        if (data) {
          const mapped = data.map((d: any) => ({
            id: d.id,
            action: d.action,
            entityType: d.entity_type,
            metadata: d.metadata || {},
            createdAt: d.created_at,
          }));
          setActivities(mapped);
        }
      });
  }, [user]);

  const handleScraperSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!quickCity.trim()) {
      toast.error("Please enter a city name.");
      return;
    }

    setSearchLoading(true);
    if (!user || user.id === "user-1") {
      setTimeout(() => {
        const filtered = MOCK_LEADS.filter((l) => {
          if (quickCategory && l.industry !== quickCategory) return false;
          if (quickCity && !l.city.toLowerCase().includes(quickCity.toLowerCase())) return false;
          return true;
        });
        setResults(filtered);
        setSearchLoading(false);
        setScansCount((prev) => prev + 1);
        setActivities((prev) => [
          {
            id: String(Date.now()),
            action: "lead.searched",
            entityType: "lead",
            metadata: { query: quickCategory, city: quickCity },
            createdAt: new Date().toISOString(),
          },
          ...prev,
        ]);
        toast.success(`Found ${filtered.length} leads in ${quickCity} (Demo Mode)`);
      }, 600);
      return;
    }

    try {
      const queryTerm = CATEGORIES.find((c) => c.id === quickCategory)?.label || "local business";
      const { data, error } = await supabase.functions.invoke("search-leads", {
        body: {
          query: queryTerm,
          city: quickCity,
          country: quickCountry,
          limit: 12,
        },
      });
      if (error) throw error;
      const rawLeads = data?.leads || [];
      const mapped = rawLeads.map((dbLead: any) => ({
        id: dbLead.id,
        businessName: dbLead.business_name,
        businessType: dbLead.business_type,
        industry: dbLead.industry,
        city: dbLead.city,
        country: dbLead.country,
        fullAddress: dbLead.full_address,
        phone: dbLead.phone || "",
        email: dbLead.email || null,
        websiteUrl: dbLead.website_url || null,
        hasWebsite: dbLead.has_website || false,
        googleRating: Number(dbLead.google_rating || 0),
        googleReviewCount: Number(dbLead.google_review_count || 0),
        opportunityScore: Number(dbLead.opportunity_score || 0),
        createdAt: dbLead.created_at,
        source: dbLead.source || "google_maps",
        savedAt: null,
        status: null,
      }));
      setResults(mapped);
      setScansCount((prev) => prev + 1);

      const { data: logData } = await supabase
        .from("audit_log")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(6);
      if (logData) {
        setActivities(
          logData.map((d: any) => ({
            id: d.id,
            action: d.action,
            entityType: d.entity_type,
            metadata: d.metadata || {},
            createdAt: d.created_at,
          })),
        );
      }

      toast.success(`Found ${mapped.length} prospects in ${quickCity}!`);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to search leads");
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSaveLead = async (lead: Lead) => {
    setSavingId(lead.id);
    try {
      await saveLead(lead);
      toast.success(`Successfully saved ${lead.businessName} to CRM!`);
    } catch (err) {
      toast.error("Failed to save lead");
    } finally {
      setSavingId(null);
    }
  };

  const downloadCSV = () => {
    if (results.length === 0) return;
    const headers = ["Business Name", "Type", "City", "Country", "Address", "Phone", "Email", "Website", "Opportunity Score", "Google Rating", "Reviews"];
    const csvRows = [
      headers.join(","),
      ...results.map((l) =>
        [
          `"${l.businessName.replace(/"/g, '""')}"`,
          `"${l.businessType.replace(/"/g, '""')}"`,
          `"${l.city.replace(/"/g, '""')}"`,
          `"${l.country.replace(/"/g, '""')}"`,
          `"${l.fullAddress.replace(/"/g, '""')}"`,
          `"${(l.phone || "").replace(/"/g, '""')}"`,
          `"${(l.email || "").replace(/"/g, '""')}"`,
          `"${(l.websiteUrl || "").replace(/"/g, '""')}"`,
          l.opportunityScore,
          l.googleRating,
          l.googleReviewCount,
        ].join(","),
      ),
    ];
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `discovered_leads_${quickCity || "global"}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV Spreadsheet downloaded successfully!");
  };

  const handleGenerate = async () => {
    if (!detail) return;
    setGenerating(true);
    setOutreachDraft("");
    try {
      const { data, error } = await supabase.functions.invoke("ai-outreach", {
        body: {
          leadId: detail.id,
          channel: selectedChannel,
          tone: selectedTone,
        },
      });
      if (error) throw error;
      setOutreachDraft(data?.message || "Hi there...");
      setProvider(data?.model?.includes("claude") ? "Generated with Claude AI" : "Generated with Gemini");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to generate outreach pitch");
      setOutreachDraft(`Hi ${detail.businessName} team,\n\nI was looking at your online presence in ${detail.city} and saw some opportunities...`);
      setProvider("Local fallback template");
    } finally {
      setGenerating(false);
    }
  };

  const copyDraft = () => {
    navigator.clipboard.writeText(outreachDraft);
    toast.success("Outreach message copied to clipboard!");
  };

  const leadsUsed = user?.leadsUsedThisMonth || 0;
  const leadsLimit = user?.leadsLimit || 10;
  const usagePercent = Math.min(100, Math.round((leadsUsed / leadsLimit) * 100));

  const getScoreReasons = (lead: Lead) => {
    const reasons = [];
    if (!lead.hasWebsite) reasons.push({ label: "No website established", pts: 40 });
    else if (lead.googleRating < 4.0) reasons.push({ label: "Low Google Rating", pts: 25 });
    if (lead.googleReviewCount < 15) reasons.push({ label: "Few customer reviews", pts: 20 });
    if (!lead.email && !lead.phone) reasons.push({ label: "No visible contact methods", pts: 15 });
    return reasons;
  };

  const STATS = [
    { label: "Searches Run", value: scansCount, icon: Search, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Leads Saved", value: totalSaved, icon: Users, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Contacted", value: contactedCount, icon: MessageSquare, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "Win Rate", value: `${conversionRate}%`, icon: Target, color: "text-violet-500", bg: "bg-violet-500/10" },
  ];

  return (
    <>
      <Header title="Dashboard" />
      <div className="space-y-6 px-4 py-6 lg:px-8">

        {/* Welcome */}
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground">
              {greeting}, {(user?.fullName || "Freelancer").split(" ")[0]}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Find businesses that need your services. Search any city, any country.
            </p>
          </div>
          <Link
            to="/app/discover"
            className="inline-flex items-center gap-2 self-start rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 transition cursor-pointer"
          >
            <Compass className="h-4 w-4" /> Discover Leads
          </Link>
        </div>

        {/* Stat Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="flex items-center gap-4 rounded-xl border border-border bg-card p-5">
              <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${s.bg}`}>
                <s.icon className={`h-5 w-5 ${s.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground leading-none">{s.value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Main grid */}
        <div className="grid gap-6 lg:grid-cols-3">

          {/* Left: Search + Results */}
          <div className="lg:col-span-2 space-y-6">

            {/* Search Form */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="text-base font-semibold text-foreground">Find Clients</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Enter a business type and city to discover potential clients with contact details.
              </p>

              <form onSubmit={handleScraperSearch} className="mt-5 space-y-4">
                <div className="grid gap-3 sm:grid-cols-3">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Business Type</label>
                    <select
                      value={quickCategory}
                      onChange={(e) => setQuickCategory(e.target.value)}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c.id} value={c.id} className="bg-background text-foreground">
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Country</label>
                    <select
                      value={quickCountry}
                      onChange={(e) => setQuickCountry(e.target.value)}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                    >
                      {COUNTRIES.map((c) => (
                        <option key={c.code} value={c.name} className="bg-background text-foreground">
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-muted-foreground">City</label>
                    <input
                      type="text"
                      required
                      placeholder="Enter city name..."
                      value={quickCity}
                      onChange={(e) => setQuickCity(e.target.value)}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                    />
                  </div>
                </div>

                {/* Suggested cities */}
                {suggestedCities.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs text-muted-foreground">Popular cities:</span>
                    {suggestedCities.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => {
                          setQuickCity(c);
                          toast.success(`Selected: ${c}`);
                        }}
                        className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-foreground hover:bg-accent hover:border-primary/30 transition cursor-pointer"
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={searchLoading}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 text-sm font-semibold text-white hover:bg-primary/90 transition disabled:opacity-50 cursor-pointer"
                >
                  {searchLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                  {searchLoading ? "Searching..." : "Search for Businesses"}
                </button>
              </form>
            </div>

            {/* Results Table */}
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="mb-4 flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h3 className="text-base font-semibold text-foreground">Results</h3>
                  <p className="text-xs text-muted-foreground">{results.length} businesses found. Click a name for details.</p>
                </div>
                {results.length > 0 && (
                  <button
                    onClick={downloadCSV}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-accent transition cursor-pointer"
                  >
                    <Download className="h-3.5 w-3.5" /> Export CSV
                  </button>
                )}
              </div>

              {searchLoading ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-sm text-muted-foreground">Scanning business directories...</p>
                </div>
              ) : results.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <Map className="h-10 w-10 text-muted-foreground/40 mb-3" />
                  <p className="text-sm font-medium text-foreground">No results yet</p>
                  <p className="text-xs text-muted-foreground mt-1 max-w-xs">Use the search form above to find businesses in any city worldwide.</p>
                </div>
              ) : (
                <div className="overflow-x-auto -mx-6 px-6">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-border text-xs text-muted-foreground">
                        <th className="pb-3 font-medium">Business</th>
                        <th className="pb-3 font-medium">Location</th>
                        <th className="pb-3 font-medium">Score</th>
                        <th className="pb-3 font-medium">Contact</th>
                        <th className="pb-3 font-medium text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {results.map((l) => (
                        <tr key={l.id} className="hover:bg-accent/50 transition">
                          <td className="py-3 pr-4">
                            <button onClick={() => setDetail(l)} className="text-left cursor-pointer group">
                              <p className="font-medium text-foreground group-hover:text-primary transition truncate max-w-[180px]">{l.businessName}</p>
                              <p className="text-xs text-muted-foreground truncate max-w-[180px]">{l.businessType}</p>
                            </button>
                          </td>
                          <td className="py-3 pr-4 text-muted-foreground text-xs">
                            {l.city}, {l.country}
                          </td>
                          <td className="py-3 pr-4">
                            <OpportunityScore score={l.opportunityScore} size="sm" />
                          </td>
                          <td className="py-3 pr-4">
                            <div className="flex items-center gap-2">
                              {l.websiteUrl ? <Globe className="h-3.5 w-3.5 text-emerald-500" /> : <Globe className="h-3.5 w-3.5 text-muted-foreground/30" />}
                              {l.email ? <Mail className="h-3.5 w-3.5 text-emerald-500" /> : <Mail className="h-3.5 w-3.5 text-muted-foreground/30" />}
                              {l.phone ? <Phone className="h-3.5 w-3.5 text-emerald-500" /> : <Phone className="h-3.5 w-3.5 text-muted-foreground/30" />}
                            </div>
                          </td>
                          <td className="py-3 text-right">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => {
                                  setDetail(l);
                                  setOutreachDraft("");
                                }}
                                className="rounded-lg border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/20 transition cursor-pointer"
                              >
                                AI Pitch
                              </button>
                              <button
                                onClick={() => handleSaveLead(l)}
                                disabled={savedIds.has(l.id) || savingId === l.id}
                                className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 transition disabled:opacity-50 cursor-pointer"
                              >
                                {savingId === l.id ? "..." : savedIds.has(l.id) ? "Saved" : "Save"}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">

            {/* Quota */}
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-foreground">Monthly Quota</h3>
                <span className="rounded-full border border-border bg-background px-2.5 py-0.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
                  {user?.plan?.toUpperCase() || "FREE"}
                </span>
              </div>

              <div className="mb-2 flex items-end justify-between text-sm">
                <span className="text-muted-foreground">{leadsUsed} of {leadsLimit} leads used</span>
                <span className="font-semibold text-foreground">{usagePercent}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-accent overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
                  style={{ width: `${usagePercent}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                {Math.max(0, leadsLimit - leadsUsed)} searches remaining this month
              </p>

              {user?.plan === "free" && (
                <Link
                  to="/app/upgrade"
                  className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-xs font-semibold text-white hover:bg-primary/90 transition cursor-pointer"
                >
                  Upgrade for More Leads
                </Link>
              )}
            </div>

            {/* Pipeline */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="text-sm font-semibold text-foreground mb-4">Pipeline Overview</h3>
              <div className="space-y-3">
                {[
                  { label: "New Leads", count: pipeline.filter((l) => l.status === "new").length, color: "bg-blue-500" },
                  { label: "Contacted", count: contactedCount, color: "bg-amber-500" },
                  { label: "Interested", count: pipeline.filter((l) => l.status === "interested").length, color: "bg-violet-500" },
                  { label: "Won", count: wonCount, color: "bg-emerald-500" },
                ].map((stage) => (
                  <div key={stage.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className={`h-2.5 w-2.5 rounded-full ${stage.color}`} />
                      <span className="text-sm text-muted-foreground">{stage.label}</span>
                    </div>
                    <span className="text-sm font-semibold text-foreground">{stage.count}</span>
                  </div>
                ))}
              </div>
              <Link
                to="/app/pipeline"
                className="mt-4 flex items-center justify-center gap-1.5 rounded-lg border border-border bg-background py-2 text-xs font-medium text-foreground hover:bg-accent transition cursor-pointer"
              >
                View Full Pipeline <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Activity Log */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="text-sm font-semibold text-foreground mb-4">Recent Activity</h3>

              {loading ? (
                <div className="flex h-24 items-center justify-center">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                </div>
              ) : activities.length === 0 ? (
                <p className="text-center py-6 text-xs text-muted-foreground">No activity yet. Start searching to see your history.</p>
              ) : (
                <ul className="space-y-3">
                  {activities.map((act) => {
                    let desc = "";
                    let icon = <CheckCircle className="h-4 w-4 text-muted-foreground shrink-0" />;

                    if (act.action === "lead.searched") {
                      desc = `Searched for ${act.metadata.query} in ${act.metadata.city}`;
                      icon = <Search className="h-4 w-4 text-blue-500 shrink-0" />;
                    } else if (act.action === "pipeline.lead_saved") {
                      desc = `Saved ${act.metadata.business_name || "a lead"} to pipeline`;
                      icon = <Flame className="h-4 w-4 text-amber-500 shrink-0" />;
                    } else if (act.action === "ai.message_generated") {
                      desc = `Generated pitch for ${act.metadata.business_name || "lead"}`;
                      icon = <Sparkles className="h-4 w-4 text-violet-500 shrink-0" />;
                    } else {
                      desc = `Event: ${act.action}`;
                    }

                    const timeStr = act.createdAt ? new Date(act.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "";

                    return (
                      <li key={act.id} className="flex items-start gap-3">
                        <div className="mt-0.5">{icon}</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-foreground truncate">{desc}</p>
                          <p className="text-[11px] text-muted-foreground">{timeStr}</p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Lead Detail + AI Outreach Modal */}
        {detail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDetail(null)} />
            <div className="relative w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className="min-w-0">
                  <h3 className="font-display text-lg font-bold text-foreground truncate">{detail.businessName}</h3>
                  <p className="text-sm text-muted-foreground">{detail.businessType || "Local Business"}</p>
                </div>
                <button onClick={() => setDetail(null)} className="rounded-lg p-1.5 hover:bg-accent text-muted-foreground hover:text-foreground cursor-pointer">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="max-h-[60vh] overflow-y-auto space-y-4 pr-1">
                {/* Contact details */}
                <div className="space-y-2 text-sm border-b border-border pb-4">
                  <p className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4 shrink-0" /> {detail.fullAddress || `${detail.city}, ${detail.country}`}
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-4 w-4 shrink-0" /> {detail.phone || "No phone"}
                    </p>
                    {detail.phone && (
                      <button
                        onClick={() => {
                          navigator.clipboard?.writeText(detail.phone);
                          toast.success("Phone copied!");
                        }}
                        className="inline-flex items-center gap-1 rounded border border-border bg-background px-2 py-0.5 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                      >
                        <Copy className="h-3 w-3" /> Copy
                      </button>
                    )}
                  </div>
                  <p className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4 shrink-0" /> {detail.email || "No email found"}
                  </p>
                  <p className="flex items-center gap-2 text-muted-foreground">
                    <Globe className="h-4 w-4 shrink-0" />{" "}
                    {detail.websiteUrl ? (
                      <a href={detail.websiteUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                        {detail.websiteUrl}
                      </a>
                    ) : (
                      "No website"
                    )}
                  </p>
                  <p className="flex items-center gap-2 text-muted-foreground">
                    <Star className="h-4 w-4 fill-amber-500 text-amber-500 shrink-0" /> {detail.googleRating} rating · {detail.googleReviewCount} reviews
                  </p>
                </div>

                {/* Opportunity signals */}
                {getScoreReasons(detail).length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2">Opportunity Signals</p>
                    <ul className="space-y-1.5">
                      {getScoreReasons(detail).map((r) => (
                        <li key={r.label} className="flex items-center justify-between rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 text-sm text-emerald-600 dark:text-emerald-400">
                          <span className="flex items-center gap-2">
                            <Check className="h-3.5 w-3.5" /> {r.label}
                          </span>
                          <span className="text-xs font-semibold">+{r.pts}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* AI Pitch Generator */}
                <div className="border-t border-border pt-4">
                  <h4 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-primary" /> AI Outreach Generator
                  </h4>

                  {outreachDraft ? (
                    <div className="mt-3 space-y-3">
                      <textarea
                        value={outreachDraft}
                        onChange={(e) => setOutreachDraft(e.target.value)}
                        className="w-full h-36 rounded-lg border border-border bg-background p-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                      />
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{provider}</span>
                        <div className="flex gap-2">
                          <button onClick={() => setOutreachDraft("")} className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground cursor-pointer">
                            Reset
                          </button>
                          <button onClick={copyDraft} className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary/90 cursor-pointer">
                            Copy Pitch
                          </button>
                          {selectedChannel === "whatsapp" && detail.phone && (
                            <a
                              href={`https://wa.me/${detail.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(outreachDraft)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 flex items-center gap-1 cursor-pointer"
                            >
                              WhatsApp
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-3 space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="mb-1 block text-xs text-muted-foreground">Channel</label>
                          <select
                            value={selectedChannel}
                            onChange={(e) => setSelectedChannel(e.target.value as any)}
                            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                          >
                            <option value="email">Email</option>
                            <option value="linkedin">LinkedIn DM</option>
                            <option value="whatsapp">WhatsApp</option>
                            <option value="phone_script">Phone Script</option>
                          </select>
                        </div>
                        <div>
                          <label className="mb-1 block text-xs text-muted-foreground">Tone</label>
                          <select
                            value={selectedTone}
                            onChange={(e) => setSelectedTone(e.target.value as any)}
                            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                          >
                            <option value="professional">Professional</option>
                            <option value="casual">Casual</option>
                            <option value="bold">Bold / Direct</option>
                          </select>
                        </div>
                      </div>
                      <button
                        onClick={handleGenerate}
                        disabled={generating}
                        className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-semibold text-white hover:bg-primary/90 transition cursor-pointer disabled:opacity-50"
                      >
                        {generating ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" /> Generating...
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-4 w-4" /> Generate Pitch
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-border">
                <button
                  onClick={() => handleSaveLead(detail)}
                  disabled={savedIds.has(detail.id)}
                  className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-50 cursor-pointer"
                >
                  {savedIds.has(detail.id) ? "Already in CRM" : "Save to Pipeline"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
