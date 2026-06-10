import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { MarketingShell, PageHeader } from "@/components/marketing/MarketingShell";
import {
  CITY_COUNTRY_MAP,
  COUNTRY_FLAG,
  COUNTRY_REGION_MAP,
  formatCityName,
} from "@/data/dynamicRouteData";
import {
  Search,
  MapPin,
  Briefcase,
  Sparkles,
  ArrowRight,
  Globe,
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
  Factory,
  Leaf,
  Utensils,
  Package,
  BookOpen,
  Users,
  Building2,
} from "lucide-react";

export const Route = createFileRoute("/find-clients/")({
  head: () => ({
    meta: [
      { title: "Global Client Directory — LanceConnect" },
      {
        name: "description",
        content: "Explore active local client leads and opportunities across 85+ global cities and 20 client niches.",
      },
      { property: "og:title", content: "LanceConnect Client Directory" },
    ],
  }),
  component: GlobalDirectory,
});

// Lucide icon mapping for all skills
const SKILL_ICONS: Record<string, React.ComponentType<any>> = {
  "web-developer": Code,
  "graphic-designer": Palette,
  "copywriter": PenTool,
  "seo-specialist": TrendingUp,
  "social-media-manager": MessageSquare,
  photographer: Camera,
  "video-producer": Video,
  "virtual-assistant": Briefcase,
  "digital-marketer": Megaphone,
  "app-developer": Smartphone,
  tutor: GraduationCap,
  "mc-events": Mic,
  "b2b-trade": Factory,
  "african-food-export": Leaf,
  "restaurant-suppliers": Utensils,
  "product-export": Package,
  "human-capital": BookOpen,
  "training-recruitment": Users,
  "local-business": Building2,
  "parent-tutors": Users,
};

// Consolidated list of all 20 categories/skills (static + dynamic + B2B)
const DIRECTORY_SKILLS = [
  {
    slug: "web-developer",
    label: "Web Developer",
    description: "Design, build, and deploy high-converting websites and custom web applications.",
  },
  {
    slug: "graphic-designer",
    label: "Graphic Designer",
    description: "Create brand identities, social media assets, marketing materials, and logos.",
  },
  {
    slug: "copywriter",
    label: "Copywriter",
    description: "Write persuasive landing page copy, sales letters, and advertising campaigns.",
  },
  {
    slug: "seo-specialist",
    label: "SEO Specialist",
    description: "Optimize local business search rankings to drive organic calls and leads.",
  },
  {
    slug: "social-media-manager",
    label: "Social Media Manager",
    description: "Build social content calendars, schedule posts, and engage with online audiences.",
  },
  {
    slug: "photographer",
    label: "Photographer",
    description: "Capture high-quality product imagery, commercial assets, and real estate tours.",
  },
  {
    slug: "video-producer",
    label: "Video Producer",
    description: "Shoot and edit commercial social media reels, testimonials, and video tours.",
  },
  {
    slug: "virtual-assistant",
    label: "Virtual Assistant",
    description: "Streamline calendars, manage customer support, and perform business administration.",
  },
  {
    slug: "digital-marketer",
    label: "Digital Marketer",
    description: "Develop paid ad campaigns, structure funnels, and optimize conversion metrics.",
  },
  {
    slug: "app-developer",
    label: "App Developer",
    description: "Build bespoke iOS and Android applications to simplify client workflows.",
  },
  {
    slug: "tutor",
    label: "Online Tutor",
    description: "Teach academic courses, languages, and technical disciplines online.",
  },
  {
    slug: "mc-events",
    label: "MC & Events Host",
    description: "Host business panels, weddings, and local award nights with charisma.",
  },
  {
    slug: "b2b-trade",
    label: "B2B Trade Partner",
    description: "Find manufacturers, factories, and procurement agencies looking for raw materials.",
  },
  {
    slug: "african-food-export",
    label: "African Food Exporter",
    description: "Find international buyers, wholesalers, and supermarkets importing ethnic foods.",
  },
  {
    slug: "restaurant-suppliers",
    label: "Restaurant Supplier",
    description: "Connect with local kitchens, cafes, and restaurants seeking direct ingredient supply.",
  },
  {
    slug: "product-export",
    label: "Product Importer & Exporter",
    description: "Find global distributors, wholesalers, and retail buyers for finished goods.",
  },
  {
    slug: "human-capital",
    label: "Corporate Training & L&D",
    description: "Offer corporate training, leadership workshops, and talent upskilling to HR teams.",
  },
  {
    slug: "training-recruitment",
    label: "Training & Recruitment",
    description: "Connect with staffing agencies, corporate recruiters, and company hiring managers.",
  },
  {
    slug: "local-business",
    label: "Local Business Consultant",
    description: "Offer localized operations consulting, offline setup, and local B2B support.",
  },
  {
    slug: "parent-tutors",
    label: "Parent Tutor Agent",
    description: "Connect with families and parents looking for private tutors and home education.",
  },
];

// Consolidate static and dynamic cities
const STATIC_CITIES = [
  { slug: "lagos", name: "Lagos", country: "Nigeria", flag: "🇳🇬", region: "Africa" },
  { slug: "london", name: "London", country: "United Kingdom", flag: "🇬🇧", region: "Europe" },
  { slug: "dubai", name: "Dubai", country: "UAE", flag: "🇦🇪", region: "Asia & Middle East" },
];

const DYNAMIC_CITIES = Object.entries(CITY_COUNTRY_MAP).map(([slug, country]) => {
  const name = formatCityName(slug);
  const flag = COUNTRY_FLAG[country] || "🌍";
  const region = COUNTRY_REGION_MAP[country] || "Other";
  return { slug, name, country, flag, region };
});

const ALL_CITIES = [...STATIC_CITIES, ...DYNAMIC_CITIES].sort((a, b) =>
  a.name.localeCompare(b.name)
);

// Popular combinations for showcase
const FEATURED_COMBOS = [
  { skillSlug: "web-developer", skillLabel: "Web Developer", citySlug: "london", cityName: "London", flag: "🇬🇧" },
  { skillSlug: "seo-specialist", skillLabel: "SEO Specialist", citySlug: "austin", cityName: "Austin", flag: "🇺🇸" },
  { skillSlug: "photographer", skillLabel: "Photographer", citySlug: "dubai", cityName: "Dubai", flag: "🇦🇪" },
  { skillSlug: "social-media-manager", skillLabel: "Social Media Manager", citySlug: "lagos", cityName: "Lagos", flag: "🇳🇬" },
  { skillSlug: "copywriter", skillLabel: "Copywriter", citySlug: "toronto", cityName: "Toronto", flag: "🇨🇦" },
  { skillSlug: "virtual-assistant", skillLabel: "Virtual Assistant", citySlug: "nairobi", cityName: "Nairobi", flag: "🇰🇪" },
];

const REGIONS_ORDER = ["Africa", "Europe", "Americas", "Asia & Middle East", "Oceania"];

function GlobalDirectory() {
  const [searchQuery, setSearchQuery] = useState("");

  // Filters skills based on search
  const filteredSkills = useMemo(() => {
    if (!searchQuery) return DIRECTORY_SKILLS;
    const q = searchQuery.toLowerCase();
    return DIRECTORY_SKILLS.filter(
      (s) => s.label.toLowerCase().includes(q) || s.description.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  // Filters cities based on search
  const filteredCities = useMemo(() => {
    if (!searchQuery) return ALL_CITIES;
    const q = searchQuery.toLowerCase();
    return ALL_CITIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.country.toLowerCase().includes(q) ||
        c.region.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  // Group filtered cities by region
  const citiesByRegion = useMemo(() => {
    const groups: Record<string, typeof ALL_CITIES> = {};
    filteredCities.forEach((city) => {
      if (!groups[city.region]) {
        groups[city.region] = [];
      }
      groups[city.region].push(city);
    });
    return groups;
  }, [filteredCities]);

  return (
    <MarketingShell>
      <PageHeader
        eyebrow="Global Client directory"
        title="Find clients in every city, across every skill."
        subtitle="LanceConnect scans the web for business opportunities across 85+ global hubs and 20 distinct client niches. Select a category or location to see active local leads."
      />

      <section className="w-full bg-background text-foreground transition-colors duration-350 min-h-screen py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          
          {/* Dynamic Search & Filter Bar */}
          <div className="max-w-xl mx-auto mb-16 relative">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-hover:text-primary transition-colors" />
              <input
                type="text"
                placeholder="Search by city, country, or skill (e.g. 'Austin', 'SEO')..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-border bg-card text-base text-foreground placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary backdrop-blur-md transition-all shadow-md dark:shadow-black/20"
              />
            </div>
            {searchQuery && (
              <p className="mt-2 text-xs text-muted-foreground text-center">
                Showing {filteredSkills.length} niches and {filteredCities.length} locations matching "{searchQuery}"
              </p>
            )}
          </div>

          {/* 1. Skill Categories Section */}
          <div className="mb-20">
            <div className="flex items-center gap-2.5 mb-8">
              <div className="p-2 rounded-lg bg-primary/10 border border-primary/20 text-primary">
                <Briefcase className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-extrabold tracking-tight text-foreground font-display">
                Browse Client Leads By Skill & Niche
              </h2>
            </div>

            {filteredSkills.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-border rounded-2xl">
                <p className="text-muted-foreground text-sm">No skill categories match your search.</p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredSkills.map((skill) => {
                  const IconComp = SKILL_ICONS[skill.slug] || Briefcase;
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
                          Niche Leads
                        </span>
                      </div>
                      <h3 className="mt-4 text-lg font-bold text-foreground group-hover:text-primary transition-colors font-display">
                        {skill.label}
                      </h3>
                      <p className="mt-2 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {skill.description}
                      </p>
                      <div className="mt-5 flex items-center gap-1.5 text-xs font-semibold text-primary/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span>Explore opportunities</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* 2. Featured Combined Combos Showcase */}
          <div className="mb-20 rounded-3xl border border-border dark:border-slate-800 bg-slate-50 dark:bg-slate-900/20 p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 h-64 w-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 h-64 w-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <Sparkles className="h-4 w-4 text-yellow-500 animate-pulse" />
                  <span className="text-xs font-mono uppercase tracking-widest text-primary font-bold">
                    Top Localized Hubs
                  </span>
                </div>
                <h3 className="text-xl font-bold text-foreground font-display">Popular Combined Opportunities</h3>
              </div>
            </div>

            <div className="relative z-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURED_COMBOS.map((combo, idx) => (
                <Link
                  key={idx}
                  to={`/find-clients/${combo.skillSlug}/${combo.citySlug}` as any}
                  className="flex items-center justify-between rounded-xl border border-border dark:border-slate-800 bg-card p-4 transition-all hover:border-primary/30 hover:bg-slate-100 dark:hover:bg-slate-950/80"
                >
                  <div>
                    <p className="text-[10px] font-mono text-muted-foreground">Combined Route</p>
                    <p className="text-sm font-semibold text-foreground mt-0.5">
                      {combo.skillLabel} in {combo.cityName}
                    </p>
                  </div>
                  <span className="text-xl flex items-center gap-1.5">
                    <span>{combo.flag}</span>
                    <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* 3. Locations Directory grouped by region */}
          <div>
            <div className="flex items-center gap-2.5 mb-8">
              <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
                <Globe className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-extrabold tracking-tight text-foreground font-display">
                Find Client Leads By Location
              </h2>
            </div>

            {filteredCities.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-border rounded-2xl">
                <p className="text-muted-foreground text-sm">No cities or countries match your search.</p>
              </div>
            ) : (
              <div className="space-y-12">
                {REGIONS_ORDER.map((region) => {
                  const citiesInRegion = citiesByRegion[region];
                  if (!citiesInRegion || citiesInRegion.length === 0) return null;

                  return (
                    <div key={region} className="border-t border-border/80 pt-8 first:border-none first:pt-0">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-xs font-mono font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase">
                          // {region}
                        </span>
                        <span className="h-px flex-1 bg-border/80 dark:bg-slate-800/60" />
                        <span className="text-xs font-semibold text-muted-foreground">
                          {citiesInRegion.length} {citiesInRegion.length === 1 ? "city" : "cities"}
                        </span>
                      </div>

                      <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                        {citiesInRegion.map((city) => (
                          <Link
                            key={city.slug}
                            to={`/find-clients/${city.slug}` as any}
                            className="flex items-center justify-between rounded-xl border border-border dark:border-slate-900 bg-card px-3.5 py-3 transition-all duration-300 hover:border-emerald-500/30 hover:bg-slate-50 dark:hover:bg-slate-900/40 hover:translate-x-0.5 text-foreground"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="text-lg flex-shrink-0 select-none">{city.flag}</span>
                              <div className="min-w-0">
                                <p className="text-xs font-bold text-foreground truncate font-display">
                                  {city.name}
                                </p>
                                <p className="text-[9px] text-muted-foreground truncate">
                                  {city.country}
                                </p>
                              </div>
                            </div>
                            <MapPin className="h-3 w-3 text-slate-400 group-hover:text-emerald-400 transition-colors flex-shrink-0 ml-1.5" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                })}

                {/* Catch-all for other un-ordered regions just in case */}
                {Object.keys(citiesByRegion)
                  .filter((r) => !REGIONS_ORDER.includes(r))
                  .map((region) => {
                    const citiesInRegion = citiesByRegion[region];
                    if (!citiesInRegion || citiesInRegion.length === 0) return null;

                    return (
                      <div key={region} className="border-t border-border/80 pt-8">
                        <div className="flex items-center gap-2 mb-4">
                          <span className="text-xs font-mono font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase">
                            // {region}
                          </span>
                          <span className="h-px flex-1 bg-border/80 dark:bg-slate-800/60" />
                          <span className="text-xs font-semibold text-muted-foreground">
                            {citiesInRegion.length} {citiesInRegion.length === 1 ? "city" : "cities"}
                          </span>
                        </div>

                        <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                          {citiesInRegion.map((city) => (
                            <Link
                              key={city.slug}
                              to={`/find-clients/${city.slug}` as any}
                              className="flex items-center justify-between rounded-xl border border-border dark:border-slate-900 bg-card px-3.5 py-3 transition-all duration-300 hover:border-emerald-500/30 hover:bg-slate-50 dark:hover:bg-slate-900/40 hover:translate-x-0.5 text-foreground"
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <span className="text-lg flex-shrink-0 select-none">{city.flag}</span>
                                <div className="min-w-0">
                                  <p className="text-xs font-bold text-foreground truncate font-display">
                                    {city.name}
                                  </p>
                                  <p className="text-[9px] text-muted-foreground truncate">
                                    {city.country}
                                  </p>
                                </div>
                              </div>
                              <MapPin className="h-3 w-3 text-slate-400 group-hover:text-emerald-400 transition-colors flex-shrink-0" />
                            </Link>
                          ))}
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>

        </div>
      </section>
    </MarketingShell>
  );
}
