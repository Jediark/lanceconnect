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
import { TrendingSearches } from "@/components/ui/TrendingSearches";
import { CATEGORIES, COUNTRIES, type Lead } from "@/data/mockData";
import { COUNTRY_CITIES } from "@/data/countriesData";
import { CATEGORY_TO_PLACES_QUERY } from "@/types";
import { usePipeline } from "@/contexts/PipelineContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

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
  const [website, setWebsite] = useState("");
  const [minScore, setMinScore] = useState(0);
  const [view, setView] = useState<"grid" | "table">("grid");
  const [sort, setSort] = useState<"score" | "rating">("score");
  const [detail, setDetail] = useState<Lead | null>(null);
  const [results, setResults] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState("");
  const [selectedNiche, setSelectedNiche] = useState("");
  const [onlineJobs, setOnlineJobs] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"local" | "online">("local");
  const [loadingOnline, setLoadingOnline] = useState(false);

  const suggestedCities = COUNTRY_CITIES[country] || [];

  useEffect(() => {
    if (user) {
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
  }, [user]);


  useEffect(() => {
    if (user) {
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
            }));
            setResults(mapped);
          }
        });
    } else {
      setResults([]);
    }
  }, [user]);

  const handleSearch = async (searchParams?: { category: string; country: string; city: string; product: string; niche: string }) => {
    const queryTerm = searchParams ? searchParams.category : (category || "local business");
    const countryName = searchParams ? searchParams.country : (country || "Nigeria");
    const cityName = searchParams ? searchParams.city : city;
    const productTerm = searchParams ? searchParams.product : product;
    const nicheTerm = searchParams ? searchParams.niche : selectedNiche;

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
          if (data.error === "LIMIT_REACHED") {
            toast.error("Search limit reached! Please upgrade your plan to get more leads.", {
              action: {
                label: "Upgrade Plan",
                onClick: () => {
                  window.location.href = "/app/upgrade";
                },
              },
            });
            return [];
          }
          throw new Error(data.error || "Failed to search leads");
        }
        return data?.leads || [];
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

      const [rawLeads, rawJobs] = await Promise.all([
        searchLeadsPromise,
        searchOnlinePromise,
      ]);

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
        facebookUrl: dbLead.facebook_url || null,
        instagramUrl: dbLead.instagram_url || null,
        hasLinkedin: dbLead.has_linkedin || false,
        linkedinUrl: dbLead.linkedin_url || null,
      }));

      setResults(mapped);
      setOnlineJobs(rawJobs);

      if (mapped.length > 0) {
        toast.success(`Found ${mapped.length} leads in ${city}!`);
      }
      if (rawJobs.length > 0) {
        toast.success(`Found ${rawJobs.length} online opportunities!`);
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Search temporarily unavailable — please try again in a moment.");
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

      <div className="border-b border-border bg-card/60 px-4 py-3 lg:px-8">
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
            onChange={(e) => setCountry(e.target.value)}
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
            onClick={handleSearch}
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

      {ONLINE_ELIGIBLE.includes(category) && (
        <div className="px-4 lg:px-8 mb-2">
          <div className="inline-flex gap-1 border border-border bg-card/50 p-1 rounded-xl backdrop-blur-sm shadow-sm">
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

      {activeTab === "local" ? (
        <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-4 lg:px-8">
          <div className="flex items-center gap-3">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{filteredResults.length}</span>{" "}
              leads
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
                  <LeadCard lead={l} onOpenDetail={setDetail} />
                </div>
              ))}
            </div>
          ) : (
            <LeadTable leads={filteredResults} onOpenDetail={setDetail} />
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

      {detail && <LeadDetailModal lead={detail} onClose={() => setDetail(null)} />}
    </>
  );
}

function LeadTable({ leads, onOpenDetail }: { leads: Lead[]; onOpenDetail: (l: Lead) => void }) {
  const { saveLead, savedIds } = usePipeline();
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
          {leads.map((l) => (
            <tr
              key={l.id}
              className="cursor-pointer hover:bg-primary/5"
              onClick={() => onOpenDetail(l)}
            >
              <td className="px-4 py-3 font-medium">
                {l.businessName}
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
              <td className="px-4 py-3 font-mono-data text-xs">{l.phone}</td>
              <td className="px-4 py-3 text-amber-600">
                <span className="inline-flex items-center gap-1">
                  <Star className="h-3 w-3 fill-current" /> {l.googleRating}
                </span>
              </td>
              <td className="px-4 py-3 text-right">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    saveLead(l);
                    toast.success("Saved to pipeline");
                  }}
                  disabled={savedIds.has(l.id)}
                  className="rounded-md bg-primary/10 px-2 py-1 text-xs font-semibold text-primary hover:bg-primary/20 disabled:opacity-50 cursor-pointer"
                >
                  {savedIds.has(l.id) ? "Saved" : "Save"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function LeadDetailModal({ lead, onClose }: { lead: Lead; onClose: () => void }) {
  const { user } = useAuth();
  const { saveLead, savedIds } = usePipeline();

  const [currentLead, setCurrentLead] = useState<Lead>(lead);
  const [enriching, setEnriching] = useState(false);
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
    if (!currentLead.websiteUrl) return;
    setEnriching(true);
    toast.info("Scraping website for verified contact email...");
    try {
      const { data, error } = await supabase.functions.invoke("enrich-contact", {
        body: { leadId: currentLead.id },
      });
      if (error) throw error;
      if (data?.lead?.email) {
        setCurrentLead((prev) => ({ ...prev, email: data.lead.email }));
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-in fade-in"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl overflow-y-auto max-h-[90vh] rounded-2xl bg-card border border-border animate-in zoom-in-95"
      >
        <div className="flex items-start justify-between border-b border-border p-6">
          <div>
            <h3 className="font-display text-xl font-bold text-white">
              {currentLead.businessName}
            </h3>
            <p className="text-sm text-slate-400">
              {currentLead.businessType} · {currentLead.city}, {currentLead.country}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 hover:bg-accent text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex border-b border-border px-6 select-none bg-[#0e1322]">
          <button
            onClick={() => setActiveTab("overview")}
            className={cn(
              "px-4 py-3 text-xs font-semibold uppercase tracking-wider border-b-2 -mb-px transition cursor-pointer",
              activeTab === "overview"
                ? "border-primary text-primary"
                : "border-transparent text-slate-400 hover:text-slate-200",
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
                : "border-transparent text-slate-400 hover:text-slate-200",
            )}
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-500 animate-pulse" /> SEO & Keywords
          </button>
        </div>

        {activeTab === "overview" ? (
          <div className="space-y-5 p-6">
            <div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold uppercase tracking-wide text-slate-400">
                  Opportunity Score
                </span>
                <OpportunityScore score={currentLead.opportunityScore} />
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full bg-primary"
                  style={{ width: `${currentLead.opportunityScore}%` }}
                />
              </div>
            </div>

            <div className="space-y-2 rounded-xl bg-background border border-border p-4 text-sm text-slate-300">
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-slate-500 shrink-0" />{" "}
                {currentLead.fullAddress || ""}
              </p>
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-2 font-mono text-xs">
                  <Phone className="h-3.5 w-3.5 text-slate-500" /> {currentLead.phone}
                </span>
                {currentLead.phone && (
                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText(currentLead.phone);
                      toast.success("Copied!");
                    }}
                    className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-2 py-0.5 text-[10px] text-white hover:bg-accent cursor-pointer"
                  >
                    <Copy className="h-2.5 w-2.5" /> Copy
                  </button>
                )}
              </div>
              <div className="flex items-center justify-between gap-2">
                <p className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-slate-500 shrink-0" />{" "}
                  {currentLead.email ?? (
                    <span className="italic text-slate-500">Not publicly listed</span>
                  )}
                </p>
                {!currentLead.email && currentLead.websiteUrl && (
                  <button
                    onClick={handleEnrich}
                    disabled={enriching}
                    className="inline-flex items-center gap-1 rounded-md border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] text-primary hover:bg-primary/20 disabled:opacity-50 transition cursor-pointer"
                  >
                    {enriching ? <Loader2 className="h-2.5 w-2.5 animate-spin" /> : "⚡ Find Email"}
                  </button>
                )}
              </div>
              <p className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-slate-500 shrink-0" />{" "}
                {currentLead.websiteUrl ?? (
                  <span className="italic text-slate-500">No website</span>
                )}
              </p>
              <p className="flex items-center gap-2">
                <Star className="h-4 w-4 fill-amber-500 text-amber-500 shrink-0" />{" "}
                {currentLead.googleRating} · {currentLead.googleReviewCount} reviews
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Opportunity Breakdown
              </p>
              <ul className="mt-2 space-y-1.5 text-sm">
                {reasons.map((r) => (
                  <li
                    key={r.label}
                    className="flex items-center justify-between rounded-md bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 text-emerald-400"
                  >
                    <span className="inline-flex items-center gap-2">
                      <Check className="h-4 w-4" /> {r.label}
                    </span>
                    <span className="font-mono text-xs font-semibold">+{r.pts} pts</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* AI Outreach Sandbox inside Detail Modal */}
            <div className="border-t border-border pt-4">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-400 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-primary" /> AI Personalized Pitch
              </h4>

              {outreachDraft ? (
                <div className="mt-3 space-y-2">
                  <textarea
                    value={outreachDraft}
                    onChange={(e) => setOutreachDraft(e.target.value)}
                    className="w-full h-36 rounded-lg border border-border bg-background p-3 text-xs font-sans text-slate-300 focus:outline-none focus:border-primary"
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-500">{provider}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setOutreachDraft("")}
                        className="rounded-lg border border-border bg-card px-3 py-1 text-xs text-slate-300 hover:text-white cursor-pointer"
                      >
                        Edit Settings
                      </button>
                      <button
                        onClick={copyDraft}
                        className="rounded-lg bg-primary px-3 py-1 text-xs font-semibold text-white hover:bg-primary/90 cursor-pointer"
                      >
                        Copy Pitch
                      </button>
                      {selectedChannel === "whatsapp" && currentLead.phone && (
                        <a
                          href={`https://wa.me/${currentLead.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(outreachDraft)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-lg bg-emerald-600 px-3 py-1 text-xs font-semibold text-white hover:bg-emerald-700 flex items-center gap-1 cursor-pointer transition"
                        >
                          Send via WhatsApp
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-3 rounded-xl border border-border bg-background p-3.5 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0d1222] p-2 rounded-lg">
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-slate-400 font-medium">Channel:</span>
                      <select
                        value={selectedChannel}
                        onChange={(e) => setSelectedChannel(e.target.value as any)}
                        className="bg-card text-xs border border-border rounded px-1.5 py-0.5 text-white focus:outline-none focus:ring-1 focus:ring-primary"
                      >
                        <option value="email">Email</option>
                        <option value="linkedin">LinkedIn DM</option>
                        <option value="whatsapp">WhatsApp Message</option>
                        <option value="phone_script">Phone Script</option>
                        {["african_food_export", "restaurant_supplier", "product_export", "b2b_trade", "human_capital", "training_recruitment"].includes(currentLead.industry || "") && (
                          <option value="letter">Physical Letter</option>
                        )}
                      </select>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-slate-400 font-medium">Tone:</span>
                      <select
                        value={selectedTone}
                        onChange={(e) => setSelectedTone(e.target.value as any)}
                        className="bg-card text-xs border border-border rounded px-1.5 py-0.5 text-white focus:outline-none focus:ring-1 focus:ring-primary"
                      >
                        <option value="professional">Professional</option>
                        <option value="casual">Casual</option>
                        <option value="bold">Bold/Direct</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-slate-400 font-medium">Language:</span>
                      <select
                        value={selectedLanguage}
                        onChange={(e) => setSelectedLanguage(e.target.value)}
                        className="bg-card text-xs border border-border rounded px-1.5 py-0.5 text-white focus:outline-none focus:ring-1 focus:ring-primary"
                      >
                        <option value="English">English</option>
                        <option value="French">French</option>
                        <option value="German">German</option>
                        <option value="Spanish">Spanish</option>
                        <option value="Portuguese">Portuguese</option>
                        <option value="Arabic">Arabic</option>
                        <option value="Japanese">Japanese</option>
                        <option value="Chinese">Chinese</option>
                      </select>
                    </div>
                  </div>
                  <button
                    onClick={handleGenerate}
                    disabled={generating}
                    className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-primary/20 hover:bg-primary/30 border border-primary/45 py-2 text-xs font-semibold text-primary-foreground cursor-pointer transition"
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
                  saveLead(currentLead);
                  toast.success("Saved to pipeline");
                }}
                disabled={savedIds.has(currentLead.id)}
                className="flex-1 rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 cursor-pointer"
              >
                {savedIds.has(currentLead.id) ? "✓ Saved in CRM" : "Save to Pipeline"}
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
                <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-2.5">
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
                  <p className="text-xs text-slate-300 leading-relaxed italic">"{seoData.hook}"</p>
                </div>

                {/* Keywords Table */}
                <div className="space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Target Local Keywords
                  </p>
                  <div className="rounded-xl border border-border bg-background/50 overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-muted/30 text-slate-400 uppercase tracking-wide text-[10px] border-b border-border">
                        <tr>
                          <th className="px-4 py-2.5">Keyword</th>
                          <th className="px-4 py-2.5 text-center">Volume</th>
                          <th className="px-4 py-2.5 text-center">Difficulty</th>
                          <th className="px-4 py-2.5 text-right">Est. Rank</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/60 text-slate-300">
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
                            <tr key={kw.keyword} className="hover:bg-muted/10 transition">
                              <td className="px-4 py-3 font-mono text-[11px] font-semibold text-slate-200">
                                {kw.keyword}
                              </td>
                              <td className="px-4 py-3 text-center">
                                <div className="flex flex-col items-center gap-1">
                                  <span className="font-mono font-semibold">{kw.volume}</span>
                                  <div className="w-12 h-1 rounded-full bg-slate-800 overflow-hidden">
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
    </div>
  );
}
