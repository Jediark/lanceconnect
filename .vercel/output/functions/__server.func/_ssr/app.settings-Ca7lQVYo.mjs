import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { e as useRouterState, L as Link, O as Outlet } from "../_libs/tanstack__react-router.mjs";
import { H as Header } from "./Header-BlyFee0d.mjs";
import { c as cn } from "./router-CgzKh1nW.mjs";
import "../_libs/sonner.mjs";
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
import "./Sidebar-BbOcovyj.mjs";
import "./PlanUsageBar-CGyoEZuD.mjs";
import "../_libs/lucide-react.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
const TABS = [{
  to: "/app/settings",
  label: "Overview",
  exact: true
}, {
  to: "/app/settings/profile",
  label: "Profile"
}, {
  to: "/app/settings/subscription",
  label: "Subscription"
}, {
  to: "/app/settings/notifications",
  label: "Notifications"
}, {
  to: "/app/settings/danger-zone",
  label: "Danger Zone"
}];
function SettingsLayout() {
  const pathname = useRouterState({
    select: (s) => s.location.pathname
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Header, { title: "Settings" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-6 lg:px-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-6 flex flex-wrap gap-1 border-b border-border overflow-x-auto", children: TABS.map((t) => {
        const active = t.exact ? pathname === t.to || pathname === "/app/settings/" : pathname === t.to;
        return /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: t.to, className: cn("whitespace-nowrap border-b-2 px-3 py-2 text-sm font-medium transition", active ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"), children: t.label }, t.to);
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {})
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `.input{width:100%;border-radius:.5rem;border:1px solid var(--input);background:var(--background);padding:.55rem .75rem;font-size:.875rem;outline:none}.input:focus{box-shadow:0 0 0 3px color-mix(in oklab, var(--primary) 18%, transparent);border-color:var(--primary)}` })
  ] });
}
function SettingsField({
  label,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground", children: label }),
    children
  ] });
}
export {
  SettingsField,
  SettingsLayout as component
};
