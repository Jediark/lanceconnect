import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { A as AuthSplit } from "./router-BmphvtAh.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { s as stringType } from "../_libs/zod.mjs";
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
const schema = stringType().trim().email("Please enter a valid email").max(255);
function ForgotPage() {
  const [email, setEmail] = reactExports.useState("");
  const [sent, setSent] = reactExports.useState(false);
  const submit = (e) => {
    e.preventDefault();
    const r = schema.safeParse(email);
    if (!r.success) {
      toast.error(r.error.issues[0].message);
      return;
    }
    setSent(true);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AuthSplit, { title: "Reset your password", children: sent ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
      "If an account exists for ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: email }),
      ", we just sent a reset link. Check your inbox (and spam)."
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", className: "mt-6 inline-block text-sm font-semibold text-primary hover:underline", children: "← Back to login" })
  ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "Enter your email and we'll send you a link to set a new password." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: submit, className: "mt-5 space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "email", required: true, value: email, onChange: (e) => setEmail(e.target.value), placeholder: "you@email.com", className: "w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90", children: "Send reset link" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-5 text-center text-xs text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", className: "text-primary hover:underline", children: "Back to login" }) })
  ] }) });
}
export {
  ForgotPage as component
};
