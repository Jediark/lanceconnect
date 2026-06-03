import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { M as MarketingShell } from "./MarketingShell-B3VnFWAV.mjs";
import { e as Route$c, B as BLOG_POSTS } from "./router-CgzKh1nW.mjs";
import "../_libs/sonner.mjs";
import { N as ArrowLeft, O as Twitter, Q as Linkedin, V as Link2 } from "../_libs/lucide-react.mjs";
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
function BlogPost() {
  const {
    post
  } = Route$c.useLoaderData();
  const related = BLOG_POSTS.filter((p) => p.slug !== post.slug).slice(0, 3);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(MarketingShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-3xl px-4 pt-12 lg:px-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/blog", className: "inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-3.5 w-3.5" }),
        " Back to blog"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mt-6 inline-block text-xs font-semibold uppercase tracking-widest text-primary", children: post.category }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-2 font-display text-4xl font-bold leading-tight md:text-5xl", children: post.title }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex items-center gap-3 text-sm text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: post.authorAvatar, alt: post.author, className: "h-10 w-10 rounded-full object-cover" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground", children: post.author }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs", children: [
            post.date,
            " · ",
            post.readMins,
            " min read"
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto mt-10 max-w-5xl px-4 lg:px-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: post.cover, alt: "", className: "aspect-[16/9] w-full rounded-2xl object-cover" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto grid max-w-6xl gap-10 px-4 py-12 lg:grid-cols-[1fr_240px] lg:px-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5 text-base leading-relaxed text-foreground/85", children: [
        post.body.split("\n\n").map((para, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: para }, i)),
        /* @__PURE__ */ jsxRuntimeExports.jsx("hr", { className: "my-8 border-border" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-paper p-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-lg font-semibold", children: "Stop refreshing job boards." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "Get 10 real, scored leads in your city — free." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/register", className: "mt-3 inline-block rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90", children: "Start free" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-widest text-muted-foreground", children: "Share" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 flex gap-2", children: [Twitter, Linkedin, Link2].map((I, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "grid h-9 w-9 place-items-center rounded-lg border border-border bg-card hover:bg-accent", children: /* @__PURE__ */ jsxRuntimeExports.jsx(I, { className: "h-4 w-4" }) }, i)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-widest text-muted-foreground", children: "More posts" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-3 space-y-3", children: related.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/blog/$slug", params: {
            slug: p.slug
          }, className: "group block", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: p.cover, alt: "", className: "aspect-[16/10] w-full rounded-lg object-cover" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm font-semibold leading-snug group-hover:text-primary", children: p.title })
          ] }) }, p.slug)) })
        ] })
      ] })
    ] })
  ] }) });
}
export {
  BlogPost as component
};
