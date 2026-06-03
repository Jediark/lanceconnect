import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Kanban, Table as TableIcon, Trash2, FolderOpen, Calendar, Download } from "lucide-react";
import { toast } from "sonner";
import { Header } from "@/components/layout/Header";
import { EmptyState } from "@/components/ui/EmptyState";
import { OpportunityScore } from "@/components/ui/OpportunityScore";
import { StatusPill } from "@/components/ui/StatusPill";
import { usePipeline } from "@/contexts/PipelineContext";
import { STATUS_META, type PipelineStatus } from "@/data/mockData";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/pipeline")({
  head: () => ({ meta: [{ title: "My Pipeline — LanceConnect" }] }),
  component: PipelinePage,
});

const COLUMNS: PipelineStatus[] = ["new", "contacted", "interested", "proposal_sent", "won"];

function PipelinePage() {
  const { pipeline, updateStatus, removeLead } = usePipeline();
  const [view, setView] = useState<"board" | "table">("board");
  const [showLost, setShowLost] = useState(false);

  const downloadCSV = () => {
    if (pipeline.length === 0) return;
    const headers = ["Business Name", "Status", "Opportunity Score", "City", "Country", "Address", "Phone", "Email", "Website", "Notes", "Follow-up Date"];
    const csvRows = [
      headers.join(","),
      ...pipeline.map(l => [
        `"${l.businessName.replace(/"/g, '""')}"`,
        `"${(l.status || "new").replace(/"/g, '""')}"`,
        l.opportunityScore,
        `"${l.city.replace(/"/g, '""')}"`,
        `"${l.country.replace(/"/g, '""')}"`,
        `"${l.fullAddress.replace(/"/g, '""')}"`,
        `"${(l.phone || "").replace(/"/g, '""')}"`,
        `"${(l.email || "").replace(/"/g, '""')}"`,
        `"${(l.websiteUrl || "").replace(/"/g, '""')}"`,
        `"${(l.notes || "").replace(/"/g, '""')}"`,
        `"${(l.followUpDate || "").replace(/"/g, '""')}"`
      ].join(","))
    ];
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "crm_pipeline.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Pipeline CSV spreadsheet exported successfully!");
  };

  if (pipeline.length === 0) {
    return (
      <>
        <Header title="My Pipeline" />
        <div className="px-4 py-10 lg:px-8">
          <EmptyState
            icon={<FolderOpen className="h-10 w-10 text-muted-foreground/60" />}
            title="You haven't saved any leads yet"
            description="Head over to Discover Leads to start building your pipeline."
            action={{ label: "Go to Discover Leads", onClick: () => (window.location.href = "/app/discover") }}
          />
        </div>
      </>
    );
  }

  const columns = showLost ? [...COLUMNS, "lost" as PipelineStatus] : COLUMNS;

  return (
    <>
      <Header title="My Pipeline" subtitle={`${pipeline.length} leads in your funnel`} />
      <div className="flex items-center justify-between gap-2 px-4 py-4 lg:px-8 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="inline-flex rounded-lg border border-border bg-card p-0.5">
            <button onClick={() => setView("board")} className={cn("inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium", view === "board" && "bg-primary text-primary-foreground")}>
              <Kanban className="h-3.5 w-3.5" /> Pipeline
            </button>
            <button onClick={() => setView("table")} className={cn("inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium", view === "table" && "bg-primary text-primary-foreground")}>
              <TableIcon className="h-3.5 w-3.5" /> Table
            </button>
          </div>
          {pipeline.length > 0 && (
            <button
              onClick={downloadCSV}
              className="rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs font-semibold hover:bg-accent flex items-center gap-1.5 cursor-pointer shadow-sm text-foreground"
            >
              <Download className="h-3.5 w-3.5" /> Export Pipeline CSV
            </button>
          )}
        </div>
        <label className="flex items-center gap-2 text-xs text-muted-foreground">
          <input type="checkbox" checked={showLost} onChange={(e) => setShowLost(e.target.checked)} className="accent-primary" />
          Show Lost
        </label>
      </div>

      {view === "board" ? (
        <div className="overflow-x-auto px-4 pb-10 lg:px-8">
          <div className="flex min-w-max gap-4">
            {columns.map((status) => {
              const cards = pipeline.filter((l) => l.status === status);
              const meta = STATUS_META[status];
              return (
                <div key={status} className="w-72 shrink-0 rounded-2xl bg-muted/50 p-3">
                  <div className={cn("mb-3 flex items-center justify-between border-l-4 pl-2", meta.ring)}>
                    <p className="text-xs font-semibold uppercase tracking-wide">{meta.label}</p>
                    <span className="rounded-full bg-card px-2 py-0.5 text-xs font-mono-data">{cards.length}</span>
                  </div>
                  <div className="space-y-2">
                    {cards.map((l) => (
                      <div key={l.id} className="rounded-xl border border-border bg-card p-3 shadow-card">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-semibold leading-tight">{l.businessName}</p>
                          <OpportunityScore score={l.opportunityScore} size="sm" showLabel={false} />
                        </div>
                        <p className="mt-0.5 text-xs text-muted-foreground">{l.city} · {l.businessType}</p>
                        {l.followUpDate && (
                          <p className="mt-2 flex items-center gap-1 text-[11px] text-amber-700">
                            <Calendar className="h-3 w-3" /> Follow up: {l.followUpDate}
                          </p>
                        )}
                        {l.notes && <p className="mt-1 text-[11px] italic text-muted-foreground">"{l.notes}"</p>}
                        <div className="mt-3 flex items-center gap-1">
                          <select
                            value={l.status ?? "new"}
                            onChange={(e) => updateStatus(l.id, e.target.value as PipelineStatus)}
                            className="flex-1 rounded-md border border-border bg-background px-2 py-1 text-[11px]"
                          >
                            {Object.entries(STATUS_META).map(([k, v]) => (
                              <option key={k} value={k}>{v.label}</option>
                            ))}
                          </select>
                          <button onClick={() => removeLead(l.id)} className="rounded-md border border-border bg-background p-1.5 text-muted-foreground hover:text-red-600">
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                    {cards.length === 0 && (
                      <p className="rounded-lg border border-dashed border-border p-4 text-center text-xs text-muted-foreground">Drop leads here</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="px-4 pb-10 lg:px-8">
          <div className="overflow-x-auto rounded-2xl border border-border bg-card">
            <table className="w-full min-w-[800px] text-sm">
              <thead className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Business</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Score</th>
                  <th className="px-4 py-3">City</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Follow-up</th>
                  <th className="px-4 py-3">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {pipeline.map((l) => (
                  <tr key={l.id} className="hover:bg-primary/5">
                    <td className="px-4 py-3 font-medium">{l.businessName}</td>
                    <td className="px-4 py-3">
                      <select value={l.status ?? "new"} onChange={(e) => updateStatus(l.id, e.target.value as PipelineStatus)} className="rounded-md border border-border bg-background px-2 py-1 text-xs">
                        {Object.entries(STATUS_META).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-3"><OpportunityScore score={l.opportunityScore} size="sm" showLabel={false} /></td>
                    <td className="px-4 py-3 text-muted-foreground">{l.city}</td>
                    <td className="px-4 py-3 font-mono-data text-xs">{l.phone}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{l.followUpDate ?? "—"}</td>
                    <td className="px-4 py-3 text-xs italic text-muted-foreground">{l.notes || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
