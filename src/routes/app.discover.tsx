import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Grid3X3, List, Search, X, MapPin, Copy } from "lucide-react";
import { toast } from "sonner";
import { Header } from "@/components/layout/Header";
import { LeadCard } from "@/components/ui/LeadCard";
import { OpportunityScore } from "@/components/ui/OpportunityScore";
import { EmptyState } from "@/components/ui/EmptyState";
import { CATEGORIES, COUNTRIES, MOCK_LEADS, type Lead } from "@/data/mockData";
import { usePipeline } from "@/contexts/PipelineContext";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/discover")({
  head: () => ({ meta: [{ title: "Discover Leads — FreelanceConnect" }] }),
  component: Discover,
});

function Discover() {
  const [category, setCategory] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [website, setWebsite] = useState("");
  const [minScore, setMinScore] = useState(0);
  const [view, setView] = useState<"grid" | "table">("grid");
  const [sort, setSort] = useState<"score" | "rating">("score");
  const [detail, setDetail] = useState<Lead | null>(null);

  const results = useMemo(() => {
    const out = MOCK_LEADS.filter((l) => {
      if (category && l.industry !== category) return false;
      if (country && !l.country.toLowerCase().includes(country.toLowerCase())) return false;
      if (city && !l.city.toLowerCase().includes(city.toLowerCase())) return false;
      if (website === "no" && l.hasWebsite) return false;
      if (website === "yes" && !l.hasWebsite) return false;
      if (l.opportunityScore < minScore) return false;
      return true;
    });
    return [...out].sort((a, b) => sort === "score" ? b.opportunityScore - a.opportunityScore : b.googleRating - a.googleRating);
  }, [category, country, city, website, minScore, sort]);

  const clear = () => { setCategory(""); setCountry(""); setCity(""); setWebsite(""); setMinScore(0); };

  return (
    <>
      <Header title="Discover Leads" subtitle="Find businesses that need your skills" />

      <div className="border-b border-border bg-card/60 px-4 py-3 lg:px-8">
        <div className="flex flex-wrap items-center gap-2">
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-lg border border-input bg-background px-3 py-2 text-sm">
            <option value="">All Categories</option>
            {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.emoji} {c.label}</option>)}
          </select>
          <select value={country} onChange={(e) => setCountry(e.target.value)} className="rounded-lg border border-input bg-background px-3 py-2 text-sm">
            <option value="">All Countries</option>
            {COUNTRIES.map((c) => <option key={c.code} value={c.name}>{c.flag} {c.name}</option>)}
          </select>
          <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Any city..." className="rounded-lg border border-input bg-background px-3 py-2 text-sm" />
          <select value={website} onChange={(e) => setWebsite(e.target.value)} className="rounded-lg border border-input bg-background px-3 py-2 text-sm">
            <option value="">All Websites</option>
            <option value="no">No Website Only</option>
            <option value="yes">Has Website</option>
          </select>
          <select value={minScore} onChange={(e) => setMinScore(Number(e.target.value))} className="rounded-lg border border-input bg-background px-3 py-2 text-sm">
            <option value={0}>Any Score</option>
            <option value={50}>50+</option>
            <option value={70}>70+</option>
            <option value={85}>85+</option>
          </select>
          <button className="ml-auto inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
            <Search className="h-3.5 w-3.5" /> Search Leads
          </button>
          <button onClick={clear} className="text-xs text-muted-foreground hover:text-foreground">Clear filters</button>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 px-4 py-4 lg:px-8">
        <p className="text-sm text-muted-foreground">Showing <span className="font-semibold text-foreground">{results.length}</span> leads</p>
        <div className="flex items-center gap-3">
          <select value={sort} onChange={(e) => setSort(e.target.value as "score" | "rating")} className="rounded-lg border border-input bg-background px-2 py-1.5 text-xs">
            <option value="score">Sort by: Score</option>
            <option value="rating">Sort by: Rating</option>
          </select>
          <div className="inline-flex rounded-lg border border-border bg-card p-0.5">
            <button onClick={() => setView("grid")} className={cn("rounded-md p-1.5", view === "grid" && "bg-accent")}><Grid3X3 className="h-4 w-4" /></button>
            <button onClick={() => setView("table")} className={cn("rounded-md p-1.5", view === "table" && "bg-accent")}><List className="h-4 w-4" /></button>
          </div>
        </div>
      </div>

      <div className="px-4 pb-10 lg:px-8">
        {results.length === 0 ? (
          <EmptyState icon="🔍" title="No leads found in this area yet" description="Try a different city or expand your filters." action={{ label: "Clear all filters", onClick: clear }} />
        ) : view === "grid" ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((l, i) => (
              <div key={l.id} style={{ animationDelay: `${i * 50}ms` }} className="animate-in fade-in-50 slide-in-from-bottom-2">
                <LeadCard lead={l} onOpenDetail={setDetail} />
              </div>
            ))}
          </div>
        ) : (
          <LeadTable leads={results} onOpenDetail={setDetail} />
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
            <tr key={l.id} className="cursor-pointer hover:bg-primary/5" onClick={() => onOpenDetail(l)}>
              <td className="px-4 py-3 font-medium">{l.businessName}<div className="text-xs text-muted-foreground">{l.businessType}</div></td>
              <td className="px-4 py-3 text-muted-foreground">{l.city}, {l.country}</td>
              <td className="px-4 py-3"><OpportunityScore score={l.opportunityScore} size="sm" showLabel={false} /></td>
              <td className="px-4 py-3">{l.hasWebsite ? <span className="text-emerald-600">✓ Yes</span> : <span className="text-red-600">✗ No</span>}</td>
              <td className="px-4 py-3 font-mono-data text-xs">{l.phone}</td>
              <td className="px-4 py-3 text-amber-600">⭐ {l.googleRating}</td>
              <td className="px-4 py-3 text-right">
                <button onClick={(e) => { e.stopPropagation(); saveLead(l); toast.success("Saved"); }} disabled={savedIds.has(l.id)} className="rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary hover:bg-primary/20 disabled:opacity-50">
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
  const { saveLead, savedIds } = usePipeline();
  const reasons = [
    !lead.hasWebsite && { label: "No website", pts: 40 },
    lead.googleRating < 4 && { label: "Below average rating", pts: 20 },
    lead.reviewCount < 20 && { label: "Very few reviews", pts: 15 },
    { label: "Active on Google Maps", pts: 10 },
  ].filter(Boolean) as { label: string; pts: number }[];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-xl overflow-hidden rounded-2xl bg-card shadow-2xl animate-in zoom-in-95">
        <div className="flex items-start justify-between border-b border-border p-6">
          <div>
            <h3 className="font-display text-xl font-bold">{lead.businessName}</h3>
            <p className="text-sm text-muted-foreground">{lead.businessType} · {lead.city}, {lead.country}</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-accent"><X className="h-4 w-4" /></button>
        </div>

        <div className="space-y-5 p-6">
          <div>
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold uppercase tracking-wide text-muted-foreground">Opportunity Score</span>
              <OpportunityScore score={lead.opportunityScore} />
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-border">
              <div className="h-full bg-gradient-brand" style={{ width: `${lead.opportunityScore}%` }} />
            </div>
          </div>

          <div className="space-y-2 rounded-xl bg-muted/40 p-4 text-sm">
            <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-muted-foreground" /> {lead.address}</p>
            <p className="flex items-center justify-between gap-2">
              <span className="font-mono-data">📞 {lead.phone}</span>
              <button onClick={() => { navigator.clipboard?.writeText(lead.phone); toast.success("Copied"); }} className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-2 py-1 text-xs hover:bg-accent">
                <Copy className="h-3 w-3" /> Copy
              </button>
            </p>
            <p>📧 {lead.email ?? <span className="italic text-muted-foreground">Not found</span>}</p>
            <p>🌐 {lead.websiteUrl ?? <span className="italic text-muted-foreground">No website</span>}</p>
            <p>⭐ {lead.googleRating} · {lead.reviewCount} reviews</p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Why this is a good lead</p>
            <ul className="mt-2 space-y-1.5 text-sm">
              {reasons.map((r) => (
                <li key={r.label} className="flex items-center justify-between rounded-md bg-emerald-50 px-3 py-1.5 text-emerald-800">
                  <span>✅ {r.label}</span>
                  <span className="font-mono-data text-xs font-semibold">+{r.pts} pts</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex gap-2">
            <button onClick={() => { saveLead(lead); toast.success("Saved to pipeline"); }} disabled={savedIds.has(lead.id)} className="flex-1 rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
              {savedIds.has(lead.id) ? "✓ Saved" : "Save to Pipeline"}
            </button>
            <button className="flex-1 rounded-lg border border-border bg-card py-2.5 text-sm font-semibold hover:bg-accent">
              ✨ Generate Outreach
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
