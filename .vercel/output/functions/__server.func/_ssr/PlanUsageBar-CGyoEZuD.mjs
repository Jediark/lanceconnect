import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { c as cn } from "./router-CgzKh1nW.mjs";
function PlanUsageBar({ used, limit, plan }) {
  const pct = Math.min(100, Math.round(used / limit * 100));
  const urgent = pct >= 80;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-sidebar-border/40 bg-sidebar-hover/60 p-3 text-sidebar-foreground", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-1 flex items-center justify-between text-xs", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium uppercase tracking-wide text-sidebar-active/80", children: [
        plan,
        " Plan"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono-data text-sidebar-active", children: [
        used,
        "/",
        limit
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1.5 w-full overflow-hidden rounded-full bg-black/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: cn("h-full transition-all", urgent ? "bg-amber-400" : "bg-primary"),
        style: { width: `${pct}%` }
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-2 text-[11px] leading-tight text-sidebar-foreground/80", children: [
      limit - used,
      " leads left this month"
    ] })
  ] });
}
export {
  PlanUsageBar as P
};
