import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { O as Outlet, e as useRouterState, L as Link } from "../_libs/tanstack__react-router.mjs";
import { S as Sidebar } from "./Sidebar-B_TN68sS.mjs";
import { c as cn } from "./router-BNXXg8Rr.mjs";
import "../_libs/sonner.mjs";
import { H as House, e as Search, K as Kanban, a as Mail, n as Settings } from "../_libs/lucide-react.mjs";
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
import "./PlanUsageBar-FhpJ1F2T.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
const ITEMS = [
  { to: "/app/dashboard", label: "Home", icon: House },
  { to: "/app/discover", label: "Discover", icon: Search },
  { to: "/app/pipeline", label: "Pipeline", icon: Kanban },
  { to: "/app/templates", label: "Templates", icon: Mail },
  { to: "/app/settings", label: "Settings", icon: Settings }
];
function MobileNav() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-border bg-card/95 backdrop-blur lg:hidden", children: ITEMS.map(({ to, label, icon: Icon }) => {
    const active = path === to;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Link,
      {
        to,
        className: cn(
          "flex flex-col items-center gap-0.5 py-2 text-[10px] font-medium",
          active ? "text-primary" : "text-muted-foreground"
        ),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-5 w-5" }),
          label
        ]
      },
      to
    );
  }) });
}
function AppLayout() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden lg:block", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sidebar, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex min-h-screen flex-1 flex-col pb-16 lg:pb-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(MobileNav, {})
  ] });
}
export {
  AppLayout as component
};
