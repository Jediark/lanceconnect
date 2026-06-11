import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useMemo, useRef } from "react";
import { MarketingShell, PageHeader } from "@/components/marketing/MarketingShell";
import { US_STATES } from "@/data/geography";
import InteractiveUSMap from "@/components/InteractiveUSMap";
import { Search, MapPin, Building2, Sparkles, ArrowRight, X } from "lucide-react";

export const Route = createFileRoute("/find-clients/united-states")({
  head: () => ({
    meta: [
      { title: "Find Freelance Clients in the United States — LanceConnect" },
      {
        name: "description",
        content: "Explore active local client leads and opportunities across all 50 US states and hundreds of cities.",
      },
      { property: "og:title", content: "USA Client Directory — LanceConnect" },
    ],
  }),
  component: USHub,
});

function USHub() {
  const [selectedState, setSelectedState] = useState<typeof US_STATES[number] | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredStateName, setHoveredStateName] = useState<string | null>(null);
  const [showMobileSheet, setShowMobileSheet] = useState(false);
  const [citySearchQuery, setCitySearchQuery] = useState("");
  const navigate = useNavigate();
  const stateSectionRef = useRef<HTMLDivElement>(null);

  // Filter states based on search query
  const filteredStates = useMemo(() => {
    if (!searchQuery) return US_STATES;
    const q = searchQuery.toLowerCase();
    return US_STATES.filter(
      (s) =>
        s.state.toLowerCase().includes(q) ||
        s.abbr.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const handleStateClick = (state: typeof US_STATES[number]) => {
    if (selectedState?.slug === state.slug) {
      setSelectedState(null);
      setShowMobileSheet(false);
    } else {
      setSelectedState(state);
      setCitySearchQuery(""); // Reset city search input
      
      // Determine if mobile view (< 640px)
      const isMobile = window.innerWidth < 640;
      if (isMobile) {
        setShowMobileSheet(true);
      } else {
        // Desktop: scroll down to state details
        setTimeout(() => {
          stateSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }, 100);
      }
    }
  };

  const handleCityClick = (citySlug: string) => {
    navigate({
      to: "/find-clients/$category",
      params: { category: citySlug },
    });
  };

  const popularUSCities = [
    { name: "New York", slug: "new-york" },
    { name: "Los Angeles", slug: "los-angeles" },
    { name: "Chicago", slug: "chicago" },
    { name: "Houston", slug: "houston" },
    { name: "Phoenix", slug: "phoenix" },
    { name: "Philadelphia", slug: "philadelphia" },
    { name: "San Antonio", slug: "san-antonio" },
    { name: "Dallas", slug: "dallas" },
  ];

  return (
    <MarketingShell>
      <PageHeader
        eyebrow="United States Directory"
        title="Find Freelance Clients in the United States"
        subtitle="The US has 33 million small businesses. Find the ones that need you — select a state or search cities to access verified active local B2B leads."
      />

      <section className="w-full bg-background text-foreground transition-colors duration-350 py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          
          {/* Header Description */}
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight font-display mb-4">
              Explore Leads by State
            </h2>
            <p className="text-muted-foreground">
              Click on the interactive map or select a state from the list to reveal local cities and scan for client opportunities.
            </p>
          </div>

          {/* Interactive Map & State Selector Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-20">
            {/* Left Column: Interactive Map (Hidden on Mobile) */}
            <div className="hidden lg:block lg:col-span-7 xl:col-span-8">
              <InteractiveUSMap
                selectedState={selectedState?.slug || null}
                onStateSelect={(slug) => {
                  const state = US_STATES.find((s) => s.slug === slug);
                  if (state) handleStateClick(state);
                }}
                hoveredState={hoveredStateName}
                setHoveredState={setHoveredStateName}
              />
            </div>

            {/* Right Column: Searchable State Grid */}
            <div className="col-span-1 lg:col-span-5 xl:col-span-4 bg-card border border-border dark:border-slate-800/80 rounded-3xl p-6 shadow-md">
              <h3 className="text-lg font-bold font-display mb-4 flex items-center gap-2">
                <Search className="h-4 w-4 text-primary" />
                Select a State
              </h3>

              {/* State Search Input */}
              <div className="relative mb-6">
                <input
                  type="text"
                  placeholder="Search states (e.g. California, TX)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-4 pr-10 py-3 rounded-xl border border-border bg-background text-sm text-foreground placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Grid List of States */}
              <div className="grid grid-cols-2 gap-2 max-h-[380px] overflow-y-auto pr-2 custom-scrollbar">
                {filteredStates.map((state) => {
                  const isSelected = selectedState?.slug === state.slug;
                  return (
                    <button
                      key={state.slug}
                      onClick={() => handleStateClick(state)}
                      className={`w-full text-left px-3 py-2.5 rounded-xl border text-sm font-medium transition-all flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? "bg-primary border-primary text-white shadow-md shadow-primary/20"
                          : "bg-background border-border text-slate-300 hover:border-primary/50 hover:bg-primary/5 dark:border-slate-800"
                      }`}
                    >
                      <span className="truncate">{state.state}</span>
                      <span className={`text-xs px-1.5 py-0.5 rounded font-mono ${
                        isSelected ? "bg-white/20 text-white" : "bg-muted text-slate-400"
                      }`}>
                        {state.abbr}
                      </span>
                    </button>
                  );
                })}
                {filteredStates.length === 0 && (
                  <p className="col-span-2 text-center text-sm text-muted-foreground py-6">
                    No states found matching "{searchQuery}"
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Desktop Inline State Cities Drill-down Section */}
          <div ref={stateSectionRef} className="scroll-mt-24 mb-20">
            {selectedState && (
              <div className="bg-card border border-primary/20 rounded-3xl p-8 shadow-lg relative overflow-hidden hidden sm:block">
                {/* Accent line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-secondary" />
                
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div>
                    <h3 className="text-2xl font-extrabold font-display flex items-center gap-2">
                      <span className="text-3xl">🏙️</span>
                      {selectedState.state} Cities
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Choose a city in {selectedState.state} to scan for business leads.
                    </p>
                  </div>
                  
                  {/* Inline State Cities Search */}
                  <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder={`Search other ${selectedState.state} cities...`}
                      value={citySearchQuery}
                      onChange={(e) => setCitySearchQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && citySearchQuery.trim()) {
                          const customCitySlug = citySearchQuery
                            .trim()
                            .toLowerCase()
                            .replace(/\s+/g, "-");
                          handleCityClick(customCitySlug);
                        }
                      }}
                      className="w-full pl-9 pr-4 py-2 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {selectedState.cities
                    .filter(c => c.replace(/-/g, " ").toLowerCase().includes(citySearchQuery.toLowerCase()))
                    .map((city) => (
                      <button
                        key={city}
                        onClick={() => handleCityClick(city)}
                        className="flex items-center gap-2 bg-background hover:bg-primary/5 border border-border dark:border-slate-800 hover:border-primary/40 rounded-2xl p-4 text-left transition-all group cursor-pointer"
                      >
                        <MapPin className="h-4 w-4 text-primary shrink-0 group-hover:scale-110 transition-transform" />
                        <span className="text-sm font-semibold capitalize truncate">
                          {city.replace(/-/g, " ")}
                        </span>
                      </button>
                    ))}
                  
                  {/* If user inputs custom search that doesn't match default list, offer it as a custom dynamic route button */}
                  {citySearchQuery.trim() && !selectedState.cities.some(c => c.replace(/-/g, " ").toLowerCase() === citySearchQuery.trim().toLowerCase()) && (
                    <button
                      onClick={() => handleCityClick(citySearchQuery.trim().toLowerCase().replace(/\s+/g, "-"))}
                      className="flex items-center justify-between col-span-2 bg-primary/10 border border-dashed border-primary/30 rounded-2xl p-4 text-left transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <Sparkles className="h-4 w-4 text-primary shrink-0 animate-pulse" />
                        <span className="text-sm font-semibold capitalize truncate text-primary">
                          Go to "{citySearchQuery}" Page
                        </span>
                      </div>
                      <ArrowRight className="h-4 w-4 text-primary group-hover:translate-x-1 transition-transform" />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Popular US Cities Quick Links Section */}
          <div className="bg-card border border-border dark:border-slate-800/80 rounded-3xl p-8 shadow-sm">
            <h3 className="text-xl font-extrabold font-display mb-6 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-secondary" />
              Popular US Client Hubs
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {popularUSCities.map((city) => (
                <button
                  key={city.slug}
                  onClick={() => handleCityClick(city.slug)}
                  className="flex items-center justify-between bg-background hover:bg-slate-50 dark:hover:bg-slate-900/40 border border-border dark:border-slate-800 rounded-2xl p-4 text-left transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-lg">🇺🇸</span>
                    <span className="text-sm font-bold truncate">{city.name}</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </button>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Mobile Bottom Sheet Overlay (< 640px) */}
      {showMobileSheet && selectedState && (
        <div className="fixed inset-0 z-50 sm:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => {
              setShowMobileSheet(false);
              setSelectedState(null);
            }}
          />
          {/* Bottom Sheet */}
          <div className="absolute bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 rounded-t-3xl p-6 pb-12 shadow-2xl max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom duration-300">
            <div className="w-12 h-1.5 bg-slate-700 rounded-full mx-auto mb-6" />
            
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold font-display text-white flex items-center gap-2">
                <span>🇺🇸</span>
                {selectedState.state} Cities
              </h3>
              <button
                onClick={() => {
                  setShowMobileSheet(false);
                  setSelectedState(null);
                }}
                className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-xs text-slate-400 mb-6 font-mono">
              // Choose a city to scan local B2B leads
            </p>

            {/* Mobile Sheet City List */}
            <div className="flex flex-col gap-2.5 mb-6">
              {selectedState.cities.map((city) => (
                <button
                  key={city}
                  onClick={() => {
                    handleCityClick(city);
                    setShowMobileSheet(false);
                  }}
                  className="w-full flex items-center gap-3 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/50 rounded-xl px-4 py-3 text-left text-white capitalize text-sm transition-all"
                >
                  <MapPin className="h-4 w-4 text-primary shrink-0" />
                  <span>{city.replace(/-/g, " ")}</span>
                </button>
              ))}
            </div>

            {/* Mobile State Cities Search Fallback */}
            <div className="border-t border-slate-800 pt-6">
              <label className="block text-xs font-semibold text-slate-400 mb-2 font-mono">
                // Search other {selectedState.state} cities
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  placeholder={`Type other ${selectedState.state} city name...`}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const target = e.target as HTMLInputElement;
                      if (target.value.trim()) {
                        const customCitySlug = target.value
                          .trim()
                          .toLowerCase()
                          .replace(/\s+/g, "-");
                        handleCityClick(customCitySlug);
                        setShowMobileSheet(false);
                      }
                    }
                  }}
                  className="w-full pl-9 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all placeholder-slate-600"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </MarketingShell>
  );
}
