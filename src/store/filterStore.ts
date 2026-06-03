import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { SearchFilters } from "@/types";

interface FilterState {
  filters: SearchFilters;
  setFilters: (filters: Partial<SearchFilters>) => void;
  resetFilters: () => void;
}

const initialFilters: SearchFilters = {
  category: "web_dev",
  country: "Nigeria",
  city: "Lagos",
  hasWebsite: false,
  minScore: 0,
  minRating: null,
};

export const useFilterStore = create<FilterState>()(
  devtools(
    (set) => ({
      filters: initialFilters,
      setFilters: (newFilters) =>
        set((state) => ({ filters: { ...state.filters, ...newFilters } })),
      resetFilters: () => set({ filters: initialFilters }),
    }),
    { name: "filter-store" }
  )
);