import { useState } from "react";
import { Bookmark, BookmarkCheck, Check, Copy, Globe, Linkedin, MapPin, Star, XCircle, Facebook, Instagram, Twitter } from "lucide-react";
import { toast } from "sonner";
import { OpportunityScore } from "./OpportunityScore";
import { usePipeline } from "@/contexts/PipelineContext";
import type { Lead } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-500/10 px-2 py-0.5 text-[9px] font-semibold text-amber-500 border border-amber-500/20 cursor-help">
                      ⚠️ Unverified phone
                    </span>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs bg-slate-900 border border-slate-700 text-slate-200 p-2 text-xs">
                    <p>
                      This number could not be verified by our system. It may still be correct — try calling or WhatsApp first.
                      {(lead.country?.toLowerCase() === "nigeria" || lead.phone?.startsWith("+234") || lead.phone?.startsWith("234")) && (
                        <span className="block mt-1 font-medium text-amber-400">
                          Nigerian numbers are harder to verify automatically — the number is likely correct.
                        </span>
                      )}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
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

      <div className="mb-4 space-y-2 text-sm">
        {lead.phone && (
          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            <a
              href={formatWhatsApp(lead.phone)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-green-500 hover:text-green-400 font-mono text-sm"
              title="Message on WhatsApp"
            >
              <WhatsAppIcon size={14} />
              {lead.phone}
            </a>
            <button
              type="button"
              onClick={copyPhone}
              className="rounded p-1 text-slate-400 hover:bg-accent hover:text-foreground transition"
              title="Copy Phone Number"
            >
              <Copy className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {lead.email ? (
          <p className="truncate text-xs text-muted-foreground">
            {lead.email}
          </p>
        ) : (
          <div className="space-y-1" onClick={(e) => e.stopPropagation()}>
            <span className="text-slate-500 text-xs italic">
              📧 Email not publicly listed
            </span>
            <div className="flex flex-wrap gap-2 mt-1">
              {lead.phone && (
                <a
                  href={formatWhatsApp(lead.phone)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-green-500 hover:underline"
                >
                  💬 Try WhatsApp instead
                </a>
              )}
              {lead.googlePlaceId && (
                <a
                  href={lead.googleMapsUrl || `https://www.google.com/maps/place/?q=place_id:${lead.googlePlaceId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-400 hover:underline"
                >
                  📍 Check Google Maps
                </a>
              )}
              {lead.hasInstagram && lead.instagramUrl && (
                <a
                  href={lead.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-pink-400 hover:underline"
                >
                  📸 Check Instagram
                </a>
              )}
            </div>
          </div>
        )}

        {/* Direct Google Maps Contact Page Link */}
        <div className="pt-1" onClick={(e) => e.stopPropagation()}>
          <a
            href={lead.googleMapsUrl || `https://www.google.com/maps/place/?q=place_id:${lead.googlePlaceId || ""}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 text-xs hover:underline flex items-center gap-1"
          >
            📍 View on Google Maps
          </a>
        </div>

        {/* Social Media Direct Links */}
        <div className="flex flex-wrap gap-2.5 mt-2 pt-1 border-t border-dashed border-border/50" onClick={(e) => e.stopPropagation()}>
          {lead.hasFacebook && lead.facebookUrl && (
            <a
              href={lead.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-400 transition"
              title="Facebook Profile"
            >
              <Facebook size={16} />
            </a>
          )}
          {lead.hasInstagram && lead.instagramUrl && (
            <a
              href={lead.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-500 hover:text-pink-400 transition"
              title="Instagram Profile"
            >
              <Instagram size={16} />
            </a>
          )}
          {lead.hasLinkedin && lead.linkedinUrl && (
            <a
              href={lead.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 transition"
              title="LinkedIn Profile"
            >
              <Linkedin size={16} />
            </a>
          )}
          {lead.hasTwitter && lead.twitterUrl && (
            <a
              href={lead.twitterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-400 hover:text-sky-300 transition"
              title="Twitter Profile"
            >
              <Twitter size={16} />
            </a>
          )}
        </div>
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
