import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useAuth } from "./router-CgzKh1nW.mjs";
import { M as MobileSidebarTrigger } from "./Sidebar-BbOcovyj.mjs";
import { J as Crown, Y as Bell } from "../_libs/lucide-react.mjs";
function Header({ title, subtitle }) {
  const { user } = useAuth();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-background/80 px-4 py-3 backdrop-blur lg:px-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(MobileSidebarTrigger, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "truncate font-display text-xl font-semibold leading-tight", children: title }),
      subtitle && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate text-xs text-muted-foreground", children: subtitle })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/app/upgrade", className: "hidden items-center gap-1.5 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-600 sm:inline-flex", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Crown, { className: "h-3.5 w-3.5" }),
        " Upgrade to Pro"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "relative grid h-9 w-9 place-items-center rounded-lg border border-border bg-card hover:bg-accent", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "h-4 w-4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" })
      ] }),
      user && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-9 w-9 place-items-center rounded-full bg-gradient-brand text-xs font-semibold text-white", children: (user.fullName || "User").split(" ").map((n) => n[0]).join("") })
    ] })
  ] });
}
export {
  Header as H
};
