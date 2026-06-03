import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useAuth, j as SettingsField, C as CATEGORIES, b as COUNTRIES } from "./router-l5HUkJG7.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
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
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/lucide-react.mjs";
function ProfilePage() {
  const {
    user,
    updateUser
  } = useAuth();
  if (!user) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: (e) => {
    e.preventDefault();
    toast.success("Profile saved");
  }, className: "max-w-2xl space-y-4 rounded-2xl border border-border bg-card p-6 shadow-card", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-16 w-16 place-items-center rounded-full bg-primary text-lg font-semibold text-primary-foreground", children: (user.fullName || "User").split(" ").map((n) => n[0]).join("") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium hover:bg-accent", children: "Upload photo" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SettingsField, { label: "Full name", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { defaultValue: user.fullName || "", onChange: (e) => updateUser({
      fullName: e.target.value
    }), className: "input" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SettingsField, { label: "Email", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { defaultValue: user.email, type: "email", className: "input" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SettingsField, { label: "Bio", children: /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { rows: 3, placeholder: "A short line about what you offer...", className: "input" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SettingsField, { label: "Website / Portfolio", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { placeholder: "https://", className: "input" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SettingsField, { label: "Freelancer category", children: /* @__PURE__ */ jsxRuntimeExports.jsx("select", { defaultValue: user.freelancerCategory, className: "input", children: CATEGORIES.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: c.id, children: [
      c.emoji,
      " ",
      c.label
    ] }, c.id)) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SettingsField, { label: "Country", children: /* @__PURE__ */ jsxRuntimeExports.jsx("select", { defaultValue: "NG", className: "input", children: COUNTRIES.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: c.code, children: [
      c.flag,
      " ",
      c.name
    ] }, c.code)) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90", children: "Save changes" })
  ] });
}
export {
  ProfilePage as component
};
