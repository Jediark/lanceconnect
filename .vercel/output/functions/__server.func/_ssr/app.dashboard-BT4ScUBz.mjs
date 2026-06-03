import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { H as Header } from "./Header-B1lmU0sd.mjs";
import { u as useAuth, f as usePipeline, h as MOCK_STATS, C as CATEGORIES, b as COUNTRIES, S as STATUS_META, c as cn } from "./router-BmphvtAh.mjs";
import { O as OpportunityScore } from "./OpportunityScore-BrDfy0yO.mjs";
import "../_libs/sonner.mjs";
import { e as Search, A as ArrowRight, a4 as TrendingUp } from "../_libs/lucide-react.mjs";
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
function StatusPill({ status, className }) {
  const meta = STATUS_META[status];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium", meta.color, className), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: meta.emoji }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: meta.label })
  ] });
}
function StatCard({
  label,
  value,
  hint
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-card p-5 shadow-card", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium uppercase tracking-wide text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 font-mono-data text-3xl font-bold text-foreground", children: value }),
    hint && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 flex items-center gap-1 text-xs text-emerald-600", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-3 w-3" }),
      " ",
      hint
    ] })
  ] });
}
function Dashboard() {
  const {
    user
  } = useAuth();
  const {
    pipeline
  } = usePipeline();
  const hour = (/* @__PURE__ */ new Date()).getHours();
  const greet = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Header, { title: "Dashboard" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 px-4 py-6 lg:px-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display text-2xl font-bold", children: [
          greet,
          ", ",
          (user?.fullName || "User").split(" ")[0],
          " 👋"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
          "You have ",
          pipeline.filter((p) => p.followUpDate).length,
          " leads to follow up today."
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Leads Found", value: MOCK_STATS.totalLeadsDiscovered.toString(), hint: "+12 today" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Saved this month", value: MOCK_STATS.leadsSavedThisMonth.toString() }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Contacted", value: MOCK_STATS.leadsContacted.toString() }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Response Rate", value: MOCK_STATS.responseRate, hint: "avg" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 lg:grid-cols-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-card p-6 shadow-card lg:col-span-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-base font-semibold", children: "Recent pipeline activity" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/app/pipeline", className: "text-xs font-medium text-primary hover:underline", children: "View all →" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "divide-y divide-border", children: pipeline.slice(0, 5).map((l) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-3 py-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate text-sm font-medium", children: l.businessName }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                l.city,
                ", ",
                l.country
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(OpportunityScore, { score: l.opportunityScore, showLabel: false, size: "sm" }),
            l.status && /* @__PURE__ */ jsxRuntimeExports.jsx(StatusPill, { status: l.status }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden font-mono-data text-xs text-muted-foreground sm:inline", children: l.savedAt })
          ] }, l.id)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-card p-6 shadow-card", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-base font-semibold", children: "Find leads now" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: "Quick search across categories and countries." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 space-y-2.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("select", { className: "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm", children: CATEGORIES.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { children: [
              c.emoji,
              " ",
              c.label
            ] }, c.id)) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("select", { className: "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm", children: COUNTRIES.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { children: [
              c.flag,
              " ",
              c.name
            ] }, c.code)) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/app/discover", className: "flex w-full items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "h-3.5 w-3.5" }),
              " Search Leads"
            ] })
          ] })
        ] })
      ] }),
      user?.plan === "free" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-amber-200 bg-amber-50 p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-display text-sm font-semibold text-amber-900", children: [
              user.leadsUsedThisMonth,
              " of ",
              user.leadsLimit,
              " free leads used this month"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-amber-800/80", children: "Upgrade for 100+ leads and AI outreach." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/app/upgrade", className: "inline-flex items-center gap-1 rounded-lg bg-amber-500 px-4 py-2 text-xs font-semibold text-white hover:bg-amber-600", children: [
            "Upgrade ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-3 w-3" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 h-2 overflow-hidden rounded-full bg-amber-200", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full bg-amber-500", style: {
          width: `${user.leadsUsedThisMonth / user.leadsLimit * 100}%`
        } }) })
      ] })
    ] })
  ] });
}
export {
  Dashboard as component
};
