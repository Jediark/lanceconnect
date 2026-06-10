import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { MaskedLeadCard, type LeadData } from "@/components/marketing/SEOLeadCard";
import {
  formatCityName,
  getCountry,
  COUNTRY_FLAG,
  US_STATE_MAP,
  SKILL_CONFIG,
  TOP_CITIES,
  ALL_SKILL_SLUGS,
  getSkillLabel,
  getMockLeadsForSkill,
  type SkillNiche,
} from "@/data/dynamicRouteData";
import {
  ArrowRight,
  CheckCircle,
  MapPin,
  Sparkles,
  Zap,
  Search,
  BarChart3,
} from "lucide-react";

export const Route = createFileRoute("/find-clients/$skill/$city")({
  loader: async ({ params }) => {
    const { skill, city } = params;
    const skillConfig = SKILL_CONFIG[skill] || null;
    const cityName = formatCityName(city);
    const countryName = getCountry(city);
    const usState = US_STATE_MAP[city];
    const displayLocation = usState
      ? `${cityName}, ${usState}`
      : countryName
      ? `${cityName}, ${countryName}`
      : cityName;
    const flag = COUNTRY_FLAG[countryName] || "🌍";
    const skillLabel = skillConfig?.label || formatCityName(skill);

    return {
      skill,
      city,
      skillConfig,
      skillLabel,
      cityName,
      countryName,
      usState,
      displayLocation,
      flag,
    };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [] };
    const { skillLabel, displayLocation, countryName, skillConfig } = loaderData;
    return {
      meta: [
        {
          title: `Find ${skillLabel} Clients in ${displayLocation} — LanceConnect`,
        },
        {
          name: "description",
          content: `Find businesses in ${displayLocation} that need a ${skillLabel}. Get verified phone numbers and emails. 10 free leads, no credit card.`,
        },
        {
          name: "keywords",
          content: `find ${skillLabel.toLowerCase()} clients in ${displayLocation}, ${skillLabel.toLowerCase()} leads ${countryName}, freelance ${skillLabel.toLowerCase()} ${displayLocation}`,
        },
        {
          property: "og:title",
          content: `Find ${skillLabel} Clients in ${displayLocation} — LanceConnect`,
        },
        {
          property: "og:description",
          content:
            skillConfig?.description ||
            `Find businesses in ${displayLocation} that need a ${skillLabel}.`,
        },
      ],
    };
  },
  component: SkillCityPage,
});

function SkillCityPage() {
  const {
    skill,
    city,
    skillConfig,
    skillLabel,
    cityName,
    countryName,
    usState,
    displayLocation,
    flag,
  } = Route.useLoaderData();

  const supabaseUrl =
    import.meta.env.VITE_SUPABASE_URL || "https://rpaodsmwhmzyhopvkwjt.supabase.co";

  const [leads, setLeads] = useState<LeadData[]>(
    getMockLeadsForSkill(cityName, countryName, skillLabel)
  );
  const [loading, setLoading] = useState(true);
  const [hasRealLeads, setHasRealLeads] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`${supabaseUrl}/functions/v1/public-leads`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        city: cityName,
        category: skillConfig?.category,
      }),
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.leads?.length) {
          setLeads(d.leads);
          setHasRealLeads(true);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [skill, city]);

  const registerUrl = `/register?category=${skillConfig?.category || skill}&city=${encodeURIComponent(cityName)}&country=${encodeURIComponent(countryName)}`;
  const regionLabel = usState
    ? `${cityName}, ${usState}, ${countryName}`
    : displayLocation;

  // Other cities for this skill
  const otherCities = [
    { label: "Lagos", to: `/find-clients/${skill}/lagos` },
    { label: "London", to: `/find-clients/${skill}/london` },
    { label: "Dubai", to: `/find-clients/${skill}/dubai` },
    ...TOP_CITIES.filter((c) => c !== city).slice(0, 6).map((c) => ({
      label: formatCityName(c),
      to: `/find-clients/${skill}/${c}`,
    })),
  ].filter((c) => c.label !== cityName);

  // Other skills in this city
  const otherSkills = ALL_SKILL_SLUGS.filter((s) => s !== skill).slice(0, 8);

  return (
    <MarketingShell>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border bg-[#020b21] py-20 lg:py-28">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-emerald-900/10 to-primary/10 pointer-events-none" />
        <div className="relative mx-auto max-w-5xl px-4 lg:px-8 text-center z-10">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-semibold text-primary font-mono uppercase tracking-wider mb-6">
            {flag} {regionLabel}
          </span>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
            Find{" "}
            <span className="text-primary">{skillLabel}</span> Clients in{" "}
            <span className="text-emerald-400">{displayLocation}</span>
          </h1>
          <p className="mt-5 text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            {skillConfig?.description ||
              `Find businesses in ${displayLocation} that need ${skillLabel} services.`}{" "}
            Get verified contacts. 10 free leads, no credit card.
          </p>
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <Link
              to={registerUrl as any}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]"
            >
              Get Free {skillLabel} Leads in {cityName}{" "}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-mono text-slate-400 pt-4 justify-center">
            <span className="flex items-center gap-1.5">
              <CheckCircle className="h-4 w-4 text-emerald-500" /> No credit card
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="h-4 w-4 text-emerald-500" /> Instant access
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="h-4 w-4 text-emerald-500" /> 10 free leads
            </span>
          </div>
        </div>
      </section>

      {/* Lead Cards / No Leads State */}
      <section className="bg-background py-20 border-b border-border">
        <div className="mx-auto max-w-6xl px-4 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Live opportunities
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight md:text-4xl">
              {skillLabel} clients in {displayLocation}
            </h2>
          </div>

          {loading ? (
            <div className="grid gap-6 md:grid-cols-3">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-border bg-card/50 h-56 animate-pulse"
                />
              ))}
            </div>
          ) : !hasRealLeads && leads.length === 0 ? (
            /* No Leads State */
            <div className="text-center py-16 max-w-md mx-auto">
              <div className="text-5xl mb-4">🔍</div>
              <h2 className="text-xl font-semibold mb-2 text-foreground">
                We're scanning {cityName} now
              </h2>
              <p className="text-slate-400 mb-6 text-sm leading-relaxed">
                Sign up free and search {cityName} directly — our system will find{" "}
                {skillLabel.toLowerCase()} leads there in seconds.
              </p>
              <Link
                to={registerUrl as any}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition shadow-lg"
              >
                Search {cityName} Free <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <>
              <div className="grid gap-6 md:grid-cols-3">
                {leads.map((lead, idx) => (
                  <MaskedLeadCard
                    key={idx}
                    lead={lead}
                    registerUrl={registerUrl}
                  />
                ))}
              </div>
              <div className="text-center mt-10">
                <Link
                  to={registerUrl as any}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition"
                >
                  Unlock all {skillLabel} leads in {cityName}{" "}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* How It Works — 3 steps */}
      <section className="bg-[#020b21] py-20 border-b border-border text-white">
        <div className="mx-auto max-w-5xl px-4 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
              How it works
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight md:text-4xl text-white">
              From search to outreach in 3 steps
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              {
                icon: Search,
                step: "01",
                title: `Pick "${skillLabel}"`,
                desc: `Select your skill and let our AI scan businesses in ${cityName}`,
              },
              {
                icon: BarChart3,
                step: "02",
                title: "Get scored leads",
                desc: `See ${cityName} businesses ranked by how urgently they need you`,
              },
              {
                icon: Zap,
                step: "03",
                title: "Reach out directly",
                desc: "Use AI-generated scripts to send verified, personalized pitches",
              },
            ].map((s, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-blue-900/30 bg-[#131c31] p-6 flex flex-col items-center text-center space-y-4 shadow-xl"
              >
                <span className="text-xs font-mono font-bold text-blue-400">
                  STEP {s.step}
                </span>
                <div className="grid h-14 w-14 place-items-center rounded-full bg-primary/10 border border-primary/30">
                  <s.icon className="h-6 w-6 text-primary" />
                </div>
                <p className="text-sm font-semibold text-slate-100">{s.title}</p>
                <p className="text-xs text-slate-400">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Niche Cards (if skill config exists) */}
      {skillConfig && (
        <section className="bg-background py-20 border-b border-border">
          <div className="mx-auto max-w-6xl px-4 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Who needs you in {cityName}
              </p>
              <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight md:text-4xl">
                Businesses looking for a {skillLabel}
              </h2>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {skillConfig.niches.map((niche: SkillNiche, idx: number) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-border bg-card p-6 hover:border-primary/30 transition duration-300 shadow-sm"
                >
                  <span className="text-3xl block mb-4">{niche.icon}</span>
                  <h3 className="font-display font-bold text-foreground mb-2">
                    {niche.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {niche.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Also available in: other cities for same skill */}
      <section className="bg-muted/30 py-16 border-b border-border">
        <div className="mx-auto max-w-4xl px-4 lg:px-8">
          <h2 className="font-display text-xl font-bold tracking-tight md:text-2xl mb-8 text-center">
            Also find {skillLabel} clients in:
          </h2>
          <div className="flex flex-wrap gap-3 justify-center">
            {otherCities.map((c) => (
              <Link
                key={c.label}
                to={c.to as any}
                className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-accent hover:border-primary/30 transition-all duration-200 hover:-translate-y-0.5 flex items-center gap-1.5"
              >
                <MapPin className="h-3 w-3 text-muted-foreground" /> {c.label}
              </Link>
            ))}
          </div>

          <h2 className="font-display text-xl font-bold tracking-tight md:text-2xl mb-8 mt-16 text-center">
            Other skills in {cityName}:
          </h2>
          <div className="flex flex-wrap gap-3 justify-center">
            {otherSkills.map((s) => (
              <Link
                key={s}
                to={`/find-clients/${s}/${city}` as any}
                className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-accent hover:border-primary/30 transition-all duration-200 hover:-translate-y-0.5"
              >
                {getSkillLabel(s)}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-[#020b21] py-20">
        <div className="mx-auto max-w-3xl px-4 lg:px-8 text-center">
          <Sparkles className="h-8 w-8 text-primary mx-auto mb-4" />
          <h2 className="font-display text-3xl font-bold text-white tracking-tight md:text-4xl">
            Get {skillLabel} clients in {displayLocation} today
          </h2>
          <p className="mt-4 text-slate-400 max-w-xl mx-auto">
            Join freelancers already using LanceConnect to win business contracts in{" "}
            {displayLocation}. No cold emailing. No bidding wars.
          </p>
          <Link
            to={registerUrl as any}
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-4 text-base font-semibold text-primary-foreground hover:bg-primary/90 transition shadow-lg shadow-primary/25 hover:scale-[1.02]"
          >
            Get 10 Free Leads <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </MarketingShell>
  );
}
