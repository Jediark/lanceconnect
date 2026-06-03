import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { M as MarketingShell, P as PageHeader } from "./MarketingShell-BDz3y-zJ.mjs";
import { R as Route$d, F as FREELANCER_CATEGORIES } from "./router-DdjAxO3q.mjs";
import "../_libs/sonner.mjs";
import { z as CircleAlert, u as Building2, A as ArrowRight } from "../_libs/lucide-react.mjs";
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
function CategoryPage() {
  const {
    cat
  } = Route$d.useLoaderData();
  const others = FREELANCER_CATEGORIES.filter((c) => c.slug !== cat.slug).slice(0, 4);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(MarketingShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { eyebrow: `${cat.emoji} For ${cat.label}`, title: cat.tagline, subtitle: cat.description, image: cat.image }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mx-auto max-w-7xl px-4 py-16 lg:px-8 grid gap-10 lg:grid-cols-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "inline-grid h-12 w-12 place-items-center rounded-xl bg-warn/15 text-warn", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-6 w-6" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-4 font-display text-3xl font-bold", children: "What we detect" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-3 text-muted-foreground", children: [
          "LanceConnect's scoring engine specifically looks for the signals that mean a business is ready to hire ",
          cat.label.toLowerCase(),
          ":"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-5 space-y-2", children: cat.problems.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex gap-3 rounded-xl border border-border bg-card p-3 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "●" }),
          p
        ] }, p)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "inline-grid h-12 w-12 place-items-center rounded-xl bg-success/15 text-success", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "h-6 w-6" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-4 font-display text-3xl font-bold", children: "Example leads" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-muted-foreground", children: "A snapshot of the kind of businesses you'll see on day one." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-5 space-y-3", children: cat.sampleBusinesses.map((b) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold", children: b.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-sm text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "Why:" }),
            " ",
            b.reason
          ] })
        ] }, b.name)) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "px-4 pb-16 lg:px-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-5xl rounded-3xl bg-primary p-10 text-center text-primary-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display text-3xl font-bold", children: [
        "Start with 10 free ",
        cat.label.toLowerCase(),
        " leads."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-primary-foreground/90", children: "No credit card. Pick your city and they're in your dashboard in seconds." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/register", className: "mt-6 inline-flex items-center gap-2 rounded-xl bg-card px-6 py-3 text-sm font-semibold text-primary hover:scale-105 transition", children: [
        "Get my leads ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mx-auto max-w-7xl px-4 pb-20 lg:px-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-xl font-bold", children: "Other crafts we serve" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4", children: others.map((o) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/freelancers/$slug", params: {
        slug: o.slug
      }, className: "group rounded-xl border border-border bg-card p-4 hover:border-primary", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xl", children: o.emoji }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 font-display font-semibold group-hover:text-primary", children: o.label }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-muted-foreground line-clamp-2", children: o.tagline })
      ] }, o.slug)) })
    ] })
  ] });
}
export {
  CategoryPage as component
};
