import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { A as AuthSplit } from "./router-CgzKh1nW.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { M as MailCheck } from "../_libs/lucide-react.mjs";
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
function VerifyPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AuthSplit, { title: "Check your inbox", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex items-center gap-3 rounded-xl border border-border bg-paper p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MailCheck, { className: "h-5 w-5" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "We sent a confirmation link to your email address." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("ol", { className: "mt-5 space-y-2 text-sm text-foreground/80", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "1." }),
        " Open the email from ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "hello@LanceConnect.app" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "2." }),
        ' Click the "Confirm my email" button'
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "3." }),
        " You'll land on your dashboard"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => toast.success("Verification email resent"), className: "mt-6 w-full rounded-lg border border-border bg-card py-2.5 text-sm font-medium hover:bg-accent", children: "Resend email" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-5 text-center text-xs text-muted-foreground", children: [
      "Wrong address? ",
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/register", className: "text-primary hover:underline", children: "Sign up again" })
    ] })
  ] });
}
export {
  VerifyPage as component
};
