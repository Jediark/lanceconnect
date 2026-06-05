import { useState } from "react";
import { Bookmark, BookmarkCheck, Check, Copy, Globe, MapPin, Star, XCircle } from "lucide-react";
import { toast } from "sonner";
import { OpportunityScore } from "./OpportunityScore";
import { usePipeline } from "@/contexts/PipelineContext";
import type { Lead } from "@/data/mockData";
import { cn } from "@/lib/utils";

export function LeadCard({ lead, onOpenDetail }: { lead: Lead; onOpenDetail?: (l: Lead) => void }) {
  const { saveLead, savedIds } = usePipeline();
  const isSaved = savedIds.has(lead.id);
  const [saving, setSaving] = useState(false);

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSaved) return;
    setSaving(true);
    setTimeout(() => {
      saveLead(lead);
      setSaving(false);
      toast.success(`${lead.businessName} saved to pipeline`);
    }, 350);
  };

  const copyPhone = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(lead.phone);
    toast.success("Phone number copied!");
  };

  const openMaps = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(lead.fullAddress || "")}`, "_blank");
  };

  return (
    <button
      type="button"
      onClick={() => onOpenDetail?.(lead)}
      className={cn(
        "group relative flex w-full flex-col rounded-2xl border bg-card p-5 text-left transition-all duration-300",
        "hover:border-primary/50 hover:bg-card/80",
        isSaved ? "border-emerald-500/70 ring-1 ring-emerald-500/10 bg-emerald-500/[0.01]" : "border-border/90",
      )}
    >
      {isSaved && (
        <span className="absolute -top-2 right-4 inline-flex items-center gap-1 rounded-full bg-emerald-500 px-2 py-0.5 text-[11px] font-bold text-white border border-emerald-400/30">
          <Check className="h-3 w-3" /> Saved
        </span>
      )}

      <div className="mb-2 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-display text-lg font-semibold leading-tight">{lead.businessName}</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {lead.businessType} · {lead.city}, {lead.country}
          </p>
        </div>
        <OpportunityScore score={lead.opportunityScore} />
      </div>

      <div className="my-3 flex flex-wrap items-center gap-2 border-y border-dashed border-border py-2.5 text-xs">
        {lead.hasWebsite ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-700">
            <Globe className="h-3 w-3" /> Has website
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-red-700">
            <XCircle className="h-3 w-3" /> No website
          </span>
        )}
        <span className="inline-flex items-center gap-1 text-amber-600">
          <Star className="h-3 w-3 fill-current" />
          <span className="font-mono-data">{lead.googleRating.toFixed(1)}</span>
          <span className="text-muted-foreground">({lead.googleReviewCount})</span>
        </span>
      </div>

      <div className="mb-4 space-y-1 text-sm">
        <p className="font-mono-data text-[13px]">{lead.phone}</p>
        <p className="truncate text-xs text-muted-foreground">
          {lead.email ?? "Not publicly listed"}
        </p>
      </div>

      <div className="mt-auto flex items-center gap-2">
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaved || saving}
          className={cn(
            "inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition",
            isSaved
              ? "bg-emerald-100 text-emerald-700"
              : "bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-60",
          )}
        >
          {saving ? (
            <span className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : isSaved ? (
            <><BookmarkCheck className="h-3.5 w-3.5" /> Saved</>
          ) : (
            <><Bookmark className="h-3.5 w-3.5" /> Save</>
          )}
        </button>
        <button
          type="button"
          onClick={copyPhone}
          className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium hover:bg-accent"
          title="Copy phone"
        >
          <Copy className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={openMaps}
          className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium hover:bg-accent"
          title="Open in Maps"
        >
          <MapPin className="h-3.5 w-3.5" />
        </button>
      </div>
    </button>
  );
}
