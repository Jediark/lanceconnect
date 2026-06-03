import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useAuth } from "./router-BNXXg8Rr.mjs";
import { P as PlanUsageBar } from "./PlanUsageBar-FhpJ1F2T.mjs";
import { t as toast } from "../_libs/sonner.mjs";
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
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/lucide-react.mjs";
function SubscriptionPage() {
  const {
    user
  } = useAuth();
  if (!user) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-card p-6 shadow-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-wide text-muted-foreground", children: "Current plan" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 font-display text-2xl font-bold capitalize", children: [
            user.plan,
            " Plan"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Renews May 28, 2026" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(PlanUsageBar, { used: user.leadsUsedThisMonth, limit: user.leadsLimit, plan: user.plan }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/app/upgrade", className: "rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90", children: "Upgrade plan" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => toast.success("Invoice emailed"), className: "rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-accent", children: "Download invoices" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-card p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold", children: "Billing history" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "mt-4 w-full text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "text-left text-xs text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "pb-2", children: "Date" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "pb-2", children: "Plan" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "pb-2", children: "Amount" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "pb-2", children: "Status" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: [["May 1, 2026", "Free", "$0", "Active"], ["Apr 1, 2026", "Free", "$0", "Active"]].map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2 font-mono-data text-xs", children: r[0] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2", children: r[1] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2 font-mono-data", children: r[2] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2 text-success", children: r[3] })
        ] }, r[0])) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => toast.error("Are you sure? Email us — we'd love to know why."), className: "text-xs text-muted-foreground hover:text-destructive", children: "Cancel subscription" })
  ] });
}
export {
  SubscriptionPage as component
};
