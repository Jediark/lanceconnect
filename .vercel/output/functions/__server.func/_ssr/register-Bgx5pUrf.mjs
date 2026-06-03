import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useAuth, A as AuthSplit } from "./router-Co1PU52Q.mjs";
import "../_libs/sonner.mjs";
import { E as EyeOff, b as Eye } from "../_libs/lucide-react.mjs";
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
function strength(pwd) {
  let s = 0;
  if (pwd.length >= 8) s++;
  if (/[A-Z]/.test(pwd)) s++;
  if (/\d/.test(pwd)) s++;
  if (/[^\w\s]/.test(pwd)) s++;
  return s;
}
function GoogleSignup() {
  const {
    login
  } = useAuth();
  const nav = useNavigate();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => {
    login();
    nav({
      to: "/onboarding"
    });
  }, type: "button", className: "mt-6 flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium hover:bg-accent", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "16", height: "16", viewBox: "0 0 48 48", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("path", { fill: "#FFC107", d: "M43.611 20.083H42V20H24v8h11.303C33.972 32.91 29.418 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("path", { fill: "#FF3D00", d: "m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("path", { fill: "#4CAF50", d: "M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.397 0-9.972-3.066-11.297-7.943l-6.522 5.025C9.527 39.556 16.227 44 24 44z" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("path", { fill: "#1976D2", d: "M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" })
    ] }),
    "Continue with Google"
  ] });
}
function RegisterPage() {
  const {
    login
  } = useAuth();
  const nav = useNavigate();
  const [show, setShow] = reactExports.useState(false);
  const [pwd, setPwd] = reactExports.useState("");
  const s = strength(pwd);
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][s];
  const strengthColor = ["bg-border", "bg-red-500", "bg-amber-500", "bg-indigo-500", "bg-emerald-500"][s];
  const submit = (e) => {
    e.preventDefault();
    login();
    nav({
      to: "/onboarding"
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AuthSplit, { title: "Create your free account", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "Start with 10 free leads — no card required." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(GoogleSignup, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "my-5 flex items-center gap-3 text-xs text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-px flex-1 bg-border" }),
      " or continue with email ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-px flex-1 bg-border" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: submit, className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { required: true, placeholder: "Full Name", className: "w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "email", required: true, placeholder: "Email Address", className: "w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: pwd, onChange: (e) => setPwd(e.target.value), type: show ? "text" : "password", required: true, placeholder: "Password", className: "w-full rounded-lg border border-input bg-background px-3 py-2.5 pr-10 text-sm outline-none focus:ring-2 focus:ring-primary/30" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setShow((v) => !v), className: "absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground", children: show ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-4 w-4" }) })
      ] }),
      pwd && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1 flex-1 overflow-hidden rounded-full bg-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `h-full transition-all ${strengthColor}`, style: {
          width: `${s / 4 * 100}%`
        } }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] text-muted-foreground", children: strengthLabel })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", className: "w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90", children: "Create Account" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-center text-[11px] text-muted-foreground", children: "By signing up, you agree to our Terms and Privacy Policy." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-3 text-center text-xs text-muted-foreground", children: [
      "Already have an account? ",
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", className: "font-medium text-primary hover:underline", children: "Log in" })
    ] })
  ] });
}
export {
  RegisterPage as component
};
