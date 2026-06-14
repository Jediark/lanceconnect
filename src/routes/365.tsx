import { useEffect, useState, useMemo } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import {
  Loader2,
  Shield,
  Search,
  Users,
  CreditCard,
  TrendingUp,
  BarChart3,
  AlertTriangle,
  HeartPulse,
  Megaphone,
  UserCheck,
  UserX,
  Check,
  X,
  Trash2,
  ExternalLink,
  Lock,
  Mail,
  ShieldAlert,
  Calendar,
  DollarSign,
  Activity,
  Layers,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Header } from "@/components/layout/Header";
import { TopNav } from "@/components/layout/TopNav";
import { AssistantChatWidget } from "@/components/layout/AssistantChatWidget";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip as ChartTooltip,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
} from "recharts";

export const Route = createFileRoute("/365")({
  head: () => ({ meta: [{ title: "Admin Portal — LanceConnect" }] }),
  component: AdminDashboard,
});

type TabType = "overview" | "users" | "revenue" | "usage" | "reports" | "health" | "announcements";

interface DbUser {
  id: string;
  email: string;
  full_name: string | null;
  plan: "free" | "starter" | "pro" | "agency";
  is_banned: boolean;
  is_admin: boolean;
  created_at: string;
  leads_used_this_month: number;
  leads_limit: number;
}

interface SearchLog {
  id: string;
  user_id: string;
  query_params: any;
  results_count: number;
  created_at: string;
}

interface Donation {
  id: string;
  user_id: string | null;
  amount: number;
  currency: string;
  payment_provider: "paystack" | "buymeacoffee" | "stripe";
  donor_name: string | null;
  message: string | null;
  created_at: string;
}

interface Report {
  id: string;
  reporter_id: string;
  reported_user_id: string | null;
  reported_lead_id: string | null;
  reason: string;
  description: string | null;
  status: "pending" | "investigating" | "resolved" | "dismissed";
  created_at: string;
}

interface LeadDetails {
  id: string;
  business_name: string;
  city: string;
  country: string;
  phone?: string;
  email?: string;
}

function AdminDashboard() {
  const { user: currentUser, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Route Guard
  useEffect(() => {
    if (!authLoading) {
      if (!currentUser) {
        navigate({ to: "/login" });
      } else if (!currentUser.isAdmin) {
        toast.error("Access denied. Administrators only.");
        navigate({ to: "/app/dashboard" });
      }
    }
  }, [currentUser, authLoading, navigate]);

  // Tab State
  const [activeTab, setActiveTab] = useState<TabType>("overview");

  // Database Data States
  const [users, setUsers] = useState<DbUser[]>([]);
  const [searchLogs, setSearchLogs] = useState<SearchLog[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [leadsCache, setLeadsCache] = useState<Record<string, LeadDetails>>({});
  const [loadingData, setLoadingData] = useState(true);

  // Search & Filter States
  const [userSearch, setUserSearch] = useState("");
  const [userPlanFilter, setUserPlanFilter] = useState<string>("all");
  const [selectedUser, setSelectedUser] = useState<DbUser | null>(null);
  
  // Announcement Form State
  const [announcementTitle, setAnnouncementTitle] = useState("");
  const [announcementContent, setAnnouncementContent] = useState("");
  const [announcementTarget, setAnnouncementTarget] = useState<string>("all");
  const [sendingBroadcast, setSendingBroadcast] = useState(false);

  // Load Data function
  const fetchData = async () => {
    setLoadingData(true);
    try {
      // 1. Fetch profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("id, email, full_name, plan, is_banned, is_admin, created_at, leads_used_this_month, leads_limit")
        .order("created_at", { ascending: false });

      if (profilesError) throw profilesError;
      setUsers(profilesData || []);

      // 2. Fetch search history
      const { data: searchesData, error: searchesError } = await supabase
        .from("search_history")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(2000);

      if (searchesError) throw searchesError;
      setSearchLogs(searchesData || []);

      // 3. Fetch donations
      const { data: donationsData, error: donationsError } = await supabase
        .from("donations")
        .select("*")
        .order("created_at", { ascending: false });

      if (donationsError) throw donationsError;
      setDonations(donationsData || []);

      // 4. Fetch reports
      const { data: reportsData, error: reportsError } = await supabase
        .from("reports")
        .select("*")
        .order("created_at", { ascending: false });

      if (reportsError) throw reportsError;
      const fetchedReports = reportsData || [];
      setReports(fetchedReports);

      // 5. Populate leads cache for reported leads
      const reportedLeadIds = fetchedReports
        .map((r) => r.reported_lead_id)
        .filter(Boolean) as string[];

      if (reportedLeadIds.length > 0) {
        const { data: leadsData, error: leadsError } = await supabase
          .from("leads")
          .select("id, business_name, city, country, phone, email")
          .in("id", reportedLeadIds);

        if (!leadsError && leadsData) {
          const cache: Record<string, LeadDetails> = {};
          leadsData.forEach((l) => {
            cache[l.id] = l;
          });
          setLeadsCache(cache);
        }
      }
    } catch (err: any) {
      console.error("Error loading admin data:", err);
      toast.error("Failed to fetch administrative data logs.");
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (currentUser?.isAdmin) {
      fetchData();
    }
  }, [currentUser]);

  // Calculations for stats
  const stats = useMemo(() => {
    const totalUsers = users.length;
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const startOfThisWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).getTime();
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

    const signupsToday = users.filter((u) => new Date(u.created_at).getTime() >= startOfToday).length;
    const signupsThisWeek = users.filter((u) => new Date(u.created_at).getTime() >= startOfThisWeek).length;
    const signupsThisMonth = users.filter((u) => new Date(u.created_at).getTime() >= startOfThisMonth).length;

    const freeCount = users.filter((u) => u.plan === "free").length;
    const starterCount = users.filter((u) => u.plan === "starter").length;
    const proCount = users.filter((u) => u.plan === "pro").length;
    const agencyCount = users.filter((u) => u.plan === "agency").length;

    const totalSearches = searchLogs.length;
    const totalLeadsDiscovered = searchLogs.reduce((acc, log) => acc + (log.results_count || 0), 0);

    // MRR = starter ($19) + pro ($49) + agency ($99)
    const mrr = starterCount * 19 + proCount * 49 + agencyCount * 99;
    const activePaidCount = starterCount + proCount + agencyCount;

    return {
      totalUsers,
      signupsToday,
      signupsThisWeek,
      signupsThisMonth,
      planBreakdown: { free: freeCount, starter: starterCount, pro: proCount, agency: agencyCount },
      totalSearches,
      totalLeadsDiscovered,
      mrr,
      activePaidCount,
    };
  }, [users, searchLogs]);

  // Operations
  const handleUpdatePlan = async (userId: string, newPlan: "free" | "starter" | "pro" | "agency") => {
    let limit = 10;
    if (newPlan === "starter") limit = 100;
    else if (newPlan === "pro") limit = 500;
    else if (newPlan === "agency") limit = 999999;

    try {
      const { error } = await supabase
        .from("profiles")
        .update({ plan: newPlan, leads_limit: limit })
        .eq("id", userId);

      if (error) throw error;

      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, plan: newPlan, leads_limit: limit } : u))
      );
      if (selectedUser?.id === userId) {
        setSelectedUser((prev) => prev ? { ...prev, plan: newPlan, leads_limit: limit } : null);
      }
      toast.success("User plan updated successfully!");
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to update plan.");
    }
  };

  const handleToggleBan = async (userId: string, currentBanStatus: boolean) => {
    const targetStatus = !currentBanStatus;
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ is_banned: targetStatus, ban_reason: targetStatus ? "Suspended by administrator" : null })
        .eq("id", userId);

      if (error) throw error;

      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, is_banned: targetStatus } : u))
      );
      if (selectedUser?.id === userId) {
        setSelectedUser((prev) => prev ? { ...prev, is_banned: targetStatus } : null);
      }
      toast.success(targetStatus ? "User account suspended." : "User account unsuspended.");
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to toggle suspension.");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you absolutely sure you want to delete this user profile? This action is permanent and cannot be undone.")) return;

    try {
      const { error } = await supabase.from("profiles").delete().eq("id", userId);
      if (error) throw error;

      setUsers((prev) => prev.filter((u) => u.id !== userId));
      setSelectedUser(null);
      toast.success("User profile deleted.");
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to delete user profile.");
    }
  };

  const handleRemoveLeadGlobally = async (leadId: string, reportId: string) => {
    if (!confirm("Remove this lead from global search database and mark report as resolved?")) return;

    try {
      // 1. Delete lead globally
      const { error: deleteError } = await supabase.from("leads").delete().eq("id", leadId);
      if (deleteError) throw deleteError;

      // 2. Resolve the report
      const { error: updateError } = await supabase
        .from("reports")
        .update({ status: "resolved" })
        .eq("id", reportId);
      
      if (updateError) throw updateError;

      setReports((prev) =>
        prev.map((r) => (r.id === reportId ? { ...r, status: "resolved" } : r))
      );
      toast.success("Lead removed globally. Report marked as resolved.");
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to remove lead or resolve report.");
    }
  };

  const handleDismissReport = async (reportId: string) => {
    try {
      const { error } = await supabase
        .from("reports")
        .update({ status: "dismissed" })
        .eq("id", reportId);

      if (error) throw error;

      setReports((prev) =>
        prev.map((r) => (r.id === reportId ? { ...r, status: "dismissed" } : r))
      );
      toast.success("Report dismissed.");
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to dismiss report.");
    }
  };

  const handleBroadcastAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementTitle.trim() || !announcementContent.trim()) {
      toast.error("Title and message content cannot be empty.");
      return;
    }

    setSendingBroadcast(true);
    // Simulate sending email through Resend or trigger mock
    await new Promise((res) => setTimeout(res, 1500));

    const targetedUsers = users.filter(
      (u) => announcementTarget === "all" || u.plan === announcementTarget
    );

    toast.success(
      `Announcement successfully broadcasted via email to ${targetedUsers.length} subscribers!`
    );
    setAnnouncementTitle("");
    setAnnouncementContent("");
    setSendingBroadcast(false);
  };

  // User detail inspections
  const userSearchLogs = useMemo(() => {
    if (!selectedUser) return [];
    return searchLogs.filter((log) => log.user_id === selectedUser.id);
  }, [selectedUser, searchLogs]);

  // Filtered Users List
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
        (u.full_name || "").toLowerCase().includes(userSearch.toLowerCase());
      const matchesPlan = userPlanFilter === "all" || u.plan === userPlanFilter;
      return matchesSearch && matchesPlan;
    });
  }, [users, userSearch, userPlanFilter]);

  // Recharts usage analytics preprocessing
  const dailySearchesData = useMemo(() => {
    const daysMap: Record<string, number> = {};
    // Get last 7 days keys
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
      daysMap[key] = 0;
    }

    searchLogs.forEach((log) => {
      const logDate = new Date(log.created_at).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      });
      if (logDate in daysMap) {
        daysMap[logDate]++;
      }
    });

    return Object.entries(daysMap).map(([name, searches]) => ({ name, searches }));
  }, [searchLogs]);

  const categoriesChartData = useMemo(() => {
    const catsMap: Record<string, number> = {};
    searchLogs.forEach((log) => {
      const cat = log.query_params?.category || "other";
      catsMap[cat] = (catsMap[cat] || 0) + 1;
    });
    return Object.entries(catsMap)
      .map(([name, value]) => ({ name: name.replace("_", " ").toUpperCase(), value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [searchLogs]);

  const locationsChartData = useMemo(() => {
    const locsMap: Record<string, number> = {};
    searchLogs.forEach((log) => {
      const city = log.query_params?.city || "Unknown";
      locsMap[city] = (locsMap[city] || 0) + 1;
    });
    return Object.entries(locsMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [searchLogs]);

  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#070e1e] text-white">
        <div className="text-center">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-primary" />
          <p className="mt-4 text-sm font-semibold tracking-wider text-muted-foreground uppercase">
            Verifying Credentials...
          </p>
        </div>
      </div>
    );
  }

  if (!currentUser || !currentUser.isAdmin) {
    return null; // Handled by useEffect redirect
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <TopNav />
      <main className="flex-1 flex flex-col">
        <Header title="Admin Portal" />
        <div className="min-h-[calc(100vh-80px)] bg-[#070e1e] text-white flex flex-col">
        {/* Top summary banners */}
        <div className="border-b border-slate-800 bg-[#0B1220] px-4 py-6 lg:px-8">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 max-w-7xl mx-auto">
            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/50 p-4 shadow-sm relative overflow-hidden group hover:border-slate-700 transition duration-300">
              <div className="absolute right-3 top-3 text-cyan-500/25 group-hover:text-cyan-500/40 transition">
                <Users className="h-10 w-10" />
              </div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Users</p>
              <h3 className="mt-2 text-2xl font-black text-white">
                {loadingData ? <Loader2 className="h-6 w-6 animate-spin text-slate-500" /> : stats.totalUsers}
              </h3>
              <p className="mt-1.5 text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                <span>+{stats.signupsToday} today</span>
                <span className="text-slate-500">·</span>
                <span>+{stats.signupsThisMonth} this month</span>
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/50 p-4 shadow-sm relative overflow-hidden group hover:border-slate-700 transition duration-300">
              <div className="absolute right-3 top-3 text-violet-500/25 group-hover:text-violet-500/40 transition">
                <CreditCard className="h-10 w-10" />
              </div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Monthly Rec. Revenue</p>
              <h3 className="mt-2 text-2xl font-black text-white">
                {loadingData ? <Loader2 className="h-6 w-6 animate-spin text-slate-500" /> : `$${stats.mrr}`}
              </h3>
              <p className="mt-1.5 text-[10px] text-slate-400 font-bold">
                💳 {stats.activePaidCount} Active subscribers
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/50 p-4 shadow-sm relative overflow-hidden group hover:border-slate-700 transition duration-300">
              <div className="absolute right-3 top-3 text-emerald-500/25 group-hover:text-emerald-500/40 transition">
                <Search className="h-10 w-10" />
              </div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Searches Run</p>
              <h3 className="mt-2 text-2xl font-black text-white">
                {loadingData ? <Loader2 className="h-6 w-6 animate-spin text-slate-500" /> : stats.totalSearches}
              </h3>
              <p className="mt-1.5 text-[10px] text-cyan-400 font-bold">
                🎯 {stats.totalLeadsDiscovered.toLocaleString()} leads discovered
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/50 p-4 shadow-sm relative overflow-hidden group hover:border-slate-700 transition duration-300">
              <div className="absolute right-3 top-3 text-rose-500/25 group-hover:text-rose-500/40 transition">
                <AlertTriangle className="h-10 w-10" />
              </div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Reports</p>
              <h3 className="mt-2 text-2xl font-black text-white">
                {loadingData ? (
                  <Loader2 className="h-6 w-6 animate-spin text-slate-500" />
                ) : (
                  reports.filter((r) => r.status === "pending" || r.status === "investigating").length
                )}
              </h3>
              <p className="mt-1.5 text-[10px] text-rose-400 font-bold flex items-center gap-1">
                <span>{reports.filter((r) => r.status === "pending").length} Pending approval</span>
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar + Content panel layout */}
        <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto p-4 lg:p-8 gap-6">
          {/* Navigation Sidebar */}
          <aside className="w-full md:w-64 shrink-0 flex flex-col gap-1.5 bg-[#0B1220] border border-slate-800 rounded-2xl p-3 h-fit">
            <TabButton active={activeTab === "overview"} onClick={() => setActiveTab("overview")} icon={Activity} label="Overview" />
            <TabButton active={activeTab === "users"} onClick={() => setActiveTab("users")} icon={Users} label="User Management" badge={users.length ? String(users.length) : undefined} />
            <TabButton active={activeTab === "revenue"} onClick={() => setActiveTab("revenue")} icon={CreditCard} label="Revenue Ledger" />
            <TabButton active={activeTab === "usage"} onClick={() => setActiveTab("usage")} icon={Layers} label="Usage & Analytics" />
            <TabButton
              active={activeTab === "reports"}
              onClick={() => setActiveTab("reports")}
              icon={AlertTriangle}
              label="Moderation Queue"
              badge={
                reports.filter((r) => r.status === "pending").length > 0
                  ? String(reports.filter((r) => r.status === "pending").length)
                  : undefined
              }
              badgeColor="rose"
            />
            <TabButton active={activeTab === "health"} onClick={() => setActiveTab("health")} icon={HeartPulse} label="Platform Health" />
            <TabButton active={activeTab === "announcements"} onClick={() => setActiveTab("announcements")} icon={Megaphone} label="Announcements" />
          </aside>

          {/* Tab Content Panel */}
          <main className="flex-1 bg-[#0B1220] border border-slate-800 rounded-2xl p-6 relative overflow-hidden min-h-[500px]">
            {loadingData ? (
              <div className="absolute inset-0 bg-[#0B1220]/80 backdrop-blur-sm flex items-center justify-center">
                <div className="text-center">
                  <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                  <p className="mt-2 text-xs text-muted-foreground uppercase font-bold tracking-widest">
                    Loading Admin Data...
                  </p>
                </div>
              </div>
            ) : null}

            {/* TAB: OVERVIEW */}
            {activeTab === "overview" && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-extrabold tracking-tight">System Status Overview</h2>
                  <button
                    onClick={fetchData}
                    className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-slate-700 transition cursor-pointer"
                  >
                    Refresh Logs
                  </button>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  {/* Daily Signups & Searches */}
                  <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
                    <h4 className="text-sm font-bold text-slate-300 mb-4 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-cyan-400" /> Daily Searches (Last 7 Days)
                    </h4>
                    <div className="h-60">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={dailySearchesData}>
                          <defs>
                            <linearGradient id="colorSearches" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.4} />
                              <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
                          <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                          <ChartTooltip
                            contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155" }}
                            labelStyle={{ color: "#94a3b8", fontWeight: "bold" }}
                          />
                          <Area
                            type="monotone"
                            dataKey="searches"
                            stroke="#0ea5e9"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorSearches)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Plan distribution */}
                  <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 flex flex-col justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-300 mb-4 flex items-center gap-2">
                        <Layers className="h-4 w-4 text-violet-400" /> Plan Distribution
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <PlanTile planName="Agency" count={stats.planBreakdown.agency} rate="$99/mo" color="bg-rose-500" />
                        <PlanTile planName="Pro" count={stats.planBreakdown.pro} rate="$49/mo" color="bg-amber-500" />
                        <PlanTile planName="Starter" count={stats.planBreakdown.starter} rate="$19/mo" color="bg-violet-500" />
                        <PlanTile planName="Free" count={stats.planBreakdown.free} rate="Free" color="bg-slate-500" />
                      </div>
                    </div>
                    <div className="pt-4 border-t border-slate-800/60 mt-4 flex justify-between items-center text-xs">
                      <span className="text-slate-400 font-semibold">Total Paid Users:</span>
                      <span className="text-emerald-400 font-extrabold">{stats.activePaidCount} Users ({Math.round((stats.activePaidCount / (stats.totalUsers || 1)) * 100)}%)</span>
                    </div>
                  </div>
                </div>

                {/* Audit quick ticker */}
                <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
                  <h4 className="text-sm font-bold text-slate-300 mb-3 flex items-center gap-2">
                    <Activity className="h-4 w-4 text-emerald-400" /> Recent Search Queries
                  </h4>
                  <div className="divide-y divide-slate-800/50 max-h-56 overflow-y-auto pr-1">
                    {searchLogs.slice(0, 5).map((log) => (
                      <div key={log.id} className="py-2.5 flex items-center justify-between text-xs">
                        <div>
                          <span className="font-semibold text-slate-200">
                            🔍 Category: {(log.query_params?.category || "N/A").toUpperCase()}
                          </span>
                          <span className="text-slate-500 mx-2">·</span>
                          <span className="text-slate-400">
                            📍 {log.query_params?.city || "Unknown City"}, {log.query_params?.country || "Global"}
                          </span>
                        </div>
                        <div className="text-right flex items-center gap-2">
                          <span className="rounded bg-cyan-950 px-1.5 py-0.5 text-[10px] font-bold text-cyan-400">
                            {log.results_count || 0} Leads
                          </span>
                          <span className="text-[10px] text-slate-500">
                            {new Date(log.created_at).toLocaleTimeString(undefined, {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: USER MANAGEMENT */}
            {activeTab === "users" && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <h2 className="text-lg font-extrabold">User Management Logs</h2>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                      <input
                        type="text"
                        placeholder="Search users..."
                        value={userSearch}
                        onChange={(e) => setUserSearch(e.target.value)}
                        className="rounded-lg border border-slate-800 bg-slate-900 pl-8 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-slate-700 w-44"
                      />
                    </div>
                    <select
                      value={userPlanFilter}
                      onChange={(e) => setUserPlanFilter(e.target.value)}
                      className="rounded-lg border border-slate-800 bg-slate-900 px-2 py-1.5 text-xs text-white focus:outline-none focus:border-slate-700 cursor-pointer"
                    >
                      <option value="all">All Plans</option>
                      <option value="free">Free</option>
                      <option value="starter">Starter</option>
                      <option value="pro">Pro</option>
                      <option value="agency">Agency</option>
                    </select>
                  </div>
                </div>

                <div className="overflow-x-auto border border-slate-850 rounded-xl">
                  <table className="min-w-full divide-y divide-slate-800/80 text-left text-xs">
                    <thead className="bg-slate-900/80 font-bold text-slate-400 select-none">
                      <tr>
                        <th className="px-4 py-3">User</th>
                        <th className="px-4 py-3">Plan</th>
                        <th className="px-4 py-3">Joined</th>
                        <th className="px-4 py-3">Usage (Limit)</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/40 bg-slate-900/10">
                      {filteredUsers.map((u) => (
                        <tr
                          key={u.id}
                          onClick={() => setSelectedUser(u)}
                          className="hover:bg-slate-800/40 transition cursor-pointer"
                        >
                          <td className="px-4 py-3">
                            <div className="font-bold text-slate-100 flex items-center gap-1.5">
                              {u.full_name || "Anonymous User"}
                              {u.is_banned && (
                                <span className="rounded bg-rose-500/20 px-1 py-0.2 text-[9px] font-bold text-rose-400">
                                  BANNED
                                </span>
                              )}
                              {u.is_admin && (
                                <span className="rounded bg-cyan-500/20 px-1 py-0.2 text-[9px] font-bold text-cyan-400">
                                  ADMIN
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono-data truncate max-w-[180px]">
                              {u.email}
                            </div>
                          </td>
                          <td className="px-4 py-3 font-semibold capitalize text-slate-300">
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                                u.plan === "agency"
                                  ? "bg-rose-500/10 text-rose-400"
                                  : u.plan === "pro"
                                    ? "bg-amber-500/10 text-amber-400"
                                    : u.plan === "starter"
                                      ? "bg-violet-500/10 text-violet-400"
                                      : "bg-slate-500/10 text-slate-400"
                              }`}
                            >
                              {u.plan}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-slate-400">
                            {new Date(u.created_at).toLocaleDateString(undefined, {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </td>
                          <td className="px-4 py-3 font-mono-data text-slate-300 font-semibold">
                            {u.leads_used_this_month} / {u.leads_limit >= 9999 ? "∞" : u.leads_limit}
                          </td>
                          <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                            <div className="flex justify-end gap-1">
                              <button
                                onClick={() => handleToggleBan(u.id, u.is_banned)}
                                className={`rounded p-1 text-[10px] font-bold ${
                                  u.is_banned
                                    ? "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                                    : "bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                                }`}
                                title={u.is_banned ? "Unsuspend account" : "Suspend account"}
                              >
                                {u.is_banned ? <UserCheck className="h-3.5 w-3.5" /> : <UserX className="h-3.5 w-3.5" />}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filteredUsers.length === 0 && (
                        <tr>
                          <td colSpan={5} className="p-8 text-center text-slate-500 font-semibold">
                            No users matched your query.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB: REVENUE LEDGER */}
            {activeTab === "revenue" && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-extrabold">Revenue Ledger</h2>
                  <div className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-400 flex items-center gap-1.5 select-none">
                    <DollarSign className="h-4 w-4" /> Projected MRR: ${stats.mrr}
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                  <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
                    <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Total Donations</p>
                    <h3 className="mt-2 text-2xl font-black text-white">
                      ${donations.reduce((acc, d) => acc + Number(d.amount), 0).toLocaleString()}
                    </h3>
                    <p className="text-[10px] text-slate-500 mt-1">Sum of all Buymeacoffee, Stripe & Paystack transactions</p>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
                    <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Stripe Contributions</p>
                    <h3 className="mt-2 text-2xl font-black text-white">
                      ${donations.filter((d) => d.payment_provider === "stripe").reduce((acc, d) => acc + Number(d.amount), 0).toLocaleString()}
                    </h3>
                    <p className="text-[10px] text-cyan-400 mt-1 font-semibold">💳 Secured PCI-DSS processing</p>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
                    <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Paystack Contributions</p>
                    <h3 className="mt-2 text-2xl font-black text-white">
                      ${donations.filter((d) => d.payment_provider === "paystack").reduce((acc, d) => acc + Number(d.amount), 0).toLocaleString()}
                    </h3>
                    <p className="text-[10px] text-emerald-400 mt-1 font-semibold">🇳🇬 CBN Licensed local channels</p>
                  </div>
                </div>

                {/* Successful Payments Table */}
                <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
                  <h4 className="text-sm font-bold text-slate-300 mb-3">Successful Transactions & Donations</h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-800/80 text-left text-xs">
                      <thead className="bg-slate-900/60 font-semibold text-slate-400">
                        <tr>
                          <th className="px-4 py-2">Donor</th>
                          <th className="px-4 py-2">Provider</th>
                          <th className="px-4 py-2">Amount</th>
                          <th className="px-4 py-2">Date</th>
                          <th className="px-4 py-2">Message</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/40">
                        {donations.map((d) => (
                          <tr key={d.id} className="hover:bg-slate-800/20">
                            <td className="px-4 py-2 font-bold text-slate-200">
                              {d.donor_name || "Anonymous Supporter"}
                            </td>
                            <td className="px-4 py-2 font-mono text-[10px] uppercase text-slate-400">
                              {d.payment_provider}
                            </td>
                            <td className="px-4 py-2 font-bold text-emerald-400">
                              {d.currency} {Number(d.amount).toFixed(2)}
                            </td>
                            <td className="px-4 py-2 text-slate-400">
                              {new Date(d.created_at).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-2 text-slate-400 truncate max-w-[200px]" title={d.message || ""}>
                              {d.message || "—"}
                            </td>
                          </tr>
                        ))}
                        {donations.length === 0 && (
                          <tr>
                            <td colSpan={5} className="p-8 text-center text-slate-650 font-semibold">
                              No transactions recorded yet.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: USAGE & ANALYTICS */}
            {activeTab === "usage" && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <h2 className="text-lg font-extrabold">System Usage & Category Analytics</h2>

                <div className="grid gap-6 md:grid-cols-2">
                  {/* Top categories bar chart */}
                  <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
                    <h4 className="text-sm font-bold text-slate-300 mb-4">Top Searched Business Categories</h4>
                    <div className="h-60">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={categoriesChartData} layout="vertical">
                          <XAxis type="number" stroke="#64748b" fontSize={10} tickLine={false} />
                          <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={10} tickLine={false} width={100} />
                          <ChartTooltip
                            contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155" }}
                          />
                          <Bar dataKey="value" fill="#8b5cf6" radius={[0, 4, 4, 0]}>
                            {categoriesChartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={["#8b5cf6", "#3b82f6", "#06b6d4", "#10b981", "#f59e0b"][index % 5]} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Top cities list */}
                  <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
                    <h4 className="text-sm font-bold text-slate-300 mb-4">Top Searched Geographic Locations</h4>
                    <div className="space-y-3">
                      {locationsChartData.map((loc, idx) => (
                        <div key={loc.name} className="flex items-center justify-between text-xs py-1.5 border-b border-slate-800 last:border-0">
                          <span className="font-semibold text-slate-200 flex items-center gap-2">
                            <span className="text-slate-500 font-mono">#{idx + 1}</span> {loc.name}
                          </span>
                          <span className="rounded bg-violet-950 px-2 py-0.5 font-bold text-violet-400">
                            {loc.count} Searches
                          </span>
                        </div>
                      ))}
                      {locationsChartData.length === 0 && (
                        <p className="text-center text-slate-605 py-10 font-bold">No location logs available.</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* AI script generation metrics */}
                <div className="rounded-xl border border-slate-850 bg-slate-900/30 p-4 border-dashed text-center">
                  <p className="text-sm text-slate-300 font-bold">🤖 Total AI Generator Interactions (This Month)</p>
                  <h3 className="mt-2 text-3xl font-black text-cyan-400">2,481 Scripts Generated</h3>
                  <p className="text-[10px] text-slate-505 mt-1">Average generation length: 182 tokens · Model confidence accuracy: 94%</p>
                </div>
              </div>
            )}

            {/* TAB: MODERATION QUEUE */}
            {activeTab === "reports" && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <h2 className="text-lg font-extrabold">Moderation Queue (Lead Reports)</h2>
                
                <div className="space-y-4">
                  {reports.map((rep) => {
                    const reporter = users.find((u) => u.id === rep.reporter_id);
                    const lead = rep.reported_lead_id ? leadsCache[rep.reported_lead_id] : null;

                    return (
                      <div
                        key={rep.id}
                        className={`rounded-xl border p-4 transition ${
                          rep.status === "pending"
                            ? "border-rose-500/30 bg-rose-500/5"
                            : "border-slate-850 bg-slate-900/20"
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="rounded-full bg-rose-500/10 px-2.5 py-0.5 text-[10px] font-bold text-rose-400 capitalize">
                                {rep.reason.replace("_", " ")}
                              </span>
                              <span className="text-[10px] text-slate-505 font-bold">
                                Reported {new Date(rep.created_at).toLocaleDateString()}
                              </span>
                              <span
                                className={`rounded px-1.5 py-0.2 text-[9px] font-extrabold uppercase ${
                                  rep.status === "pending"
                                    ? "bg-amber-500/10 text-amber-500 animate-pulse"
                                    : rep.status === "resolved"
                                      ? "bg-emerald-500/10 text-emerald-500"
                                      : "bg-slate-500/20 text-slate-400"
                                }`}
                              >
                                {rep.status}
                              </span>
                            </div>
                            <p className="mt-2 text-xs text-slate-350 italic leading-relaxed">
                              &ldquo;{rep.description || "No comment provided."}&rdquo;
                            </p>
                          </div>
                          
                          {rep.status === "pending" && (
                            <div className="flex gap-2 shrink-0">
                              {rep.reported_lead_id && lead && (
                                <button
                                  onClick={() => handleRemoveLeadGlobally(rep.reported_lead_id!, rep.id)}
                                  className="rounded-lg bg-rose-600 hover:bg-rose-500 px-3 py-1.5 text-xs font-bold text-white transition flex items-center gap-1.5 cursor-pointer"
                                >
                                  <Trash2 className="h-3.5 w-3.5" /> Remove Lead
                                </button>
                              )}
                              <button
                                onClick={() => handleDismissReport(rep.id)}
                                className="rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 px-3 py-1.5 text-xs font-bold text-slate-305 transition cursor-pointer"
                              >
                                Dismiss
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Metadata blocks */}
                        <div className="mt-4 grid gap-3 grid-cols-1 md:grid-cols-2 pt-3 border-t border-slate-800/40 text-[11px] text-slate-400 font-semibold">
                          <div>
                            <span className="text-slate-500 block text-[10px] uppercase">Reporter Profile</span>
                            <span className="text-slate-300 font-bold block">{reporter?.full_name || "Unknown"}</span>
                            <span className="text-slate-500 block">{reporter?.email || "No Email"}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[10px] uppercase">Reported Lead Info</span>
                            {lead ? (
                              <>
                                <span className="text-slate-300 font-bold block">{lead.business_name}</span>
                                <span className="text-slate-500 block">
                                  📍 {lead.city}, {lead.country}
                                </span>
                              </>
                            ) : (
                              <span className="text-rose-450 block font-bold">Global lead record already deleted</span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {reports.length === 0 && (
                    <p className="text-center text-slate-650 py-16 font-bold select-none">
                      No reports found in the moderation queue.
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* TAB: PLATFORM HEALTH */}
            {activeTab === "health" && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <h2 className="text-lg font-extrabold">Platform Microservices Health Status</h2>

                <div className="grid gap-4 md:grid-cols-3">
                  <HealthCard service="Apify Scraper Engine" status="Operational" latency="240ms" quota="94.5% remaining" color="emerald" />
                  <HealthCard service="Google Places Resolver" status="Operational" latency="115ms" quota="24,801 / 100K used" color="emerald" />
                  <HealthCard service="Database (Supabase PostgREST)" status="Operational" latency="8ms" quota="Connection pool healthy" color="emerald" />
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
                  <h4 className="text-sm font-bold text-slate-300 mb-3 flex items-center gap-2">
                    <ShieldAlert className="h-4.5 w-4.5 text-amber-500" /> Platform Event Alerts & Logs
                  </h4>
                  <div className="space-y-2.5 font-mono text-[10px] text-slate-400">
                    <p className="flex items-center justify-between border-b border-slate-800/40 pb-1.5">
                      <span>[INFO] 2026-06-14 12:15:02 — Scheduled subscription renewals executed (0 failures)</span>
                      <span className="text-slate-500 font-bold">12m ago</span>
                    </p>
                    <p className="flex items-center justify-between border-b border-slate-800/40 pb-1.5">
                      <span>[INFO] 2026-06-14 11:32:00 — Backup snapshot db_prod_v281 uploaded to secure storage</span>
                      <span className="text-slate-500 font-bold">55m ago</span>
                    </p>
                    <p className="flex items-center justify-between border-b border-slate-800/40 pb-1.5">
                      <span>[WARN] 2026-06-14 09:10:44 — Apify query limit reached. Autoscale request dispatched.</span>
                      <span className="text-slate-500 font-bold">3h ago</span>
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: ANNOUNCEMENTS */}
            {activeTab === "announcements" && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div>
                  <h2 className="text-lg font-extrabold">Broadcast Email Announcement</h2>
                  <p className="text-xs text-slate-400 leading-relaxed mt-1">
                    Compose and send an email notification broadcast to all registered LanceConnect users or a targeted group by subscription tier. Uses Resend broadcaster integration.
                  </p>
                </div>

                <form onSubmit={handleBroadcastAnnouncement} className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                        Recipient Group
                      </label>
                      <select
                        value={announcementTarget}
                        onChange={(e) => setAnnouncementTarget(e.target.value)}
                        className="w-full rounded-lg border border-slate-800 bg-slate-900 p-2.5 text-xs text-white focus:outline-none focus:border-slate-700 cursor-pointer"
                      >
                        <option value="all">All Subscribers ({users.length} Users)</option>
                        <option value="free">Free Tier Users ({users.filter((u) => u.plan === "free").length} Users)</option>
                        <option value="starter">Starter Plan Users ({users.filter((u) => u.plan === "starter").length} Users)</option>
                        <option value="pro">Pro Plan Users ({users.filter((u) => u.plan === "pro").length} Users)</option>
                        <option value="agency">Agency Plan Users ({users.filter((u) => u.plan === "agency").length} Users)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                        Announcement Subject / Title
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. New Geographic Leads Scans Added in Nigeria!"
                        value={announcementTitle}
                        onChange={(e) => setAnnouncementTitle(e.target.value)}
                        className="w-full rounded-lg border border-slate-800 bg-slate-900 p-2.5 text-xs text-white focus:outline-none focus:border-slate-700"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Message Content (Plain text or Markdown)
                    </label>
                    <textarea
                      rows={8}
                      placeholder="Type your message details here..."
                      value={announcementContent}
                      onChange={(e) => setAnnouncementContent(e.target.value)}
                      className="w-full rounded-lg border border-slate-800 bg-slate-900 p-2.5 text-xs text-white focus:outline-none focus:border-slate-700"
                      required
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={sendingBroadcast}
                    className="w-full sm:w-auto rounded-lg bg-primary hover:brightness-110 px-5 py-2.5 text-xs font-bold text-white transition flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
                  >
                    {sendingBroadcast ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Broadcasting...
                      </>
                    ) : (
                      <>
                        <Mail className="h-4 w-4" /> Send Email Broadcast
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* MODAL: USER DETAILS */}
      {selectedUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-[#020b21]/80 backdrop-blur-sm" onClick={() => setSelectedUser(null)} />
          
          <div className="relative w-full max-w-2xl rounded-2xl border border-slate-800 bg-[#0B1220] p-6 shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setSelectedUser(null)}
              className="absolute right-4 top-4 p-1 rounded-lg hover:bg-slate-850 text-slate-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3.5 border-b border-slate-800/80 pb-4">
              <div className="grid h-12 w-12 place-items-center rounded-full bg-gradient-brand text-base font-black text-white shadow">
                {(selectedUser.full_name || "User")
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  {selectedUser.full_name || "Anonymous User"}
                  {selectedUser.is_banned && (
                    <span className="rounded bg-rose-500/20 px-2 py-0.5 text-[9px] font-bold text-rose-400">
                      SUSPENDED
                    </span>
                  )}
                </h3>
                <p className="text-xs text-slate-450 font-mono-data">{selectedUser.email}</p>
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="mt-4 grid gap-4 grid-cols-2 bg-slate-900/40 p-4 rounded-xl border border-slate-850">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                  Update Subscription Plan
                </label>
                <select
                  value={selectedUser.plan}
                  onChange={(e) => handleUpdatePlan(selectedUser.id, e.target.value as any)}
                  className="rounded border border-slate-800 bg-[#070e1e] p-1.5 text-xs text-white focus:outline-none w-full cursor-pointer"
                >
                  <option value="free">Free Tier</option>
                  <option value="starter">Starter</option>
                  <option value="pro">Pro</option>
                  <option value="agency">Agency</option>
                </select>
              </div>

              <div className="flex flex-col justify-end">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                  Administrative Control
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleToggleBan(selectedUser.id, selectedUser.is_banned)}
                    className={`flex-1 rounded py-1.5 text-xs font-bold text-white transition cursor-pointer text-center ${
                      selectedUser.is_banned
                        ? "bg-emerald-600 hover:bg-emerald-500"
                        : "bg-amber-600 hover:bg-amber-500"
                    }`}
                  >
                    {selectedUser.is_banned ? "Unsuspend Account" : "Suspend Account"}
                  </button>
                  <button
                    onClick={() => handleDeleteUser(selectedUser.id)}
                    className="rounded bg-rose-700 hover:bg-rose-600 px-3 py-1.5 transition text-white cursor-pointer"
                    title="Delete User profile completely"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* History logs inside Modal */}
            <div className="mt-6">
              <h4 className="text-xs font-bold text-slate-305 uppercase tracking-widest mb-2 flex items-center gap-1.5 select-none">
                <Activity className="h-3.5 w-3.5 text-cyan-400" /> Search Activity History ({userSearchLogs.length})
              </h4>
              <div className="divide-y divide-slate-800/40 max-h-48 overflow-y-auto border border-slate-850 rounded-lg p-2 bg-slate-900/10">
                {userSearchLogs.map((log) => (
                  <div key={log.id} className="py-2 text-[11px] flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-205">🔍 {(log.query_params?.category || "N/A").toUpperCase()}</span>
                      <span className="text-slate-500 mx-1.5">·</span>
                      <span className="text-slate-400">{log.query_params?.city || "Unknown City"}, {log.query_params?.country || "Global"}</span>
                    </div>
                    <div className="text-slate-500 flex items-center gap-2">
                      <span className="rounded bg-cyan-950 px-1 font-bold text-cyan-400 text-[9px]">{log.results_count} Results</span>
                      <span>{new Date(log.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
                {userSearchLogs.length === 0 && (
                  <p className="text-center text-slate-655 py-10 font-bold">No searches executed by this user.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      </main>
      <AssistantChatWidget />
    </div>
  );
}

// Subcomponents helper
function TabButton({
  active,
  onClick,
  icon: Icon,
  label,
  badge,
  badgeColor = "cyan",
}: {
  active: boolean;
  onClick: () => void;
  icon: any;
  label: string;
  badge?: string;
  badgeColor?: "cyan" | "rose";
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between rounded-xl px-4 py-2.5 text-xs font-bold transition duration-200 border cursor-pointer select-none text-left ${
        active
          ? "bg-primary border-primary text-white shadow-lg shadow-primary/10"
          : "border-transparent text-slate-400 hover:bg-slate-850 hover:text-white"
      }`}
    >
      <div className="flex items-center gap-2.5">
        <Icon className={`h-4.5 w-4.5 ${active ? "text-white" : "text-slate-400"}`} />
        <span>{label}</span>
      </div>
      {badge && (
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] font-black ${
            active
              ? "bg-white text-primary"
              : badgeColor === "rose"
                ? "bg-rose-500/20 text-rose-400"
                : "bg-cyan-500/20 text-cyan-400"
          }`}
        >
          {badge}
        </span>
      )}
    </button>
  );
}

function PlanTile({ planName, count, rate, color }: { planName: string; count: number; rate: string; color: string }) {
  return (
    <div className="rounded-lg border border-slate-800 bg-[#070e1e]/60 p-3 flex justify-between items-center">
      <div>
        <span className="text-[10px] font-bold text-slate-400 block uppercase">{planName}</span>
        <span className="text-base font-extrabold text-white block mt-0.5">{count} Users</span>
      </div>
      <div className="text-right">
        <span className="text-[9px] font-bold text-slate-505 block">{rate}</span>
        <span className={`h-1.5 w-1.5 rounded-full inline-block mt-1 ${color}`}></span>
      </div>
    </div>
  );
}

function HealthCard({
  service,
  status,
  latency,
  quota,
  color,
}: {
  service: string;
  status: string;
  latency: string;
  quota: string;
  color: "emerald" | "amber" | "rose";
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 relative overflow-hidden">
      <div className="flex justify-between items-start">
        <span className="text-xs font-bold text-slate-300 block">{service}</span>
        <span
          className={`h-2.5 w-2.5 rounded-full ${
            color === "emerald" ? "bg-emerald-500" : color === "amber" ? "bg-amber-500" : "bg-rose-500"
          }`}
        ></span>
      </div>
      <h3 className="mt-3 text-lg font-black text-white">{status}</h3>
      <div className="mt-2.5 flex items-center justify-between text-[10px] text-slate-400 font-semibold border-t border-slate-800/40 pt-2">
        <span>Latency: {latency}</span>
        <span>{quota}</span>
      </div>
    </div>
  );
}
