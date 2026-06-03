import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { e as useRouterState, L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useAuth, L as Logo, c as cn } from "./router-Co1PU52Q.mjs";
import { P as PlanUsageBar } from "./PlanUsageBar-BMnEdB6K.mjs";
import { a0 as Menu, $ as X, H as House, e as Search, K as Kanban, a as Mail, k as Sparkles, n as Settings, a1 as Crown } from "../_libs/lucide-react.mjs";
const NAV = [
  { section: "Main", items: [
    { to: "/app/dashboard", label: "Dashboard", icon: House },
    { to: "/app/discover", label: "Discover Leads", icon: Search },
    { to: "/app/pipeline", label: "My Pipeline", icon: Kanban }
  ] },
  { section: "Tools", items: [
    { to: "/app/templates", label: "Templates", icon: Mail },
    { to: "/app/ai-generator", label: "AI Generator", icon: Sparkles, badge: "Pro" }
  ] },
  { section: "Account", items: [
    { to: "/app/settings", label: "Settings", icon: Settings },
    { to: "/app/upgrade", label: "Upgrade", icon: Crown, highlight: true }
  ] }
];
function Sidebar({ onClose }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { user } = useAuth();
  if (!user) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "flex h-full w-60 shrink-0 flex-col bg-sidebar text-sidebar-foreground", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-5 pb-4 pt-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/app/dashboard", className: "flex items-center gap-2 text-sidebar-active", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Logo, { size: 32 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-base font-bold", children: "LanceConnect" })
      ] }),
      onClose && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "text-sidebar-foreground lg:hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-5 w-5" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "flex-1 space-y-5 overflow-y-auto px-3 pb-4", children: NAV.map((group) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/60", children: group.section }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-0.5", children: group.items.map((item) => {
        const active = pathname === item.to;
        const Icon = item.icon;
        return /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Link,
          {
            to: item.to,
            onClick: onClose,
            className: cn(
              "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition",
              active ? "bg-sidebar-active text-sidebar" : "text-sidebar-foreground hover:bg-sidebar-hover hover:text-sidebar-active",
              item.highlight && !active && "text-amber-300 hover:text-amber-200"
            ),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1", children: item.label }),
              item.badge && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full bg-amber-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-amber-300", children: item.badge })
            ]
          }
        ) }, item.label);
      }) })
    ] }, group.section)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 border-t border-sidebar-border/60 p-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(PlanUsageBar, { used: user.leadsUsedThisMonth, limit: user.leadsLimit, plan: user.plan }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/app/upgrade", onClick: onClose, className: "block rounded-lg bg-primary/90 px-3 py-2 text-center text-xs font-medium text-primary-foreground hover:bg-primary", children: "Upgrade now" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-1 pt-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-8 w-8 place-items-center rounded-full bg-primary text-xs font-semibold text-primary-foreground", children: (user.fullName || "User").split(" ").map((n) => n[0]).join("") }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 leading-tight", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate text-xs font-medium text-sidebar-active", children: user.fullName || "User" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate text-[11px] text-sidebar-foreground/70", children: user.email })
        ] })
      ] })
    ] })
  ] });
}
function MobileSidebarTrigger() {
  const [open, setOpen] = reactExports.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: () => setOpen(true),
        className: "inline-flex items-center justify-center rounded-lg border border-border bg-card p-2 lg:hidden",
        "aria-label": "Open menu",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Menu, { className: "h-5 w-5" })
      }
    ),
    open && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed inset-0 z-50 lg:hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-black/50", onClick: () => setOpen(false) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-y-0 left-0 animate-in slide-in-from-left", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sidebar, { onClose: () => setOpen(false) }) })
    ] })
  ] });
}
export {
  MobileSidebarTrigger as M,
  Sidebar as S
};
