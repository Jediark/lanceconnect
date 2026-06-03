import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { H as Header } from "./Header-CRCJa7A4.mjs";
import { O as OpportunityScore } from "./OpportunityScore-gvF-z_pR.mjs";
import { g as MOCK_LEADS, C as CATEGORIES, b as COUNTRIES, c as cn, f as usePipeline } from "./router-DdjAxO3q.mjs";
import { E as EmptyState } from "./EmptyState-tsOotTjz.mjs";
import { e as Search, a0 as Grid3x3, a1 as List, c as Check, G as Globe, a2 as CircleX, f as Star, a3 as BookmarkCheck, B as Bookmark, x as Copy, g as MapPin, X, P as Phone, a as Mail } from "../_libs/lucide-react.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/isbot.mjs";
import "./Sidebar-CcaRZzAu.mjs";
import "./PlanUsageBar-CxkCQUHD.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
function LeadCard({ lead, onOpenDetail }) {
  const { saveLead, savedIds } = usePipeline();
  const isSaved = savedIds.has(lead.id);
  const [saving, setSaving] = reactExports.useState(false);
  const handleSave = (e) => {
    e.stopPropagation();
    if (isSaved) return;
    setSaving(true);
    setTimeout(() => {
      saveLead(lead);
      setSaving(false);
      toast.success(`${lead.businessName} saved to pipeline`);
    }, 350);
  };
  const copyPhone = (e) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(lead.phone);
    toast.success("Phone number copied!");
  };
  const openMaps = (e) => {
    e.stopPropagation();
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(lead.fullAddress || "")}`, "_blank");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      type: "button",
      onClick: () => onOpenDetail?.(lead),
      className: cn(
        "group relative flex w-full flex-col rounded-2xl border bg-card p-5 text-left shadow-card transition-all",
        "hover:-translate-y-0.5 hover:shadow-card-hover",
        isSaved ? "border-emerald-400/60 ring-1 ring-emerald-200" : "border-border"
      ),
      children: [
        isSaved && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "absolute -top-2 right-4 inline-flex items-center gap-1 rounded-full bg-emerald-500 px-2 py-0.5 text-[11px] font-medium text-white shadow", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3 w-3" }),
          " Saved"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-2 flex items-start justify-between gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-lg font-semibold leading-tight", children: lead.businessName }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-0.5 text-xs text-muted-foreground", children: [
              lead.businessType,
              " · ",
              lead.city,
              ", ",
              lead.country
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(OpportunityScore, { score: lead.opportunityScore })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "my-3 flex flex-wrap items-center gap-2 border-y border-dashed border-border py-2.5 text-xs", children: [
          lead.hasWebsite ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-700", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "h-3 w-3" }),
            " Has website"
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-red-700", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-3 w-3" }),
            " No website"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 text-amber-600", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-3 w-3 fill-current" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono-data", children: lead.googleRating.toFixed(1) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
              "(",
              lead.googleReviewCount,
              ")"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 space-y-1 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono-data text-[13px]", children: lead.phone }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate text-xs text-muted-foreground", children: lead.email ?? "Email not found" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-auto flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: handleSave,
              disabled: isSaved || saving,
              className: cn(
                "inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition",
                isSaved ? "bg-emerald-100 text-emerald-700" : "bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
              ),
              children: saving ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" }) : isSaved ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(BookmarkCheck, { className: "h-3.5 w-3.5" }),
                " Saved"
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Bookmark, { className: "h-3.5 w-3.5" }),
                " Save"
              ] })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: copyPhone,
              className: "inline-flex items-center justify-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium hover:bg-accent",
              title: "Copy phone",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "h-3.5 w-3.5" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: openMaps,
              className: "inline-flex items-center justify-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium hover:bg-accent",
              title: "Open in Maps",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-3.5 w-3.5" })
            }
          )
        ] })
      ]
    }
  );
}
function Discover() {
  const [category, setCategory] = reactExports.useState("");
  const [country, setCountry] = reactExports.useState("");
  const [city, setCity] = reactExports.useState("");
  const [website, setWebsite] = reactExports.useState("");
  const [minScore, setMinScore] = reactExports.useState(0);
  const [view, setView] = reactExports.useState("grid");
  const [sort, setSort] = reactExports.useState("score");
  const [detail, setDetail] = reactExports.useState(null);
  const results = reactExports.useMemo(() => {
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
  const clear = () => {
    setCategory("");
    setCountry("");
    setCity("");
    setWebsite("");
    setMinScore(0);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Header, { title: "Discover Leads", subtitle: "Find businesses that need your skills" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-b border-border bg-card/60 px-4 py-3 lg:px-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: category, onChange: (e) => setCategory(e.target.value), className: "rounded-lg border border-input bg-background px-3 py-2 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "All Categories" }),
        CATEGORIES.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: c.id, children: [
          c.emoji,
          " ",
          c.label
        ] }, c.id))
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: country, onChange: (e) => setCountry(e.target.value), className: "rounded-lg border border-input bg-background px-3 py-2 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "All Countries" }),
        COUNTRIES.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: c.name, children: [
          c.flag,
          " ",
          c.name
        ] }, c.code))
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: city, onChange: (e) => setCity(e.target.value), placeholder: "Any city...", className: "rounded-lg border border-input bg-background px-3 py-2 text-sm" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: website, onChange: (e) => setWebsite(e.target.value), className: "rounded-lg border border-input bg-background px-3 py-2 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "All Websites" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "no", children: "No Website Only" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "yes", children: "Has Website" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: minScore, onChange: (e) => setMinScore(Number(e.target.value)), className: "rounded-lg border border-input bg-background px-3 py-2 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: 0, children: "Any Score" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: 50, children: "50+" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: 70, children: "70+" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: 85, children: "85+" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "ml-auto inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "h-3.5 w-3.5" }),
        " Search Leads"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: clear, className: "text-xs text-muted-foreground hover:text-foreground", children: "Clear filters" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2 px-4 py-4 lg:px-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
        "Showing ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: results.length }),
        " leads"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: sort, onChange: (e) => setSort(e.target.value), className: "rounded-lg border border-input bg-background px-2 py-1.5 text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "score", children: "Sort by: Score" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "rating", children: "Sort by: Rating" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex rounded-lg border border-border bg-card p-0.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setView("grid"), className: cn("rounded-md p-1.5", view === "grid" && "bg-accent"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Grid3x3, { className: "h-4 w-4" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setView("table"), className: cn("rounded-md p-1.5", view === "table" && "bg-accent"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(List, { className: "h-4 w-4" }) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 pb-10 lg:px-8", children: results.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { icon: "🔍", title: "No leads found in this area yet", description: "Try a different city or expand your filters.", action: {
      label: "Clear all filters",
      onClick: clear
    } }) : view === "grid" ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3", children: results.map((l, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
      animationDelay: `${i * 50}ms`
    }, className: "animate-in fade-in-50 slide-in-from-bottom-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LeadCard, { lead: l, onOpenDetail: setDetail }) }, l.id)) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(LeadTable, { leads: results, onOpenDetail: setDetail }) }),
    detail && /* @__PURE__ */ jsxRuntimeExports.jsx(LeadDetailModal, { lead: detail, onClose: () => setDetail(null) })
  ] });
}
function LeadTable({
  leads,
  onOpenDetail
}) {
  const {
    saveLead,
    savedIds
  } = usePipeline();
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto rounded-2xl border border-border bg-card", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full min-w-[800px] text-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Business" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Location" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Score" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Website" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Phone" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Rating" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-border", children: leads.map((l) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "cursor-pointer hover:bg-primary/5", onClick: () => onOpenDetail(l), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3 font-medium", children: [
        l.businessName,
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: l.businessType })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3 text-muted-foreground", children: [
        l.city,
        ", ",
        l.country
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(OpportunityScore, { score: l.opportunityScore, size: "sm", showLabel: false }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: l.hasWebsite ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-emerald-600", children: "✓ Yes" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-600", children: "✗ No" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-mono-data text-xs", children: l.phone }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-amber-600", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-3 w-3 fill-current" }),
        " ",
        l.googleRating
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: (e) => {
        e.stopPropagation();
        saveLead(l);
        toast.success("Saved");
      }, disabled: savedIds.has(l.id), className: "rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary hover:bg-primary/20 disabled:opacity-50", children: savedIds.has(l.id) ? "Saved" : "Save" }) })
    ] }, l.id)) })
  ] }) });
}
function LeadDetailModal({
  lead,
  onClose
}) {
  const {
    saveLead,
    savedIds
  } = usePipeline();
  const reasons = [!lead.hasWebsite && {
    label: "No website",
    pts: 40
  }, lead.googleRating < 4 && {
    label: "Below average rating",
    pts: 20
  }, lead.googleReviewCount < 20 && {
    label: "Very few reviews",
    pts: 15
  }, {
    label: "Active on Google Maps",
    pts: 10
  }].filter(Boolean);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in", onClick: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { onClick: (e) => e.stopPropagation(), className: "w-full max-w-xl overflow-hidden rounded-2xl bg-card shadow-2xl animate-in zoom-in-95", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between border-b border-border p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-xl font-bold", children: lead.businessName }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
          lead.businessType,
          " · ",
          lead.city,
          ", ",
          lead.country
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "rounded-lg p-1.5 hover:bg-accent", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5 p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold uppercase tracking-wide text-muted-foreground", children: "Opportunity Score" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(OpportunityScore, { score: lead.opportunityScore })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 h-2 overflow-hidden rounded-full bg-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full bg-primary", style: {
          width: `${lead.opportunityScore}%`
        } }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 rounded-xl bg-muted/40 p-4 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-4 w-4 text-muted-foreground" }),
          " ",
          lead.fullAddress || ""
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "flex items-center justify-between gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-2 font-mono-data", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-3.5 w-3.5 text-muted-foreground" }),
            " ",
            lead.phone
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => {
            navigator.clipboard?.writeText(lead.phone);
            toast.success("Copied");
          }, className: "inline-flex items-center gap-1 rounded-md border border-border bg-background px-2 py-1 text-xs hover:bg-accent", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "h-3 w-3" }),
            " Copy"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "h-4 w-4 text-muted-foreground" }),
          " ",
          lead.email ?? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "italic text-muted-foreground", children: "Not found" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "h-4 w-4 text-muted-foreground" }),
          " ",
          lead.websiteUrl ?? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "italic text-muted-foreground", children: "No website" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-4 w-4 fill-amber-500 text-amber-500" }),
          " ",
          lead.googleRating,
          " · ",
          lead.googleReviewCount,
          " reviews"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-wide text-muted-foreground", children: "Why this is a good lead" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-2 space-y-1.5 text-sm", children: reasons.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center justify-between rounded-md bg-emerald-50 px-3 py-1.5 text-emerald-800", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4" }),
            " ",
            r.label
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono-data text-xs font-semibold", children: [
            "+",
            r.pts,
            " pts"
          ] })
        ] }, r.label)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
          saveLead(lead);
          toast.success("Saved to pipeline");
        }, disabled: savedIds.has(lead.id), className: "flex-1 rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50", children: savedIds.has(lead.id) ? "✓ Saved" : "Save to Pipeline" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "flex-1 rounded-lg border border-border bg-card py-2.5 text-sm font-semibold hover:bg-accent", children: "✨ Generate Outreach" })
      ] })
    ] })
  ] }) });
}
export {
  Discover as component
};
