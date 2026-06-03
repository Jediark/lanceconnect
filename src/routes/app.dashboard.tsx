import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Search, TrendingUp } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { MOCK_STATS, CATEGORIES, COUNTRIES } from "@/data/mockData";
import { usePipeline } from "@/contexts/PipelineContext";
import { StatusPill } from "@/components/ui/StatusPill";
import { OpportunityScore } from "@/components/ui/OpportunityScore";
import { useAuth } from "@/contexts/AuthContext";

export const Route = createFileRoute("/app/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — LanceConnect" }] }),
  component: Dashboard,
});

function StatCard({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-2 font-mono-data text-3xl font-bold text-foreground">{value}</p>
      {hint && <p className="mt-1 flex items-center gap-1 text-xs text-emerald-600"><TrendingUp className="h-3 w-3" /> {hint}</p>}
    </div>
  );
}

function Dashboard() {
  const { user } = useAuth();
  const { pipeline } = usePipeline();
  const hour = new Date().getHours();
  const greet = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <>
      <Header title="Dashboard" />
      <div className="space-y-6 px-4 py-6 lg:px-8">
        <div>
          <h2 className="font-display text-2xl font-bold">{greet}, {(user?.fullName || "User").split(" ")[0]} 👋</h2>
          <p className="text-sm text-muted-foreground">You have {pipeline.filter((p) => p.followUpDate).length} leads to follow up today.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Leads Found" value={MOCK_STATS.totalLeadsDiscovered.toString()} hint="+12 today" />
          <StatCard label="Saved this month" value={MOCK_STATS.leadsSavedThisMonth.toString()} />
          <StatCard label="Contacted" value={MOCK_STATS.leadsContacted.toString()} />
          <StatCard label="Response Rate" value={MOCK_STATS.responseRate} hint="avg" />
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-card lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-base font-semibold">Recent pipeline activity</h3>
              <Link to="/app/pipeline" className="text-xs font-medium text-primary hover:underline">View all →</Link>
            </div>
            <ul className="divide-y divide-border">
              {pipeline.slice(0, 5).map((l) => (
                <li key={l.id} className="flex items-center gap-3 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{l.businessName}</p>
                    <p className="text-xs text-muted-foreground">{l.city}, {l.country}</p>
                  </div>
                  <OpportunityScore score={l.opportunityScore} showLabel={false} size="sm" />
                  {l.status && <StatusPill status={l.status} />}
                  <span className="hidden font-mono-data text-xs text-muted-foreground sm:inline">{l.savedAt}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <h3 className="font-display text-base font-semibold">Find leads now</h3>
            <p className="mt-1 text-xs text-muted-foreground">Quick search across categories and countries.</p>
            <div className="mt-4 space-y-2.5">
              <select className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                {CATEGORIES.map((c) => <option key={c.id}>{c.emoji} {c.label}</option>)}
              </select>
              <select className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                {COUNTRIES.map((c) => <option key={c.code}>{c.flag} {c.name}</option>)}
              </select>
              <Link to="/app/discover" className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
                <Search className="h-3.5 w-3.5" /> Search Leads
              </Link>
            </div>
          </div>
        </div>

        {user?.plan === "free" && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-display text-sm font-semibold text-amber-900">
                  {user.leadsUsedThisMonth} of {user.leadsLimit} free leads used this month
                </p>
                <p className="text-xs text-amber-800/80">Upgrade for 100+ leads and AI outreach.</p>
              </div>
              <Link to="/app/upgrade" className="inline-flex items-center gap-1 rounded-lg bg-amber-500 px-4 py-2 text-xs font-semibold text-white hover:bg-amber-600">
                Upgrade <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-amber-200">
              <div className="h-full bg-amber-500" style={{ width: `${(user.leadsUsedThisMonth / user.leadsLimit) * 100}%` }} />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
