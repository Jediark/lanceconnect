import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Search, TrendingUp, Compass, Calendar, Activity, CheckCircle, Flame, Mail, Sparkles, Loader2 } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { CATEGORIES, COUNTRIES } from "@/data/mockData";
import { usePipeline } from "@/contexts/PipelineContext";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

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
  const { pipeline } = usePipeline();
  const nav = useNavigate();

  const [loading, setLoading] = useState(false);
  const [scansCount, setScansCount] = useState(0);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [quickCity, setQuickCity] = useState("");
  const [quickCategory, setQuickCategory] = useState("web_dev");

  // Greeting based on time
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  // Dynamic calculations from CRM
  const totalSaved = pipeline.length;
  const contactedCount = pipeline.filter((l) => l.status === "contacted").length;
  const wonCount = pipeline.filter((l) => l.status === "won").length;
  const conversionRate = totalSaved > 0 ? Math.round((wonCount / totalSaved) * 100) : 0;

  // Load audit logs and scan histories
  useEffect(() => {
    if (!user || user.id === "user-1") {
      // Mock logs for demo mode
      setScansCount(14);
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

    // 2. Fetch recent activity from audit logs
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

  // Handle Quick Search
  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickCity.trim()) {
      toast.error("Please enter a city first.");
      return;
    }
    // Redirect user to discover page with params
    nav({
      to: "/app/discover",
      search: {
        category: quickCategory,
        city: quickCity,
      } as any,
    });
  };

  // Quota computations
  const leadsUsed = user?.leadsUsedThisMonth || 0;
  const leadsLimit = user?.leadsLimit || 10;
  const usagePercentage = Math.min(100, Math.round((leadsUsed / leadsLimit) * 100));

  // Circular progress dimensions
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const strokeOffset = circumference - (usagePercentage / 100) * circumference;

  return (
    <>
      <Header title="Dashboard" />
      <div className="space-y-6 px-4 py-6 lg:px-8">
        
        {/* Welcome Header */}
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold text-white">
              {greeting}, {(user?.fullName || "Freelancer").split(" ")[0]} 👋
            </h2>
            <p className="text-sm text-slate-400">
              Welcome back to your client-finding command center.
            </p>
          </div>
          <Link 
            to="/app/discover"
            className="inline-flex items-center gap-1.5 self-start rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-white shadow-lg hover:bg-primary/90 transition"
          >
            <Compass className="h-4 w-4" /> Discover New Leads
          </Link>
        </div>

        {/* Premium Stat Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-card hover:border-slate-800 transition">
            <p className="text-[10px] font-mono uppercase tracking-widest text-slate-500">// total.scans</p>
            <p className="mt-2 font-mono text-3xl font-bold text-white">{scansCount}</p>
            <p className="mt-1 flex items-center gap-1 text-[10px] text-emerald-500 font-medium">
              <TrendingUp className="h-3 w-3" /> Searches run
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-card hover:border-slate-800 transition">
            <p className="text-[10px] font-mono uppercase tracking-widest text-slate-500">// saved.leads</p>
            <p className="mt-2 font-mono text-3xl font-bold text-white">{totalSaved}</p>
            <p className="mt-1 text-[10px] text-slate-500 font-medium">
              In your CRM pipeline
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-card hover:border-slate-800 transition">
            <p className="text-[10px] font-mono uppercase tracking-widest text-slate-500">// contacted</p>
            <p className="mt-2 font-mono text-3xl font-bold text-white">{contactedCount}</p>
            <p className="mt-1 text-[10px] text-slate-500 font-medium">
              Outreach sent out
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-card hover:border-slate-800 transition">
            <p className="text-[10px] font-mono uppercase tracking-widest text-slate-500">// win.rate</p>
            <p className="mt-2 font-mono text-3xl font-bold text-white">{conversionRate}%</p>
            <p className="mt-1 text-[10px] text-primary font-medium">
              Saved leads closed
            </p>
          </div>
        </div>

        {/* Dynamic Activity and Quick Launcher */}
        <div className="grid gap-6 lg:grid-cols-3">
          
          {/* Recent Activity Timeline Widget */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-card lg:col-span-2 flex flex-col justify-between">
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Activity className="h-4 w-4 text-primary" /> Live Activity Feed
                </h3>
                <span className="text-[10px] font-mono text-slate-500">Real-time logs</span>
              </div>

              {loading ? (
                <div className="flex h-48 items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : activities.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center text-slate-500">
                  <span className="text-2xl">🌱</span>
                  <p className="mt-2 text-xs font-mono">No activity logged yet.</p>
                  <p className="text-[10px] text-slate-600 mt-1">Discover and save your first leads to start tracking events.</p>
                </div>
              ) : (
                <ul className="space-y-4">
                  {activities.map((act) => {
                    let desc = "";
                    let icon = <CheckCircle className="h-3.5 w-3.5 text-slate-500 shrink-0" />;

                    if (act.action === "lead.searched") {
                      desc = `Searched for ${act.metadata.query} in ${act.metadata.city}`;
                      icon = <Search className="h-3.5 w-3.5 text-blue-500 shrink-0" />;
                    } else if (act.action === "pipeline.lead_saved") {
                      desc = `Saved ${act.metadata.business_name || "a lead"} to your CRM pipeline`;
                      icon = <Flame className="h-3.5 w-3.5 text-amber-500 shrink-0" />;
                    } else if (act.action === "ai.message_generated" || act.action === "ai.message_cached") {
                      desc = `Generated an AI outreach pitch for ${act.metadata.business_name || "a business"}`;
                      icon = <Sparkles className="h-3.5 w-3.5 text-purple-400 shrink-0" />;
                    } else {
                      desc = `Performed action: ${act.action}`;
                    }

                    const timeStr = act.createdAt
                      ? new Date(act.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      : "";

                    return (
                      <li key={act.id} className="flex items-start justify-between gap-3 text-xs border-b border-border/40 pb-2.5 last:border-0 last:pb-0">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="h-7 w-7 rounded-lg bg-background border border-border/50 flex items-center justify-center shrink-0">
                            {icon}
                          </div>
                          <span className="truncate text-slate-300 font-sans leading-tight">{desc}</span>
                        </div>
                        <span className="font-mono text-[9px] text-slate-500 whitespace-nowrap">{timeStr}</span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {totalSaved > 0 && (
              <div className="mt-6 border-t border-border/40 pt-4 flex justify-between items-center text-xs">
                <span className="text-slate-400 font-sans">View saved leads, schedule follow-ups, or copy notes.</span>
                <Link to="/app/pipeline" className="font-bold text-primary hover:underline flex items-center gap-0.5">
                  Open CRM Pipeline <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            )}
          </div>

          {/* Quick Scrape Search Launcher Widget */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-card flex flex-col justify-between">
            <div>
              <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Search className="h-4 w-4 text-emerald-500" /> Lead Finder Launchpad
              </h3>
              <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                Scan public maps index and discover verified local businesses.
              </p>
              
              <form onSubmit={handleQuickSearch} className="mt-4 space-y-3">
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1">Target Skill</label>
                  <select 
                    value={quickCategory}
                    onChange={(e) => setQuickCategory(e.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-white focus:outline-none focus:border-primary transition"
                  >
                    {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.emoji} {c.label}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1">Target City</label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. London, Lagos, São Paulo"
                    value={quickCity}
                    onChange={(e) => setQuickCity(e.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-primary transition font-mono"
                  />
                </div>

                <button 
                  type="submit" 
                  className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-primary py-2 text-xs font-semibold text-white hover:bg-primary/95 transition cursor-pointer"
                >
                  <Search className="h-3.5 w-3.5" /> Launch Scraper Scan
                </button>
              </form>
            </div>
            
            <p className="mt-4 text-[9px] font-mono text-slate-500 text-center leading-normal">
              Queries deduct 1 lead credit. Global index covering 150+ countries.
            </p>
          </div>
        </div>

        {/* Circular Progress Gauge Widget & CRM Stages Progress */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          
          {/* Quota Usage Gauge Widget */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-card flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider">Quota Consumption</h3>
                <p className="mt-1 text-xs text-slate-400">Monthly leads allowances</p>
              </div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500">
                Plan: {user?.plan?.toUpperCase() || "FREE"}
              </span>
            </div>

            {/* Circular Gauge */}
            <div className="my-6 flex items-center justify-center gap-6">
              <div className="relative h-32 w-32">
                <svg className="h-full w-full -rotate-90">
                  {/* Track ring */}
                  <circle
                    cx="64"
                    cy="64"
                    r={radius}
                    className="stroke-slate-800 fill-none"
                    strokeWidth="8"
                  />
                  {/* Progress ring */}
                  <circle
                    cx="64"
                    cy="64"
                    r={radius}
                    className="stroke-primary fill-none transition-all duration-500 ease-out"
                    strokeWidth="8"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeOffset}
                    strokeLinecap="round"
                  />
                </svg>
                {/* Center text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="font-mono text-2xl font-bold text-white">{usagePercentage}%</span>
                  <span className="text-[8px] font-mono uppercase tracking-wider text-slate-500">Used</span>
                </div>
              </div>

              <div className="flex-1 space-y-1.5 text-xs text-slate-300">
                <div className="flex justify-between">
                  <span>Used Leads:</span>
                  <span className="font-mono font-bold text-white">{leadsUsed}</span>
                </div>
                <div className="flex justify-between">
                  <span>Allowance limit:</span>
                  <span className="font-mono text-slate-400">{leadsLimit}</span>
                </div>
                <div className="h-px bg-border/40 my-1" />
                <div className="flex justify-between">
                  <span>Credits remaining:</span>
                  <span className="font-mono font-bold text-emerald-400">{Math.max(0, leadsLimit - leadsUsed)}</span>
                </div>
              </div>
            </div>

            {/* Upgrade banner for Free plan users */}
            {user?.plan === "free" ? (
              <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-3.5 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold text-amber-500 leading-tight">Limits approaching</p>
                  <p className="text-[9px] text-slate-400 mt-0.5 leading-snug">Get 100+ global lead lines and Claude AI templates.</p>
                </div>
                <Link 
                  to="/app/upgrade"
                  className="rounded-lg bg-amber-500 px-3 py-1.5 text-[10px] font-bold text-white hover:bg-amber-600 shrink-0 shadow transition"
                >
                  Upgrade
                </Link>
              </div>
            ) : (
              <div className="text-[10px] text-slate-500 text-center leading-normal">
                Resetting on your monthly billing cycle date.
              </div>
            )}
          </div>

          {/* CRM Stages Progression Visualizer */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-card lg:col-span-2 flex flex-col justify-between">
            <div>
              <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider">Pipeline Conversion Steps</h3>
              <p className="mt-1 text-xs text-slate-400">Your deal stages conversion flow</p>
            </div>

            {/* Steps Row */}
            <div className="my-6 grid gap-4 grid-cols-4 relative">
              {[
                { stage: "New", count: pipeline.filter((l) => l.status === "new").length, color: "bg-blue-500" },
                { stage: "Contacted", count: contactedCount, color: "bg-amber-500" },
                { stage: "Interested", count: pipeline.filter((l) => l.status === "interested").length, color: "bg-purple-500" },
                { stage: "Won", count: wonCount, color: "bg-emerald-500" }
              ].map((step, idx) => (
                <div key={step.stage} className="flex flex-col items-center text-center relative z-10">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold font-mono text-white ${step.color} shadow-lg shadow-black/20`}>
                    {step.count}
                  </div>
                  <span className="text-xs font-semibold text-white mt-2 leading-none">{step.stage}</span>
                  <span className="text-[10px] text-slate-500 font-mono mt-1">leads</span>
                </div>
              ))}
              {/* Connector lines in background */}
              <div className="absolute top-[20px] left-[12.5%] right-[12.5%] h-0.5 bg-slate-800 z-0" />
            </div>

            <div className="text-center bg-background border border-border/40 p-3 rounded-xl text-xs text-slate-400">
              {wonCount > 0 ? (
                <span className="flex items-center justify-center gap-1.5 text-emerald-400 font-medium">
                  🎉 You have successfully won {wonCount} high-paying freelance contract{wonCount > 1 ? "s" : ""}! Keep scanning.
                </span>
              ) : (
                <span>Outreach to contacts to convert them into interested prospects.</span>
              )}
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
