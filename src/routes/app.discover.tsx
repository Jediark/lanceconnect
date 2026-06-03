import { useMemo, useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Grid3X3, List, Search, X, MapPin, Copy, Star, Phone, Mail, Globe, Check, Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Header } from "@/components/layout/Header";
import { LeadCard } from "@/components/ui/LeadCard";
import { OpportunityScore } from "@/components/ui/OpportunityScore";
import { EmptyState } from "@/components/ui/EmptyState";
import { CATEGORIES, COUNTRIES, MOCK_LEADS, type Lead } from "@/data/mockData";
import { usePipeline } from "@/contexts/PipelineContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/discover")({
  head: () => ({ meta: [{ title: "Discover Leads — LanceConnect" }] }),
  component: Discover,
});

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

  useEffect(() => {
    if (!user || user.id === "user-1") {
      setResults(MOCK_LEADS);
    } else {
      setLoading(true);
      supabase
        .from("leads")
        .select("*")
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
            }));
            setResults(mapped);
          }
        });
    }
  }, [user]);

  const handleSearch = async () => {
    if (!city) {
      toast.error("Please enter a city (e.g. Lagos, London).");
      return;
    }

    if (!user || user.id === "user-1") {
      setLoading(true);
      setTimeout(() => {
        const queryTerm = category || "web_dev";
        const filtered = MOCK_LEADS.filter((l) => {
          if (category && l.industry !== category) return false;
          if (country && !l.country.toLowerCase().includes(country.toLowerCase())) return false;
          if (city && !l.city.toLowerCase().includes(city.toLowerCase())) return false;
          if (website === "no" && l.hasWebsite) return false;
          if (website === "yes" && !l.hasWebsite) return false;
          if (l.opportunityScore < minScore) return false;
          return true;
        });
        setResults(filtered);
        setLoading(false);
        toast.success(`Found ${filtered.length} leads in ${city} (Demo Mode)`);
      }, 500);
      return;
    }

    setLoading(true);
    try {
      const queryTerm = category || "local business";
      const countryName = country || "Nigeria";
      const { data, error } = await supabase.functions.invoke("search-leads", {
        body: {
          query: queryTerm,
          city: city,
          country: countryName,
          limit: 20
        }
      });
      if (error) throw error;
      const rawLeads = data?.leads || [];
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
      }));
      setResults(mapped);
      toast.success(`Found ${mapped.length} leads in ${city}!`);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to search leads");
    } finally {
      setLoading(false);
    }
  };

  const filteredResults = useMemo(() => {
    const out = results.filter((l) => {
      if (website === "no" && l.hasWebsite) return false;
      if (website === "yes" && !l.hasWebsite) return false;
      if (l.opportunityScore < minScore) return false;
      return true;
    });
    return [...out].sort((a, b) => sort === "score" ? b.opportunityScore - a.opportunityScore : b.googleRating - a.googleRating);
  }, [results, website, minScore, sort]);

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
          <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Enter city (e.g. Lagos)..." className="rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary" />
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
          <button onClick={handleSearch} disabled={loading} className="ml-auto inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 cursor-pointer">
            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Search className="h-3.5 w-3.5" />} Search Leads
          </button>
          <button onClick={clear} className="text-xs text-muted-foreground hover:text-foreground">Clear filters</button>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 px-4 py-4 lg:px-8">
        <p className="text-sm text-muted-foreground">Showing <span className="font-semibold text-foreground">{filteredResults.length}</span> leads</p>
        <div className="flex items-center gap-3">
          <select value={sort} onChange={(e) => setSort(e.target.value as "score" | "rating")} className="rounded-lg border border-input bg-background px-2 py-1.5 text-xs">
            <option value="score">Sort by: Score</option>
            <option value="rating">Sort by: Rating</option>
          </select>
          <div className="inline-flex rounded-lg border border-border bg-card p-0.5">
            <button onClick={() => setView("grid")} className={cn("rounded-md p-1.5 cursor-pointer", view === "grid" && "bg-accent")}><Grid3X3 className="h-4 w-4" /></button>
            <button onClick={() => setView("table")} className={cn("rounded-md p-1.5 cursor-pointer", view === "table" && "bg-accent")}><List className="h-4 w-4" /></button>
          </div>
        </div>
      </div>

      <div className="px-4 pb-10 lg:px-8">
        {loading && filteredResults.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="mt-2 text-sm text-muted-foreground">Searching business indexes...</p>
          </div>
        ) : filteredResults.length === 0 ? (
          <EmptyState icon="🔍" title="No leads found in this area yet" description="Try a different city or expand your filters." action={{ label: "Clear all filters", onClick: clear }} />
        ) : view === "grid" ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredResults.map((l, i) => (
              <div key={l.id} style={{ animationDelay: `${i * 50}ms` }} className="animate-in fade-in-50 slide-in-from-bottom-2">
                <LeadCard lead={l} onOpenDetail={setDetail} />
              </div>
            ))}
          </div>
        ) : (
          <LeadTable leads={filteredResults} onOpenDetail={setDetail} />
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
              <td className="px-4 py-3 text-amber-600"><span className="inline-flex items-center gap-1"><Star className="h-3 w-3 fill-current" /> {l.googleRating}</span></td>
              <td className="px-4 py-3 text-right">
                <button onClick={(e) => { e.stopPropagation(); saveLead(l); toast.success("Saved to pipeline"); }} disabled={savedIds.has(l.id)} className="rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary hover:bg-primary/20 disabled:opacity-50 cursor-pointer">
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
  
  const [generating, setGenerating] = useState(false);
  const [outreachDraft, setOutreachDraft] = useState("");
  const [selectedChannel, setSelectedChannel] = useState<'email' | 'linkedin' | 'whatsapp' | 'phone_script'>('email');
  const [selectedTone, setSelectedTone] = useState<'casual' | 'professional' | 'bold'>('professional');
  const [provider, setProvider] = useState("");

  const handleGenerate = async () => {
    setGenerating(true);
    setOutreachDraft("");
    try {
      if (!user || user.id === "user-1") {
        setTimeout(() => {
          const draftText = `Subject: Helping ${lead.businessName} with design and web optimization\n\nHi Manager,\n\nI noticed your business online and saw a few areas where a redesigned mobile interface or faster load speeds could increase your customer bookings. I'd love to jump on a quick 5-minute call this week to share some suggestions.\n\nBest,\nAlex`;
          setOutreachDraft(draftText);
          setProvider("⚡ Generated with Gemini");
          setGenerating(false);
          toast.success("AI draft generated successfully!");
        }, 1000);
        return;
      }

      const apiChannel = selectedChannel === 'whatsapp' ? 'sms' : selectedChannel;
      const { data, error } = await supabase.functions.invoke("ai-outreach", {
        body: {
          leadId: lead.id,
          channel: apiChannel,
          tone: selectedTone
        }
      });
      if (error) throw error;
      setOutreachDraft(data.message || "");
      setProvider(data.provider_label || "✦ Generated with AI");
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
    !lead.hasWebsite && { label: "No website detected", pts: 40 },
    lead.googleRating < 4 && { label: "Below average rating", pts: 20 },
    lead.googleReviewCount < 20 && { label: "Very few reviews", pts: 15 },
    { label: "Active Google Maps listing", pts: 10 },
  ].filter(Boolean) as { label: string; pts: number }[];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-in fade-in" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-xl overflow-y-auto max-h-[90vh] rounded-2xl bg-card border border-border shadow-2xl animate-in zoom-in-95">
        <div className="flex items-start justify-between border-b border-border p-6">
          <div>
            <h3 className="font-display text-xl font-bold text-white">{lead.businessName}</h3>
            <p className="text-sm text-slate-400">{lead.businessType} · {lead.city}, {lead.country}</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-accent text-slate-400 hover:text-white cursor-pointer"><X className="h-4 w-4" /></button>
        </div>

        <div className="space-y-5 p-6">
          <div>
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold uppercase tracking-wide text-slate-400">Opportunity Score</span>
              <OpportunityScore score={lead.opportunityScore} />
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800">
              <div className="h-full bg-primary" style={{ width: `${lead.opportunityScore}%` }} />
            </div>
          </div>

          <div className="space-y-2 rounded-xl bg-background border border-border p-4 text-sm text-slate-300">
            <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-slate-500 shrink-0" /> {lead.fullAddress || ""}</p>
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-2 font-mono text-xs"><Phone className="h-3.5 w-3.5 text-slate-500" /> {lead.phone}</span>
              {lead.phone && (
                <button onClick={() => { navigator.clipboard?.writeText(lead.phone); toast.success("Copied!"); }} className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-2 py-0.5 text-[10px] text-white hover:bg-accent cursor-pointer">
                  <Copy className="h-2.5 w-2.5" /> Copy
                </button>
              )}
            </div>
            <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-slate-500 shrink-0" /> {lead.email ?? <span className="italic text-slate-500">Not found</span>}</p>
            <p className="flex items-center gap-2"><Globe className="h-4 w-4 text-slate-500 shrink-0" /> {lead.websiteUrl ?? <span className="italic text-slate-500">No website</span>}</p>
            <p className="flex items-center gap-2"><Star className="h-4 w-4 fill-amber-500 text-amber-500 shrink-0" /> {lead.googleRating} · {lead.googleReviewCount} reviews</p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Opportunity Breakdown</p>
            <ul className="mt-2 space-y-1.5 text-sm">
              {reasons.map((r) => (
                <li key={r.label} className="flex items-center justify-between rounded-md bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 text-emerald-400">
                  <span className="inline-flex items-center gap-2"><Check className="h-4 w-4" /> {r.label}</span>
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
                    <button onClick={() => setOutreachDraft("")} className="rounded-lg border border-border bg-card px-3 py-1 text-xs text-slate-300 hover:text-white cursor-pointer">Edit Settings</button>
                    <button onClick={copyDraft} className="rounded-lg bg-primary px-3 py-1 text-xs font-semibold text-white hover:bg-primary/90 cursor-pointer">Copy Pitch</button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-3 rounded-xl border border-border bg-background p-3.5 space-y-3">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-slate-400 font-medium">Channel:</span>
                    <select 
                      value={selectedChannel} 
                      onChange={(e) => setSelectedChannel(e.target.value as any)} 
                      className="bg-card text-xs border border-border rounded px-1.5 py-0.5 text-white"
                    >
                      <option value="email">📧 Email</option>
                      <option value="linkedin">🔗 LinkedIn DM</option>
                      <option value="whatsapp">💬 WhatsApp Message</option>
                      <option value="phone_script">📞 Phone Script</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-slate-400 font-medium">Tone:</span>
                    <select 
                      value={selectedTone} 
                      onChange={(e) => setSelectedTone(e.target.value as any)} 
                      className="bg-card text-xs border border-border rounded px-1.5 py-0.5 text-white"
                    >
                      <option value="professional">👔 Professional</option>
                      <option value="casual">☕ Casual</option>
                      <option value="bold">🚀 Bold/Direct</option>
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
            <button onClick={() => { saveLead(lead); toast.success("Saved to pipeline"); }} disabled={savedIds.has(lead.id)} className="flex-1 rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 cursor-pointer">
              {savedIds.has(lead.id) ? "✓ Saved in CRM" : "Save to Pipeline"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
