import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { c as cn, C as CATEGORIES, b as COUNTRIES } from "./router-CgzKh1nW.mjs";
import "../_libs/sonner.mjs";
import { c as Check, A as ArrowRight } from "../_libs/lucide-react.mjs";
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
function Onboarding() {
  const nav = useNavigate();
  const [step, setStep] = reactExports.useState(1);
  const [category, setCategory] = reactExports.useState(null);
  const [country, setCountry] = reactExports.useState("");
  const [city, setCity] = reactExports.useState("");
  const [worldwide, setWorldwide] = reactExports.useState(false);
  const [name, setName] = reactExports.useState("");
  const next = () => setStep((s) => s + 1);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-background", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-3xl px-4 py-10 lg:py-16", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-8 flex items-center gap-2", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("h-1.5 flex-1 rounded-full transition", i <= step ? "bg-primary" : "bg-border") }, i)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mb-2 text-xs font-mono-data text-muted-foreground", children: [
      "STEP ",
      step,
      " OF 3"
    ] }),
    step === 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl font-bold md:text-4xl", children: "What do you do?" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-muted-foreground", children: "We'll find businesses that specifically need your skills." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5", children: CATEGORIES.map((c) => {
        const active = category === c.id;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setCategory(c.id), className: cn("relative rounded-xl border bg-card p-4 text-left transition hover:-translate-y-0.5 hover:shadow-card", active ? "border-primary ring-2 ring-primary/30" : "border-border"), children: [
          active && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute right-2 top-2 grid h-5 w-5 place-items-center rounded-full bg-primary text-primary-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3 w-3" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl", children: c.emoji }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 font-display text-sm font-semibold", children: c.label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-[11px] text-muted-foreground", children: c.example })
        ] }, c.id);
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-10 flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: next, disabled: !category, className: "inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-40", children: [
        "Continue ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4" })
      ] }) })
    ] }),
    step === 2 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl font-bold md:text-4xl", children: "Where should we look?" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-muted-foreground", children: "We find leads globally — start with your best target market." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-semibold uppercase tracking-wide text-muted-foreground", children: "Country" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: country, onChange: (e) => setCountry(e.target.value), disabled: worldwide, className: "mt-1 w-full rounded-lg border border-input bg-card px-3 py-2.5 text-sm disabled:opacity-50", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Select a country" }),
            COUNTRIES.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: c.code, children: [
              c.flag,
              " ",
              c.name
            ] }, c.code))
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-semibold uppercase tracking-wide text-muted-foreground", children: "City" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: city, onChange: (e) => setCity(e.target.value), disabled: worldwide, placeholder: "e.g. Lagos, London, São Paulo, New York", className: "mt-1 w-full rounded-lg border border-input bg-card px-3 py-2.5 text-sm disabled:opacity-50" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-border bg-card p-3 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: worldwide, onChange: (e) => setWorldwide(e.target.checked), className: "h-4 w-4 accent-primary" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "🌍 Search worldwide" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-10 flex justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setStep(1), className: "rounded-lg border border-border px-5 py-2.5 text-sm font-medium hover:bg-accent", children: "Back" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: next, disabled: !worldwide && !country, className: "inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-40", children: [
          "Continue ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4" })
        ] })
      ] })
    ] }),
    step === 3 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl font-bold md:text-4xl", children: "Almost there!" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-muted-foreground", children: "Tell us a little about yourself so your outreach feels personal." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-semibold uppercase tracking-wide text-muted-foreground", children: "Full name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: name, onChange: (e) => setName(e.target.value), placeholder: "Alex Johnson", className: "mt-1 w-full rounded-lg border border-input bg-card px-3 py-2.5 text-sm" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-semibold uppercase tracking-wide text-muted-foreground", children: "Website or portfolio (optional)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { placeholder: "https://your-site.com", className: "mt-1 w-full rounded-lg border border-input bg-card px-3 py-2.5 text-sm" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-semibold uppercase tracking-wide text-muted-foreground", children: "Short bio — what you offer" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { rows: 3, placeholder: "I build fast, affordable websites for restaurants and local businesses.", className: "mt-1 w-full rounded-lg border border-input bg-card px-3 py-2.5 text-sm" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => nav({
        to: "/app/discover"
      }), className: "mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90", children: [
        "Start Finding Clients ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4" })
      ] })
    ] })
  ] }) });
}
export {
  Onboarding as component
};
