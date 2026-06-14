import { useMemo, useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Briefcase,
  Grid3X3,
  List,
  Search,
  X,
  MapPin,
  Copy,
  Star,
  Phone,
  Mail,
  Globe,
  Check,
  Sparkles,
  Loader2,
  Download,
} from "lucide-react";
import { toast } from "sonner";
import { Header } from "@/components/layout/Header";
import { LeadCard } from "@/components/ui/LeadCard";
import { OnlineJobCard } from "@/components/ui/OnlineJobCard";
import { OpportunityScore } from "@/components/ui/OpportunityScore";
import { EmptyState } from "@/components/ui/EmptyState";
import { OutreachPreview } from "@/components/ui/OutreachPreview";
import { TrendingSearches } from "@/components/ui/TrendingSearches";
import { QuickConnectModal } from "@/components/dashboard/QuickConnectModal";
import { CATEGORIES, COUNTRIES, type Lead } from "@/data/mockData";
import { COUNTRY_CITIES } from "@/data/countriesData";
import { CATEGORY_TO_PLACES_QUERY } from "@/types";
import { usePreferences } from "@/contexts/PreferencesContext";
import { usePipeline } from "@/contexts/PipelineContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Shield } from "lucide-react";

export const Route = createFileRoute("/app/discover")({
  head: () => ({ meta: [{ title: "Discover Leads — LanceConnect" }] }),
  component: Discover,
});

const ONLINE_ELIGIBLE = [
  "tutor",
  "parent_tutor",
  "seo",
  "copywriter",
  "web_dev",
  "designer",
  "social_media",
  "marketing",
  "training_recruitment",
  "human_capital",
];

function Discover() {
  const { user } = useAuth();
  const [category, setCategory] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [product, setProduct] = useState("");
  const [selectedNiche, setSelectedNiche] = useState("");
  const [results, setResults] = useState<Lead[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [website, setWebsite] = useState("");
  const [minScore, setMinScore] = useState(0);
  const [view, setView] = useState<"grid" | "table">("grid");
  const [sort, setSort] = useState<"score" | "rating">("score");
  const [detail, setDetail] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(false);
  const [onlineJobs, setOnlineJobs] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"local" | "online">("local");
  const [loadingOnline, setLoadingOnline] = useState(false);
  const [quickConnectOpen, setQuickConnectOpen] = useState(false);
  const [quickConnectLead, setQuickConnectLead] = useState<Lead | undefined>();
  const [quickConnectChannel, setQuickConnectChannel] = useState<"email" | "linkedin" | "whatsapp">("email");
  const [quickConnectMessage, setQuickConnectMessage] = useState("");
  const [totalPoolCount, setTotalPoolCount] = useState(0);
  const [expansionMessage, setExpansionMessage] = useState<string | null>(null);
  const [searchIntelligence, setSearchIntelligence] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCategory = sessionStorage.getItem("lc_shared_category");
      const savedCountry = sessionStorage.getItem("lc_shared_country");
      const savedCity = sessionStorage.getItem("lc_shared_city");
      const savedNiche = sessionStorage.getItem("lc_shared_niche");
      const savedResults = sessionStorage.getItem("lc_shared_results");
      const savedOnlineJobs = sessionStorage.getItem("lc_shared_online_jobs");

      if (savedCategory) setCategory(savedCategory);
      if (savedCountry) setCountry(savedCountry);
      if (savedCity) setCity(savedCity);
      if (savedNiche) setSelectedNiche(savedNiche);
      if (savedResults) {
        try {
          setResults(JSON.parse(savedResults));
        } catch {
          // ignore
        }
      }
      if (savedOnlineJobs) {
        try {
          setOnlineJobs(JSON.parse(savedOnlineJobs));
        } catch {
          // ignore
        }
      }
      setIsMounted(true);
    }
  }, []);

  useEffect(() => {
    if (isMounted && typeof window !== "undefined") {
      sessionStorage.setItem("lc_shared_category", category);
      sessionStorage.setItem("lc_shared_country", country);
      sessionStorage.setItem("lc_shared_city", city);
      sessionStorage.setItem("lc_shared_niche", selectedNiche);
    }
  }, [category, country, city, selectedNiche, isMounted]);

  useEffect(() => {
    if (isMounted && typeof window !== "undefined") {
      sessionStorage.setItem("lc_shared_results", JSON.stringify(results));
      sessionStorage.setItem("lc_shared_online_jobs", JSON.stringify(onlineJobs));
      if (results.length > 0 || onlineJobs.length > 0) {
        sessionStorage.setItem("lc_shared_has_session", "true");
      } else {
        sessionStorage.removeItem("lc_shared_has_session");
      }
    }
  }, [results, onlineJobs, isMounted]);

  // Background fetch for online opportunities when restoring a search from dashboard or reload
  useEffect(() => {
    if (!isMounted || !user) return;
    
    const hasSavedSession = typeof window !== "undefined" && sessionStorage.getItem("lc_shared_has_session") === "true";
    const savedOnlineJobs = typeof window !== "undefined" ? sessionStorage.getItem("lc_shared_online_jobs") : null;
    
    if (hasSavedSession && category && ONLINE_ELIGIBLE.includes(category)) {
      let parsedJobs = [];
      try {
        if (savedOnlineJobs) parsedJobs = JSON.parse(savedOnlineJobs);
      } catch {}

      if (parsedJobs.length === 0 && !loadingOnline && onlineJobs.length === 0) {
        setLoadingOnline(true);
        supabase.auth.getSession().then(({ data: { session } }) => {
          const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://rpaodsmwhmzyhopvkwjt.supabase.co";
          fetch(`${supabaseUrl}/functions/v1/online-opportunities`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session?.access_token}`,
            },
            body: JSON.stringify({
              category,
              page: 1,
            }),
          })
            .then((res) => res.json())
            .then((data) => {
              if (data?.jobs) {
                setOnlineJobs(data.jobs);
                if (typeof window !== "undefined") {
                  sessionStorage.setItem("lc_shared_online_jobs", JSON.stringify(data.jobs));
                }
                if (results.length === 0 && data.jobs.length > 0) {
                  setActiveTab("online");
                }
              }
            })
            .catch((err) => console.error("Auto fetch online jobs failed:", err))
            .finally(() => setLoadingOnline(false));
        });
      }
    }
  }, [isMounted, user, category, results.length]);

  const suggestedCities = COUNTRY_CITIES[country] || [];

  useEffect(() => {
    if (!isMounted || !user) return;
    const hasSavedSession = typeof window !== "undefined" && sessionStorage.getItem("lc_shared_has_session") === "true";
    if (!hasSavedSession) {
      if (
        ["african_food_export", "b2b_trade", "restaurant_supplier", "product_export", "human_capital", "training_recruitment"].includes(
          user.freelancerCategory || "",
        )
      ) {
        setCategory(user.freelancerCategory);
        if (user.supplierProfile?.products) {
          const prodStr = Array.isArray(user.supplierProfile.products)
            ? user.supplierProfile.products.join(", ")
            : String(user.supplierProfile.products);
          setProduct(prodStr);
        }
      }
    }
  }, [user, isMounted]);

  const attachClaimsToLeads = async (leads: Lead[]) => {
    if (leads.length === 0) return leads;
    const leadIds = leads.map((l) => l.id);
    try {
      const { data, error } = await supabase.rpc("get_lead_claims", { lead_ids: leadIds });
      if (error) {
        console.error("Error fetching lead claims:", error);
        return leads;
      }

      const claimsMap = new Map<string, { status: string; updated_at: string; user_id: string }>();
      (data || []).forEach((claim: any) => {
        let evaluatedStatus: 'pitched' | 'won' | null = null;
        if (claim.status === "won") {
          evaluatedStatus = "won";
        } else if (["contacted", "interested", "proposal_sent"].includes(claim.status)) {
          const updatedAt = new Date(claim.updated_at);
          const diffTime = Math.abs(new Date().getTime() - updatedAt.getTime());
          const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
          if (diffDays < 30) {
            evaluatedStatus = "pitched";
          }
        }
        
        if (evaluatedStatus) {
          const existing = claimsMap.get(claim.lead_id);
          if (!existing || evaluatedStatus === "won") {
            claimsMap.set(claim.lead_id, {
              status: evaluatedStatus,
              updated_at: claim.updated_at,
              user_id: claim.user_id
            });
          }
        }
      });

      return leads.map((l) => {
        const claim = claimsMap.get(l.id);
        if (claim) {
          return {
            ...l,
            claimStatus: claim.status as 'pitched' | 'won',
            claimUserId: claim.user_id,
            claimUpdatedAt: claim.updated_at,
          };
        }
        return {
          ...l,
          claimStatus: null,
          claimUserId: null,
          claimUpdatedAt: null,
        };
      });
    } catch (err) {
      console.error("Failed to attach claims:", err);
      return leads;
    }
  };

  useEffect(() => {
    if (!isMounted || !user) return;

    const params = new URLSearchParams(window.location.search);
    const autoSearch = params.get("autoSearch");
    if (autoSearch === "true") {
      const categoryParam = params.get("category") || "";
      const cityParam = params.get("city") || "";
      const countryParam = params.get("country") || "";
      const nicheParam = params.get("niche") || "";
      if (categoryParam && cityParam) {
        setCategory(categoryParam);
        setCity(cityParam);
        setCountry(countryParam);
        setSelectedNiche(nicheParam);
        handleSearch({
          category: categoryParam,
          country: countryParam,
          city: cityParam,
          product: "",
          niche: nicheParam,
        });
        return;
      }
    }

    const hasSavedSession = typeof window !== "undefined" && sessionStorage.getItem("lc_shared_has_session") === "true";
    if (!hasSavedSession) {
      setLoading(true);
      let queryBuilder = supabase.from("leads").select("*");
      if (user.freelancerCategory) {
        queryBuilder = queryBuilder.eq("industry", user.freelancerCategory);
      }
      queryBuilder
        .order("created_at", { ascending: false })
        .limit(12)
        .then(({ data, error }) => {
          setLoading(false);
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
              facebookUrl: dbLead.facebook_url || null,
              instagramUrl: dbLead.instagram_url || null,
              hasLinkedin: dbLead.has_linkedin || false,
              linkedinUrl: dbLead.linkedin_url || null,
              phoneVerified: dbLead.phone_verified || false,
              emailVerified: dbLead.email_verified || false,
              websiteLive: dbLead.website_live || false,
              isFlagged: dbLead.is_flagged || false,
              suspiciousCount: dbLead.suspicious_count || 0,
            }));
            attachClaimsToLeads(mapped).then((enriched) => {
              setResults(enriched);
            });
          }
        });
    }
  }, [user, isMounted]);

  const handleSearch = async (
    searchParams?: { category: string; country: string; city: string; product: string; niche: string } | React.MouseEvent
  ) => {
    const isEvent = searchParams && ("preventDefault" in searchParams || "target" in searchParams);
    const params = searchParams && !isEvent ? (searchParams as any) : null;

    const queryTerm = params ? params.category : (category || "local business");
    const countryName = params ? params.country : (country || "Nigeria");
    const cityName = params ? params.city : city;
    const productTerm = params ? params.product : product;
    const nicheTerm = params ? params.niche : selectedNiche;

    if (!cityName) {
      toast.error("Please enter a city (e.g. Lagos, London).");
      return;
    }

    setLoading(true);
    setLoadingOnline(true);
    setOnlineJobs([]);
    setActiveTab("local");

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const supabaseUrl =
        import.meta.env.VITE_SUPABASE_URL || "https://rpaodsmwhmzyhopvkwjt.supabase.co";

      const storedSeenKey = `lc_seen_lead_ids_${user?.id || "anon"}`;
      let localSeen: string[] = [];
      try {
        localSeen = JSON.parse(localStorage.getItem(storedSeenKey) || "[]");
      } catch (e) {
        console.warn("Failed to parse local seen lead IDs:", e);
      }

      const searchLeadsPromise = fetch(`${supabaseUrl}/functions/v1/search-leads`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({
          query: queryTerm,
          city: cityName,
          country: countryName,
          limit: 20,
          seen_lead_ids: localSeen,
          product: [
            "african_food_export",
            "b2b_trade",
            "restaurant_supplier",
            "product_export",
          ].includes(queryTerm)
            ? productTerm
            : undefined,
          niche: nicheTerm || undefined,
        }),
      }).then(async (res) => {
        const data = await res.json();
        if (!res.ok || data.error) {
          const errObj = data.error || {};
          const errCode = typeof errObj === "string" ? errObj : errObj.code;
          const errMsg = typeof errObj === "string" ? errObj : errObj.message;

          if (errCode === "LIMIT_REACHED" || errCode === "QUOTA_EXHAUSTED" || res.status === 402) {
            toast.error(errMsg || "Search limit reached! Please upgrade your plan to get more leads.", {
              action: {
                label: "Upgrade Plan",
                onClick: () => {
                  window.location.href = "/app/upgrade";
                },
              },
            });
            const limitError = new Error(errMsg || "Search limit reached");
            (limitError as any).isHandled = true;
            throw limitError;
          }

          if (errCode === "RATE_LIMIT_EXCEEDED" || res.status === 429) {
            toast.error(errMsg || "Too many requests. Please try again later.");
            const rateLimitError = new Error(errMsg || "Too many requests");
            (rateLimitError as any).isHandled = true;
            throw rateLimitError;
          }

          throw new Error(errMsg || "Failed to search leads");
        }
        return data;
      });

      const onlineEligible = ONLINE_ELIGIBLE.includes(queryTerm);
      const searchOnlinePromise = onlineEligible
        ? fetch(`${supabaseUrl}/functions/v1/online-opportunities`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session?.access_token}`,
            },
            body: JSON.stringify({
              category: queryTerm,
              page: 1,
            }),
          }).then(async (res) => {
            const data = await res.json();
            if (!res.ok || data.error) {
              console.error("Online jobs error:", data.error);
              return [];
            }
            return data?.jobs || [];
          }).catch(err => {
            console.error("Online jobs fetch failed:", err);
            return [];
          })
        : Promise.resolve([]);

      const [searchData, rawJobs] = await Promise.all([
        searchLeadsPromise,
        searchOnlinePromise,
      ]);

      const rawLeads = searchData?.leads || [];
      const poolCount = searchData?.total_pool_count || 0;
      const expMsg = searchData?.expansion_message || null;

      setTotalPoolCount(poolCount);
      setExpansionMessage(expMsg);
      setSearchIntelligence(searchData?.intelligence || null);

      // Save returned lead IDs to localStorage seen leads
      const returnedIds = rawLeads.map((l: any) => l.id);
      if (returnedIds.length > 0) {
        try {
          const updatedLocalSeen = [...new Set([...localSeen, ...returnedIds])];
          localStorage.setItem(storedSeenKey, JSON.stringify(updatedLocalSeen));
        } catch (e) {
          console.warn("Failed to save local seen lead IDs:", e);
        }
      }

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
        score_breakdown: dbLead.score_breakdown || null,
        createdAt: dbLead.created_at,
        source: dbLead.source || "google_maps",
        savedAt: null,
        status: null,
        facebookUrl: dbLead.facebook_url || null,
        instagramUrl: dbLead.instagram_url || null,
        hasLinkedin: dbLead.has_linkedin || false,
        linkedinUrl: dbLead.linkedin_url || null,
        phoneVerified: dbLead.phone_verified || false,
        emailVerified: dbLead.email_verified || false,
        websiteLive: dbLead.website_live || false,
        isFlagged: dbLead.is_flagged || false,
        suspiciousCount: dbLead.suspicious_count || 0,
      }));

      const enriched = await attachClaimsToLeads(mapped);
      setResults(enriched);
      setOnlineJobs(rawJobs);

      if (mapped.length > 0) {
        toast.success(`Found ${mapped.length} leads in ${cityName}!`);
      }
      if (rawJobs.length > 0) {
        toast.success(`Found ${rawJobs.length} online opportunities!`);
        if (mapped.length === 0) {
          setActiveTab("online");
        }
      }
    } catch (err: any) {
      console.error(err);
      if (!err.isHandled) {
        toast.error("Search temporarily unavailable — please try again in a moment.");
      }
    } finally {
      setLoading(false);
      setLoadingOnline(false);
    }
  };

  const filteredResults = useMemo(() => {
    const out = results.filter((l) => {
      if (website === "no" && l.hasWebsite) return false;
      if (website === "yes" && !l.hasWebsite) return false;
      if (l.opportunityScore < minScore) return false;
      return true;
    });
    return [...out].sort((a, b) =>
      sort === "score" ? b.opportunityScore - a.opportunityScore : b.googleRating - a.googleRating,
    );
  }, [results, website, minScore, sort]);

  const clear = () => {
    setCategory("");
    setCountry("");
    setCity("");
    setWebsite("");
    setMinScore(0);
    setProduct("");
    setSelectedNiche("");
    setSearchIntelligence(null);
  };

  const downloadCSV = () => {
    if (filteredResults.length === 0) return;
    const headers = [
      "Business Name",
      "Type",
      "City",
      "Country",
      "Address",
      "Phone",
      "Email",
      "Website",
      "Opportunity Score",
      "Google Rating",
      "Reviews",
    ];
    const csvRows = [
      headers.join(","),
      ...filteredResults.map((l) =>
        [
          `"${l.businessName.replace(/"/g, '""')}"`,
          `"${l.businessType.replace(/"/g, '""')}"`,
          `"${l.city.replace(/"/g, '""')}"`,
          `"${l.country.replace(/"/g, '""')}"`,
          `"${(l.fullAddress || "").replace(/"/g, '""')}"`,
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
    link.setAttribute("download", `lanceconnect_leads_${city || "global"}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV Spreadsheet downloaded successfully!");
  };

  return (
    <>
      <Header title="Discover Leads" subtitle="Find businesses that need your skills" />

      <TrendingSearches
        onSelectSearch={(search) => {
          setCategory(search.category);
          setCountry(search.country);
          setCity(search.city);
          setProduct(search.product);
          setSelectedNiche(search.niche);
          handleSearch(search);
        }}
        className="mx-4 lg:mx-8 mt-4"
      />

      <div className="border-b border-border bg-card px-4 py-3 lg:px-8">
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id} className="bg-background text-foreground">
                {c.label}
              </option>
            ))}
          </select>
          {["african_food_export", "b2b_trade", "restaurant_supplier", "product_export"].includes(
            category,
          ) && (
            <input
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              placeholder="What product do you supply? (e.g. palm oil)"
              className="rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary w-56 animate-in slide-in-from-left-2 duration-200"
            />
          )}
          <select
            value={country}
            onChange={(e) => {
              setCountry(e.target.value);
              setCity("");
            }}
            className="rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground"
          >
            <option value="">All Countries</option>
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.name} className="bg-background text-foreground">
                {c.name}
              </option>
            ))}
          </select>
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            id="discover-city-input"
            autoComplete="off"
            list="discover-cities-list"
            placeholder="Enter city..."
            className="rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary"
          />
          <datalist id="discover-cities-list">
            {suggestedCities.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
          <select
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            className="rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground"
          >
            <option value="">All Websites</option>
            <option value="no">No Website Only</option>
            <option value="yes">Has Website</option>
          </select>
          <select
            value={minScore}
            onChange={(e) => setMinScore(Number(e.target.value))}
            className="rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground"
          >
            <option value={0}>Any Score</option>
            <option value={50}>50+</option>
            <option value={70}>70+</option>
            <option value={85}>85+</option>
          </select>
          <button
            onClick={() => handleSearch()}
            disabled={loading}
            className="ml-auto inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Search className="h-3.5 w-3.5" />
            )}{" "}
            Search Leads
          </button>
          <button onClick={clear} className="text-xs text-muted-foreground hover:text-foreground">
            Clear filters
          </button>
        </div>

        {/* Niche Keyword Suggestions */}
        {category && (CATEGORY_TO_PLACES_QUERY[category] || []).length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 text-[11px] mt-2.5 pt-2.5 border-t border-border/10 select-none">
            <span className="text-slate-500 font-medium">Niche suggestions:</span>
            {(CATEGORY_TO_PLACES_QUERY[category] || []).map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => {
                  setSelectedNiche(selectedNiche === n ? "" : n);
                  toast.info(
                    selectedNiche === n
                      ? "Cleared niche filter"
                      : `Filtered search niche to: "${n}"`,
                  );
                }}
                className={cn(
                  "rounded px-2.5 py-0.5 font-medium border transition cursor-pointer text-[10px]",
                  selectedNiche === n
                    ? "bg-primary text-white border-primary"
                    : "bg-primary/5 border-primary/20 text-primary hover:bg-primary/10",
                )}
              >
                {n}
              </button>
            ))}
          </div>
        )}

        {/* Suggested Cities */}
        {suggestedCities.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 text-[11px] mt-2.5 pt-2.5 border-t border-border/20">
            <span className="text-slate-500 font-medium">Suggested cities:</span>
            {suggestedCities.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => {
                  setCity(c);
                  toast.success(`Selected city: ${c}`);
                }}
                className="rounded bg-primary/10 border border-primary/20 px-2 py-0.5 font-medium text-primary hover:bg-primary/20 transition cursor-pointer text-[10px]"
              >
                {c}
              </button>
            ))}
          </div>
        )}
      </div>

      {(ONLINE_ELIGIBLE.includes(category) || onlineJobs.length > 0) && (
        <div className="px-4 lg:px-8 mb-2">
          <div className="inline-flex gap-1 border border-border bg-card p-1 rounded-xl shadow-sm">
            <button
              type="button"
              onClick={() => setActiveTab("local")}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer",
                activeTab === "local"
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              🏪 Local Businesses ({filteredResults.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("online")}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer",
                activeTab === "online"
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              🌐 Online Opportunities ({onlineJobs.length})
            </button>
          </div>
        </div>
      )}

      {searchIntelligence && (
        <div className="mx-4 lg:mx-8 mt-2 mb-4 p-3 bg-slate-900/40 border border-slate-800 rounded-xl text-xs text-slate-400 flex flex-wrap items-center gap-2 font-mono animate-in slide-in-from-top-2 duration-300">
          <span className="text-indigo-400">📍</span>
          <span>Searching <span className="font-semibold text-indigo-400">{searchIntelligence.niche_searched}</span> in <span className="font-semibold text-primary">{searchIntelligence.district_searched}</span></span>
          <span className="text-slate-600">·</span>
          <span>Area {searchIntelligence.district_number}/{searchIntelligence.total_districts}</span>
          {searchIntelligence.leads_excluded > 0 && (
            <>
              <span className="text-slate-600">·</span>
              <span className="text-slate-500">
                {searchIntelligence.leads_excluded} already seen leads excluded
              </span>
            </>
          )}
          {searchIntelligence.personalized && (
            <>
              <span className="text-slate-600">·</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                ✨ Personalized Reranking Active
              </span>
            </>
          )}
        </div>
      )}

      {expansionMessage && (
        <div className="mx-4 lg:mx-8 mt-2 mb-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-500 flex items-center gap-2 animate-in slide-in-from-top-2 duration-300">
          <Sparkles className="h-4 w-4 shrink-0 text-amber-500" />
          <span>{expansionMessage}</span>
        </div>
      )}

      {activeTab === "local" ? (
        <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-4 lg:px-8">
          <div className="flex items-center gap-3">
            <p className="text-sm text-muted-foreground">
              {totalPoolCount > 0 && category && city ? (
                <>
                  Showing <span className="font-semibold text-foreground">{filteredResults.length}</span> of{" "}
                  <span className="font-semibold text-foreground">{totalPoolCount}</span> available{" "}
                  <span className="font-semibold text-foreground">
                    {CATEGORIES.find((c) => c.id === category)?.label || "Local Business"}
                  </span>{" "}
                  leads in <span className="font-semibold text-foreground">{city}</span>
                </>
              ) : (
                <>
                  Showing <span className="font-semibold text-foreground">{filteredResults.length}</span> leads
                </>
              )}
            </p>
            {filteredResults.length > 0 && (
              <button
                onClick={downloadCSV}
                className="rounded-lg border border-border bg-card px-2.5 py-1 text-xs font-semibold hover:bg-accent flex items-center gap-1.5 cursor-pointer text-foreground"
              >
                <Download className="h-3.5 w-3.5" /> Export CSV
              </button>
            )}
          </div>
          <div className="flex items-center gap-3">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as "score" | "rating")}
              className="rounded-lg border border-input bg-background px-2 py-1.5 text-xs"
            >
              <option value="score">Sort by: Score</option>
              <option value="rating">Sort by: Rating</option>
            </select>
            <div className="inline-flex rounded-lg border border-border bg-card p-0.5">
              <button
                onClick={() => setView("grid")}
                className={cn("rounded-md p-1.5 cursor-pointer", view === "grid" && "bg-accent")}
              >
                <Grid3X3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setView("table")}
                className={cn("rounded-md p-1.5 cursor-pointer", view === "table" && "bg-accent")}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-4 lg:px-8">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{onlineJobs.length}</span> remote job listings
          </p>
        </div>
      )}

      <div className="px-4 pb-10 lg:px-8">
        {activeTab === "local" ? (
          loading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="group relative flex w-full flex-col rounded-2xl border border-border bg-card p-5 space-y-4"
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                    <Skeleton className="h-7 w-12 rounded-full" />
                  </div>
                  <div className="flex gap-2">
                    <Skeleton className="h-5 w-24 rounded-full" />
                    <Skeleton className="h-5 w-20 rounded-full" />
                  </div>
                  <div className="space-y-2 py-2 border-y border-dashed border-border">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Skeleton className="h-9 flex-1" />
                    <Skeleton className="h-9 w-9" />
                    <Skeleton className="h-9 w-9" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredResults.length === 0 ? (
            <EmptyState
              icon={<Search className="h-10 w-10 text-muted-foreground/60" />}
              title="No leads found in this area yet"
              description="Try a different city or expand your filters."
              action={{ label: "Clear all filters", onClick: clear }}
            />
          ) : view === "grid" ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredResults.map((l, i) => (
                <div
                  key={l.id}
                  style={{ animationDelay: `${i * 50}ms` }}
                  className="animate-in fade-in-50 slide-in-from-bottom-2"
                >
                  <LeadCard
                    lead={l}
                    onOpenDetail={setDetail}
                    onQuickConnect={(lead, channel) => {
                      setQuickConnectLead(lead);
                      setQuickConnectChannel(channel || "email");
                      setQuickConnectMessage("");
                      setQuickConnectOpen(true);
                    }}
                    onDismiss={(leadId) => {
                      setResults((prev) => prev.filter((item) => item.id !== leadId));
                    }}
                  />
                </div>
              ))}
            </div>
          ) : (
            <LeadTable
              leads={filteredResults}
              onOpenDetail={setDetail}
              onQuickConnect={(lead, channel) => {
                setQuickConnectLead(lead);
                setQuickConnectChannel(channel || "email");
                setQuickConnectMessage("");
                setQuickConnectOpen(true);
              }}
            />
          )
        ) : (
          loadingOnline ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="group relative flex w-full flex-col rounded-2xl border border-border bg-card p-5 space-y-4"
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                    <Skeleton className="h-7 w-12 rounded-full" />
                  </div>
                  <div className="space-y-2 py-2 border-y border-dashed border-border">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Skeleton className="h-9 flex-1" />
                  </div>
                </div>
              ))}
            </div>
          ) : onlineJobs.length === 0 ? (
            <EmptyState
              icon={<Briefcase className="h-10 w-10 text-muted-foreground/60" />}
              title="No online opportunities found"
              description="We couldn't find any remote job listings for this category right now."
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {onlineJobs.map((job, idx) => (
                <div
                  key={job.id}
                  style={{ animationDelay: `${idx * 50}ms` }}
                  className="animate-in fade-in-50 slide-in-from-bottom-2"
                >
                  <OnlineJobCard job={job} />
                </div>
              ))}
            </div>
          )
        )}
      </div>

      {detail && (
        <LeadDetailModal
          lead={detail}
          onClose={() => setDetail(null)}
          onUpdateLead={(updated) => {
            setResults((prev) =>
              prev.map((l) => (l.id === updated.id ? updated : l))
            );
            setDetail(updated);
          }}
          onQuickConnect={(lead, channel, msg) => {
            setQuickConnectLead(lead);
            setQuickConnectChannel(channel || "email");
            setQuickConnectMessage(msg || "");
            setQuickConnectOpen(true);
          }}
        />
      )}

      <QuickConnectModal
        open={quickConnectOpen}
        onOpenChange={setQuickConnectOpen}
        lead={quickConnectLead}
        initialChannel={quickConnectChannel}
        initialMessage={quickConnectMessage}
        onLeadUpdated={(updated) => {
          setResults((prev) =>
            prev.map((l) => {
              if (l.id === updated.id) {
                return {
                  ...l,
                  email: updated.email,
                  notes: updated.notes,
                  status: updated.status || "contacted",
                  claimStatus: "pitched",
                  claimUserId: user?.id || null,
                  claimUpdatedAt: new Date().toISOString(),
                };
              }
              return l;
            })
          );
          if (detail && detail.id === updated.id) {
            setDetail((prev) =>
              prev
                ? {
                    ...prev,
                    email: updated.email,
                    notes: updated.notes,
                    status: updated.status || "contacted",
                    claimStatus: "pitched",
                    claimUserId: user?.id || null,
                    claimUpdatedAt: new Date().toISOString(),
                  }
                : null
            );
          }
        }}
      />
    </>
  );
}

function LeadTable({
  leads,
  onOpenDetail,
  onQuickConnect,
}: {
  leads: Lead[];
  onOpenDetail: (l: Lead) => void;
  onQuickConnect?: (lead: Lead, initialChannel?: "email" | "linkedin" | "whatsapp") => void;
}) {
  const { saveLead, savedIds } = usePipeline();
  const { user } = useAuth();

  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-card">
      <table className="w-full min-w-[800px] text-sm">
        <thead className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
          <tr>
            <th className="px-4 py-3">Business</th>
            <th className="px-4 py-3">Location</th>
            <th className="px-4 py-3">Score</th>
            <th className="px-4 py-3">Website</th>
            <th className="px-4 py-3">Phone</th>
            <th className="px-4 py-3">Rating</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {leads.map((l) => {
            const isLocked = !!(l.claimStatus && l.claimUserId !== user?.id);
            return (
              <tr
                key={l.id}
                className="cursor-pointer hover:bg-primary/5"
                onClick={() => onOpenDetail(l)}
              >
                <td className="px-4 py-3 font-medium">
                  <div className="flex items-center gap-2">
                    {l.businessName}
                    {l.claimStatus && (
                      <span className={cn(
                        "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[9px] font-bold border",
                        l.claimStatus === 'won'
                          ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                          : l.claimUserId === user?.id
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                      )}>
                        {l.claimStatus === 'won' 
                          ? l.claimUserId === user?.id ? "🎉 Client" : "🔒 Active Client"
                          : l.claimUserId === user?.id ? "✓ Contacted" : "⏳ Pitched"}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">{l.businessType}</div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {l.city}, {l.country}
                </td>
                <td className="px-4 py-3">
                  <OpportunityScore score={l.opportunityScore} size="sm" showLabel={false} />
                </td>
                <td className="px-4 py-3">
                  {l.hasWebsite ? (
                    <span className="text-emerald-600 font-semibold">✓ Yes</span>
                  ) : (
                    <span className="text-red-600">✗ No</span>
                  )}
                </td>
                <td className="px-4 py-3 font-mono-data text-xs">
                  {l.phone ? (
                    onQuickConnect && !isLocked ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onQuickConnect(l, "whatsapp");
                        }}
                        className="text-green-500 hover:text-green-400 font-semibold cursor-pointer"
                      >
                        {l.phone}
                      </button>
                    ) : (
                      <span className={cn(isLocked && "text-slate-500 line-through")}>
                        {l.phone}
                      </span>
                    )
                  ) : (
                    <span className="italic text-slate-500">-</span>
                  )}
                </td>
                <td className="px-4 py-3 text-amber-600">
                  <span className="inline-flex items-center gap-1">
                    <Star className="h-3 w-3 fill-current" /> {l.googleRating}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isLocked) return;
                      saveLead(l);
                      toast.success("Saved to pipeline");
                    }}
                    disabled={savedIds.has(l.id) || isLocked}
                    className="rounded-md bg-primary/10 px-2 py-1 text-xs font-semibold text-primary hover:bg-primary/20 disabled:opacity-50 cursor-pointer"
                  >
                    {isLocked ? "🔒 Locked" : savedIds.has(l.id) ? "Saved" : "Save"}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

const getClaimTimeAgo = (updatedAtStr?: string | null) => {
  if (!updatedAtStr) return "recently";
  const updatedAt = new Date(updatedAtStr);
  const diffTime = Math.abs(new Date().getTime() - updatedAt.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "today";
  if (diffDays === 1) return "yesterday";
  return `${diffDays} days ago`;
};

function LeadDetailModal({
  lead,
  onClose,
  onUpdateLead,
  onQuickConnect,
}: {
  lead: Lead;
  onClose: () => void;
  onUpdateLead?: (updated: Lead) => void;
  onQuickConnect?: (lead: Lead, initialChannel?: "email" | "linkedin" | "whatsapp", initialMessage?: string) => void;
}) {
  const { user } = useAuth();
  const { saveLead, savedIds } = usePipeline();
  const { safetyPopupDismissed, setSafetyPopupDismissed } = usePreferences();

  const [currentLead, setCurrentLead] = useState<Lead>(lead);
  const [enriching, setEnriching] = useState(false);
  const isLocked = !!(currentLead.claimStatus && currentLead.claimUserId !== user?.id);

  useEffect(() => {
    if (currentLead.websiteUrl && !currentLead.email && !enriching) {
      handleEnrich();
    }
  }, [currentLead.id]);
  const [generating, setGenerating] = useState(false);
  const [outreachDraft, setOutreachDraft] = useState("");
  const [selectedChannel, setSelectedChannel] = useState<
    "email" | "linkedin" | "whatsapp" | "phone_script" | "letter"
  >("email");
  const [selectedTone, setSelectedTone] = useState<"casual" | "professional" | "bold">(
    "professional",
  );
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [provider, setProvider] = useState("");
  const [activeTab, setActiveTab] = useState<"overview" | "seo">("overview");
  const [seoLoading, setSeoLoading] = useState(false);
  const [seoData, setSeoData] = useState<{ keywords: any[]; hook: string } | null>(null);

  // Safety & Report States
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
        reported_lead_id: currentLead.id,
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

  const handleLoadSeo = async () => {
    if (seoData) return;
    setSeoLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("lead-seo-audit", {
        body: { leadId: currentLead.id },
      });
      if (error) throw error;
      setSeoData(data);
    } catch (err: any) {
      console.error("Failed to load SEO audit:", err);
      toast.error(err.message || "Failed to load SEO audit data");
    } finally {
      setSeoLoading(false);
    }
  };

  const handleEnrich = async () => {
    if (!currentLead.websiteUrl || enriching) return;
    setEnriching(true);
    try {
      const { data, error } = await supabase.functions.invoke("enrich-contact", {
        body: { leadId: currentLead.id },
      });
      if (error) throw error;
      if (data?.lead?.email) {
        const updated = { ...currentLead, email: data.lead.email };
        setCurrentLead(updated);
        if (onUpdateLead) {
          onUpdateLead(updated);
        }
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

  const handleGenerate = async () => {
    setGenerating(true);
    setOutreachDraft("");
    try {
      const apiChannel = selectedChannel === "whatsapp" ? "sms" : selectedChannel;
      const { data, error } = await supabase.functions.invoke("ai-outreach", {
        body: {
          leadId: currentLead.id,
          channel: apiChannel,
          tone: selectedTone,
          language: selectedLanguage,
        },
      });
      if (error) throw error;
      setOutreachDraft(data.message || "");
      setProvider(data.provider_label || "Generated with AI");
      toast.success("AI Outreach Draft generated!");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to generate AI outreach");
    } finally {
      setGenerating(false);
    }
  };

  const copyDraft = () => {
    navigator.clipboard.writeText(outreachDraft);
    toast.success("Copied to clipboard!");
  };

  const reasons = [
    !currentLead.hasWebsite && { label: "No website detected", pts: 40 },
    currentLead.googleRating < 4 && { label: "Below average rating", pts: 20 },
    currentLead.googleReviewCount < 20 && { label: "Very few reviews", pts: 15 },
    { label: "Active Google Maps listing", pts: 10 },
  ].filter(Boolean) as { label: string; pts: number }[];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 animate-in fade-in"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl overflow-y-auto max-h-[90vh] rounded-2xl bg-card border border-border animate-in zoom-in-95 text-foreground shadow-xl"
      >
        <div className="flex items-start justify-between border-b border-border p-6">
          <div>
            <h3 className="font-display text-xl font-bold text-foreground">
              {currentLead.businessName}
            </h3>
            <p className="text-sm text-muted-foreground">
              {currentLead.businessType} · {currentLead.city}, {currentLead.country}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 hover:bg-accent text-muted-foreground hover:text-foreground transition cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex border-b border-border px-6 select-none bg-muted/30">
          <button
            onClick={() => setActiveTab("overview")}
            className={cn(
              "px-4 py-3 text-xs font-semibold uppercase tracking-wider border-b-2 -mb-px transition cursor-pointer",
              activeTab === "overview"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            Overview & Outreach
          </button>
          <button
            onClick={() => {
              setActiveTab("seo");
              handleLoadSeo();
            }}
            className={cn(
              "px-4 py-3 text-xs font-semibold uppercase tracking-wider border-b-2 -mb-px transition cursor-pointer flex items-center gap-1.5",
              activeTab === "seo"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-500 animate-pulse" /> SEO & Keywords
          </button>
        </div>

        {activeTab === "overview" ? (
          <div className="space-y-5 p-6">
            {currentLead.claimStatus && (
              <div className={cn(
                "rounded-xl border p-4 flex items-start gap-3 text-sm",
                currentLead.claimStatus === 'won'
                  ? "bg-[#241238] border-purple-500/40 text-purple-200"
                  : currentLead.claimUserId === user?.id
                    ? "bg-[#0e2c20] border-emerald-500/40 text-emerald-200"
                    : "bg-[#2c1a0e] border-amber-500/40 text-amber-200"
              )}>
                <Shield className="h-5 w-5 shrink-0 mt-0.5 text-current" />
                <div>
                  <p className="font-semibold">
                    {currentLead.claimStatus === 'won'
                      ? currentLead.claimUserId === user?.id
                        ? "🎉 Your Active Client"
                        : "🔒 Active Client"
                      : currentLead.claimUserId === user?.id
                        ? "✓ Contacted by you recently"
                        : "⏳ Pitched Recently (Claimed)"
                    }
                  </p>
                  <p className="text-xs mt-0.5 opacity-90">
                    {currentLead.claimStatus === 'won'
                      ? currentLead.claimUserId === user?.id
                        ? "You marked this lead as a closed/won deal. Other specialists cannot pitch them."
                        : "Another freelancer has successfully closed a deal with this client. Outreach is disabled."
                      : currentLead.claimUserId === user?.id
                        ? `You initiated outreach to this lead ${getClaimTimeAgo(currentLead.claimUpdatedAt)}.`
                        : `Another freelancer initiated outreach to this lead ${getClaimTimeAgo(currentLead.claimUpdatedAt)}. Contact options are disabled for 30 days to avoid spam.`
                    }
                  </p>
                </div>
              </div>
            )}
            <div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold uppercase tracking-wide text-muted-foreground">
                  Opportunity Score
                </span>
                <OpportunityScore score={currentLead.opportunityScore} />
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full bg-primary"
                  style={{ width: `${currentLead.opportunityScore}%` }}
                />
              </div>
            </div>

            <div className="space-y-2 rounded-xl bg-background border border-border p-4 text-sm text-foreground">
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground/80 shrink-0" />{" "}
                {currentLead.fullAddress || ""}
              </p>
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-2 font-mono text-xs">
                  <Phone className="h-3.5 w-3.5 text-muted-foreground/80" />
                  {currentLead.phone ? (
                    isLocked ? (
                      <span className="text-slate-500 line-through font-mono text-xs" title="Outreach locked">
                        {maskPhone(currentLead.phone)}
                      </span>
                    ) : safetyPopupDismissed ? (
                      onQuickConnect ? (
                        <button
                          type="button"
                          onClick={() => {
                            onQuickConnect(currentLead, "whatsapp");
                            onClose();
                          }}
                          className="text-green-500 hover:text-green-400 font-semibold cursor-pointer text-left"
                        >
                          {currentLead.phone}
                        </button>
                      ) : (
                        currentLead.phone
                      )
                    ) : (
                      <span
                        onClick={() => handleContactAction(() => {})}
                        className="cursor-pointer text-muted-foreground hover:text-foreground"
                        title="Click to reveal details"
                      >
                        {maskPhone(currentLead.phone)}
                      </span>
                    )
                  ) : (
                    <span className="italic text-muted-foreground/75">Not listed</span>
                  )}
                </span>
                {currentLead.phone && (
                  <button
                    disabled={isLocked}
                    onClick={() => {
                      if (isLocked) return;
                      handleContactAction(() => {
                        navigator.clipboard?.writeText(currentLead.phone);
                        toast.success("Copied phone number!");
                      });
                    }}
                    className={cn(
                      "inline-flex items-center gap-1 rounded-md border border-border bg-muted px-2 py-0.5 text-[10px] text-foreground transition",
                      isLocked ? "opacity-50 cursor-not-allowed" : "hover:bg-accent cursor-pointer"
                    )}
                  >
                    <Copy className="h-2.5 w-2.5" /> Copy
                  </button>
                )}
              </div>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground/80 shrink-0" />{" "}
                  {currentLead.email ? (
                    isLocked ? (
                      <span className="text-muted-foreground line-through font-mono text-xs" title="Outreach locked">
                        {maskEmail(currentLead.email)}
                      </span>
                    ) : safetyPopupDismissed ? (
                      <a
                        href={`mailto:${currentLead.email}`}
                        className="text-primary hover:underline font-mono text-xs font-semibold"
                      >
                        {currentLead.email}
                      </a>
                    ) : (
                      <span
                        onClick={() => handleContactAction(() => {})}
                        className="cursor-pointer text-muted-foreground hover:text-foreground font-mono text-xs"
                        title="Click to reveal details"
                      >
                        {maskEmail(currentLead.email)}
                      </span>
                    )
                  ) : enriching ? (
                    <span className="text-primary animate-pulse flex items-center gap-1.5 font-mono text-xs">
                      <Loader2 className="h-3 w-3 animate-spin text-primary" />
                      Auto-crawling website for email...
                    </span>
                  ) : (
                    <span className="italic text-muted-foreground/75">Not publicly listed</span>
                  )}
                </div>
                {currentLead.email && (
                  <button
                    disabled={isLocked}
                    onClick={() => {
                      if (isLocked) return;
                      handleContactAction(() => {
                        navigator.clipboard?.writeText(currentLead.email || "");
                        toast.success("Copied email address!");
                      });
                    }}
                    className={cn(
                      "inline-flex items-center gap-1 rounded-md border border-border bg-muted px-2 py-0.5 text-[10px] text-foreground transition",
                      isLocked ? "opacity-50 cursor-not-allowed" : "hover:bg-accent cursor-pointer"
                    )}
                  >
                    <Copy className="h-2.5 w-2.5" /> Copy
                  </button>
                )}
                {!currentLead.email && currentLead.websiteUrl && (
                  <button
                    onClick={handleEnrich}
                    disabled={enriching || isLocked}
                    className="inline-flex items-center gap-1 rounded-md border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] text-primary hover:bg-primary/20 disabled:opacity-50 transition cursor-pointer"
                  >
                    {enriching ? <Loader2 className="h-2.5 w-2.5 animate-spin" /> : "⚡ Find Email"}
                  </button>
                )}
              </div>
              <p className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-muted-foreground/80 shrink-0" />{" "}
                {currentLead.websiteUrl ? (
                  <a
                    href={currentLead.websiteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary hover:underline text-xs truncate"
                  >
                    {currentLead.websiteUrl}
                  </a>
                ) : (
                  <span className="italic text-muted-foreground/75">No website</span>
                )}
              </p>
              <p className="flex items-center gap-2">
                <Star className="h-4 w-4 fill-amber-500 text-amber-500 shrink-0" />{" "}
                <span className="font-semibold">{currentLead.googleRating}</span> · {currentLead.googleReviewCount} reviews
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Opportunity Breakdown
              </p>
              <ul className="mt-2 space-y-1.5 text-sm">
                {reasons.map((r) => (
                  <li
                    key={r.label}
                    className="flex items-center justify-between rounded-md bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 text-emerald-700 dark:text-emerald-300"
                  >
                    <span className="inline-flex items-center gap-2">
                      <Check className="h-4 w-4" /> {r.label}
                    </span>
                    <span className="font-mono text-xs font-semibold">+{r.pts} pts</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* GMB Opportunity Signals */}
            {currentLead.score_breakdown?.gmb_gaps?.length > 0 && (
              <div className="border-t border-border pt-4 animate-in fade-in duration-200">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2 flex items-center gap-1.5">
                  <span>📍 Google My Business Gaps</span>
                  <span className="rounded-full bg-amber-500/15 px-1.5 py-0.5 text-[9px] font-bold text-amber-500 border border-amber-500/25">
                    {currentLead.score_breakdown.gmb_gaps.length} detected
                  </span>
                </p>
                <div className="space-y-2">
                  {currentLead.score_breakdown.gmb_gaps.map((gap: string, index: number) => {
                    let pitchTip = "Highlight this gap as a quick-win optimization you can handle for them.";
                    if (gap.includes("photos")) {
                      pitchTip = "Pitch a photographic styling session or stock collection package to increase GMB visibility.";
                    } else if (gap.includes("description")) {
                      pitchTip = "Suggest writing an SEO-optimized business biography to rank higher in local search.";
                    } else if (gap.includes("reviews")) {
                      pitchTip = "Offer a review generation campaign to boost local reputation and rankings.";
                    } else if (gap.includes("website")) {
                      pitchTip = "No website linked means lost traffic. Pitch a landing page or professional site design.";
                    } else if (gap.includes("rating")) {
                      pitchTip = "Low rating hurts trust. Pitch reputation management and automated feedback forms.";
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
                      View GMB Optimization Guide & Outreach Script &rarr;
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* AI Outreach Sandbox inside Detail Modal */}
            <div className="border-t border-border pt-4">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-400 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-primary" /> AI Personalized Pitch
              </h4>

              {outreachDraft ? (
                <div className="mt-3 space-y-2">
                  <OutreachPreview
                    channel={selectedChannel === "whatsapp" ? "whatsapp" : selectedChannel === "linkedin" ? "linkedin" : selectedChannel === "phone_script" ? "phone_script" : selectedChannel === "letter" ? "letter" : "email"}
                    value={outreachDraft}
                    onChange={(val) => setOutreachDraft(val)}
                    senderName={user?.fullName || "Freelancer"}
                    businessName={currentLead.businessName}
                    businessEmail={currentLead.email || "info@business.com"}
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-500">{provider}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setOutreachDraft("")}
                        className="rounded-lg border border-border bg-muted px-3 py-1 text-xs text-foreground hover:bg-accent cursor-pointer transition"
                      >
                        Edit Settings
                      </button>
                      <button
                        onClick={copyDraft}
                        className="rounded-lg bg-primary px-3 py-1 text-xs font-semibold text-white hover:bg-primary/90 cursor-pointer"
                      >
                        Copy Pitch
                      </button>
                      {(selectedChannel === "whatsapp" || selectedChannel === "email" || selectedChannel === "linkedin") && (
                        <button
                          disabled={isLocked}
                          onClick={() => {
                            if (isLocked) return;
                            if (onQuickConnect) {
                              onQuickConnect(currentLead, selectedChannel as any, outreachDraft);
                              onClose();
                            }
                          }}
                          className={cn(
                            "rounded-lg px-3 py-1 text-xs font-semibold text-white flex items-center gap-1 transition",
                            isLocked ? "bg-muted text-muted-foreground cursor-not-allowed" : "cursor-pointer",
                            !isLocked && (selectedChannel === "whatsapp"
                              ? "bg-emerald-600 hover:bg-emerald-700"
                              : selectedChannel === "linkedin"
                                ? "bg-[#0A66C2] hover:bg-[#084e96]"
                                : "bg-primary hover:brightness-110")
                          )}
                        >
                          {isLocked ? "🔒 Closed" : `Send via ${selectedChannel === "whatsapp" ? "WhatsApp" : selectedChannel === "linkedin" ? "LinkedIn" : "Email"}`}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-3 rounded-xl border border-border bg-muted/40 p-3.5 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-3 bg-card border border-border p-2 rounded-lg">
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-muted-foreground font-medium">Channel:</span>
                      <select
                        value={selectedChannel}
                        onChange={(e) => setSelectedChannel(e.target.value as any)}
                        className="bg-background text-foreground text-xs border border-border rounded px-1.5 py-0.5 focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                      >
                        <option value="email" className="bg-background text-foreground">Email</option>
                        <option value="linkedin" className="bg-background text-foreground">LinkedIn DM</option>
                        <option value="whatsapp" className="bg-background text-foreground">WhatsApp Message</option>
                        <option value="phone_script" className="bg-background text-foreground">Phone Script</option>
                        {["african_food_export", "restaurant_supplier", "product_export", "b2b_trade", "human_capital", "training_recruitment"].includes(currentLead.industry || "") && (
                          <option value="letter" className="bg-background text-foreground">Physical Letter</option>
                        )}
                      </select>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-muted-foreground font-medium">Tone:</span>
                      <select
                        value={selectedTone}
                        onChange={(e) => setSelectedTone(e.target.value as any)}
                        className="bg-background text-foreground text-xs border border-border rounded px-1.5 py-0.5 focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                      >
                        <option value="professional" className="bg-background text-foreground">Professional</option>
                        <option value="casual" className="bg-background text-foreground">Casual</option>
                        <option value="bold" className="bg-background text-foreground">Bold/Direct</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-muted-foreground font-medium">Language:</span>
                      <select
                        value={selectedLanguage}
                        onChange={(e) => setSelectedLanguage(e.target.value)}
                        className="bg-background text-foreground text-xs border border-border rounded px-1.5 py-0.5 focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                      >
                        <option value="English" className="bg-background text-foreground">English</option>
                        <option value="French" className="bg-background text-foreground">French</option>
                        <option value="German" className="bg-background text-foreground">German</option>
                        <option value="Spanish" className="bg-background text-foreground">Spanish</option>
                        <option value="Portuguese" className="bg-background text-foreground">Portuguese</option>
                        <option value="Arabic" className="bg-background text-foreground">Arabic</option>
                        <option value="Japanese" className="bg-background text-foreground">Japanese</option>
                        <option value="Chinese" className="bg-background text-foreground">Chinese</option>
                      </select>
                    </div>
                  </div>
                  <button
                    onClick={handleGenerate}
                    disabled={generating || isLocked}
                    className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-primary hover:bg-primary/95 py-2 text-xs font-semibold text-white cursor-pointer transition disabled:opacity-40"
                  >
                    {generating ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        Generating Pitch...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-3.5 w-3.5" />
                        Write Outreach Message
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-2 border-t border-border">
              <button
                onClick={() => {
                  if (isLocked) return;
                  saveLead(currentLead);
                  toast.success("Saved to pipeline");
                }}
                disabled={savedIds.has(currentLead.id) || isLocked}
                className="flex-1 rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 cursor-pointer"
              >
                {isLocked ? "🔒 Locked" : savedIds.has(currentLead.id) ? "✓ Saved in CRM" : "Save to Pipeline"}
              </button>
              <button
                type="button"
                onClick={() => setLeadReportModalOpen(true)}
                className="rounded-lg border border-destructive/30 text-destructive bg-destructive/10 px-4 py-2.5 text-sm font-semibold hover:bg-destructive/20 cursor-pointer transition"
              >
                Report ⚑
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-5 p-6 animate-fade-in">
            {seoLoading ? (
              <div className="space-y-4 py-6">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-14 w-full" />
                </div>
                <div className="space-y-3 pt-4">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                </div>
              </div>
            ) : seoData ? (
              <>
                {/* Outreach Hook Section */}
                <div className="rounded-xl border border-primary/25 bg-primary/5 p-4 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-semibold uppercase tracking-wide text-primary flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-amber-500 animate-pulse" /> Outreach SEO
                      Hook
                    </h4>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(seoData.hook);
                        toast.success("Copied outreach hook!");
                      }}
                      className="inline-flex items-center gap-1 rounded-md border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] text-primary hover:bg-primary/20 transition cursor-pointer"
                    >
                      <Copy className="h-2.5 w-2.5" /> Copy Hook
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed italic font-medium">"{seoData.hook}"</p>
                </div>

                {/* Keywords Table */}
                <div className="space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Target Local Keywords
                  </p>
                  <div className="rounded-xl border border-border bg-card overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-muted/80 text-muted-foreground uppercase tracking-wide text-[10px] border-b border-border">
                        <tr>
                          <th className="px-4 py-2.5">Keyword</th>
                          <th className="px-4 py-2.5 text-center">Volume</th>
                          <th className="px-4 py-2.5 text-center">Difficulty</th>
                          <th className="px-4 py-2.5 text-right">Est. Rank</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border text-foreground">
                        {seoData.keywords.map((kw: any) => {
                          let diffColor =
                            "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
                          if (kw.difficulty > 50)
                            diffColor = "bg-rose-500/10 text-rose-400 border border-rose-500/20";
                          else if (kw.difficulty > 30)
                            diffColor = "bg-amber-500/10 text-amber-400 border border-amber-500/20";

                          let rankContent = (
                            <span className="font-semibold text-emerald-400 font-mono">
                              #{kw.rank}
                            </span>
                          );
                          if (kw.rank > 100)
                            rankContent = <span className="text-slate-500 italic">No Site</span>;
                          else if (kw.rank > 30)
                            rankContent = (
                              <span className="font-semibold text-rose-400 font-mono">
                                #{kw.rank}
                              </span>
                            );
                          else if (kw.rank > 10)
                            rankContent = (
                              <span className="font-semibold text-amber-400 font-mono">
                                #{kw.rank}
                              </span>
                            );

                          return (
                            <tr key={kw.keyword} className="hover:bg-muted/30 transition">
                              <td className="px-4 py-3 font-mono text-[11px] font-semibold text-foreground">
                                {kw.keyword}
                              </td>
                              <td className="px-4 py-3 text-center">
                                <div className="flex flex-col items-center gap-1">
                                  <span className="font-mono font-semibold">{kw.volume}</span>
                                  <div className="w-12 h-1 rounded-full bg-muted overflow-hidden">
                                    <div
                                      className="h-full bg-primary"
                                      style={{
                                        width: `${Math.min(100, (kw.volume / 1500) * 100)}%`,
                                      }}
                                    />
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-center">
                                <span
                                  className={cn(
                                    "px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold",
                                    diffColor,
                                  )}
                                >
                                  {kw.difficulty}%
                                </span>
                              </td>
                              <td className="px-4 py-3 text-right">{rankContent}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-xs text-muted-foreground font-mono">Failed to load SEO data.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Safety Reminder Modal */}
      {safetyReminderOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200 text-left">
            <div className="flex items-center gap-2 text-amber-500 mb-4">
              <Shield className="h-6 w-6" />
              <h3 className="text-lg font-bold text-foreground">First-Contact Safety Guidelines</h3>
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              Please review our safety checklists before reaching out to this contact:
            </p>
            <ul className="space-y-2.5 text-xs text-muted-foreground mb-6">
              <li className="flex items-start gap-2">
                <span className="text-amber-500 mt-0.5">⚠️</span>
                <span><strong>No Upfront Payments:</strong> Never pay fees to secure a job or project. Authentic clients will not charge you.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 mt-0.5">🔍</span>
                <span><strong>Verify Legitimacy:</strong> Check the business registry or official website before agreeing to terms.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 mt-0.5">💳</span>
                <span><strong>Secure Transactions:</strong> Use verified payment channels or contract escrow systems to protect your earnings.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 mt-0.5">💬</span>
                <span><strong>Watch for Scams:</strong> Be cautious if a client immediately redirects you to private communication apps to bypass platform logs.</span>
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
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
              You are reporting the lead <strong>{currentLead.businessName}</strong>. Please provide details to help our moderation team review this business.
            </p>
            <form onSubmit={handleSubmitLeadReport} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Reason for Report
                </label>
                <select
                  value={leadReportReason}
                  onChange={(e) => setLeadReportReason(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-mono text-foreground focus:border-primary focus:outline-none cursor-pointer animate-none"
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
                  className="w-full rounded-xl border border-border bg-background p-3 text-xs font-mono text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none"
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
                  className="rounded-xl bg-red-500 hover:bg-red-600 text-white px-4 py-2 text-xs font-semibold shadow-md transition flex items-center gap-1 disabled:opacity-50 cursor-pointer"
                >
                  {submittingLeadReport ? "Submitting..." : "Submit Report"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
