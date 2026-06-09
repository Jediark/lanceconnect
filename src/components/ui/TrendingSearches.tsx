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
    label: "Dry cleaner in Lagos",
    query: { category: "local business", country: "Nigeria", city: "Lagos", product: "", niche: "dry cleaner" },
    count: 34,
  },
  {
    label: "Restaurant in London",
    query: { category: "restaurant_supplier", country: "United Kingdom", city: "London", product: "", niche: "restaurant" },
    count: 28,
  },
  {
    label: "Bakery in Seattle",
    query: { category: "local business", country: "United States", city: "Seattle", product: "", niche: "bakery" },
    count: 19,
  },
  {
    label: "Find clients in England",
    query: { category: "web_dev", country: "United Kingdom", city: "London", product: "", niche: "clients" },
    count: 22,
  },
];

export function TrendingSearches({ onSelectSearch, className }: TrendingSearchesProps) {
  const [trends, setTrends] = useState<TrendItem[]>(DEFAULT_TRENDS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Keeping this static for now to showcase the 3 specific interactive examples
    setLoading(false);
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
