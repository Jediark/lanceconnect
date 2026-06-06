import { useState } from "react";
import { Bookmark, BookmarkCheck, Check, Copy, Globe, Linkedin, MapPin, Star, XCircle } from "lucide-react";
import { toast } from "sonner";
import { OpportunityScore } from "./OpportunityScore";
import { usePipeline } from "@/contexts/PipelineContext";
import type { Lead } from "@/data/mockData";
import { cn } from "@/lib/utils";

export function LeadCard({ lead, onOpenDetail }: { lead: Lead; onOpenDetail?: (l: Lead) => void }) {
  const { saveLead, savedIds } = usePipeline();
  const isSaved = savedIds.has(lead.id);
  const [saving, setSaving] = useState(false);

  const isB2B = [
    "african_food_export",
    "restaurant_supplier",
    "product_export",
    "b2b_trade",
    "human_capital",
    "training_recruitment",
  ].includes(lead.industry || "");

  const getBuyerSignal = (score: number) => {
    if (score >= 80) return { label: "Hot Lead", color: "text-rose-400 bg-rose-500/10 border-rose-500/20" };
    if (score >= 50) return { label: "Warm Prospect", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" };
    return { label: "Cold Prospect", color: "text-slate-400 bg-slate-500/10 border-slate-500/20" };
  };
  const signalInfo = getBuyerSignal(lead.opportunityScore);

  const getCompanySize = (reviewCount: number) => {
    if (reviewCount > 500) return { label: "Large Enterprise", color: "text-purple-400 bg-purple-500/10 border-purple-500/20" };
    if (reviewCount > 100) return { label: "Medium Company", color: "text-blue-400 bg-blue-500/10 border-blue-500/20" };
    if (reviewCount > 20) return { label: "Small Business", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" };
    return { label: "Micro Business", color: "text-slate-400 bg-slate-500/10 border-slate-500/20" };
  };
  const sizeInfo = getCompanySize(lead.googleReviewCount);

  const alreadyImports =
    lead.industry === "african_food_export" &&
    (/importer|wholesaler|distributor|supermarket|ethnic|african/i.test(lead.businessType || "") ||
      /importer|wholesaler|distributor|supermarket|ethnic|african/i.test(lead.businessName || ""));

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
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(lead.fullAddress || "")}`,
      "_blank",
    );
  };

  return (
    <button
      type="button"
      onClick={() => onOpenDetail?.(lead)}
      className={cn(
        "group relative flex w-full flex-col rounded-2xl border bg-card p-5 text-left transition-all duration-300",
        "hover:border-primary/50 hover:bg-card/80",
        isSaved
          ? "border-emerald-500/70 ring-1 ring-emerald-500/10 bg-emerald-500/[0.01]"
          : "border-border/90",
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
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            {!lead.phoneVerified && (
              <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-500/10 px-2 py-0.5 text-[9px] font-semibold text-amber-500 border border-amber-500/20">
                ⚠️ Unverified phone
              </span>
            )}
            {!lead.emailVerified && lead.email && (
              <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-500/10 px-2 py-0.5 text-[9px] font-semibold text-amber-500 border border-amber-500/20">
                ⚠️ Unverified email
              </span>
            )}
            {lead.hasWebsite && !lead.websiteLive && (
              <span className="inline-flex items-center gap-0.5 rounded-full bg-red-500/10 px-2 py-0.5 text-[9px] font-semibold text-red-400 border border-red-500/20">
                ⚠️ Website unreachable
              </span>
            )}
            {lead.isFlagged && (
              <span className="inline-flex items-center gap-0.5 rounded-full bg-rose-500/10 px-2 py-0.5 text-[9px] font-semibold text-rose-400 border border-rose-500/20 animate-pulse">
                ⚠️ Under Review
              </span>
            )}
          </div>
        </div>
        <OpportunityScore score={lead.opportunityScore} />
      </div>

      {isB2B && (
        <div className="mt-1 mb-2 flex flex-wrap gap-1.5 text-[10px] font-semibold">
          <span className={cn("px-2 py-0.5 rounded-full border", signalInfo.color)}>
            {signalInfo.label}
          </span>
          <span className={cn("px-2 py-0.5 rounded-full border", sizeInfo.color)}>
            {sizeInfo.label}
          </span>
          {alreadyImports && (
            <span className="px-2 py-0.5 rounded-full border bg-amber-500/10 text-amber-400 border-amber-500/20">
              Already Imports African Food
            </span>
          )}
        </div>
      )}

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
        {(lead.hasLinkedin || lead.linkedinUrl) && (
          <a
            href={lead.linkedinUrl || `https://www.linkedin.com/search/results/all/?keywords=${encodeURIComponent(lead.businessName)}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1 mt-1.5 text-xs text-[#0a66c2] hover:underline"
          >
            <Linkedin className="h-3 w-3 fill-current" /> LinkedIn Profile
          </a>
        )}
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
            <>
              <BookmarkCheck className="h-3.5 w-3.5" /> Saved
            </>
          ) : (
            <>
              <Bookmark className="h-3.5 w-3.5" /> Save
            </>
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
