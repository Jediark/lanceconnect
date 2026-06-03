import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { H as Header } from "./Header-B1lmU0sd.mjs";
import { E as EmptyState } from "./EmptyState-tsOotTjz.mjs";
import { O as OpportunityScore } from "./OpportunityScore-BrDfy0yO.mjs";
import { f as usePipeline, c as cn, S as STATUS_META } from "./router-BmphvtAh.mjs";
import "../_libs/sonner.mjs";
import { K as Kanban, _ as Table, $ as Trash2 } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "./Sidebar-COwQrclZ.mjs";
import "./PlanUsageBar-D_YzYxE8.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
const COLUMNS = ["new", "contacted", "interested", "proposal_sent", "won"];
function PipelinePage() {
  const {
    pipeline,
    updateStatus,
    removeLead
  } = usePipeline();
  const [view, setView] = reactExports.useState("board");
  const [showLost, setShowLost] = reactExports.useState(false);
  if (pipeline.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Header, { title: "My Pipeline" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-10 lg:px-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { icon: "📭", title: "You haven't saved any leads yet", description: "Head over to Discover Leads to start building your pipeline.", action: {
        label: "Go to Discover Leads",
        onClick: () => window.location.href = "/app/discover"
      } }) })
    ] });
  }
  const columns = showLost ? [...COLUMNS, "lost"] : COLUMNS;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Header, { title: "My Pipeline", subtitle: `${pipeline.length} leads in your funnel` }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2 px-4 py-4 lg:px-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex rounded-lg border border-border bg-card p-0.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setView("board"), className: cn("inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium", view === "board" && "bg-primary text-primary-foreground"), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Kanban, { className: "h-3.5 w-3.5" }),
          " Pipeline"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setView("table"), className: cn("inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium", view === "table" && "bg-primary text-primary-foreground"), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Table, { className: "h-3.5 w-3.5" }),
          " Table"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 text-xs text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: showLost, onChange: (e) => setShowLost(e.target.checked), className: "accent-primary" }),
        "Show Lost"
      ] })
    ] }),
    view === "board" ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto px-4 pb-10 lg:px-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-w-max gap-4", children: columns.map((status) => {
      const cards = pipeline.filter((l) => l.status === status);
      const meta = STATUS_META[status];
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-72 shrink-0 rounded-2xl bg-muted/50 p-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn("mb-3 flex items-center justify-between border-l-4 pl-2", meta.ring), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-semibold uppercase tracking-wide", children: [
            meta.emoji,
            " ",
            meta.label
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full bg-card px-2 py-0.5 text-xs font-mono-data", children: cards.length })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          cards.map((l) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-3 shadow-card", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold leading-tight", children: l.businessName }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(OpportunityScore, { score: l.opportunityScore, size: "sm", showLabel: false })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-0.5 text-xs text-muted-foreground", children: [
              l.city,
              " · ",
              l.businessType
            ] }),
            l.followUpDate && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-2 text-[11px] text-amber-700", children: [
              "📅 Follow up: ",
              l.followUpDate
            ] }),
            l.notes && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-[11px] italic text-muted-foreground", children: [
              '"',
              l.notes,
              '"'
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: l.status ?? "new", onChange: (e) => updateStatus(l.id, e.target.value), className: "flex-1 rounded-md border border-border bg-background px-2 py-1 text-[11px]", children: Object.entries(STATUS_META).map(([k, v]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: k, children: [
                v.emoji,
                " ",
                v.label
              ] }, k)) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => removeLead(l.id), className: "rounded-md border border-border bg-background p-1.5 text-muted-foreground hover:text-red-600", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3 w-3" }) })
            ] })
          ] }, l.id)),
          cards.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "rounded-lg border border-dashed border-border p-4 text-center text-xs text-muted-foreground", children: "Drop leads here" })
        ] })
      ] }, status);
    }) }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 pb-10 lg:px-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto rounded-2xl border border-border bg-card", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full min-w-[800px] text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Business" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Score" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "City" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Phone" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Follow-up" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Notes" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-border", children: pipeline.map((l) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-primary/5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-medium", children: l.businessName }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: l.status ?? "new", onChange: (e) => updateStatus(l.id, e.target.value), className: "rounded-md border border-border bg-background px-2 py-1 text-xs", children: Object.entries(STATUS_META).map(([k, v]) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: k, children: v.label }, k)) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(OpportunityScore, { score: l.opportunityScore, size: "sm", showLabel: false }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground", children: l.city }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-mono-data text-xs", children: l.phone }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-xs text-muted-foreground", children: l.followUpDate ?? "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-xs italic text-muted-foreground", children: l.notes || "—" })
      ] }, l.id)) })
    ] }) }) })
  ] });
}
export {
  PipelinePage as component
};
