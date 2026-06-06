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
  Globe,
  Star,
  XCircle,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Copy,
  MapPin,
} from "lucide-react";
import { toast } from "sonner";
import { Header } from "@/components/layout/Header";
import { EmptyState } from "@/components/ui/EmptyState";
import { OpportunityScore } from "@/components/ui/OpportunityScore";
import { StatusPill } from "@/components/ui/StatusPill";
import { usePipeline } from "@/contexts/PipelineContext";
import { STATUS_META, type Lead, type PipelineStatus } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";

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

const WhatsAppIcon = ({ size = 14 }: { size?: number }) => (
  <svg
    className="fill-current shrink-0"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.488 1.45 5.41 1.451 5.353 0 9.709-4.352 9.712-9.711.001-2.597-1.006-5.038-2.834-6.87-1.827-1.83-4.269-2.836-6.87-2.837-5.356 0-9.714 4.354-9.717 9.714-.001 1.983.518 3.92 1.503 5.629L2.748 21.3l4.899-1.286zm10.744-6.953c-.307-.153-1.815-.896-2.09-.997-.277-.1-.478-.153-.679.153-.2.306-.777.997-.95 1.198-.175.202-.349.224-.656.071-1.127-.565-1.878-1.002-2.614-2.262-.196-.336.196-.312.56-.632.06-.053.12-.108.174-.165.17-.184.22-.303.32-.505.099-.202.05-.38-.025-.533-.075-.153-.679-1.636-.93-2.24-.244-.587-.49-.508-.679-.518-.175-.008-.376-.01-.577-.01-.202 0-.53.075-.807.38-.277.304-1.058 1.034-1.058 2.52 0 1.485 1.079 2.921 1.23 3.123.15.202 2.124 3.242 5.145 4.544 2.457 1.059 3.036 1.012 3.655.885.727-.148 1.815-.742 2.072-1.46.257-.716.257-1.33.18-1.46-.076-.127-.276-.202-.583-.355z" />
  </svg>
);

const formatWhatsApp = (phone: string): string => {
  const digits = phone.replace(/\D/g, "");
  return `https://wa.me/${digits}`;
};

function PipelinePage() {
  const { user } = useAuth();
  const { pipeline, updateStatus, removeLead } = usePipeline();
  const [selectedStatus, setSelectedStatus] = useState<PipelineStatus | "all">("all");
  const [view, setView] = useState<"grid" | "table">("grid");
  const [showLost, setShowLost] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [manualEmail, setManualEmail] = useState("");

  const handleOpenLead = (lead: Lead) => {
    setSelectedLead(lead);
    setManualEmail(lead.email || "");
  };

  const saveManualEmail = async () => {
    if (!selectedLead) return;
    try {
      // Update email on leads table
      const { error: leadErr } = await supabase
        .from("leads")
        .update({
          email: manualEmail || null,
          email_confidence: "manually_added",
          email_verified: false,
        })
        .eq("id", selectedLead.id);

      if (leadErr) throw leadErr;

      const existingNotes = selectedLead.notes || "";
      const appendedNotes = existingNotes
        ? `${existingNotes}\nEmail added manually: ${manualEmail}`
        : `Email added manually: ${manualEmail}`;

      // Update notes on user_leads table
      const { error: userLeadErr } = selectedLead.userLeadId
        ? await supabase
            .from("user_leads")
            .update({ notes: appendedNotes })
            .eq("id", selectedLead.userLeadId)
        : await supabase
            .from("user_leads")
            .update({ notes: appendedNotes })
            .eq("user_id", user?.id)
            .eq("lead_id", selectedLead.id);

      if (userLeadErr) throw userLeadErr;

      toast.success("Email saved!");

      // Update local state in pipeline context so the UI updates instantly
      await updateStatus(selectedLead.id, selectedLead.status || "new", appendedNotes);

      // Also update the local selectedLead state
      setSelectedLead((prev) => (prev ? { ...prev, email: manualEmail, notes: appendedNotes } : null));
    } catch (err: any) {
      console.error("Error saving manual email:", err);
      toast.error(err.message || "Failed to save manual email.");
    }
  };

  const handleRateLead = async (leadId: string, rating: "genuine" | "suspicious") => {
    if (!user) {
      toast.error("You must be logged in to rate a business.");
      return;
    }
    try {
      const { error } = await supabase.from("lead_ratings").upsert({
        user_id: user.id,
        lead_id: leadId,
        rating: rating,
      });

      if (error) {
        if (error.code === "23505") {
          toast.warning("You have already rated this lead.");
          return;
        }
        throw error;
      }
      toast.success(rating === "genuine" ? "Thank you! Business marked as genuine." : "Thank you. Rating submitted.");
    } catch (err: any) {
      console.error("Error rating lead:", err);
      toast.error(err.message || "Failed to submit rating.");
    }
  };

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
                    onClick={() => handleOpenLead(l)}
                    className="relative rounded-xl border border-border bg-card p-4 shadow-sm hover:border-primary/50 transition cursor-pointer hover:bg-accent/5"
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

                        <div className="flex items-center gap-2 pt-3 border-t border-border/50" onClick={(e) => e.stopPropagation()}>
                          <select
                            value={l.status ?? "new"}
                            onClick={(e) => e.stopPropagation()}
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
                            onClick={(e) => {
                              e.stopPropagation();
                              removeLead(l.id);
                            }}
                            className="rounded-md border border-border bg-background p-1.5 text-muted-foreground hover:text-red-500 transition"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        <div className="flex flex-col gap-1.5 pt-2 border-t border-border/30" onClick={(e) => e.stopPropagation()}>
                          <p className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider">
                            Community Verification
                          </p>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleRateLead(l.id, "genuine")}
                              className="flex-1 rounded-md border border-border bg-card py-1 px-1.5 text-[10px] font-medium hover:bg-primary/5 hover:border-primary/30 flex items-center justify-center gap-1 transition text-foreground"
                            >
                              👍 Yes
                            </button>
                            <button
                              onClick={() => handleRateLead(l.id, "suspicious")}
                              className="flex-1 rounded-md border border-border bg-card py-1 px-1.5 text-[10px] font-medium hover:bg-red-500/5 hover:border-red-500/30 flex items-center justify-center gap-1 transition text-red-500/80 hover:text-red-500"
                            >
                              👎 Suspicious
                            </button>
                          </div>
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
                    <tr
                      key={l.id}
                      onClick={() => handleOpenLead(l)}
                      className="hover:bg-primary/5 cursor-pointer"
                    >
                      <td className="px-4 py-3 font-medium">{l.businessName}</td>
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={l.status ?? "new"}
                          onClick={(e) => e.stopPropagation()}
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

      {/* 📂 LEAD DETAIL DRAWER 📂 */}
      <Sheet open={selectedLead !== null} onOpenChange={(open) => !open && setSelectedLead(null)}>
        <SheetContent className="sm:max-w-md overflow-y-auto bg-card border-l border-border text-foreground">
          {selectedLead && (
            <div className="space-y-6">
              <SheetHeader>
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary uppercase tracking-wider">
                    {selectedLead.status ? getStatusLabel(selectedLead.status) : "New"}
                  </span>
                  <OpportunityScore score={selectedLead.opportunityScore} />
                </div>
                <SheetTitle className="text-xl font-bold font-display mt-2">
                  {selectedLead.businessName}
                </SheetTitle>
                <SheetDescription className="text-xs text-muted-foreground">
                  {selectedLead.businessType} · {selectedLead.city}, {selectedLead.country}
                </SheetDescription>
              </SheetHeader>

              {/* Address */}
              <div className="rounded-xl bg-muted/30 p-3.5 border border-border/50 text-sm space-y-1">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Address</span>
                <p className="text-xs text-foreground/90 flex items-start gap-1">
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-muted-foreground mt-0.5" />
                  {selectedLead.fullAddress || `${selectedLead.city}, ${selectedLead.country}`}
                </p>
              </div>

              {/* Contact Channels */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Contact details</h4>
                
                {selectedLead.phone ? (
                  <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-muted/10">
                    <a
                      href={formatWhatsApp(selectedLead.phone)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-green-500 hover:text-green-400 font-mono text-sm font-medium"
                    >
                      <WhatsAppIcon size={16} />
                      {selectedLead.phone}
                    </a>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(selectedLead.phone);
                        toast.success("Phone copied to clipboard!");
                      }}
                      className="rounded border border-border bg-card p-1.5 hover:bg-accent text-muted-foreground hover:text-foreground transition"
                      title="Copy Number"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground italic">No phone number available</p>
                )}

                {/* Email Field with Manual Entry */}
                <div className="space-y-2 pt-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
                    Email (add manually if found)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      placeholder="Enter email if you find it..."
                      value={manualEmail}
                      onChange={(e) => setManualEmail(e.target.value)}
                      className="flex-1 text-sm bg-background border border-border rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-primary"
                    />
                    <button
                      onClick={saveManualEmail}
                      className="text-xs font-semibold bg-primary hover:bg-primary/95 text-primary-foreground px-4 py-2 rounded-lg transition"
                    >
                      Save
                    </button>
                  </div>
                  {selectedLead.email ? (
                    <p className="text-xs text-muted-foreground">
                      Current: <span className="font-mono text-foreground">{selectedLead.email}</span>
                    </p>
                  ) : (
                    <div className="space-y-1 pt-1">
                      <span className="text-slate-500 text-xs italic">
                        📧 Email not publicly listed
                      </span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {selectedLead.phone && (
                          <a
                            href={formatWhatsApp(selectedLead.phone)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-green-500 hover:underline"
                          >
                            💬 Try WhatsApp instead
                          </a>
                        )}
                        {selectedLead.googlePlaceId && (
                          <a
                            href={selectedLead.googleMapsUrl || `https://www.google.com/maps/place/?q=place_id:${selectedLead.googlePlaceId}`}
                            target="_blank"
                            className="text-xs text-blue-400 hover:underline"
                          >
                            📍 Check Google Maps
                          </a>
                        )}
                        {selectedLead.hasInstagram && selectedLead.instagramUrl && (
                          <a
                            href={selectedLead.instagramUrl}
                            target="_blank"
                            className="text-xs text-pink-400 hover:underline"
                          >
                            📸 Check Instagram
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Verify manually via Maps */}
              <div className="pt-2">
                <a
                  href={selectedLead.googleMapsUrl || `https://www.google.com/maps/place/?q=place_id:${selectedLead.googlePlaceId || ""}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 text-xs hover:underline flex items-center gap-1"
                >
                  📍 Open direct Google Maps to check manually
                </a>
              </div>

              {/* Social Channels */}
              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Social Channels</h4>
                <div className="flex flex-wrap gap-3">
                  {selectedLead.hasFacebook && selectedLead.facebookUrl && (
                    <a
                      href={selectedLead.facebookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-400 transition"
                      title="Facebook"
                    >
                      <Facebook size={20} />
                    </a>
                  )}
                  {selectedLead.hasInstagram && selectedLead.instagramUrl && (
                    <a
                      href={selectedLead.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-pink-500 hover:text-pink-400 transition"
                      title="Instagram"
                    >
                      <Instagram size={20} />
                    </a>
                  )}
                  {selectedLead.hasLinkedin && selectedLead.linkedinUrl && (
                    <a
                      href={selectedLead.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 transition"
                      title="LinkedIn"
                    >
                      <Linkedin size={20} />
                    </a>
                  )}
                  {selectedLead.hasTwitter && selectedLead.twitterUrl && (
                    <a
                      href={selectedLead.twitterUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sky-400 hover:text-sky-300 transition"
                      title="Twitter"
                    >
                      <Twitter size={20} />
                    </a>
                  )}
                  {!selectedLead.hasFacebook && !selectedLead.hasInstagram && !selectedLead.hasLinkedin && !selectedLead.hasTwitter && (
                    <span className="text-xs text-muted-foreground italic">No social media links detected</span>
                  )}
                </div>
              </div>

              {/* Notes Log */}
              <div className="space-y-2 pt-4 border-t border-border/60">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
                  Pipeline Notes
                </label>
                <textarea
                  value={selectedLead.notes || ""}
                  disabled
                  rows={4}
                  className="w-full text-xs font-mono bg-muted/30 border border-border/80 rounded-lg p-2.5 resize-none text-muted-foreground"
                />
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
