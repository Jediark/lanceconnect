import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useMemo, useRef, useEffect } from "react";
import { MarketingShell, PageHeader } from "@/components/marketing/MarketingShell";
import { GLOBAL_REGIONS, US_STATES } from "@/data/geography";
import {
  CITY_COUNTRY_MAP,
  COUNTRY_FLAG,
  COUNTRY_REGION_MAP,
  SKILL_CONFIG,
  formatCityName,
} from "@/data/dynamicRouteData";
import {
  Search,
  MapPin,
  Briefcase,
  Sparkles,
  ArrowRight,
  Globe,
  ChevronRight,
  ChevronDown,
  Building2,
  Code,
  Palette,
  PenTool,
  TrendingUp,
  MessageSquare,
  Camera,
  Video,
  Megaphone,
  Smartphone,
  GraduationCap,
  Mic,
  X,
} from "lucide-react";

export const Route = createFileRoute("/find-clients/")({
  head: () => ({
    meta: [
      { title: "Find Freelance Clients Anywhere in the World — LanceConnect" },
      {
        name: "description",
        content: "Explore active local client leads and B2B opportunities across global regions, countries, states, and cities.",
      },
      { property: "og:title", content: "Global Client Directory — LanceConnect" },
    ],
  }),
  component: GlobalDirectoryHub,
});

// Consolidate the 9 dynamic skills requested
const NINE_SKILLS = [
  { slug: "seo-specialist", label: "SEO Specialist", icon: TrendingUp, desc: "Optimize local business search rankings to drive organic leads." },
  { slug: "social-media-manager", label: "Social Media Manager", icon: MessageSquare, desc: "Build social campaigns, content calendars, and engage audiences." },
  { slug: "photographer", label: "Photographer", icon: Camera, desc: "Capture high-quality product imagery and commercial assets." },
  { slug: "video-producer", label: "Video Producer", icon: Video, desc: "Shoot and edit commercial reels, video tours, and testimonials." },
  { slug: "virtual-assistant", label: "Virtual Assistant", icon: Briefcase, desc: "Manage scheduling, emails, and general business admin." },
  { slug: "digital-marketer", icon: Megaphone, label: "Digital Marketer", desc: "Set up paid ad campaigns and optimize conversion funnels." },
  { slug: "app-developer", icon: Smartphone, label: "App Developer", desc: "Build bespoke mobile applications for local client workflows." },
  { slug: "tutor", icon: GraduationCap, label: "Online Tutor", desc: "Provide remote tutoring, courses, and educational support." },
  { slug: "mc-events", icon: Mic, label: "MC & Events Host", desc: "Host business summits, corporate events, and panel discussions." },
];

const COUNTRIES_WITH_HUBS = [
  "united-states",
  "nigeria",
  "united-kingdom",
  "india",
  "ghana",
  "kenya",
  "south-africa",
  "canada",
  "australia",
  "germany",
  "france",
  "uae",
  "brazil",
  "philippines",
  "malaysia",
];

function GlobalDirectoryHub() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [expandedRegion, setExpandedRegion] = useState<string | null>(null);
  const [expandedCountry, setExpandedCountry] = useState<string | null>(null);
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Consolidate ALL cities for autocomplete list
  const allSearchableCities = useMemo(() => {
    const list: Array<{ slug: string; name: string; country: string; flag: string }> = [];
    const seenSlugs = new Set<string>();

    // 1. Core static/dynamic cities in CITY_COUNTRY_MAP
    Object.entries(CITY_COUNTRY_MAP).forEach(([slug, country]) => {
      if (!seenSlugs.has(slug)) {
        seenSlugs.add(slug);
        list.push({
          slug,
          name: formatCityName(slug),
          country,
          flag: COUNTRY_FLAG[country] || "🌍",
        });
      }
    });

    // 2. Cities in US_STATES
    US_STATES.forEach((state) => {
      state.cities.forEach((city) => {
        if (!seenSlugs.has(city)) {
          seenSlugs.add(city);
          list.push({
            slug: city,
            name: formatCityName(city),
            country: "United States",
            flag: "🇺🇸",
          });
        }
      });
    });

    // 3. Cities in GLOBAL_REGIONS
    GLOBAL_REGIONS.forEach((region) => {
      region.countries.forEach((country) => {
        country.cities.forEach((city) => {
          if (!seenSlugs.has(city)) {
            seenSlugs.add(city);
            list.push({
              slug: city,
              name: formatCityName(city),
              country: country.country,
              flag: COUNTRY_FLAG[country.country] || "🌍",
            });
          }
        });
      });
    });

    // Add static cities (Lagos, London, Dubai) if not present
    const statics = [
      { slug: "lagos", name: "Lagos", country: "Nigeria", flag: "🇳🇬" },
      { slug: "london", name: "London", country: "United Kingdom", flag: "🇬🇧" },
      { slug: "dubai", name: "Dubai", country: "UAE", flag: "🇦🇪" },
    ];
    statics.forEach((s) => {
      if (!seenSlugs.has(s.slug)) {
        seenSlugs.add(s.slug);
        list.push(s);
      }
    });

    return list.sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  // Filter autocomplete results based on user input
  const autocompleteResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return allSearchableCities.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.country.toLowerCase().includes(q)
    ).slice(0, 10);
  }, [searchQuery, allSearchableCities]);

  const handleCitySelect = (citySlug: string) => {
    setSearchQuery("");
    setShowDropdown(false);
    navigate({
      to: "/find-clients/$category",
      params: { category: citySlug },
    });
  };

  const handleCountrySelect = (countrySlug: string) => {
    navigate({
      to: "/find-clients/$category",
      params: { category: countrySlug },
    });
  };

  // Structured region data for cards
  const regionCards = useMemo(() => {
    // Collect countries in "Rest of World" (countries in CITY_COUNTRY_MAP but not in GLOBAL_REGIONS)
    const activeCountriesInRegions = new Set(
      GLOBAL_REGIONS.flatMap((r) => r.countries.map((c) => c.country))
    );
    activeCountriesInRegions.add("United States");

    const restOfWorldCountriesMap: Record<string, string[]> = {};
    Object.entries(CITY_COUNTRY_MAP).forEach(([citySlug, country]) => {
      if (!activeCountriesInRegions.has(country)) {
        if (!restOfWorldCountriesMap[country]) {
          restOfWorldCountriesMap[country] = [];
        }
        restOfWorldCountriesMap[country].push(citySlug);
      }
    });

    const restOfWorldCountries = Object.entries(restOfWorldCountriesMap).map(([country, cities]) => ({
      country,
      slug: country.toLowerCase().replace(/\s+/g, "-"),
      cities,
    }));

    return [
      {
        region: "Africa",
        emoji: "🌍",
        citiesCount: 47,
        flags: "🇳🇬 🇿🇦 🇰🇪 🇬🇭 🇪🇹",
        countries: GLOBAL_REGIONS.find((r) => r.region === "Africa")?.countries || [],
      },
      {
        region: "Americas",
        emoji: "🌎",
        citiesCount: 28,
        flags: "🇺🇸 🇨🇦 🇧🇷 🇲🇽",
        countries: GLOBAL_REGIONS.find((r) => r.region === "Americas")?.countries || [],
      },
      {
        region: "Asia & Pacific",
        emoji: "🌏",
        citiesCount: 31,
        flags: "🇮🇳 🇯🇵 🇦🇺 🇵🇭",
        countries: GLOBAL_REGIONS.find((r) => r.region === "Asia & Pacific")?.countries || [],
      },
      {
        region: "Europe",
        emoji: "🇪🇺",
        citiesCount: 24,
        flags: "🇬🇧 🇩🇪 🇫🇷 🇮🇹",
        countries: GLOBAL_REGIONS.find((r) => r.region === "Europe")?.countries || [],
      },
      {
        region: "Middle East",
        emoji: "🌐",
        citiesCount: 12,
        flags: "🇦🇪 🇸🇦 🇶🇦",
        countries: GLOBAL_REGIONS.find((r) => r.region === "Middle East")?.countries || [],
      },
      {
        region: "Rest of World",
        emoji: "🌍",
        citiesCount: 18,
        flags: "🇹🇷 🇪🇬 🇲🇦 🇸🇬",
        countries: restOfWorldCountries,
      },
    ];
  }, []);

  const popularCities = [
    { name: "Lagos", slug: "lagos" },
    { name: "London", slug: "london" },
    { name: "Dubai", slug: "dubai" },
    { name: "Mumbai", slug: "mumbai" },
    { name: "Nairobi", slug: "nairobi" },
    { name: "Toronto", slug: "toronto" },
    { name: "Berlin", slug: "berlin" },
    { name: "Accra", slug: "accra" },
    { name: "Tokyo", slug: "tokyo" },
    { name: "São Paulo", slug: "sao-paulo" },
  ];

  return (
    <MarketingShell>
      <PageHeader
        eyebrow="Global directory"
        title="Find Freelance Clients Anywhere in the World"
        subtitle="Select your region to find local business leads, or search any city directly."
      />

      <section className="w-full bg-background text-foreground transition-colors duration-350 min-h-screen py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">

          {/* Prominent Search Bar */}
          <div className="max-w-xl mx-auto mb-16 relative" ref={dropdownRef}>
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-hover:text-primary transition-colors" />
              <input
                type="text"
                placeholder="Search any city... Lagos, London, Dubai, New York"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-border bg-card text-base text-foreground placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary backdrop-blur-md transition-all shadow-md dark:shadow-black/20"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Autocomplete Dropdown */}
            {showDropdown && autocompleteResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="py-2">
                  <p className="px-4 py-1 text-[9px] uppercase tracking-wider font-mono text-slate-500">
                    Search Results
                  </p>
                  {autocompleteResults.map((city) => (
                    <button
                      key={city.slug}
                      onClick={() => handleCitySelect(city.slug)}
                      className="w-full px-4 py-3 hover:bg-slate-800 flex items-center justify-between text-left text-sm transition-colors text-white"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-base select-none">{city.flag}</span>
                        <div>
                          <span className="font-bold">{city.name}</span>
                          <span className="text-slate-400 text-xs ml-1.5">({city.country})</span>
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-slate-500" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* World Regions Grid */}
          <div className="mb-20">
            <h2 className="text-2xl font-extrabold tracking-tight font-display mb-8 text-center sm:text-left">
              Browse Leads by Region
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {regionCards.map((region) => {
                const isRegionExpanded = expandedRegion === region.region;
                return (
                  <div
                    key={region.region}
                    className={`rounded-2xl border transition-all duration-300 ${
                      isRegionExpanded
                        ? "border-primary bg-slate-900/60 shadow-lg col-span-full"
                        : "border-border dark:border-slate-800/80 bg-card hover:border-primary/40 hover:-translate-y-1 hover:shadow-md"
                    }`}
                  >
                    {/* Region Card Header */}
                    <div
                      onClick={() => {
                        setExpandedRegion(isRegionExpanded ? null : region.region);
                        setExpandedCountry(null);
                      }}
                      className="p-6 cursor-pointer flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-3xl select-none">{region.emoji}</span>
                        <div>
                          <h3 className="text-lg font-bold font-display text-white">
                            {region.region}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {region.citiesCount} cities
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-mono tracking-wider opacity-60 hidden sm:inline">
                          {region.flags}
                        </span>
                        {isRegionExpanded ? (
                          <ChevronDown className="h-5 w-5 text-primary" />
                        ) : (
                          <ChevronRight className="h-5 w-5 text-slate-400" />
                        )}
                      </div>
                    </div>

                    {/* Region Expansion: Countries list */}
                    {isRegionExpanded && (
                      <div className="p-6 border-t border-slate-800/60 bg-slate-950/40 rounded-b-2xl">
                        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                          {region.countries.map((country) => {
                            const isCountryExpanded = expandedCountry === country.country;
                            const hasHub = COUNTRIES_WITH_HUBS.includes(country.slug);

                            return (
                              <div
                                key={country.slug}
                                className={`rounded-xl border transition-all ${
                                  isCountryExpanded
                                    ? "border-primary bg-slate-900/80 col-span-full p-6"
                                    : "border-slate-800 bg-slate-900/40 hover:border-slate-700 p-4"
                                }`}
                              >
                                {/* Country Select Button / Expanded Title */}
                                <div className="flex items-center justify-between gap-2">
                                  <button
                                    onClick={() => {
                                      setExpandedCountry(isCountryExpanded ? null : country.country);
                                    }}
                                    className="flex items-center gap-2 font-bold font-display text-sm text-white hover:text-primary transition-colors text-left cursor-pointer"
                                  >
                                    <span className="text-base select-none">
                                      {COUNTRY_FLAG[country.country] || "🌍"}
                                    </span>
                                    <span>{country.country}</span>
                                    {isCountryExpanded ? (
                                      <ChevronDown className="h-4 w-4 ml-1 text-primary shrink-0" />
                                    ) : (
                                      <ChevronRight className="h-4 w-4 ml-1 text-slate-500 shrink-0" />
                                    )}
                                  </button>

                                  {/* Link to country page if it has a hub */}
                                  {hasHub && (
                                    <Link
                                      to={
                                        country.slug === "united-states"
                                          ? ("/find-clients/united-states" as any)
                                          : (`/find-clients/${country.slug}` as any)
                                      }
                                      className="text-[10px] font-semibold text-primary hover:text-white bg-primary/10 border border-primary/20 hover:bg-primary px-2.5 py-1 rounded-full transition-all shrink-0"
                                    >
                                      Go to Hub ↗
                                    </Link>
                                  )}
                                </div>

                                {/* Country Expansion: Cities list */}
                                {isCountryExpanded && (
                                  <div className="mt-6 border-t border-slate-800 pt-6">
                                    <p className="text-[10px] font-mono text-slate-500 mb-4 uppercase tracking-wider">
                                      // Cities in {country.country}
                                    </p>
                                    
                                    {/* US states redirection helper */}
                                    {country.slug === "united-states" ? (
                                      <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 text-center">
                                        <p className="text-sm text-slate-300 mb-4">
                                          USA lead scanning is categorized by state and cities.
                                        </p>
                                        <Link
                                          to={"/find-clients/united-states" as any}
                                          className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all"
                                        >
                                          Open USA Interactive Map
                                          <ArrowRight className="h-3.5 w-3.5" />
                                        </Link>
                                      </div>
                                    ) : (
                                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                                        {country.cities.map((city) => (
                                          <button
                                            key={city}
                                            onClick={() => handleCitySelect(city)}
                                            className="flex items-center gap-2 bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-primary/40 rounded-xl p-3 text-left transition-all cursor-pointer group"
                                          >
                                            <MapPin className="h-3.5 w-3.5 text-primary shrink-0 group-hover:scale-110 transition-transform" />
                                            <span className="text-xs font-bold text-white capitalize truncate">
                                              {city.replace(/-/g, " ")}
                                            </span>
                                          </button>
                                        ))}
                                        {country.cities.length === 0 && (
                                          <p className="col-span-full text-center text-xs text-slate-500 py-4">
                                            No default cities listed. Search above to scan any city.
                                          </p>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Popular Cities list */}
          <div className="mb-20 bg-card border border-border dark:border-slate-800/80 rounded-3xl p-8 shadow-sm">
            <h3 className="text-lg font-bold font-display mb-4 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-secondary animate-pulse" />
              Most searched cities this week
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {popularCities.map((city) => (
                <button
                  key={city.slug}
                  onClick={() => handleCitySelect(city.slug)}
                  className="bg-background hover:bg-primary/5 hover:border-primary/40 border border-border dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs font-semibold capitalize transition-all cursor-pointer"
                >
                  {city.name}
                </button>
              ))}
            </div>
          </div>

          {/* Browse By Skill section */}
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight font-display mb-8 text-center sm:text-left">
              Or find clients by your skill
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {NINE_SKILLS.map((skill) => {
                const IconComp = skill.icon;
                return (
                  <Link
                    key={skill.slug}
                    to={`/find-clients/${skill.slug}` as any}
                    className="group block rounded-2xl border border-border dark:border-slate-800/80 bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:bg-slate-50 dark:hover:bg-slate-900/40 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between">
                      <div className="p-2.5 rounded-xl bg-primary/5 border border-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                        <IconComp className="h-5 w-5 shrink-0" />
                      </div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground bg-muted px-2.5 py-0.5 rounded-full border border-border group-hover:text-primary group-hover:border-primary/30 transition-colors">
                        Explore
                      </span>
                    </div>
                    <h3 className="mt-4 text-base font-bold text-foreground group-hover:text-primary transition-colors font-display">
                      {skill.label}
                    </h3>
                    <p className="mt-2 text-xs text-muted-foreground leading-relaxed line-clamp-2">
                      {skill.desc}
                    </p>
                    <div className="mt-5 flex items-center gap-1.5 text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span>Browse Leads</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

        </div>
      </section>
    </MarketingShell>
  );
}
