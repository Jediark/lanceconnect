import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export interface GlobalStats {
  lifetimeSearches: number;
  lifetimeLeads: number;
  lifetimeCountries: number;
  leadsToday: number;
  citiesToday: number;
}

interface StatsContextType {
  stats: GlobalStats;
  loading: boolean;
  refreshStats: () => Promise<void>;
}

const StatsContext = createContext<StatsContextType | undefined>(undefined);

// Simple deterministic pseudo-random number generator (LCG)
const lcg = (seed: number) => {
  const a = 1664525;
  const c = 1013904223;
  const m = Math.pow(2, 32);
  return (a * seed + c) % m;
};

export function StatsProvider({ children }: { children: React.ReactNode }) {
  // Compute deterministic daily activity mock values based on date seed
  const todayDate = new Date();
  const dateSeed = todayDate.getFullYear() * 10000 + (todayDate.getMonth() + 1) * 100 + todayDate.getDate();
  
  const rand1 = lcg(dateSeed);
  const rand2 = lcg(rand1);

  const mockCitiesToday = (rand1 % 6) + 3; // 3 to 8 cities checked today
  const mockLeadsToday = mockCitiesToday * 10 + (rand2 % 20) + 15; // 45 to 99 leads indexed today

  const BASELINE_LEADS = 12480;
  const BASELINE_SEARCHES = 1450;
  const BASELINE_COUNTRIES = 150;

  const [stats, setStats] = useState<GlobalStats>({
    lifetimeSearches: BASELINE_SEARCHES,
    lifetimeLeads: BASELINE_LEADS,
    lifetimeCountries: BASELINE_COUNTRIES,
    leadsToday: mockLeadsToday,
    citiesToday: mockCitiesToday,
  });
  const [loading, setLoading] = useState(true);

  async function fetchStats() {
    try {
      const todayStr = todayDate.toISOString().split("T")[0];

      // 1. Total leads in DB
      const { count: dbTotalLeads } = await supabase
        .from("leads")
        .select("*", { count: "exact", head: true });

      // 2. Today's leads in DB
      const { count: dbTodayLeads } = await supabase
        .from("leads")
        .select("*", { count: "exact", head: true })
        .gte("created_at", todayStr);

      // 3. Unique cities checked today (from leads created today)
      const { data: dbTodayLeadsCities } = await supabase
        .from("leads")
        .select("city")
        .gte("created_at", todayStr);

      const dbTodayCitiesCount = dbTodayLeadsCities
        ? new Set(dbTodayLeadsCities.map((l) => l.city).filter(Boolean)).size
        : 0;

      // 4. Total searches in DB
      const { count: dbTotalSearches } = await supabase
        .from("search_history")
        .select("*", { count: "exact", head: true });

      const realTotalLeads = dbTotalLeads || 0;
      const realLeadsToday = dbTodayLeads || 0;
      const realTotalSearches = dbTotalSearches || 0;

      setStats({
        lifetimeSearches: BASELINE_SEARCHES + realTotalSearches,
        lifetimeLeads: BASELINE_LEADS + realTotalLeads,
        lifetimeCountries: BASELINE_COUNTRIES,
        leadsToday: mockLeadsToday + realLeadsToday,
        citiesToday: mockCitiesToday + dbTodayCitiesCount,
      });
    } catch (err) {
      console.error("Failed to load global stats from database:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <StatsContext.Provider value={{ stats, loading, refreshStats: fetchStats }}>
      {children}
    </StatsContext.Provider>
  );
}

export function useStats() {
  const context = useContext(StatsContext);
  if (context === undefined) {
    throw new Error("useStats must be used within a StatsProvider");
  }
  return context;
}
