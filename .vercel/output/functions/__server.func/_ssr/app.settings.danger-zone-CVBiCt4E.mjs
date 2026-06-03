import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { u as useAuth } from "./router-Co1PU52Q.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { ai as Download, ah as TriangleAlert, a8 as Trash2 } from "../_libs/lucide-react.mjs";
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
function DangerZone() {
  const {
    logout
  } = useAuth();
  const nav = useNavigate();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-card p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-5 w-5 text-primary" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-3 font-display text-lg font-semibold", children: "Export your data" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "Download every lead, note, and template as a single CSV. We email you a link within 5 minutes." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => toast.success("Export started — check your email"), className: "mt-4 rounded-lg border border-border bg-background px-4 py-2 text-sm font-semibold hover:bg-accent", children: "Request export" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-destructive/40 bg-destructive/5 p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-5 w-5 text-destructive" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-lg font-semibold text-destructive", children: "Delete account" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-destructive/80", children: "This permanently removes your account, leads, pipeline, and templates. We can't undo this." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => {
        if (confirm("Permanently delete your account? This cannot be undone.")) {
          logout();
          nav({
            to: "/"
          });
          toast.success("Account deleted");
        }
      }, className: "mt-4 inline-flex items-center gap-2 rounded-lg bg-destructive px-4 py-2 text-sm font-semibold text-destructive-foreground hover:opacity-90", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }),
        " Delete account"
      ] })
    ] })
  ] });
}
export {
  DangerZone as component
};
