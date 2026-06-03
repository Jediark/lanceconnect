import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Search, TrendingUp, Compass, Activity, CheckCircle, Flame, Mail, Sparkles, Loader2, X, MapPin, Copy, Star, Phone, Globe, Check } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { CATEGORIES, COUNTRIES, MOCK_LEADS, type Lead } from "@/data/mockData";
import { usePipeline } from "@/contexts/PipelineContext";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { OpportunityScore } from "@/components/ui/OpportunityScore";

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
  
  // Scraper search state
  const [quickCity, setQuickCity] = useState("");
  const [quickCategory, setQuickCategory] = useState("web_dev");
  const [quickCountry, setQuickCountry] = useState("Nigeria");
  const [results, setResults] = useState<Lead[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  // Outreach & Lead Detail state
  const [detail, setDetail] = useState<Lead | null>(null);
  const [generating, setGenerating] = useState(false);
  const [outreachDraft, setOutreachDraft] = useState("");
  const [selectedChannel, setSelectedChannel] = useState<"email" | "linkedin" | "whatsapp" | "phone_script">("email");
  const [selectedTone, setSelectedTone] = useState<"professional" | "casual" | "bold">("professional");
  const [provider, setProvider] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);

  // Greeting based on time
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  // Dynamic calculations from CRM
  const totalSaved = pipeline.length;
  const contactedCount = pipeline.filter((l) => l.status === "contacted").length;
  const wonCount = pipeline.filter((l) => l.status === "won").length;
  const conversionRate = totalSaved > 0 ? Math.round((wonCount / totalSaved) * 100) : 0;

  // Initial mount load
  useEffect(() => {
    if (!user) return;

    if (user.id === "user-1") {
      // Mock data for demo mode
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
    // 1. Fetch total search count from search history
    supabase
      .from("search_history")
      .select("id", { count: "exact" })
      .eq("user_id", user.id)
      .then(({ count, error }) => {
        if (!error && count !== null) setScansCount(count);
      });

    // 2. Load latest global leads as initial recommendations
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
            status: null
          }));
          setResults(mapped);
        }
      });

    // 3. Fetch recent activity from audit logs
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

  // Handle lead discovery search
  const handleScraperSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickCity.trim()) {
      toast.error("Please enter a city name.");
      return;
    }

    setSearchLoading(true);
    if (!user || user.id === "user-1") {
      setTimeout(() => {
        const queryTerm = quickCategory || "web_dev";
        const filtered = MOCK_LEADS.filter((l) => {
          if (quickCategory && l.industry !== quickCategory) return false;
          if (quickCity && !l.city.toLowerCase().includes(quickCity.toLowerCase())) return false;
          return true;
        });
        setResults(filtered);
        setSearchLoading(false);
        setScansCount((prev) => prev + 1);
        
        // Append live activity logs
        setActivities((prev) => [
          {
            id: String(Date.now()),
            action: "lead.searched",
            entityType: "lead",
            metadata: { query: quickCategory, city: quickCity },
            createdAt: new Date().toISOString()
          },
          ...prev
        ]);
        toast.success(`Found ${filtered.length} leads in ${quickCity} (Demo Mode)`);
      }, 600);
      return;
    }

    try {
      const queryTerm = CATEGORIES.find(c => c.id === quickCategory)?.label || "local business";
      const { data, error } = await supabase.functions.invoke("search-leads", {
        body: {
          query: queryTerm,
          city: quickCity,
          country: quickCountry,
          limit: 12
        }
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
        status: null
      }));
      setResults(mapped);
      setScansCount((prev) => prev + 1);
      
      // Update activity logs from database
      const { data: logData } = await supabase
        .from("audit_log")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(6);
      if (logData) {
        setActivities(logData.map((d: any) => ({
          id: d.id,
          action: d.action,
          entityType: d.entity_type,
          metadata: d.metadata || {},
          createdAt: d.created_at,
        })));
      }

      toast.success(`Found ${mapped.length} prospects in ${quickCity}!`);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to search leads");
    } finally {
      setSearchLoading(false);
    }
  };

  // Save lead handler
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

  // AI Pitch Generator
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
      setProvider(data?.model?.includes("claude") ? "✦ Generated with Claude AI" : "⚡ Generated with Gemini");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to generate outreach pitch");
      // Local fallback
      setOutreachDraft(`Hi ${detail.businessName} team,\n\nI was looking at your online presence in ${detail.city} and saw some opportunities...`);
      setProvider("⚡ Local fallback template");
    } finally {
      setGenerating(false);
    }
  };

  const copyDraft = () => {
    navigator.clipboard.writeText(outreachDraft);
    toast.success("Outreach message copied to clipboard!");
  };

  // Quota computations
  const leadsUsed = user?.leadsUsedThisMonth || 0;
  const leadsLimit = user?.leadsLimit || 10;
  const usagePercentage = Math.min(100, Math.round((leadsUsed / leadsLimit) * 100));

  // Circular progress dimensions
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const strokeOffset = circumference - (usagePercentage / 100) * circumference;

  // Render score reasons
  const getScoreReasons = (lead: Lead) => {
    const reasons = [];
    if (!lead.hasWebsite) reasons.push({ label: "No website established", pts: 40 });
    else if (lead.googleRating < 4.0) reasons.push({ label: "Low Google Rating", pts: 25 });
    if (lead.googleReviewCount < 15) reasons.push({ label: "Few customer reviews", pts: 20 });
    if (!lead.email && !lead.phone) reasons.push({ label: "No visible contact methods", pts: 15 });
    return reasons;
  };

  return (
    <>
      <Header title="Dashboard" />
      <div className="space-y-6 px-4 py-6 lg:px-8">
        
        {/* Welcome Header */}
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground">
              {greeting}, {(user?.fullName || "Freelancer").split(" ")[0]} 👋
            </h2>
            <p className="text-sm text-slate-500">
              Welcome back to your client-finding command center.
            </p>
          </div>
          <Link 
            to="/app/discover"
            className="inline-flex items-center gap-1.5 self-start rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-white shadow-lg hover:bg-primary/90 transition cursor-pointer"
          >
            <Compass className="h-4 w-4" /> Discover Leads Map
          </Link>
        </div>

        {/* Premium Stat Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-card hover:border-slate-800 transition">
            <p className="text-[10px] font-mono uppercase tracking-widest text-slate-500">// total.scans</p>
            <p className="mt-2 font-mono text-3xl font-bold text-foreground">{scansCount}</p>
            <p className="mt-1 flex items-center gap-1 text-[10px] text-emerald-500 font-medium">
              <TrendingUp className="h-3 w-3" /> Searches run
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-card hover:border-slate-800 transition">
            <p className="text-[10px] font-mono uppercase tracking-widest text-slate-500">// saved.leads</p>
            <p className="mt-2 font-mono text-3xl font-bold text-foreground">{totalSaved}</p>
            <p className="mt-1 text-[10px] text-slate-500 font-medium">
              In your CRM pipeline
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-card hover:border-slate-800 transition">
            <p className="text-[10px] font-mono uppercase tracking-widest text-slate-500">// contacted</p>
            <p className="mt-2 font-mono text-3xl font-bold text-foreground">{contactedCount}</p>
            <p className="mt-1 text-[10px] text-slate-500 font-medium">
              Outreach sent out
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-card hover:border-slate-800 transition">
            <p className="text-[10px] font-mono uppercase tracking-widest text-slate-500">// win.rate</p>
            <p className="mt-2 font-mono text-3xl font-bold text-foreground">{conversionRate}%</p>
            <p className="mt-1 text-[10px] text-primary font-medium">
              Saved leads closed
            </p>
          </div>
        </div>

        {/* Primary Action Deck: Lead Search & Active Opportunities */}
        <div className="grid gap-6 lg:grid-cols-3">
          
          {/* Main workspace panels */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Lead Scraper Console */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
              <h3 className="font-display text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Search className="h-4 w-4 text-primary" /> Active Lead Scraper Console
              </h3>
              <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                Configure your search options and scan live maps databases for local business opportunities.
              </p>
              
              <form onSubmit={handleScraperSearch} className="mt-4 grid gap-3 sm:grid-cols-4 items-end">
                <div className="sm:col-span-1">
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1">Freelancer Craft</label>
                  <select 
                    value={quickCategory}
                    onChange={(e) => setQuickCategory(e.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary transition"
                  >
                    {CATEGORIES.map((c) => <option key={c.id} value={c.id} className="bg-background text-foreground">{c.emoji} {c.label}</option>)}
                  </select>
                </div>

                <div className="sm:col-span-1">
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1">Target Country</label>
                  <select 
                    value={quickCountry}
                    onChange={(e) => setQuickCountry(e.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary transition"
                  >
                    {COUNTRIES.map((c) => <option key={c.code} value={c.name} className="bg-background text-foreground">{c.flag} {c.name}</option>)}
                  </select>
                </div>

                <div className="sm:col-span-1">
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1">City Name</label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. Lagos, London, New York"
                    value={quickCity}
                    onChange={(e) => setQuickCity(e.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground placeholder-slate-600 focus:outline-none focus:border-primary transition font-mono"
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={searchLoading}
                  className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-primary py-2 text-xs font-semibold text-white hover:bg-primary/95 transition disabled:opacity-50 cursor-pointer"
                >
                  {searchLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Search className="h-3.5 w-3.5" />} Find Opportunities
                </button>
              </form>
            </div>

            {/* Discovered Leads List panel */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
              <div className="mb-4 flex items-center justify-between border-b border-border/40 pb-3">
                <div>
                  <h3 className="font-display text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <Compass className="h-4 w-4 text-emerald-500" /> Discovered Clients List
                  </h3>
                  <p className="text-[10px] text-slate-500 mt-0.5">Click any lead line to open details & draft custom AI outreach messages.</p>
                </div>
                <span className="text-[10px] font-mono text-muted-foreground bg-background px-2 py-0.5 rounded border border-border/50">{results.length} targets</span>
              </div>

              {searchLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-xs font-mono text-muted-foreground animate-pulse">Scanning global map index...</p>
                </div>
              ) : results.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center text-slate-500">
                  <span className="text-3xl">🌎</span>
                  <p className="mt-3 text-sm font-medium text-foreground">No active opportunities loaded.</p>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm">Enter a target city and query parameters in the scraper console above to fetch real-time leads.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-border/40 text-slate-500 font-mono uppercase text-[10px] tracking-wider">
                        <th className="pb-3 font-semibold">Business name</th>
                        <th className="pb-3 font-semibold">Type</th>
                        <th className="pb-3 font-semibold">Location</th>
                        <th className="pb-3 font-semibold">Score</th>
                        <th className="pb-3 font-semibold">Contact Details</th>
                        <th className="pb-3 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/20">
                      {results.map((l) => (
                        <tr key={l.id} className="hover:bg-background/40 transition group">
                          <td className="py-3 font-semibold text-foreground max-w-[150px] truncate">
                            <button onClick={() => setDetail(l)} className="hover:underline text-left cursor-pointer">
                              {l.businessName}
                            </button>
                          </td>
                          <td className="py-3 text-slate-500 max-w-[120px] truncate">{l.businessType}</td>
                          <td className="py-3 text-slate-500">{l.city}, {l.country}</td>
                          <td className="py-3">
                            <OpportunityScore score={l.opportunityScore} size="sm" />
                          </td>
                          <td className="py-3">
                            <div className="flex items-center gap-1.5 text-slate-400">
                              {l.websiteUrl ? <Globe className="h-3.5 w-3.5 text-emerald-500" /> : <X className="h-3.5 w-3.5 text-red-500" />}
                              {l.email ? <Mail className="h-3.5 w-3.5 text-emerald-500" /> : <Mail className="h-3.5 w-3.5 text-slate-600" />}
                              {l.phone ? <Phone className="h-3.5 w-3.5 text-emerald-500" /> : <Phone className="h-3.5 w-3.5 text-slate-600" />}
                            </div>
                          </td>
                          <td className="py-3 text-right">
                            <div className="flex justify-end gap-1.5">
                              <button 
                                onClick={() => { setDetail(l); setOutreachDraft(""); }}
                                className="rounded bg-primary/10 border border-primary/20 px-2 py-1 text-[10px] font-bold text-primary hover:bg-primary/20 transition cursor-pointer"
                              >
                                Pitch AI
                              </button>
                              <button 
                                onClick={() => handleSaveLead(l)}
                                disabled={savedIds.has(l.id) || savingId === l.id}
                                className="rounded bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 text-[10px] font-bold text-emerald-500 hover:bg-emerald-500/20 transition disabled:opacity-50 cursor-pointer"
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

          {/* Right Panel Widgets */}
          <div className="space-y-6">
            
            {/* Quota Usage Gauge Widget */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-card flex flex-col justify-between">
              <div className="flex items-start justify-between border-b border-border/40 pb-3">
                <div>
                  <h3 className="font-display text-sm font-bold text-foreground uppercase tracking-wider">Quota Meter</h3>
                  <p className="text-[10px] text-slate-500">Monthly leads consumption</p>
                </div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 px-1.5 py-0.5 rounded border border-border/50 bg-background">
                  {user?.plan?.toUpperCase() || "FREE"}
                </span>
              </div>

              {/* Circular Gauge */}
              <div className="my-6 flex items-center justify-center gap-6">
                <div className="relative h-28 w-28 shrink-0">
                  <svg className="h-full w-full -rotate-90">
                    <circle
                      cx="56"
                      cy="56"
                      r={radius}
                      className="stroke-slate-200 dark:stroke-slate-800 fill-none"
                      strokeWidth="7"
                    />
                    <circle
                      cx="56"
                      cy="56"
                      r={radius}
                      className="stroke-primary fill-none transition-all duration-500 ease-out"
                      strokeWidth="7"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeOffset}
                      strokeLinecap="round"
                    />
                  </svg>
                  {/* Center text */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="font-mono text-xl font-bold text-foreground">{usagePercentage}%</span>
                    <span className="text-[8px] font-mono uppercase tracking-wider text-slate-500">Used</span>
                  </div>
                </div>

                <div className="flex-1 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex justify-between">
                    <span>Used Leads:</span>
                    <span className="font-mono font-bold text-foreground">{leadsUsed}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Limit:</span>
                    <span className="font-mono text-slate-400">{leadsLimit}</span>
                  </div>
                  <div className="h-px bg-border/40 my-1" />
                  <div className="flex justify-between">
                    <span>Available:</span>
                    <span className="font-mono font-bold text-emerald-500">{Math.max(0, leadsLimit - leadsUsed)}</span>
                  </div>
                </div>
              </div>

              {user?.plan === "free" && (
                <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold text-amber-500 leading-none">Quota low</p>
                    <p className="text-[9px] text-slate-500 mt-1 leading-snug">Get 100+ global lead lines and premium templates.</p>
                  </div>
                  <Link 
                    to="/app/upgrade"
                    className="rounded bg-amber-500 px-2.5 py-1 text-[10px] font-bold text-white hover:bg-amber-600 shrink-0 shadow transition cursor-pointer"
                  >
                    Upgrade
                  </Link>
                </div>
              )}
            </div>

            {/* Pipeline visualizer */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-card flex flex-col justify-between">
              <div className="border-b border-border/40 pb-3">
                <h3 className="font-display text-sm font-bold text-foreground uppercase tracking-wider">Campaign Pipeline</h3>
                <p className="text-[10px] text-slate-500">CRM conversion stage progression</p>
              </div>

              <div className="my-6 grid gap-4 grid-cols-4 relative">
                {[
                  { stage: "New", count: pipeline.filter((l) => l.status === "new").length, color: "bg-blue-500" },
                  { stage: "Contacted", count: contactedCount, color: "bg-amber-500" },
                  { stage: "Reply", count: pipeline.filter((l) => l.status === "interested").length, color: "bg-purple-500" },
                  { stage: "Won", count: wonCount, color: "bg-emerald-500" }
                ].map((step) => (
                  <div key={step.stage} className="flex flex-col items-center text-center relative z-10">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold font-mono text-white ${step.color} shadow-md`}>
                      {step.count}
                    </div>
                    <span className="text-[10px] font-semibold text-foreground mt-2 leading-none">{step.stage}</span>
                  </div>
                ))}
                {/* Connector line */}
                <div className="absolute top-[16px] left-[12.5%] right-[12.5%] h-0.5 bg-slate-200 dark:bg-slate-800 z-0" />
              </div>

              <div className="text-center bg-background border border-border/40 p-2.5 rounded-xl text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
                {wonCount > 0 ? (
                  <span className="text-emerald-500 font-medium">
                    🎉 Won {wonCount} high-paying freelance contracts!
                  </span>
                ) : (
                  <span>Keep saving prospects and sending AI pitches to convert won deals.</span>
                )}
              </div>
            </div>

            {/* Audit Logs activities list */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-card flex flex-col justify-between">
              <div className="border-b border-border/40 pb-3 mb-4">
                <h3 className="font-display text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Activity className="h-4 w-4 text-primary" /> System Activity Logs
                </h3>
              </div>

              {loading ? (
                <div className="flex h-36 items-center justify-center">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                </div>
              ) : activities.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-xs">No logs recorded yet.</div>
              ) : (
                <ul className="space-y-3">
                  {activities.map((act) => {
                    let desc = "";
                    let icon = <CheckCircle className="h-3 w-3 text-slate-500 shrink-0" />;

                    if (act.action === "lead.searched") {
                      desc = `Scanned for ${act.metadata.query} in ${act.metadata.city}`;
                      icon = <Search className="h-3 w-3 text-blue-500 shrink-0" />;
                    } else if (act.action === "pipeline.lead_saved") {
                      desc = `Saved ${act.metadata.business_name || "a lead"} to pipeline`;
                      icon = <Flame className="h-3 w-3 text-amber-500 shrink-0" />;
                    } else if (act.action === "ai.message_generated") {
                      desc = `Generated outreach message for ${act.metadata.business_name || "lead"}`;
                      icon = <Sparkles className="h-3 w-3 text-purple-400 shrink-0" />;
                    } else {
                      desc = `Triggered event: ${act.action}`;
                    }

                    const timeStr = act.createdAt
                      ? new Date(act.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                      : "";

                    return (
                      <li key={act.id} className="flex items-start justify-between gap-3 text-[11px] border-b border-border/30 pb-2 last:border-0 last:pb-0">
                        <div className="flex items-center gap-2 min-w-0">
                          {icon}
                          <span className="truncate text-slate-600 dark:text-slate-300 leading-none">{desc}</span>
                        </div>
                        <span className="font-mono text-[8px] text-slate-500 whitespace-nowrap">{timeStr}</span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

          </div>

        </div>

        {/* Lead Pilot AI Outreach & Details Modal Overlay */}
        {detail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDetail(null)} />
            
            {/* Modal Box */}
            <div className="relative w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
              <div className="flex items-start justify-between border-b border-border/40 pb-3">
                <div className="min-w-0">
                  <h3 className="font-display text-lg font-bold text-foreground truncate">{detail.businessName}</h3>
                  <p className="text-[10px] font-mono text-slate-500 uppercase mt-0.5 tracking-wider">{detail.businessType || "Local Business"}</p>
                </div>
                <button onClick={() => setDetail(null)} className="rounded-lg p-1 hover:bg-accent text-slate-400 hover:text-foreground cursor-pointer text-slate-400">
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Modal Core details scroll area */}
              <div className="my-4 max-h-[60vh] overflow-y-auto space-y-4 pr-1">
                
                {/* Contact grid */}
                <div className="grid gap-2 text-xs text-slate-600 dark:text-slate-300 border-b border-border/30 pb-3">
                  <p className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-slate-500" /> {detail.fullAddress || `${detail.city}, ${detail.country}`}</p>
                  <div className="flex items-center justify-between">
                    <p className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 text-slate-500" /> {detail.phone || "No phone number"}</p>
                    {detail.phone && (
                      <button onClick={() => { navigator.clipboard?.writeText(detail.phone); toast.success("Phone number copied!"); }} className="inline-flex items-center gap-1 rounded border border-border bg-background px-1.5 py-0.5 text-[9px] text-slate-500 hover:text-foreground cursor-pointer transition">
                        <Copy className="h-2.5 w-2.5" /> Copy
                      </button>
                    )}
                  </div>
                  <p className="flex items-center gap-2"><Mail className="h-3.5 w-3.5 text-slate-500" /> {detail.email || "No email address found"}</p>
                  <p className="flex items-center gap-2"><Globe className="h-3.5 w-3.5 text-slate-500" /> {detail.websiteUrl ? <a href={detail.websiteUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline">{detail.websiteUrl}</a> : "No website established"}</p>
                  <p className="flex items-center gap-2"><Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" /> {detail.googleRating} · {detail.googleReviewCount} reviews</p>
                </div>

                {/* Score breakdown reasons */}
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-wider text-slate-500">Scan Signals Analysis</p>
                  <ul className="mt-2 space-y-1 text-xs">
                    {getScoreReasons(detail).map((r) => (
                      <li key={r.label} className="flex items-center justify-between rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 text-emerald-600 dark:text-emerald-400">
                        <span className="inline-flex items-center gap-1.5"><Check className="h-3.5 w-3.5" /> {r.label}</span>
                        <span className="font-mono text-[10px] font-bold">+{r.pts} pts</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Pitch Generator Workspace */}
                <div className="border-t border-border/30 pt-4">
                  <h4 className="text-[10px] font-mono uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-primary" /> Lead Pilot AI Outreach Generator
                  </h4>

                  {outreachDraft ? (
                    <div className="mt-3 space-y-2">
                      <textarea
                        value={outreachDraft}
                        onChange={(e) => setOutreachDraft(e.target.value)}
                        className="w-full h-36 rounded-lg border border-border bg-background p-3 text-xs font-sans text-foreground focus:outline-none focus:border-primary"
                      />
                      <div className="flex items-center justify-between text-[9px] text-slate-500">
                        <span>{provider}</span>
                        <div className="flex gap-2">
                          <button onClick={() => setOutreachDraft("")} className="rounded border border-border bg-background px-2.5 py-1 text-xs text-slate-500 hover:text-foreground cursor-pointer">Edit settings</button>
                          <button onClick={copyDraft} className="rounded bg-primary px-3 py-1 text-xs font-semibold text-white hover:bg-primary/90 cursor-pointer">Copy outreach pitch</button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-3 rounded-xl border border-border bg-background p-3.5 space-y-3">
                      <div className="flex items-center justify-between gap-3 flex-wrap text-xs">
                        <div className="flex items-center gap-1.5">
                          <span className="text-slate-500">Outreach Channel:</span>
                          <select 
                            value={selectedChannel}
                            onChange={(e) => setSelectedChannel(e.target.value as any)}
                            className="bg-card border border-border rounded px-1.5 py-0.5 text-foreground text-[11px]"
                          >
                            <option value="email">📧 Email</option>
                            <option value="linkedin">🔗 LinkedIn DM</option>
                            <option value="whatsapp">💬 WhatsApp Message</option>
                            <option value="phone_script">📞 Phone Script</option>
                          </select>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <span className="text-slate-500">Tone:</span>
                          <select 
                            value={selectedTone}
                            onChange={(e) => setSelectedTone(e.target.value as any)}
                            className="bg-card border border-border rounded px-1.5 py-0.5 text-foreground text-[11px]"
                          >
                            <option value="professional">👔 Professional</option>
                            <option value="casual">☕ Casual</option>
                            <option value="bold">🚀 Bold / Direct</option>
                          </select>
                        </div>
                      </div>

                      <button
                        onClick={handleGenerate}
                        disabled={generating}
                        className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-primary/20 hover:bg-primary/30 border border-primary/45 py-2 text-xs font-semibold text-primary cursor-pointer transition"
                      >
                        {generating ? (
                          <>
                            <Loader2 className="h-3.5 w-3.5 animate-spin" /> Generating outreach...
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-3.5 w-3.5" /> Compose Pitch with AI
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>

              </div>

              <div className="flex gap-2 pt-3 border-t border-border/40">
                <button 
                  onClick={() => handleSaveLead(detail)}
                  disabled={savedIds.has(detail.id)}
                  className="w-full rounded-lg bg-primary py-2.5 text-xs font-semibold text-white hover:bg-primary/95 disabled:opacity-50 cursor-pointer"
                >
                  {savedIds.has(detail.id) ? "✓ Prospect saved in CRM" : "Save to CRM Pipeline"}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
}
