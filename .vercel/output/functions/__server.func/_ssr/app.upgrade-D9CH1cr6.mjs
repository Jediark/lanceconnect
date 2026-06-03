import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { H as Header } from "./Header-CRCJa7A4.mjs";
import { u as useAuth, a as usePreferences, c as cn } from "./router-DdjAxO3q.mjs";
import "../_libs/sonner.mjs";
import { C as CircleCheck } from "../_libs/lucide-react.mjs";
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
import "./Sidebar-CcaRZzAu.mjs";
import "./PlanUsageBar-CxkCQUHD.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
function UpgradePage() {
  const {
    user
  } = useAuth();
  const [annual, setAnnual] = reactExports.useState(false);
  const {
    t,
    formatPrice,
    getCurrencySymbol
  } = usePreferences();
  const PLANS = [{
    name: t("plan_free"),
    monthly: 0,
    leads: "10",
    cta: t("plan_cta_free"),
    popular: false,
    features: [t("plan_free_feature_1"), t("plan_free_feature_2"), t("plan_free_feature_3")]
  }, {
    name: t("plan_individual"),
    monthly: 5,
    leads: "200",
    cta: t("plan_cta_ind"),
    popular: true,
    features: [t("plan_ind_feature_1"), t("plan_ind_feature_2"), t("plan_ind_feature_3"), t("plan_ind_feature_4"), t("plan_ind_feature_5")]
  }, {
    name: t("plan_company"),
    monthly: 20,
    leads: "Unlimited",
    cta: t("plan_cta_comp"),
    popular: false,
    features: [t("plan_comp_feature_1"), t("plan_comp_feature_2"), t("plan_comp_feature_3"), t("plan_comp_feature_4"), t("plan_comp_feature_5")]
  }];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Header, { title: "Upgrade" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 px-4 py-6 lg:px-8", children: [
      user && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900", children: [
        "You're on the ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "capitalize", children: user.plan }),
        " plan · ",
        user.leadsUsedThisMonth,
        "/",
        user.leadsLimit,
        " leads used this month. Upgrade to unlock unlimited leads, AI outreach, and more."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex rounded-full border border-border bg-card p-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setAnnual(false), className: cn("rounded-full px-4 py-1.5 text-xs font-medium", !annual && "bg-primary text-primary-foreground"), children: "Monthly" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setAnnual(true), className: cn("rounded-full px-4 py-1.5 text-xs font-medium", annual && "bg-primary text-primary-foreground"), children: [
          "Annual ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1 text-emerald-500", children: "−20%" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-5 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto", children: PLANS.map((p) => {
        const rawPrice = annual ? Math.round(p.monthly * 0.8) : p.monthly;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn("relative rounded-2xl border bg-card p-6", p.popular ? "border-primary shadow-card-hover lg:-translate-y-3" : "border-border shadow-card"), children: [
          p.popular && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground", children: "Most Popular" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-widest text-muted-foreground", children: p.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex items-baseline gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-display text-4xl font-bold", children: [
              getCurrencySymbol(),
              formatPrice(rawPrice)
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: t("plan_mo") })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-sm font-mono-data text-primary", children: [
            p.leads,
            " ",
            t("plan_leads_mo")
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-5 space-y-2 text-sm", children: p.features.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "mt-0.5 h-4 w-4 shrink-0 text-emerald-500" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground/80", children: f })
          ] }, f)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: cn("mt-6 w-full rounded-lg py-2.5 text-sm font-semibold transition", p.popular ? "bg-primary text-primary-foreground hover:bg-primary/90" : "border border-border bg-background hover:bg-accent"), children: p.cta })
        ] }, p.name);
      }) })
    ] })
  ] });
}
export {
  UpgradePage as component
};
