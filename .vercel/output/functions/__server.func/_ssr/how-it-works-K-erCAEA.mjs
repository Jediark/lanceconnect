import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { M as MarketingShell, P as PageHeader } from "./MarketingShell-B3VnFWAV.mjs";
import { I as IMG } from "./router-CgzKh1nW.mjs";
import "../_libs/sonner.mjs";
import { A as ArrowRight } from "../_libs/lucide-react.mjs";
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
const steps = [{
  n: "01",
  title: "Pick your skill",
  desc: "Select your freelance category — web dev, design, copywriting, and 7 more.",
  image: IMG.webDev,
  human: IMG.face1,
  caption: "This is Amara from Lagos"
}, {
  n: "02",
  title: "Choose your market",
  desc: "Target any city or country in the world. Filter by industry, size, signals.",
  image: IMG.marketStall,
  human: IMG.face2,
  caption: "This is Diego from São Paulo"
}, {
  n: "03",
  title: "Discover scored leads",
  desc: "Get a scored list of businesses that fit. Hot leads bubble to the top.",
  image: IMG.seo,
  human: IMG.face3,
  caption: "This is Sarah from London"
}, {
  n: "04",
  title: "Reach out directly",
  desc: "Use our templates (or the AI writer on Pro) to send a first message.",
  image: IMG.copywriter,
  human: IMG.face4,
  caption: "This is Priya from Mumbai"
}, {
  n: "05",
  title: "Track replies in your pipeline",
  desc: "Move leads from 'contacted' to 'interested' to 'won'.",
  image: IMG.workspace,
  human: IMG.face1,
  caption: "Your pipeline, simple and clean"
}];
function HowPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(MarketingShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { eyebrow: "How it works", title: "From blank screen to booked call in one afternoon.", subtitle: "No funnel diagrams. No marketing degree. Just five honest steps that have helped freelancers in 50+ countries land their first paying clients.", image: IMG.heroLaptop }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-7xl px-4 py-16 lg:px-8 space-y-20", children: steps.map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "grid gap-10 items-center lg:grid-cols-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `${i % 2 === 0 ? "lg:order-2" : ""}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono-data text-sm text-primary", children: [
          "// step.",
          s.n
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-2 font-display text-3xl font-bold md:text-3xl", children: s.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-muted-foreground", children: s.desc }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-xs text-primary font-medium", children: s.caption })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -inset-3 rounded-2xl bg-primary/10 blur-sm" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: s.human, alt: s.caption, className: "relative rounded-2xl object-cover shadow-xl", loading: "lazy" })
      ] })
    ] }, s.n)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "px-4 pb-20 lg:px-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-5xl rounded-3xl bg-primary p-12 text-center text-primary-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-3xl font-bold", children: "Ready in 3 minutes" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-primary-foreground/90", children: "Sign up, pick your craft, and your first 10 leads land in your dashboard immediately." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/register", className: "mt-6 inline-flex items-center gap-2 rounded-xl bg-card px-6 py-3 text-sm font-semibold text-primary hover:scale-105 transition", children: [
        "Start finding leads ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4" })
      ] })
    ] }) })
  ] });
}
export {
  HowPage as component
};
