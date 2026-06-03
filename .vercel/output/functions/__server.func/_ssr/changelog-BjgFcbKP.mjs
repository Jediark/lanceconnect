import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { M as MarketingShell, P as PageHeader } from "./MarketingShell-DOvfDtzL.mjs";
import { d as CHANGELOG } from "./router-BNXXg8Rr.mjs";
import "../_libs/sonner.mjs";
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
import "../_libs/lucide-react.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
const SplitComponent = () => /* @__PURE__ */ jsxRuntimeExports.jsxs(MarketingShell, { children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { eyebrow: "Changelog", title: "What we shipped.", subtitle: "A new version roughly every 2 weeks. Built by 6 people across 6 time zones." }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "mx-auto max-w-3xl px-4 py-16 lg:px-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx("ol", { className: "space-y-10", children: CHANGELOG.map((e) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "relative pl-6 border-l-2 border-border", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -left-[7px] top-2 h-3 w-3 rounded-full bg-primary" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-baseline gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono-data text-xs text-muted-foreground", children: e.date }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono-data text-xs font-semibold text-primary", children: e.version }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${e.tag === "feature" ? "bg-primary/10 text-primary" : e.tag === "improvement" ? "bg-success/10 text-success" : "bg-warn/10 text-warn"}`, children: e.tag })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-2 font-display text-xl font-bold", children: e.title }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-3 space-y-1.5 text-sm text-muted-foreground", children: e.items.map((i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "→" }),
      i
    ] }, i)) })
  ] }, e.version)) }) })
] });
export {
  SplitComponent as component
};
