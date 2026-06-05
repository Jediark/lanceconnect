import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Sparkles, TrendingUp, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface TrendingSearchesProps {
  onSelectSearch: (search: {
    category: string;
    country: string;
    city: string;
    product: string;
    niche: string;
  }) => void;
  className?: string;
}

interface TrendItem {
  label: string;
  query: {
    category: string;
    country: string;
    city: string;
    product: string;
    niche: string;
  };
  count: number;
}

const DEFAULT_TRENDS: TrendItem[] = [
  {
    label: "Web Developers in Lagos",
    query: { category: "web_dev", country: "Nigeria", city: "Lagos", product: "", niche: "" },
    count: 34,
  },
  {
    label: "African Palm Oil Supplier UK",
    query: { category: "african_food_export", country: "United Kingdom", city: "London", product: "palm oil", niche: "importer" },
    count: 28,
  },
  {
    label: "SEO Specialists in New York",
    query: { category: "seo", country: "United States", city: "New York", product: "", niche: "" },
    count: 19,
  },
  {
    label: "Math Tutors in Toronto",
    query: { category: "tutor", country: "Canada", city: "Toronto", product: "", niche: "" },
    count: 15,
  },
  {
    label: "B2B Trade Suppliers in Mumbai",
    query: { category: "b2b_trade", country: "India", city: "Mumbai", product: "", niche: "" },
    count: 12,
  },
];

export function TrendingSearches({ onSelectSearch, className }: TrendingSearchesProps) {
  const [trends, setTrends] = useState<TrendItem[]>(DEFAULT_TRENDS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTrends() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("search_intelligence")
          .select("category, country, city, product, search_query")
          .order("created_at", { ascending: false })
          .limit(100);

        if (error) throw error;

        if (data && data.length > 5) {
          // Group and count occurrences
          const counts: Record<string, { count: number; raw: typeof data[0] }> = {};
          
          data.forEach((item) => {
            if (!item.search_query) return;
            const key = `${item.category || ""}-${item.country || ""}-${item.city || ""}-${item.product || ""}`;
            if (!counts[key]) {
              counts[key] = { count: 0, raw: item };
            }
            counts[key].count += 1;
          });

          // Convert to TrendItem array and sort
          const sortedTrends = Object.entries(counts)
            .map(([_, val]) => {
              const r = val.raw;
              // Build a user friendly label
              let label = r.search_query;
              if (r.city && r.country) {
                label = `${r.search_query} in ${r.city}, ${r.country}`;
              } else if (r.country) {
                label = `${r.search_query} in ${r.country}`;
              }
              
              return {
                label: label.charAt(0).toUpperCase() + label.slice(1),
                query: {
                  category: r.category || "",
                  country: r.country || "",
                  city: r.city || "",
                  product: r.product || "",
                  niche: r.search_query || "",
                },
                count: val.count,
              };
            })
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

          if (sortedTrends.length > 2) {
            setTrends(sortedTrends);
          }
        }
      } catch (err) {
        console.warn("Failed to fetch search intelligence trends, using defaults:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchTrends();
  }, []);

  return (
    <div className={cn("rounded-2xl border border-border bg-card/40 p-4 backdrop-blur-md shadow-sm transition-all hover:shadow-md", className)}>
      <div className="flex items-center gap-2 mb-3">
        <TrendingUp className="h-4 w-4 text-primary animate-pulse" />
        <h3 className="text-sm font-semibold tracking-tight text-foreground flex items-center gap-1.5">
          Trending Searches
          <Sparkles className="h-3.5 w-3.5 text-yellow-500" />
        </h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {trends.map((trend, idx) => (
          <button
            key={idx}
            onClick={() => onSelectSearch(trend.query)}
            className="group inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/30 px-3 py-1 text-xs font-medium text-muted-foreground transition-all duration-300 hover:border-primary/50 hover:bg-primary/10 hover:text-primary hover:shadow-sm"
          >
            <Search className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-colors" />
            <span>{trend.label}</span>
            <span className="ml-1 rounded-full bg-muted/60 px-1.5 py-0.5 text-[10px] text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary transition-colors">
              {trend.count}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
