import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { M as MarketingShell, P as PageHeader } from "./MarketingShell-DejLplSF.mjs";
import { B as BLOG_POSTS } from "./router-BmphvtAh.mjs";
import "../_libs/sonner.mjs";
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
import "../_libs/lucide-react.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
function BlogIndex() {
  const [hero, ...rest] = BLOG_POSTS;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(MarketingShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { eyebrow: "Blog", title: "Playbooks from working freelancers.", subtitle: "Cold-email scripts that landed real clients. Pricing mistakes. Outreach experiments. Written by the people who actually do the work." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mx-auto max-w-7xl px-4 py-12 lg:px-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/blog/$slug", params: {
        slug: hero.slug
      }, className: "group grid gap-8 rounded-3xl border border-border bg-card p-6 lg:grid-cols-2 lg:p-8 hover:shadow-card-hover transition", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative overflow-hidden rounded-2xl", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: hero.cover, alt: hero.title, className: "aspect-[4/3] w-full object-cover transition group-hover:scale-105" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col justify-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-semibold uppercase tracking-widest text-primary", children: [
            hero.category,
            " · Featured"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-3 font-display text-3xl font-bold md:text-4xl", children: hero.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-muted-foreground", children: hero.excerpt }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 flex items-center gap-3 text-xs text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: hero.authorAvatar, alt: hero.author, className: "h-8 w-8 rounded-full object-cover" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              hero.author,
              " · ",
              hero.date,
              " · ",
              hero.readMins,
              " min read"
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3", children: rest.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/blog/$slug", params: {
        slug: p.slug
      }, className: "group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition hover:-translate-y-0.5 hover:shadow-card-hover", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: p.cover, alt: p.title, className: "aspect-[16/10] w-full object-cover transition group-hover:scale-105" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-1 flex-col p-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] font-semibold uppercase tracking-widest text-primary", children: p.category }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-2 font-display text-lg font-semibold leading-snug", children: p.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 line-clamp-2 text-sm text-muted-foreground", children: p.excerpt }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex items-center gap-2 text-xs text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: p.authorAvatar, alt: p.author, className: "h-6 w-6 rounded-full object-cover" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              p.author,
              " · ",
              p.readMins,
              " min"
            ] })
          ] })
        ] })
      ] }, p.slug)) })
    ] })
  ] });
}
export {
  BlogIndex as component
};
