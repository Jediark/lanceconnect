import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Table as TableIcon,
  Trash2,
  FolderOpen,
  Calendar,
  Download,
  Mail,
  Phone,
  ThumbsUp,
  Send,
  Trophy,
  Grid,
} from "lucide-react";
import { toast } from "sonner";
import { Header } from "@/components/layout/Header";
import { EmptyState } from "@/components/ui/EmptyState";
import { OpportunityScore } from "@/components/ui/OpportunityScore";
import { StatusPill } from "@/components/ui/StatusPill";
import { usePipeline } from "@/contexts/PipelineContext";
import { STATUS_META, type PipelineStatus } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

export const Route = createFileRoute("/app/pipeline")({
  head: () => ({ meta: [{ title: "My Pipeline — LanceConnect" }] }),
  component: PipelinePage,
});

const COLUMNS: PipelineStatus[] = ["new", "contacted", "interested", "proposal_sent", "won"];

const STATUS_ICONS: Record<PipelineStatus | "lost", any> = {
  new: Mail,
  contacted: Phone,
  interested: ThumbsUp,
  proposal_sent: Send,
  won: Trophy,
  lost: Trash2,
};

function PipelinePage() {
  const { user } = useAuth();
  const { pipeline, updateStatus, removeLead } = usePipeline();
  const [selectedStatus, setSelectedStatus] = useState<PipelineStatus | "all">("all");
  const [view, setView] = useState<"grid" | "table">("grid");
  const [showLost, setShowLost] = useState(false);

  const PIPELINE_STAGES: Record<string, Record<PipelineStatus | "lost", string>> = {
    supplier: { new: 'Identified', contacted: 'Contacted', interested: 'Catalogue Sent', proposal_sent: 'Negotiating', won: 'Contract Signed', lost: 'Lost' },
    human_capital: { new: 'Identified', contacted: 'Contacted', interested: 'Needs Assessment', proposal_sent: 'Proposal Sent', won: 'Contract Signed', lost: 'Lost' },
    training_recruitment: { new: 'Identified', contacted: 'Contacted', interested: 'Requirements Gathered', proposal_sent: 'Candidates Submitted', won: 'Placed', lost: 'Lost' },
    tutor: { new: 'Identified', contacted: 'Contacted', interested: 'Trial Session', proposal_sent: 'Regular Student', won: 'Completed', lost: 'Dropped' },
    freelance: { new: 'New', contacted: 'Contacted', interested: 'Interested', proposal_sent: 'Proposal Sent', won: 'Won', lost: 'Lost' },
  };

  const getPipelineType = (category: string): string => {
    if (['african_food_export','restaurant_supplier','product_export','b2b_trade'].includes(category)) return 'supplier';
    if (category === 'human_capital') return 'human_capital';
    if (category === 'training_recruitment') return 'training_recruitment';
    if (['tutor','parent_tutor'].includes(category)) return 'tutor';
    return 'freelance';
  };

  const getStatusLabel = (status: PipelineStatus | "lost") => {
    const type = getPipelineType(user?.freelancerCategory || "");
    return PIPELINE_STAGES[type]?.[status] || PIPELINE_STAGES.freelance[status] || status;
  };


  const downloadCSV = () => {
    if (pipeline.length === 0) return;
    const headers = [
      "Business Name",
      "Status",
      "Opportunity Score",
      "City",
      "Country",
      "Address",
      "Phone",
      "Email",
      "Website",
      "Notes",
      "Follow-up Date",
    ];
    const csvRows = [
      headers.join(","),
      ...pipeline.map((l) =>
        [
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
          `"${(l.followUpDate || "").replace(/"/g, '""')}"`,
        ].join(","),
      ),
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
            action={{
              label: "Go to Discover Leads",
              onClick: () => (window.location.href = "/app/discover"),
            }}
          />
        </div>
      </>
    );
  }

  const columns = showLost ? [...COLUMNS, "lost" as PipelineStatus] : COLUMNS;

  return (
    <>
      <Header title="My Pipeline" subtitle={`${pipeline.length} leads in your funnel`} />
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-4 py-4 lg:px-8 border-b border-border/50">
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setSelectedStatus("all")}
            className={cn(
              "text-sm font-bold transition",
              selectedStatus === "all"
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            All Categories
          </button>
          <div className="h-4 w-px bg-border mx-1 sm:mx-2" />
          <div className="inline-flex rounded-lg border border-border bg-card p-0.5">
            <button
              onClick={() => setView("grid")}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium sm:px-3 sm:py-1.5",
                view === "grid" && "bg-primary text-primary-foreground",
              )}
            >
              <Grid className="h-3.5 w-3.5" /> Grid
            </button>
            <button
              onClick={() => setView("table")}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium sm:px-3 sm:py-1.5",
                view === "table" && "bg-primary text-primary-foreground",
              )}
            >
              <TableIcon className="h-3.5 w-3.5" /> Table
            </button>
          </div>
          {pipeline.length > 0 && (
            <button
              onClick={downloadCSV}
              className="rounded-lg border border-border bg-card px-2.5 py-1 text-xs font-semibold hover:bg-accent flex items-center gap-1.5 cursor-pointer shadow-sm text-foreground sm:py-1.5"
            >
              <Download className="h-3.5 w-3.5" /> Export
            </button>
          )}
        </div>
        <label className="flex items-center gap-2 text-xs text-muted-foreground self-start sm:self-auto">
          <input
            type="checkbox"
            checked={showLost}
            onChange={(e) => setShowLost(e.target.checked)}
            className="accent-primary"
          />
          Show Lost
        </label>
      </div>

      {/* APILayer-style Category Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 px-4 lg:px-8 mb-8">
        {columns.map((status) => {
          const meta = STATUS_META[status];
          const count = pipeline.filter((l) => l.status === status).length;
          const Icon = STATUS_ICONS[status];
          const isSelected = selectedStatus === status;

          return (
            <div
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={cn(
                "relative cursor-pointer overflow-hidden rounded-xl bg-card border shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover group",
                isSelected ? "border-primary ring-1 ring-primary/50" : "border-border",
              )}
            >
              {/* Bold Top Border mapping to category color */}
              <div
                className="absolute top-0 inset-x-0 h-1.5"
                style={{ backgroundColor: meta.color }}
              />

              <div className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div
                    className="rounded-lg p-2.5"
                    style={{ backgroundColor: meta.color + "15", color: meta.color }}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-foreground leading-tight mb-1">
                      {getStatusLabel(status)}
                    </h3>
                    <p className="text-[11px] text-muted-foreground leading-snug">
                      Track leads currently in the {getStatusLabel(status).toLowerCase()} phase.
                    </p>
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-extrabold text-foreground">{count}</p>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Leads
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Leads Listing Area */}
      {view === "grid" ? (
        <div className="px-4 pb-10 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {pipeline
              .filter((l) => selectedStatus === "all" || l.status === selectedStatus)
              .map((l) => {
                const leadMeta = STATUS_META[l.status ?? "new"];
                return (
                  <div
                    key={l.id}
                    className="relative rounded-xl border border-border bg-card p-4 shadow-sm hover:border-primary/50 transition"
                  >
                    <div
                      className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl"
                      style={{ backgroundColor: leadMeta.color }}
                    />
                    <div className="pl-3 flex flex-col h-full">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="text-sm font-bold text-foreground leading-tight">
                          {l.businessName}
                        </h4>
                        <OpportunityScore score={l.opportunityScore} size="sm" showLabel={false} />
                      </div>
                      <p className="text-[11px] text-muted-foreground mb-4">
                        {l.city} · {l.businessType}
                      </p>

                      <div className="mt-auto space-y-3">
                        {l.followUpDate && (
                          <p className="flex items-center gap-1.5 text-[11px] font-medium text-amber-600 dark:text-amber-500">
                            <Calendar className="h-3.5 w-3.5" /> Follow up: {l.followUpDate}
                          </p>
                        )}

                        <div className="flex items-center gap-2 pt-3 border-t border-border/50">
                          <select
                            value={l.status ?? "new"}
                            onChange={(e) => updateStatus(l.id, e.target.value as PipelineStatus)}
                            className="flex-1 rounded-md border border-border bg-background px-2 py-1.5 text-[11px] font-medium focus:ring-1 focus:ring-primary outline-none"
                          >
                            {Object.entries(STATUS_META).map(([k, v]) => (
                              <option key={k} value={k}>
                                {getStatusLabel(k as PipelineStatus)}
                              </option>
                            ))}
                          </select>
                          <button
                            onClick={() => removeLead(l.id)}
                            className="rounded-md border border-border bg-background p-1.5 text-muted-foreground hover:text-red-500 transition"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
          {pipeline.filter((l) => selectedStatus === "all" || l.status === selectedStatus)
            .length === 0 && (
            <p className="text-center text-sm text-muted-foreground py-10">
              No leads found in this category.
            </p>
          )}
        </div>
      ) : (
        <div className="px-4 pb-10 lg:px-8">
          <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
            <table className="w-full min-w-[800px] text-sm">
              <thead className="bg-muted text-left text-xs uppercase tracking-wide text-muted-foreground">
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
                {pipeline
                  .filter((l) => selectedStatus === "all" || l.status === selectedStatus)
                  .map((l) => (
                    <tr key={l.id} className="hover:bg-primary/5">
                      <td className="px-4 py-3 font-medium">{l.businessName}</td>
                      <td className="px-4 py-3">
                        <select
                          value={l.status ?? "new"}
                          onChange={(e) => updateStatus(l.id, e.target.value as PipelineStatus)}
                          className="rounded-md border border-border bg-background px-2 py-1 text-xs"
                        >
                          {Object.entries(STATUS_META).map(([k, v]) => (
                            <option key={k} value={k}>
                              {getStatusLabel(k as PipelineStatus)}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <OpportunityScore score={l.opportunityScore} size="sm" showLabel={false} />
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{l.city}</td>
                      <td className="px-4 py-3 font-mono-data text-xs">{l.phone}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">
                        {l.followUpDate ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-xs italic text-muted-foreground">
                        {l.notes || "—"}
                      </td>
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
