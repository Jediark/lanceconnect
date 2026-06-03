import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { M as MarketingShell, P as PageHeader } from "./MarketingShell-CmBQIeTV.mjs";
import { a as usePreferences, I as IMG } from "./router-CpuVc37M.mjs";
import "../_libs/sonner.mjs";
import { c as Check, d as Minus, S as Shield } from "../_libs/lucide-react.mjs";
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
const matrix = [{
  label: "Lead discovery",
  values: [true, true, true]
}, {
  label: "Opportunity scoring",
  values: [true, true, true]
}, {
  label: "CRM pipeline",
  values: [false, true, true]
}, {
  label: "Templates",
  values: ["1", "Unlimited", "Unlimited"]
}, {
  label: "CSV export",
  values: [false, true, true]
}, {
  label: "AI Outreach Writer",
  values: [false, true, true]
}, {
  label: "Team seats",
  values: ["1", "1", "3"]
}, {
  label: "API access",
  values: [false, false, true]
}, {
  label: "White-label option",
  values: [false, false, true]
}, {
  label: "Priority support",
  values: [false, true, true]
}];
const faqs = [{
  q: "Can I really use this for free, forever?",
  a: "Yes. The Free plan gives you 10 leads a month, every month, with no credit card. Most freelancers upgrade when they win their first client and want more leads."
}, {
  q: "How do I get a refund?",
  a: "Email us within 14 days of any paid charge and we'll refund you in full, no questions asked."
}, {
  q: "Where do the leads come from?",
  a: "Public sources: Google Maps, business directories, and open company registries. Every lead is verifiable."
}, {
  q: "Do you support my country?",
  a: "We work in 150+ countries. If your country isn't supported, email us — we usually add new markets within a week."
}, {
  q: "Can I cancel anytime?",
  a: "Yes. Cancel from Settings → Subscription. You keep access until the end of your billing period."
}];
function PricingPage() {
  const {
    t,
    formatPrice,
    getCurrencySymbol
  } = usePreferences();
  const plans = [{
    name: t("plan_free"),
    price: 0,
    leads: `10 ${t("plan_leads_mo")}`,
    cta: t("plan_cta_free"),
    popular: false
  }, {
    name: t("plan_individual"),
    price: 5,
    leads: `200 ${t("plan_leads_mo")}`,
    cta: t("plan_cta_ind"),
    popular: true
  }, {
    name: t("plan_company"),
    price: 20,
    leads: "Unlimited",
    cta: t("plan_cta_comp"),
    popular: false
  }];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(MarketingShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { eyebrow: t("nav_pricing"), title: "Honest pricing. Built for freelancers.", subtitle: "No 'contact sales'. No annual lock-ins. Cancel anytime. 14-day money-back guarantee on every paid plan.", image: IMG.coffeeShop }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "mx-auto max-w-7xl px-4 pt-8 lg:px-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex rounded-full border border-border bg-card p-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "rounded-full bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground", children: "Monthly" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "rounded-full px-4 py-1.5 text-xs font-medium", children: [
        "Annual ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1 text-emerald-500", children: "−20%" })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mx-auto max-w-7xl px-4 py-16 lg:px-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-5 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto", children: plans.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `relative rounded-2xl border bg-card p-6 ${p.popular ? "border-primary shadow-card-hover lg:-translate-y-3" : "border-border shadow-card"}`, children: [
        p.popular && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground", children: "Most popular" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-widest text-muted-foreground", children: p.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex items-baseline gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-display text-4xl font-bold", children: [
            getCurrencySymbol(),
            formatPrice(p.price)
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: t("plan_mo") })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm font-mono-data text-primary", children: p.leads }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/register", className: `mt-5 block rounded-lg py-2.5 text-center text-sm font-semibold transition ${p.popular ? "bg-primary text-primary-foreground hover:bg-primary/90" : "border border-border bg-background hover:bg-accent"}`, children: p.cta })
      ] }, p.name)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-16 overflow-x-auto rounded-2xl border border-border bg-card", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-paper border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left font-semibold", children: "Feature" }),
          plans.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-center font-semibold", children: p.name }, p.name))
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: matrix.map((row) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border last:border-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-foreground/80", children: row.label }),
          row.values.map((v, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-center", children: v === true ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "mx-auto h-4 w-4 text-success" }) : v === false ? /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, { className: "mx-auto h-4 w-4 text-muted-foreground" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono-data text-xs", children: v }) }, i))
        ] }, row.label)) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-16 grid gap-6 lg:grid-cols-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-paper p-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-6 w-6 text-primary" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-3 font-display text-lg font-semibold", children: "14-day money-back guarantee" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Don't love it? Email us within 14 days for a full refund. No forms, no questions." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-2xl font-bold", children: "FAQ" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 space-y-3", children: faqs.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs("details", { className: "group rounded-xl border border-border bg-card p-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("summary", { className: "cursor-pointer list-none font-semibold flex items-center justify-between", children: [
              f.q,
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-2 text-primary group-open:rotate-45 transition", children: "+" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-sm text-muted-foreground", children: f.a })
          ] }, f.q)) })
        ] })
      ] })
    ] })
  ] });
}
export {
  PricingPage as component
};
