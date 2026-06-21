import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
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
  Shield,
  ArrowLeft,
  Home,
  Heart,
  Briefcase,
  Utensils,
  Activity,
  Car,
  Laptop,
  LayoutGrid,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { CATEGORIES, COUNTRIES, MOCK_LEADS, type Lead } from "@/data/mockData";
import { COUNTRY_CITIES } from "@/data/countriesData";
import { usePipeline } from "@/contexts/PipelineContext";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { usePreferences } from "@/contexts/PreferencesContext";
import { OutreachPreview } from "@/components/ui/OutreachPreview";
import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { getCountry } from "@/data/dynamicRouteData";
import { LeadsOverTimeChart, PipelineFunnelChart } from "@/components/dashboard/AnalyticsCharts";
import { LiveEventsTicker } from "@/components/dashboard/LiveEventsTicker";
import { GoalTracker } from "@/components/dashboard/GoalTracker";
import { GlobalHeatmap } from "@/components/dashboard/GlobalHeatmap";
import { QuickConnectModal } from "@/components/dashboard/QuickConnectModal";
import { TrendingSearches } from "@/components/ui/TrendingSearches";

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

interface OutreachLog {
  date: string;
  channel: "email" | "linkedin" | "whatsapp";
  subject?: string;
  message: string;
}

const parseOutreachLogs = (notes: string): OutreachLog[] => {
  if (!notes) return [];
  const match = notes.match(/<!--OUTREACH_LOGS_START-->([\s\S]*?)<!--OUTREACH_LOGS_END-->/);
  if (match) {
    try {
      return JSON.parse(match[1]).history;
    } catch {
      return [];
    }
  }
  return [];
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

function DealValueInput({ lead }: { lead: Lead }) {
  const { updateStatus } = usePipeline();
  const [val, setVal] = useState(lead.dealValue?.toString() || "");

  useEffect(() => {
    setVal(lead.dealValue?.toString() || "");
  }, [lead.dealValue]);

  const handleBlur = async () => {
    const num = val === "" ? null : Number(val);
    if (num !== lead.dealValue) {
      try {
        await updateStatus(lead.id, lead.status || "won", lead.notes, lead.followUpDate, num);
        toast.success(`Updated deal value for ${lead.businessName}`);
      } catch (err) {
        console.error(err);
        toast.error("Failed to update deal value");
      }
    }
  };

  return (
    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
      <span className="text-[10px] text-muted-foreground">$</span>
      <input
        type="number"
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onBlur={handleBlur}
        placeholder="0"
        className="w-16 bg-slate-900 border border-slate-700 rounded px-1.5 py-0.5 text-[10px] text-foreground focus:outline-none focus:border-primary font-semibold"
      />
    </div>
  );
}

const PARENT_CATEGORIES = [
  { id: "all", label: "All Industries" },
  { id: "home_services", label: "Home Services" },
  { id: "health_wellness", label: "Health & Wellness" },
  { id: "professional_services", label: "Professional Services" },
  { id: "food_hospitality", label: "Food & Hospitality" },
  { id: "fitness_sports", label: "Fitness & Sports" },
  { id: "automotive_energy", label: "Automotive & Energy" },
  { id: "ecommerce_tech", label: "Ecommerce & Tech" },
];

const MICRO_NICHES = [
  // Home Services
  { name: "Landscaping", category: "home_services" },
  { name: "Roofing", category: "home_services" },
  { name: "HVAC", category: "home_services" },
  { name: "Carpentry", category: "home_services" },
  { name: "Snow removal", category: "home_services" },
  { name: "Pool services", category: "home_services" },
  { name: "Plumbers", category: "home_services" },
  { name: "Electricians", category: "home_services" },
  { name: "Pest Control", category: "home_services" },
  { name: "Handyman Services", category: "home_services" },
  { name: "Moving Companies", category: "home_services" },
  { name: "Water & Fire Restoration", category: "home_services" },
  // Health & Wellness
  { name: "Med spa", category: "health_wellness" },
  { name: "Dentistry", category: "health_wellness" },
  { name: "Massage therapist", category: "health_wellness" },
  { name: "Barber shops", category: "health_wellness" },
  { name: "Nail salons", category: "health_wellness" },
  // Professional Services
  { name: "Real estate", category: "professional_services" },
  { name: "Vet services", category: "professional_services" },
  { name: "Law", category: "professional_services" },
  { name: "Accountants / CPAs", category: "professional_services" },
  { name: "Bookkeepers", category: "professional_services" },
  { name: "Insurance Agencies", category: "professional_services" },
  { name: "Marketing Agencies", category: "professional_services" },
  // Food & Hospitality
  { name: "Restaurants", category: "food_hospitality" },
  { name: "Coffee shops", category: "food_hospitality" },
  { name: "Bakeries", category: "food_hospitality" },
  { name: "Catering Services", category: "food_hospitality" },
  // Fitness & Sports
  { name: "Boxing gyms", category: "fitness_sports" },
  { name: "MMA gyms", category: "fitness_sports" },
  { name: "Coaching", category: "fitness_sports" },
  { name: "Physical Trainer", category: "fitness_sports" },
  // Automotive & Energy
  { name: "Car dealerships", category: "automotive_energy" },
  { name: "Mobile car detailer", category: "automotive_energy" },
  { name: "Solar companies", category: "automotive_energy" },
  // Ecommerce & Tech
  { name: "Ecommerce", category: "ecommerce_tech" },
];

function Dashboard() {
  const { user } = useAuth();
  const { pipeline, savedIds, saveLead, removeLead, updateStatus } = usePipeline();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [scansCount, setScansCount] = useState(0);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [totalLeadsCount, setTotalLeadsCount] = useState(0);
  const [savedThisMonth, setSavedThisMonth] = useState(0);
  const [contactedCountFromDb, setContactedCountFromDb] = useState(0);

  const [quickCity, setQuickCity] = useState("");
  const [quickCategory, setQuickCategory] = useState("web_dev");
  const [quickCountry, setQuickCountry] = useState("United States");
  const [selectedNiche, setSelectedNiche] = useState("");
  const [activeParentCategory, setActiveParentCategory] = useState("all");
  const [results, setResults] = useState<Lead[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  const [activeStatScreen, setActiveStatScreen] = useState<
    "searches" | "saved" | "contacted" | "win_rate" | null
  >(null);
  const [searchHistory, setSearchHistory] = useState<any[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCity = sessionStorage.getItem("lc_shared_city");
      const savedCategory = sessionStorage.getItem("lc_shared_category");
      const savedCountry = sessionStorage.getItem("lc_shared_country");
      const savedNiche = sessionStorage.getItem("lc_shared_niche");
      const savedResults = sessionStorage.getItem("lc_shared_results");

      if (savedCity) setQuickCity(savedCity);
      if (savedCategory) setQuickCategory(savedCategory);
      if (savedCountry) setQuickCountry(savedCountry);
      if (savedNiche) setSelectedNiche(savedNiche);
      if (savedResults) {
        try {
          setResults(JSON.parse(savedResults));
        } catch {
          // ignore
        }
      }

      // Handle successful donation redirect from Stripe/Paystack
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get("donation") === "success") {
        toast.success(
          "Thank you for your generous donation! 🎉 Your support keeps LanceConnect free and unlimited for everyone.",
        );
        window.history.replaceState({}, document.title, window.location.pathname);
      }

      setIsMounted(true);
    }
  }, []);

  useEffect(() => {
    if (isMounted && typeof window !== "undefined") {
      sessionStorage.setItem("lc_shared_city", quickCity);
      sessionStorage.setItem("lc_shared_category", quickCategory);
      sessionStorage.setItem("lc_shared_country", quickCountry);
      sessionStorage.setItem("lc_shared_niche", selectedNiche);
    }
  }, [quickCity, quickCategory, quickCountry, selectedNiche, isMounted]);

  useEffect(() => {
    if (isMounted && typeof window !== "undefined") {
      sessionStorage.setItem("lc_shared_results", JSON.stringify(results));
      if (results.length > 0) {
        sessionStorage.setItem("lc_shared_has_session", "true");
      } else {
        sessionStorage.removeItem("lc_shared_has_session");
      }
    }
  }, [results, isMounted]);

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

  // Safety & Report states
  const { safetyPopupDismissed, setSafetyPopupDismissed } = usePreferences();
  const [safetyReminderOpen, setSafetyReminderOpen] = useState(false);
  const [leadReportModalOpen, setLeadReportModalOpen] = useState(false);
  const [leadReportReason, setLeadReportReason] = useState<string>("fake_business");
  const [leadReportDescription, setLeadReportDescription] = useState("");
  const [submittingLeadReport, setSubmittingLeadReport] = useState(false);

  const maskPhone = (phone: string) => {
    if (!phone) return "";
    const clean = phone.trim();
    if (clean.length <= 6) return "••••••••";
    return clean.slice(0, 6) + " ••• ••••";
  };

  const maskEmail = (email: string) => {
    if (!email) return "";
    const parts = email.split("@");
    if (parts.length < 2) return "••••@••••";
    const name = parts[0];
    const domain = parts[1];
    return name.slice(0, Math.min(3, name.length)) + "•••@" + domain;
  };

  const handleContactAction = (action: () => void) => {
    if (!safetyPopupDismissed) {
      setSafetyReminderOpen(true);
    } else {
      action();
    }
  };

  const handleSubmitLeadReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("You must be logged in to report a lead.");
      return;
    }
    setSubmittingLeadReport(true);
    try {
      const { error } = await supabase.from("reports").insert({
        reporter_id: user.id,
        reported_lead_id: detail?.id,
        reason: leadReportReason,
        description: leadReportDescription,
      });

      if (error) throw error;
      toast.success("Thank you. The report has been submitted for review.");
      setLeadReportModalOpen(false);
    } catch (err: any) {
      console.error("Error submitting lead report:", err);
      toast.error(err.message || "Failed to submit report. Please try again.");
    } finally {
      setSubmittingLeadReport(false);
    }
  };

  const [quickConnectOpen, setQuickConnectOpen] = useState(false);
  const [quickConnectLead, setQuickConnectLead] = useState<Lead | undefined>();
  const [quickConnectChannel, setQuickConnectChannel] = useState<"email" | "linkedin" | "whatsapp">(
    "email",
  );
  const [quickConnectMessage, setQuickConnectMessage] = useState("");
  const [leadsChartData, setLeadsChartData] = useState<{ name: string; leads: number }[]>([]);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  const totalSaved = pipeline.length;
  const contactedCount = pipeline.filter((l) => l.status === "contacted").length;
  const wonCount = pipeline.filter((l) => l.status === "won").length;
  const conversionRate = totalSaved > 0 ? Math.round((wonCount / totalSaved) * 100) : 0;
  const suggestedCities = COUNTRY_CITIES[quickCountry] || [];

  const formatDateTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const getCategoryLabel = (catId: string) => {
    return CATEGORIES.find((c) => c.id === catId)?.label || catId;
  };

  const savedThisMonthList = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const prefix = `${year}-${month}`; // "2026-06"
    return pipeline
      .filter((lead) => lead.savedAt && lead.savedAt.startsWith(prefix))
      .sort((a, b) => b.savedAt!.localeCompare(a.savedAt!));
  }, [pipeline]);

  const contactedLeadsSorted = useMemo(() => {
    return pipeline
      .filter((lead) => parseOutreachLogs(lead.notes || "").length > 0)
      .map((lead) => {
        const logs = parseOutreachLogs(lead.notes || "");
        const lastOutreachDate = logs.length > 0 ? new Date(logs[0].date).getTime() : 0;
        return { lead, lastOutreachDate, lastLog: logs[0] };
      })
      .sort((a, b) => b.lastOutreachDate - a.lastOutreachDate);
  }, [pipeline]);

  type TimelineItem = {
    date: Date;
    title: string;
    description?: string;
    type: "discovery" | "save" | "outreach" | "milestone";
  };

  const getLeadTimeline = (lead: Lead) => {
    const items: TimelineItem[] = [];

    if (lead.createdAt) {
      items.push({
        date: new Date(lead.createdAt),
        title: "Lead Discovered",
        description: `Discovered on LanceConnect via Google Maps in ${lead.city}.`,
        type: "discovery",
      });
    }

    if (lead.savedAt) {
      items.push({
        date: new Date(lead.savedAt),
        title: "Saved to Pipeline",
        description: "Saved to your prospects list for tracking.",
        type: "save",
      });
    }

    const logs = parseOutreachLogs(lead.notes || "");
    logs.forEach((log) => {
      items.push({
        date: new Date(log.date),
        title: `Outreach Sent (${log.channel === "email" ? "Email" : log.channel === "whatsapp" ? "WhatsApp" : "LinkedIn"})`,
        description: log.subject ? `Subject: ${log.subject}` : undefined,
        type: "outreach",
      });
    });

    if (lead.status === "won") {
      items.push({
        date: new Date(),
        title: "Lead Converted! 🎉",
        description: lead.dealValue ? `Won deal worth $${lead.dealValue}` : "Successfully won this client.",
        type: "milestone",
      });
    }

    return items.sort((a, b) => a.date.getTime() - b.date.getTime());
  };

  const funnelData = [
    { name: "New", value: pipeline.filter((l) => l.status === "new").length, color: "#7C3AED" },
    { name: "Contacted", value: contactedCount, color: "#F59E0B" },
    {
      name: "Interested",
      value: pipeline.filter((l) => l.status === "interested").length,
      color: "#3B82F6",
    },
    {
      name: "Proposal",
      value: pipeline.filter((l) => l.status === "proposal_sent").length,
      color: "#EC4899",
    },
    { name: "Won", value: wonCount, color: "#10B981" },
  ];

  const heatmapRegions = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const map = new Map<string, any>();

    // 1. Add user's home region if available
    if (user?.city && user?.country) {
      const key = `${user.city.toLowerCase()}-${user.country.toLowerCase()}`;
      map.set(key, {
        city: user.city,
        country: user.country,
        savedLeads: pipeline.filter((l) => l.city.toLowerCase() === user.city!.toLowerCase())
          .length,
        activeSearches: 3,
        topCategory: user.freelancerCategory || "web_dev",
        status: "active",
      });
    }

    // 2. Add pipeline regions
    pipeline.forEach((l) => {
      if (!l.city || !l.country) return;
      const key = `${l.city.toLowerCase()}-${l.country.toLowerCase()}`;

      const existing = map.get(key);
      const isContacted = ["contacted", "interested", "proposal_sent"].includes(l.status || "");
      const isWon = l.status === "won";

      if (existing) {
        existing.savedLeads += 1;
        if (isContacted && existing.status !== "won") {
          existing.status = "contacted";
        } else if (isWon) {
          existing.status = "saved";
        }
      } else {
        map.set(key, {
          city: l.city,
          country: l.country,
          savedLeads: 1,
          activeSearches: 1,
          topCategory: l.industry || "web_dev",
          status: isContacted ? "contacted" : "saved",
        });
      }
    });

    // 3. Add geographic test cases for mapping validation
    const testCases = [
      {
        city: "Los Angeles",
        country: "United States",
        lat: 34.0522,
        lng: -118.2437,
        savedLeads: 5,
        activeSearches: 2,
        topCategory: "designer",
        status: "saved",
      },
      {
        city: "Seattle",
        country: "United States",
        lat: 47.6062,
        lng: -122.3321,
        savedLeads: 0,
        activeSearches: 4,
        topCategory: "web_dev",
        status: "active",
      },
      {
        city: "New York",
        country: "United States",
        lat: 40.7128,
        lng: -74.006,
        savedLeads: 12,
        activeSearches: 1,
        topCategory: "copywriter",
        status: "contacted",
      },
      {
        city: "London",
        country: "United Kingdom",
        lat: 51.5074,
        lng: -0.1278,
        savedLeads: 8,
        activeSearches: 3,
        topCategory: "seo",
        status: "contacted",
      },
      {
        city: "Tokyo",
        country: "Japan",
        lat: 35.6762,
        lng: 139.6503,
        savedLeads: 3,
        activeSearches: 2,
        topCategory: "app_dev",
        status: "saved",
      },
      {
        city: "Sydney",
        country: "Australia",
        lat: -33.8688,
        lng: 151.2093,
        savedLeads: 2,
        activeSearches: 1,
        topCategory: "marketing",
        status: "active",
      },
    ];

    testCases.forEach((tc) => {
      const key = `${tc.city.toLowerCase()}-${tc.country.toLowerCase()}`;
      if (!map.has(key)) {
        map.set(key, tc);
      }
    });

    // Resolve lat/lng from a local coordinates dictionary if not already present
    const localCoords: Record<string, { lat: number; lon: number }> = {
      lagos: { lat: 6.5244, lon: 3.3792 },
      london: { lat: 51.5074, lon: -0.1278 },
      newyork: { lat: 40.7128, lon: -74.006 },
      losangeles: { lat: 34.0522, lon: -118.2437 },
      calgary: { lat: 51.0447, lon: -114.0719 },
      toronto: { lat: 43.6532, lon: -79.3832 },
      berlin: { lat: 52.52, lon: 13.405 },
      paris: { lat: 48.8566, lon: 2.3522 },
      sydney: { lat: -33.8688, lon: 151.2093 },
      tokyo: { lat: 35.6762, lon: 139.6503 },
      mumbai: { lat: 19.076, lon: 72.8777 },
      saopaulo: { lat: -23.5505, lon: -46.6333 },
      johannesburg: { lat: -26.2041, lon: 28.0473 },
      cairo: { lat: 30.0444, lon: 31.2357 },
      dubai: { lat: 25.2048, lon: 55.2708 },
      seattle: { lat: 47.6062, lon: -122.3321 },
      atlanta: { lat: 33.7490, lon: -84.3880 },
      dallas: { lat: 32.7767, lon: -96.7970 },
      boston: { lat: 42.3601, lon: -71.0589 },
      chicago: { lat: 41.8781, lon: -87.6298 },
      miami: { lat: 25.7617, lon: -80.1918 },
      houston: { lat: 29.7604, lon: -95.3698 },
      philadelphia: { lat: 39.9526, lon: -75.1652 },
      denver: { lat: 39.7392, lon: -104.9903 },
      phoenix: { lat: 33.4484, lon: -112.0740 },
      lasvegas: { lat: 36.1716, lon: -115.1398 },
      washington: { lat: 38.9072, lon: -77.0369 },
      austin: { lat: 30.2672, lon: -97.7431 },
      sanfrancisco: { lat: 37.7749, lon: -122.4194 },
    };

    const result = Array.from(map.values());
    result.forEach((r) => {
      if (!r.lat || !r.lng) {
        const k = r.city.toLowerCase().replace(/[^a-z]/g, "");
        if (localCoords[k]) {
          r.lat = localCoords[k].lat;
          r.lng = localCoords[k].lon;
        }
      }
    });

    return result;
  }, [user, pipeline]);

  const [activeFilter, setActiveFilter] = useState<"all" | "saved" | "contacted" | "won">("all");

  const displayedLeads = useMemo(() => {
    if (activeFilter === "saved") {
      return pipeline;
    }
    if (activeFilter === "contacted") {
      return pipeline.filter((l) => l.status === "contacted");
    }
    if (activeFilter === "won") {
      return pipeline.filter((l) => l.status === "won");
    }
    return results;
  }, [results, pipeline, activeFilter]);

  useEffect(() => {
    if (!isMounted || !user) return;

    // Check if redirecting from chatbot search run
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      const runSearchParam = searchParams.get("runSearch");
      if (runSearchParam === "true") {
        const category = searchParams.get("category") || "";
        const city = searchParams.get("city") || "";
        const country = searchParams.get("country") || "";
        const niche = searchParams.get("niche") || "";
        
        sessionStorage.setItem("lc_shared_category", category);
        sessionStorage.setItem("lc_shared_city", city);
        sessionStorage.setItem("lc_shared_country", country);
        sessionStorage.setItem("lc_shared_niche", niche);
        sessionStorage.setItem("lc_shared_has_session", "true");
        
        toast.info("Scanned lead parameters synced! Routing to discover...");
        
        setTimeout(() => {
          window.location.href = `/app/discover?autoSearch=true&category=${category}&city=${city}&country=${country}&niche=${niche}`;
        }, 1200);
        return;
      }
    }

    setLoading(true);

    // Prefill search parameters from user profile only if there is no session-saved search
    const hasSavedSession =
      typeof window !== "undefined" && sessionStorage.getItem("lc_shared_has_session") === "true";
    if (!hasSavedSession) {
      if (user.freelancerCategory) setQuickCategory(user.freelancerCategory);
      const userCountry = user.country;
      if (userCountry) {
        const countryObj = COUNTRIES.find(
          (c) =>
            c.code.toLowerCase() === userCountry.toLowerCase() ||
            c.name.toLowerCase() === userCountry.toLowerCase(),
        );
        if (countryObj) {
          setQuickCountry(countryObj.name);
        } else {
          setQuickCountry(userCountry);
        }
      }
      if (user.city) setQuickCity(user.city);
    }

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
      .select("id, query_params, results_count, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) {
          setSearchHistory(data as any);
          setScansCount(data.length);
        }
      });

    if (!hasSavedSession) {
      let leadsQuery = supabase.from("leads").select("*");
      if (user.freelancerCategory) {
        leadsQuery = leadsQuery.eq("industry", user.freelancerCategory);
      }
      leadsQuery
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
              score_breakdown: d.score_breakdown || null,
              createdAt: d.created_at,
              source: d.source || "google_maps",
              savedAt: null,
              status: null,
              phoneVerified: d.phone_verified || false,
              emailVerified: d.email_verified || false,
              websiteLive: d.website_live || false,
              isFlagged: d.is_flagged || false,
              suspiciousCount: d.suspicious_count || 0,
            }));
            setResults(mapped); // No automatic fallback emails for database leads for integrity
          }
        });
    }

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

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    supabase
      .from("leads")
      .select("created_at")
      .gte("created_at", sevenDaysAgo.toISOString())
      .then(({ data, error }) => {
        if (!error && data) {
          const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
          const last7Days = Array.from({ length: 7 }, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i));
            return {
              name: daysOfWeek[d.getDay()],
              dateStr: d.toDateString(),
              leads: 0,
            };
          });

          data.forEach((lead: any) => {
            const leadDate = new Date(lead.created_at).toDateString();
            const foundDay = last7Days.find((day) => day.dateStr === leadDate);
            if (foundDay) {
              foundDay.leads += 1;
            }
          });

          setLeadsChartData(last7Days.map((d) => ({ name: d.name, leads: d.leads })));
        }
      });
  }, [user, isMounted]);

  const handleEnrich = async () => {
    if (!detail || !detail.websiteUrl || enriching) return;
    setEnriching(true);
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
        console.log("No public email address found on the website.");
      }
    } catch (err: any) {
      console.error("Auto-enrich failed:", err);
    } finally {
      setEnriching(false);
    }
  };

  useEffect(() => {
    if (detail && detail.websiteUrl && !detail.email && !enriching) {
      handleEnrich();
    }
  }, [detail?.id]);

  const handleSearch = async (
    e?:
      | React.FormEvent
      | { category: string; country: string; city: string; product: string; niche: string },
  ) => {
    const isEvent = e && typeof (e as any).preventDefault === "function";
    if (isEvent) {
      (e as React.FormEvent).preventDefault();
    }

    let searchCategory = quickCategory;
    let searchCity = quickCity;
    let searchCountry = quickCountry;
    let searchNiche = selectedNiche;

    if (e && !isEvent) {
      const params = e as { category: string; country: string; city: string; niche?: string };
      searchCategory = params.category;
      searchCity = params.city;
      searchCountry = params.country;
      if (params.niche !== undefined) {
        searchNiche = params.niche;
      }
    }

    if (!searchCity.trim()) {
      toast.error("Please enter a city name.");
      return;
    }

    // Resolve country dynamically from city if possible
    if (searchCity) {
      const resolved = getCountry(searchCity.toLowerCase().replace(/\s+/g, "-"));
      if (resolved) {
        searchCountry = resolved;
        setQuickCountry(resolved);
      }
    }
    setSearchLoading(true);
    if (!user) {
      setSearchLoading(false);
      return;
    }
    try {
      const { data, error } = await supabase.functions.invoke("search-leads", {
        body: {
          query: searchCategory,
          city: searchCity,
          country: searchCountry,
          niche: searchNiche || undefined,
          limit: 12,
        },
      });
      if (error) {
        let errMsg = error.message || "Failed to search leads";
        let errCode = "";

        try {
          if (error.context) {
            const errJson = await error.context.json();
            if (errJson && errJson.error) {
              errCode = errJson.error.code || "";
              errMsg = errJson.error.message || errMsg;
            }
          }
        } catch (e) {
          console.error("Failed to parse error context:", e);
        }

        if (errCode === "LIMIT_REACHED" || errCode === "QUOTA_EXHAUSTED" || error.status === 402) {
          toast.error(errMsg, {
            action: {
              label: "Upgrade Plan",
              onClick: () => {
                window.location.href = "/app/upgrade";
              },
            },
          });
          const limitError = new Error(errMsg);
          (limitError as any).isHandled = true;
          throw limitError;
        }

        if (errCode === "RATE_LIMIT_EXCEEDED" || error.status === 429) {
          toast.error(errMsg);
          const rateLimitError = new Error(errMsg);
          (rateLimitError as any).isHandled = true;
          throw rateLimitError;
        }

        throw new Error(errMsg);
      }
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
        score_breakdown: d.score_breakdown || null,
        createdAt: d.created_at,
        source: d.source || "google_maps",
        savedAt: null,
        status: null,
        phoneVerified: d.phone_verified || false,
        emailVerified: d.email_verified || false,
        websiteLive: d.website_live || false,
        isFlagged: d.is_flagged || false,
        suspiciousCount: d.suspicious_count || 0,
      }));
      setResults(mapped);
      setScansCount((p) => p + 1); // Respect data integrity by showing real found data
      supabase
        .from("search_history")
        .select("id, query_params, results_count, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .then(({ data }) => {
          if (data) setSearchHistory(data as any);
        });
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
      if (!err.isHandled) {
        toast.error("Search temporarily unavailable — please try again in a moment.");
      }
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

  const handleRemoveLead = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove ${name} from your pipeline?`)) {
      try {
        await removeLead(id);
        setDetail(null);
        toast.success(`Removed ${name} from pipeline.`);
      } catch (err) {
        console.error(err);
        toast.error("Failed to remove lead.");
      }
    }
  };

  const handleMarkAsWon = async (lead: Lead) => {
    try {
      await updateStatus(lead.id, "won", lead.notes, lead.followUpDate, lead.dealValue);
      setDetail({ ...lead, status: "won" }); // update local modal state
      toast.success(`${lead.businessName} marked as Won! 🎉`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status.");
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

  const handleReRunSearch = async (historyItem: any) => {
    const q = historyItem.query_params || {};
    setQuickCategory(q.category || "web_dev");
    setQuickCountry(q.country || "United States");
    setQuickCity(q.city || "");
    setActiveStatScreen(null);
    handleSearch({
      category: q.category || "web_dev",
      country: q.country || "United States",
      city: q.city || "",
      product: "",
      niche: "",
    });
  };

  const getOutreachStatus = (lead: Lead) => {
    if (lead.status === "won" || lead.status === "interested") {
      return { text: "Replied", style: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" };
    }
    if (lead.status === "proposal_sent") {
      return { text: "Opened", style: "bg-blue-500/10 border-blue-500/20 text-blue-400" };
    }
    return { text: "Sent", style: "bg-slate-500/10 border-slate-500/20 text-slate-400" };
  };

  const handleResendClick = (e: React.MouseEvent, lead: Lead, lastLog?: OutreachLog) => {
    e.stopPropagation();
    setQuickConnectLead(lead);
    setQuickConnectChannel(lastLog?.channel || "email");
    setQuickConnectMessage(lastLog?.message || "");
    setQuickConnectOpen(true);
  };

  const renderSearchesPanel = () => {
    if (searchHistory.length === 0) {
      return (
        <div className="text-center py-12 text-muted-foreground text-xs font-semibold">
          No searches performed yet.
        </div>
      );
    }
    return (
      <div className="space-y-4">
        {searchHistory.map((item) => {
          const q = item.query_params || {};
          const catLabel = getCategoryLabel(q.category);
          return (
            <div key={item.id} className="rounded-xl border border-border bg-slate-900/60 p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-xs font-bold text-foreground">
                    {catLabel} in {q.city}, {q.country}
                  </h4>
                  <p className="text-[10px] text-muted-foreground mt-1 font-semibold">
                    {formatDateTime(item.created_at)}
                  </p>
                </div>
                <span className="rounded-full bg-primary/10 border border-primary/20 text-primary px-2.5 py-0.5 text-[10px] font-bold">
                  {item.results_count || 0} leads
                </span>
              </div>
              <button
                onClick={() => handleReRunSearch(item)}
                className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-primary/10 border border-primary/20 hover:bg-primary/25 px-3 py-1.5 text-[11px] font-bold text-primary transition cursor-pointer"
              >
                <Search className="h-3 w-3" /> Re-run Search
              </button>
            </div>
          );
        })}
      </div>
    );
  };

  const renderSavedPanel = () => {
    if (savedThisMonthList.length === 0) {
      return (
        <div className="text-center py-12 text-muted-foreground text-xs font-semibold">
          No leads saved this month.
        </div>
      );
    }
    return (
      <div className="space-y-3">
        {savedThisMonthList.map((lead) => (
          <div
            key={lead.id}
            onClick={() => {
              setDetail(lead);
              setOutreachDraft("");
            }}
            className="rounded-xl border border-border bg-slate-900/60 p-4 hover:border-primary/50 transition cursor-pointer space-y-2.5"
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-xs font-bold text-foreground truncate max-w-[180px]">
                  {lead.businessName}
                </h4>
                <p className="text-[10px] text-muted-foreground mt-0.5 font-semibold">
                  {lead.businessType || "Local Business"}
                </p>
              </div>
              <ScoreBadge score={lead.opportunityScore} />
            </div>

            <p className="text-[10px] text-muted-foreground flex items-center gap-1 font-semibold">
              <MapPin className="h-3 w-3 shrink-0" /> {lead.city}, {lead.country}
            </p>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800/40 text-[10px] text-muted-foreground font-semibold">
              <span>Saved {lead.savedAt ? new Date(lead.savedAt).toLocaleDateString() : ""}</span>
              <div className="flex items-center gap-2">
                <Phone className={`h-3.5 w-3.5 ${lead.phone ? "text-emerald-400" : "text-slate-600"}`} />
                <Mail className={`h-3.5 w-3.5 ${lead.email ? "text-emerald-400" : "text-slate-600"}`} />
                <Globe className={`h-3.5 w-3.5 ${lead.websiteUrl ? "text-emerald-400" : "text-slate-600"}`} />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderContactedPanel = () => {
    if (contactedLeadsSorted.length === 0) {
      return (
        <div className="text-center py-12 text-muted-foreground text-xs font-semibold">
          No leads contacted yet.
        </div>
      );
    }
    return (
      <div className="space-y-3">
        {contactedLeadsSorted.map(({ lead, lastLog }) => {
          const statusInfo = getOutreachStatus(lead);
          return (
            <div
              key={lead.id}
              onClick={() => {
                setDetail(lead);
                setOutreachDraft("");
              }}
              className="rounded-xl border border-border bg-slate-900/60 p-4 hover:border-primary/50 transition cursor-pointer space-y-3"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-xs font-bold text-foreground truncate max-w-[180px]">
                    {lead.businessName}
                  </h4>
                  <p className="text-[10px] text-muted-foreground mt-0.5 font-semibold">
                    {lead.businessType || "Local Business"}
                  </p>
                </div>
                <span className={`rounded-full border px-2 py-0.5 text-[9px] font-bold ${statusInfo.style}`}>
                  {statusInfo.text}
                </span>
              </div>

              <div className="flex items-center justify-between text-[10px] text-muted-foreground font-semibold">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3 shrink-0" /> {lead.city}, {lead.country}
                </span>
                <span>
                  {lastLog ? formatDateTime(lastLog.date) : ""}
                </span>
              </div>

              <button
                onClick={(e) => handleResendClick(e, lead, lastLog)}
                className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-primary/10 border border-primary/20 hover:bg-primary/25 px-3 py-1.5 text-[11px] font-bold text-primary transition cursor-pointer"
              >
                <Mail className="h-3 w-3" /> Resend Outreach
              </button>
            </div>
          );
        })}
      </div>
    );
  };

  const renderWinRatePanel = () => {
    const wonLeads = pipeline.filter((l) => l.status === "won");
    const notConvertedLeads = pipeline.filter((l) => l.status !== "won");

    return (
      <div className="space-y-6 text-left">
        {/* Summary Card */}
        <div className="rounded-xl border border-border bg-slate-900/40 p-4 space-y-3">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Contacted</span>
              <p className="text-lg font-extrabold text-foreground mt-0.5">{contactedLeadsSorted.length}</p>
            </div>
            <div className="border-x border-border/40">
              <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Wins</span>
              <p className="text-lg font-extrabold text-emerald-400 mt-0.5">{wonCount}</p>
            </div>
            <div>
              <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Win Rate</span>
              <p className="text-lg font-extrabold text-cyan-400 mt-0.5">{conversionRate}%</p>
            </div>
          </div>
          {/* Progress Bar */}
          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full" style={{ width: `${conversionRate}%` }} />
          </div>
        </div>

        {/* Won Leads Section */}
        <div className="space-y-2.5">
          <h4 className="text-[10px] font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1">
            🏆 Converted Clients ({wonLeads.length})
          </h4>
          {wonLeads.length === 0 ? (
            <p className="text-[10px] text-muted-foreground italic py-2">No converted clients yet.</p>
          ) : (
            <div className="space-y-2.5">
              {wonLeads.map((lead) => (
                <div
                  key={lead.id}
                  onClick={() => {
                    setDetail(lead);
                    setOutreachDraft("");
                  }}
                  className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 hover:border-emerald-500/40 transition cursor-pointer space-y-2.5"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-xs font-bold text-foreground truncate max-w-[180px]">{lead.businessName}</h4>
                      <p className="text-[10px] text-muted-foreground mt-0.5 font-semibold">
                        {lead.businessType || "Local Business"}
                      </p>
                    </div>
                    <DealValueInput lead={lead} />
                  </div>
                  <div className="text-[10px] text-muted-foreground flex justify-between font-semibold">
                    <span>Won {lead.claimUpdatedAt ? new Date(lead.claimUpdatedAt).toLocaleDateString() : (lead.savedAt ? new Date(lead.savedAt).toLocaleDateString() : "Recently")}</span>
                    <span className="text-emerald-400 font-bold">{lead.dealValue ? `$${lead.dealValue}` : "Log value"}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Not Yet Converted Section */}
        <div className="space-y-2.5">
          <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-400">
            ⏳ Not Yet Converted ({notConvertedLeads.length})
          </h4>
          {notConvertedLeads.length === 0 ? (
            <p className="text-[10px] text-muted-foreground italic py-2">All leads converted!</p>
          ) : (
            <div className="space-y-2.5">
              {notConvertedLeads.map((lead) => {
                const logs = parseOutreachLogs(lead.notes || "");
                const lastLog = logs.length > 0 ? logs[0] : undefined;
                return (
                  <div
                    key={lead.id}
                    onClick={() => {
                      setDetail(lead);
                      setOutreachDraft("");
                    }}
                    className="rounded-xl border border-border bg-slate-900/60 p-4 hover:border-primary/50 transition cursor-pointer space-y-3"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-xs font-bold text-foreground truncate max-w-[180px]">{lead.businessName}</h4>
                        <p className="text-[10px] text-muted-foreground mt-0.5 font-semibold">
                          {lead.businessType || "Local Business"}
                        </p>
                      </div>
                      <ScoreBadge score={lead.opportunityScore} />
                    </div>
                    <button
                      onClick={(e) => handleResendClick(e, lead, lastLog)}
                      className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-primary/10 border border-primary/20 hover:bg-primary/25 px-3 py-1.5 text-[11px] font-bold text-primary transition cursor-pointer"
                    >
                      <Mail className="h-3 w-3" /> Resend Outreach
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <Header title="Dashboard" />

      <div className="px-4 py-6 lg:px-8 space-y-8">
        {/* ═══ HERO SEARCH ═══ */}
        <section className="relative overflow-hidden rounded-2xl border border-border bg-card p-5 sm:p-8 md:p-10">
          {/* decorative dots */}
          <div className="absolute inset-0 bg-dot-pattern pointer-events-none opacity-40" />

          <form onSubmit={handleSearch} className="relative z-10">
            <div className="grid gap-3 sm:grid-cols-4">
              <div>
                <label className="mb-1.5 block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  My Category / Service
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
                  onChange={(e) => {
                    setQuickCountry(e.target.value);
                    setQuickCity("");
                  }}
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
                  id="dashboard-city-input"
                  autoComplete="off"
                  list="dashboard-cities-list"
                  placeholder="e.g. Lagos, London..."
                  value={quickCity}
                  onChange={(e) => setQuickCity(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition"
                />
                <datalist id="dashboard-cities-list">
                  {suggestedCities.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
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
                  {searchLoading ? "Scanning..." : "Search Leads"}
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

          <div className="relative z-10 max-w-2xl mt-6 pt-6 border-t border-border/40">
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


          {/* B2B Freelance Niche Filters */}
          <div className="relative z-10 mt-6 pt-6 border-t border-border/40 select-none">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <div>
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <span>Target B2B Freelance Niches</span>
                  <span className="text-xs font-normal text-muted-foreground">(Direct business outreach, not job listings)</span>
                </h3>
              </div>
              {selectedNiche && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedNiche("");
                    toast.success("Cleared niche filter");
                  }}
                  className="text-xs font-medium text-amber-500 hover:text-amber-600 transition flex items-center gap-1 cursor-pointer bg-transparent border-none outline-none self-start"
                >
                  <X className="h-3.5 w-3.5" /> Clear niche filter: <strong className="underline">{selectedNiche}</strong>
                </button>
              )}
            </div>

            {/* Parent Category Pills */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {PARENT_CATEGORIES.map((pc) => {
                const isActive = activeParentCategory === pc.id;
                return (
                  <button
                    key={pc.id}
                    type="button"
                    onClick={() => setActiveParentCategory(pc.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer flex items-center gap-1.5
                      ${isActive
                        ? "bg-primary border-primary text-white shadow-md shadow-primary/10"
                        : "bg-muted/40 border-border/80 hover:bg-muted text-muted-foreground hover:text-foreground"
                      }`}
                  >
                    {pc.id === "all" && <LayoutGrid className="h-3.5 w-3.5" />}
                    {pc.id === "home_services" && <Home className="h-3.5 w-3.5" />}
                    {pc.id === "health_wellness" && <Heart className="h-3.5 w-3.5" />}
                    {pc.id === "professional_services" && <Briefcase className="h-3.5 w-3.5" />}
                    {pc.id === "food_hospitality" && <Utensils className="h-3.5 w-3.5" />}
                    {pc.id === "fitness_sports" && <Activity className="h-3.5 w-3.5" />}
                    {pc.id === "automotive_energy" && <Car className="h-3.5 w-3.5" />}
                    {pc.id === "ecommerce_tech" && <Laptop className="h-3.5 w-3.5" />}
                    <span>{pc.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Micro Niches Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 max-h-40 overflow-y-auto pr-1">
              {MICRO_NICHES.filter(
                (n) => activeParentCategory === "all" || n.category === activeParentCategory,
              ).map((n) => {
                const isSelected = selectedNiche === n.name;
                return (
                  <button
                    key={n.name}
                    type="button"
                    onClick={() => {
                      const newNiche = isSelected ? "" : n.name;
                      setSelectedNiche(newNiche);
                      if (newNiche) {
                        toast.success(`Niche filter set to: ${newNiche}`);
                      } else {
                        toast.success("Cleared niche filter");
                      }
                    }}
                    className={`px-3 py-2 rounded-xl text-xs font-medium border text-left truncate transition cursor-pointer
                      ${isSelected
                        ? "bg-amber-500/10 border-amber-500/80 text-amber-500 font-bold dark:bg-amber-500/15"
                        : "bg-background border-border/80 hover:bg-muted text-foreground/80 hover:text-foreground"
                      }`}
                    title={n.name}
                  >
                    {n.name}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* ═══ TRENDING SEARCHES ═══ */}
        <TrendingSearches
          onSelectSearch={(search) => {
            setQuickCategory(search.category);
            setQuickCountry(search.country);
            setQuickCity(search.city);
            handleSearch(search);
          }}
          className="my-6"
        />

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
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto justify-center sm:justify-start">
            <Link
              to="/freelancers"
              className="w-full sm:w-auto text-center shrink-0 rounded-lg border border-primary/30 bg-primary/10 px-3.5 py-1.5 text-[11px] font-bold text-primary hover:bg-primary/20 transition"
            >
              Browse Public Directory
            </Link>
            <Link
              to="/find-clients"
              className="w-full sm:w-auto text-center shrink-0 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1.5 text-[11px] font-bold text-cyan-400 hover:bg-cyan-500/20 transition flex items-center justify-center gap-1"
            >
              <Globe className="h-3.5 w-3.5 shrink-0" /> Global SEO Directory
            </Link>
          </div>
        </div>

        {/* ═══ STATS ROW ═══ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              id: "searches",
              label: "Searches Performed",
              value: scansCount,
              icon: Search,
              bg: "bg-primary",
              fg: "text-white",
            },
            {
              id: "saved",
              label: "Saved This Month",
              value: savedThisMonthList.length,
              icon: Users,
              bg: "bg-success",
              fg: "text-white",
            },
            {
              id: "contacted",
              label: "Leads Contacted",
              value: contactedLeadsSorted.length,
              icon: MessageSquare,
              bg: "bg-warn",
              fg: "text-white",
            },
            {
              id: "win_rate",
              label: "Win Rate",
              value: `${conversionRate}%`,
              icon: Target,
              bg: "bg-hot",
              fg: "text-white",
            },
          ].map((s) => (
            <div
              key={s.label}
              onClick={() => setActiveStatScreen(s.id as any)}
              className="rounded-2xl border bg-card p-5 border-border hover:border-primary/50 transition group cursor-pointer"
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

        {/* ═══ QUICK DIRECTORIES ═══ */}
        <section className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Globe className="h-4 w-4 text-primary" /> Quick Directories
              </h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Browse leads by skill or city
              </p>
            </div>
            <Link
              to="/find-clients"
              className="text-[11px] font-semibold text-primary hover:underline flex items-center gap-1"
            >
              View All <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                By Skill
              </p>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: "Web Developers", to: "/find-clients/web-developer" },
                  { label: "Graphic Designers", to: "/find-clients/graphic-designer" },
                  { label: "Copywriters", to: "/find-clients/copywriter" },
                  { label: "SEO Specialists", to: "/find-clients/seo-specialists" },
                  { label: "Social Media", to: "/find-clients/social-media" },
                ].map((d) => (
                  <Link
                    key={d.label}
                    to={d.to as any}
                    className="rounded-full border border-border bg-background px-2.5 py-1 text-[11px] font-medium text-foreground hover:border-primary hover:text-primary transition"
                  >
                    {d.label}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                By City
              </p>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: "Lagos", to: "/find-clients/lagos" },
                  { label: "London", to: "/find-clients/london" },
                  { label: "Dubai", to: "/find-clients/dubai" },
                  { label: "United States", to: "/find-clients/united-states" },
                  { label: "All Locations", to: "/find-clients" },
                ].map((d) => (
                  <Link
                    key={d.label}
                    to={d.to as any}
                    className="rounded-full border border-border bg-background px-2.5 py-1 text-[11px] font-medium text-foreground hover:border-primary hover:text-primary transition"
                  >
                    {d.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══ ANALYTICS ROW ═══ */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-5 overflow-hidden">
            <h3 className="text-sm font-bold text-foreground mb-4">Leads Discovered</h3>
            <LeadsOverTimeChart data={leadsChartData} />
          </div>
          <div className="rounded-2xl border border-border bg-card p-5 flex flex-col overflow-hidden">
            <h3 className="text-sm font-bold text-foreground mb-4">Conversion Pipeline</h3>
            <PipelineFunnelChart data={funnelData} className="flex-1" />
          </div>
        </div>

        {/* ═══ HEATMAP ROW ═══ */}
        <GlobalHeatmap
          regions={heatmapRegions}
          className="h-[400px]"
          onViewLeads={(city, country, category) => {
            setQuickCity(city);
            const countryObj = COUNTRIES.find(
              (c) =>
                c.name.toLowerCase() === country.toLowerCase() ||
                c.code.toLowerCase() === country.toLowerCase(),
            );
            if (countryObj) {
              setQuickCountry(countryObj.name);
            } else {
              setQuickCountry(country);
            }
            setQuickCategory(category);
            handleSearch({ category, country, city, product: "", niche: "" });

            // Scroll to discovered-businesses-list or results container
            setTimeout(() => {
              const resultsEl = document.querySelector(".lg\\:col-span-2");
              if (resultsEl) {
                resultsEl.scrollIntoView({ behavior: "smooth", block: "start" });
              }
            }, 100);
          }}
        />

        {/* ═══ MAIN CONTENT: RESULTS + SIDEBAR ═══ */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* ── Results area (2 cols) ── */}
          <div className="lg:col-span-2 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <span>
                    {activeFilter === "all"
                      ? "Discovered Businesses"
                      : activeFilter === "saved"
                        ? "Saved Leads"
                        : activeFilter === "contacted"
                          ? "Contacted Leads"
                          : "Won Leads"}
                  </span>
                  {activeFilter !== "all" && (
                    <button
                      onClick={() => setActiveFilter("all")}
                      className="text-[10px] bg-primary/20 border border-primary/30 text-primary px-2.5 py-0.5 rounded-full font-mono hover:bg-primary hover:text-white transition cursor-pointer"
                    >
                      Clear Filter [x]
                    </button>
                  )}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {displayedLeads.length} leads found. Click any card to view details.
                </p>
              </div>
              {displayedLeads.length > 0 && activeFilter === "all" && (
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
            ) : displayedLeads.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center rounded-2xl border border-dashed border-border bg-card">
                <div className="grid h-16 w-16 place-items-center rounded-2xl bg-primary/8 mb-4">
                  <Search className="h-7 w-7 text-primary/60" />
                </div>
                <p className="text-base font-semibold text-foreground">
                  {activeFilter === "all"
                    ? "No results yet"
                    : activeFilter === "saved"
                      ? "No saved leads yet"
                      : activeFilter === "contacted"
                        ? "No contacted leads yet"
                        : "No won leads yet"}
                </p>
                <p className="text-sm text-muted-foreground mt-1 max-w-xs">
                  {activeFilter === "all"
                    ? "Search for any business type in any city above to discover clients."
                    : "Move leads into this stage in your pipeline/discover tool to view them here."}
                </p>
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {displayedLeads.map((lead) => {
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
                      <div
                        className="flex flex-col sm:flex-row gap-2"
                        onClick={(e) => e.stopPropagation()}
                      >
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

            {/* Donation Card */}
            <div className="rounded-2xl border border-rose-500/20 bg-card p-5 shadow-sm text-left relative overflow-hidden group hover:border-rose-500/30 transition">
              <div className="absolute top-0 right-0 -mt-3 -mr-3 h-10 w-10 bg-rose-500/10 rounded-full blur-lg pointer-events-none" />
              <h4 className="text-sm font-bold text-foreground mb-2 flex items-center gap-1.5">
                <span className="text-rose-500">☕</span> Keep us free — donate
              </h4>
              <p className="text-[11px] text-muted-foreground leading-normal mb-3">
                LanceConnect has no paywalls or monthly subscription plans. We rely entirely on
                voluntary donations from successful freelancers to keep running.
              </p>
              <Link
                to="/support-us"
                className="flex items-center justify-center gap-1.5 w-full rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 py-2.5 text-xs font-bold transition cursor-pointer"
              >
                ❤️ Support LanceConnect
              </Link>
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
              <LiveEventsTicker activities={activities} />
            </div>
          </div>
        </div>
      </div>

      {/* ═══ DETAIL MODAL ═══ */}
      {detail && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 dark:bg-black/85 backdrop-blur-sm"
          onClick={() => setDetail(null)}
        >
          <div
            className="relative w-full max-w-md rounded-2xl border border-border bg-card animate-in fade-in zoom-in-95 duration-200 text-foreground shadow-2xl flex flex-col max-h-[85vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between p-6 pb-4 border-b border-border/80">
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-extrabold text-foreground truncate">
                  {detail.businessName}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {detail.businessType || "Local Business"}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Quality Score:</span>
                  <ScoreBadge score={detail.opportunityScore} />
                </div>
              </div>
              <button
                onClick={() => setDetail(null)}
                className="grid h-8 w-8 place-items-center rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="p-6 space-y-6 overflow-y-auto flex-1">
              
              {/* Modern Grid of Interactive Contact Actions */}
              <div className="grid grid-cols-3 gap-3">
                {detail.phone ? (
                  <button
                    onClick={() => handleContactAction(() => window.open(`tel:${detail.phone}`, "_self"))}
                    className="flex flex-col items-center justify-center p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-400 transition cursor-pointer"
                  >
                    <Phone className="h-4 w-4 mb-1.5" />
                    <span className="text-[10px] font-bold">Call Client</span>
                    <span className="text-[8px] text-muted-foreground truncate max-w-full mt-1 font-mono">{detail.phone}</span>
                  </button>
                ) : (
                  <div className="flex flex-col items-center justify-center p-3 rounded-xl border border-border/60 bg-muted/10 dark:bg-slate-900/40 text-muted-foreground opacity-50 select-none">
                    <Phone className="h-4 w-4 mb-1.5" />
                    <span className="text-[10px] font-bold">No Phone</span>
                  </div>
                )}

                {detail.email ? (
                  <button
                    onClick={() => handleContactAction(() => window.open(`mailto:${detail.email}`, "_self"))}
                    className="flex flex-col items-center justify-center p-3 rounded-xl border border-primary/20 bg-primary/5 hover:bg-primary/10 text-primary transition cursor-pointer"
                  >
                    <Mail className="h-4 w-4 mb-1.5" />
                    <span className="text-[10px] font-bold">Email Client</span>
                    <span className="text-[8px] text-muted-foreground truncate max-w-full mt-1 font-mono">{maskEmail(detail.email)}</span>
                  </button>
                ) : detail.websiteUrl ? (
                  <button
                    onClick={handleEnrich}
                    disabled={enriching}
                    className="flex flex-col items-center justify-center p-3 rounded-xl border border-primary/20 bg-primary/5 hover:bg-primary/10 text-primary transition cursor-pointer"
                  >
                    {enriching ? (
                      <Loader2 className="h-4 w-4 animate-spin mb-1.5" />
                    ) : (
                      <Mail className="h-4 w-4 mb-1.5" />
                    )}
                    <span className="text-[10px] font-bold">{enriching ? "Finding..." : "Find Email"}</span>
                  </button>
                ) : (
                  <div className="flex flex-col items-center justify-center p-3 rounded-xl border border-border/60 bg-muted/10 dark:bg-slate-900/40 text-muted-foreground opacity-50 select-none">
                    <Mail className="h-4 w-4 mb-1.5" />
                    <span className="text-[10px] font-bold">No Email</span>
                  </div>
                )}

                {detail.websiteUrl ? (
                  <a
                    href={detail.websiteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex flex-col items-center justify-center p-3 rounded-xl border border-cyan-500/20 bg-cyan-500/5 hover:bg-cyan-500/10 text-cyan-400 transition text-center cursor-pointer"
                  >
                    <Globe className="h-4 w-4 mb-1.5" />
                    <span className="text-[10px] font-bold">Website</span>
                    <span className="text-[8px] text-muted-foreground truncate max-w-full mt-1 block">{detail.websiteUrl.replace(/https?:\/\/(www\.)?/, "")}</span>
                  </a>
                ) : (
                  <div className="flex flex-col items-center justify-center p-3 rounded-xl border border-border/60 bg-muted/10 dark:bg-slate-900/40 text-muted-foreground opacity-50 select-none">
                    <Globe className="h-4 w-4 mb-1.5" />
                    <span className="text-[10px] font-bold">No Site</span>
                  </div>
                )}
              </div>

              {/* Address details */}
              <div className="text-xs text-muted-foreground leading-relaxed flex items-start gap-2 bg-muted/30 dark:bg-slate-950/40 p-3 rounded-xl border border-border/50">
                <MapPin className="h-4 w-4 text-muted-foreground/80 shrink-0 mt-0.5" />
                <span>{detail.fullAddress || `${detail.city}, ${detail.country}`}</span>
              </div>

              {/* Opportunity signals */}
              {getScoreReasons(detail).length > 0 && (
                <div>
                  <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Opportunity Signals
                  </p>
                  <div className="space-y-1.5">
                    {getScoreReasons(detail).map((r) => (
                      <div
                        key={r.label}
                        className="flex items-center justify-between rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 text-xs text-emerald-700 dark:text-emerald-300"
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

              {/* GMB Opportunity Signals */}
              {detail.score_breakdown?.gmb_gaps?.length > 0 && (
                <div className="border-t border-border/80 pt-4">
                  <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <span>📍 Google My Business Gaps</span>
                    <span className="rounded-full bg-amber-500/15 px-1.5 py-0.5 text-[9px] font-bold text-amber-500 border border-amber-500/25">
                      {detail.score_breakdown.gmb_gaps.length} detected
                    </span>
                  </p>
                  <div className="space-y-2">
                    {detail.score_breakdown.gmb_gaps.map((gap: string, index: number) => {
                      let pitchTip =
                        "Highlight this gap as a quick-win optimization you can handle for them.";
                      if (gap.includes("photos")) {
                        pitchTip =
                          "Pitch a photographic styling session or stock collection package to increase GMB visibility.";
                      } else if (gap.includes("description")) {
                        pitchTip =
                          "Suggest writing an SEO-optimized business biography to rank higher in local search.";
                      } else if (gap.includes("reviews")) {
                        pitchTip =
                          "Offer a review generation campaign to boost local reputation and rankings.";
                      } else if (gap.includes("website")) {
                        pitchTip =
                          "No website linked means lost traffic. Pitch a landing page or professional site design.";
                      } else if (gap.includes("rating")) {
                        pitchTip =
                          "Low rating hurts trust. Pitch reputation management and automated feedback forms.";
                      }

                      return (
                        <div
                          key={index}
                          className="rounded-xl border border-amber-500/30 bg-amber-500/10 dark:bg-amber-500/15 p-3 text-xs"
                        >
                          <div className="flex items-center gap-1.5 font-bold text-amber-700 dark:text-amber-400 mb-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                            {gap}
                          </div>
                          <p className="text-muted-foreground leading-relaxed pl-3">
                            <span className="font-bold text-foreground">Pitch Tip: </span>
                            {pitchTip}
                          </p>
                        </div>
                      );
                    })}
                    <div className="pt-1 text-right">
                      <a
                        href="/resources/google-my-business"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-500 hover:text-amber-400 hover:underline"
                      >
                        GMB Optimization Guide & Script &rarr;
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* Chronological Activity Timeline */}
              {(() => {
                const timeline = getLeadTimeline(detail);
                return (
                  <div className="border-t border-border/80 pt-4">
                    <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                      Activity Timeline
                    </p>
                    <div className="relative border-l border-slate-800 pl-4 ml-2 space-y-4">
                      {timeline.map((item, index) => (
                        <div key={index} className="relative">
                          {/* Timeline node dot */}
                          <span className={`absolute -left-[21px] top-1.5 flex h-2.5 w-2.5 rounded-full border-2 border-card ${
                            item.type === "milestone" 
                              ? "bg-emerald-500 ring-2 ring-emerald-500/20" 
                              : item.type === "outreach"
                                ? "bg-primary"
                                : item.type === "save"
                                  ? "bg-success"
                                  : "bg-slate-500"
                          }`} />
                          <div>
                            <span className="text-[9px] text-muted-foreground font-mono block">
                              {formatDateTime(item.date.toISOString())}
                            </span>
                            <span className="text-xs font-bold text-foreground block mt-0.5">
                              {item.title}
                            </span>
                            {item.description && (
                              <span className="text-[10px] text-muted-foreground block mt-0.5 leading-relaxed">
                                {item.description}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* AI Generator */}
              <div className="border-t border-border/80 pt-4">
                <h4 className="text-sm font-bold text-foreground flex items-center gap-1.5 mb-3">
                  <Sparkles className="h-4 w-4 text-primary" /> AI Outreach
                </h4>
                {outreachDraft ? (
                  <div className="space-y-3">
                    <OutreachPreview
                      channel={selectedChannel === "whatsapp" ? "whatsapp" : selectedChannel === "linkedin" ? "linkedin" : selectedChannel === "phone_script" ? "phone_script" : selectedChannel === "letter" ? "letter" : "email"}
                      value={outreachDraft}
                      onChange={(val) => setOutreachDraft(val)}
                      senderName={user?.fullName || "Freelancer"}
                      businessName={detail.businessName}
                      businessEmail={detail.email || "info@business.com"}
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
                        {(selectedChannel === "whatsapp" ||
                          selectedChannel === "email" ||
                          selectedChannel === "linkedin") && (
                          <button
                            onClick={() => {
                              setQuickConnectLead(detail);
                              setQuickConnectChannel(selectedChannel);
                              setQuickConnectMessage(outreachDraft);
                              setQuickConnectOpen(true);
                              setDetail(null);
                            }}
                            className={`rounded-lg px-3 py-1.5 text-[11px] font-bold text-white cursor-pointer transition flex items-center gap-1 ${
                              selectedChannel === "whatsapp"
                                ? "bg-emerald-600 hover:bg-emerald-700"
                                : selectedChannel === "linkedin"
                                  ? "bg-[#0A66C2] hover:bg-[#084e96]"
                                  : "bg-primary hover:brightness-110"
                            }`}
                          >
                            Send via{" "}
                            {selectedChannel === "whatsapp"
                              ? "WhatsApp"
                              : selectedChannel === "linkedin"
                                ? "LinkedIn"
                                : "Email"}
                          </button>
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
                        className="rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                      >
                        <option value="email" className="bg-background text-foreground">Email</option>
                        <option value="linkedin" className="bg-background text-foreground">LinkedIn</option>
                        <option value="whatsapp" className="bg-background text-foreground">WhatsApp</option>
                        <option value="phone_script" className="bg-background text-foreground">Phone Script</option>
                      </select>
                      <select
                        value={selectedTone}
                        onChange={(e) => setSelectedTone(e.target.value as any)}
                        className="rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                      >
                        <option value="professional" className="bg-background text-foreground">Professional</option>
                        <option value="casual" className="bg-background text-foreground">Casual</option>
                        <option value="bold" className="bg-background text-foreground">Bold/Direct</option>
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

            {/* Footer Buttons */}
            <div className="p-6 border-t border-border bg-muted/10 dark:bg-[#070e1e]/20 flex flex-col gap-3">
              <div className="flex gap-2">
                {savedIds.has(detail.id) ? (
                  <>
                    {detail.status !== "won" ? (
                      <button
                        onClick={() => handleMarkAsWon(detail)}
                        className="flex-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white py-2 text-xs font-extrabold uppercase tracking-wider transition cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                      >
                        🏆 Mark as Won
                      </button>
                    ) : (
                      <span className="flex-1 text-center py-2 text-xs font-extrabold uppercase text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                        🏆 Converted Client
                      </span>
                    )}
                    <button
                      onClick={() => handleRemoveLead(detail.id, detail.businessName)}
                      className="flex-1 rounded-xl border border-rose-500/30 text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 py-2 text-xs font-bold transition cursor-pointer"
                    >
                      Remove Lead
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleSaveLead(detail)}
                    className="w-full rounded-xl bg-primary py-2 text-xs font-bold text-white hover:brightness-110 transition cursor-pointer"
                  >
                    Save to Pipeline
                  </button>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setQuickConnectLead(detail);
                    setQuickConnectChannel("email");
                    setQuickConnectMessage("");
                    setQuickConnectOpen(true);
                    setDetail(null);
                  }}
                  className="flex-1 rounded-xl border border-border bg-background hover:bg-accent py-2 text-xs font-semibold text-foreground transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Mail className="h-3.5 w-3.5" /> Quick Connect
                </button>
                <button
                  type="button"
                  onClick={() => setLeadReportModalOpen(true)}
                  className="rounded-xl border border-destructive/30 text-destructive bg-destructive/10 px-4 py-2 text-xs font-semibold hover:bg-destructive/20 cursor-pointer transition"
                >
                  Report ⚑
                </button>
              </div>
            </div>
          </div>

          {/* Safety Reminder Modal */}
          {safetyReminderOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/85">
              <div className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200 text-left">
                <div className="flex items-center gap-2 text-amber-500 mb-4">
                  <Shield className="h-6 w-6" />
                  <h3 className="text-lg font-bold text-foreground">
                    First-Contact Safety Guidelines
                  </h3>
                </div>
                <p className="text-xs text-muted-foreground mb-4">
                  Please review our safety checklists before reaching out to this contact:
                </p>
                <ul className="space-y-2.5 text-xs text-muted-foreground mb-6">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 mt-0.5">⚠️</span>
                    <span>
                      <strong>No Upfront Payments:</strong> Never pay fees to secure a job or
                      project. Authentic clients will not charge you.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 mt-0.5">🔍</span>
                    <span>
                      <strong>Verify Legitimacy:</strong> Check the business registry or official
                      website before agreeing to terms.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 mt-0.5">💳</span>
                    <span>
                      <strong>Secure Transactions:</strong> Use verified payment channels or
                      contract escrow systems to protect your earnings.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 mt-0.5">💬</span>
                    <span>
                      <strong>Watch for Scams:</strong> Be cautious if a client immediately
                      redirects you to private communication apps to bypass platform logs.
                    </span>
                  </li>
                </ul>
                <button
                  onClick={() => {
                    setSafetyPopupDismissed(true);
                    setSafetyReminderOpen(false);
                    toast.success("Contact revealed!");
                  }}
                  className="w-full rounded-xl bg-primary hover:bg-primary/95 text-white py-3 text-xs font-bold shadow-md transition text-center cursor-pointer"
                >
                  Reveal Contact Details
                </button>
              </div>
            </div>
          )}

          {/* Lead Report Modal */}
          {leadReportModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/85">
              <div className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200 text-left">
                <button
                  onClick={() => setLeadReportModalOpen(false)}
                  className="absolute top-4 right-4 text-slate-500 hover:text-slate-300"
                >
                  <X className="h-5 w-5" />
                </button>
                <div className="flex items-center gap-2 text-amber-500 mb-4">
                  <Shield className="h-6 w-6" />
                  <h3 className="text-lg font-bold text-foreground">Report Lead</h3>
                </div>
                <p className="text-xs text-muted-foreground mb-4">
                  You are reporting the lead <strong>{detail.businessName}</strong>. Please provide
                  details to help our moderation team review this business.
                </p>
                <form onSubmit={handleSubmitLeadReport} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1">
                      Reason for Report
                    </label>
                    <select
                      value={leadReportReason}
                      onChange={(e) => setLeadReportReason(e.target.value)}
                      className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                    >
                      <option value="fake_business">Fake Business / Listing</option>
                      <option value="scam">Scam / Fraudulent Lead</option>
                      <option value="spam">Spam / Duplicate</option>
                      <option value="other">Other Reason</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1">
                      Additional Details
                    </label>
                    <textarea
                      value={leadReportDescription}
                      onChange={(e) => setLeadReportDescription(e.target.value)}
                      placeholder="Describe the issue in detail..."
                      rows={4}
                      className="w-full rounded-xl border border-border bg-background p-3 text-xs font-mono text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                      required
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setLeadReportModalOpen(false)}
                      className="rounded-xl border border-border px-4 py-2 text-xs font-semibold text-foreground hover:bg-accent transition cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submittingLeadReport}
                      className="rounded-xl bg-red-500 hover:bg-red-650 text-white px-4 py-2 text-xs font-semibold shadow-md transition flex items-center gap-1 disabled:opacity-50 cursor-pointer"
                    >
                      {submittingLeadReport ? "Submitting..." : "Submit Report"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ═══ STATS DETAIL PANELS (SLIDE-IN DRAWERS) ═══ */}
      <AnimatePresence>
        {activeStatScreen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveStatScreen(null)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            />
            {/* Drawer Content */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full sm:max-w-md h-full bg-[#0B1220] border-l border-border/80 shadow-2xl flex flex-col z-10 text-foreground"
            >
              {/* Header */}
              <div className="p-6 border-b border-border/80 flex items-center justify-between">
                <button
                  onClick={() => setActiveStatScreen(null)}
                  className="flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition cursor-pointer"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </button>
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
                  {activeStatScreen === "searches" && `Searches Performed — ${scansCount}`}
                  {activeStatScreen === "saved" && `Saved This Month — ${savedThisMonthList.length}`}
                  {activeStatScreen === "contacted" && `Leads Contacted — ${contactedLeadsSorted.length}`}
                  {activeStatScreen === "win_rate" && `Win Rate — ${conversionRate}%`}
                </h3>
                <button
                  onClick={() => setActiveStatScreen(null)}
                  className="grid h-8 w-8 place-items-center rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {activeStatScreen === "searches" && renderSearchesPanel()}
                {activeStatScreen === "saved" && renderSavedPanel()}
                {activeStatScreen === "contacted" && renderContactedPanel()}
                {activeStatScreen === "win_rate" && renderWinRatePanel()}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ═══ QUICK CONNECT MODAL ═══ */}
      <QuickConnectModal
        open={quickConnectOpen}
        onOpenChange={setQuickConnectOpen}
        lead={quickConnectLead}
        initialChannel={quickConnectChannel}
        initialMessage={quickConnectMessage}
        onLeadUpdated={(updated) => {
          setResults((prev) =>
            prev.map((l) =>
              l.id === updated.id ? { ...l, email: updated.email, notes: updated.notes } : l,
            ),
          );
          if (detail && detail.id === updated.id) {
            setDetail((prev) =>
              prev ? { ...prev, email: updated.email, notes: updated.notes } : null,
            );
          }
        }}
      />
    </>
  );
}
