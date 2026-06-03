import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { H as Header } from "./Header-CRCJa7A4.mjs";
import { u as useAuth, g as MOCK_LEADS } from "./router-DdjAxO3q.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { k as Sparkles, a5 as RefreshCw, J as Crown, x as Copy } from "../_libs/lucide-react.mjs";
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
const TONES = ["Friendly", "Formal", "Casual", "Direct"];
const LANGS = ["English", "Spanish", "French", "Italian", "Portuguese"];
const CHANNELS = ["Email", "WhatsApp", "LinkedIn DM", "Phone script"];
function AIPage() {
  const {
    user
  } = useAuth();
  const isPro = user?.plan === "pro" || user?.plan === "agency";
  const [leadId, setLeadId] = reactExports.useState(MOCK_LEADS[0].id);
  const [tone, setTone] = reactExports.useState("Friendly");
  const [lang, setLang] = reactExports.useState("English");
  const [channel, setChannel] = reactExports.useState("Email");
  const [output, setOutput] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  const lead = MOCK_LEADS.find((l) => l.id === leadId);
  const generate = () => {
    if (!isPro) {
      toast.error("AI Writer is a Pro feature");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setOutput(`Hi there,

I was looking up small businesses in ${lead.city} this morning and ${lead.businessName} caught my eye — a ${lead.googleRating}★ ${lead.businessType.toLowerCase()} with great reviews and yet${lead.hasWebsite ? " a website that doesn't quite match the quality of the business" : " no website at all"}.

I'm a freelancer who helps local businesses fix exactly this. No agency markup, just me. I'd love to send you a quick mock-up — free, no strings — so you can see what's possible.

Would a 10-minute call work this week?

Warmly,
— Your name`);
      setLoading(false);
    }, 900);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Header, { title: "AI Outreach Writer" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-6 p-4 lg:grid-cols-[400px_1fr] lg:p-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "space-y-4 rounded-2xl border border-border bg-card p-5 shadow-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-5 w-5 text-primary" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-semibold", children: "Setup" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-auto rounded-full bg-warn/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-warn", children: "Pro" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Lead", children: /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: leadId, onChange: (e) => setLeadId(e.target.value), className: "input", children: MOCK_LEADS.map((l) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: l.id, children: [
          l.businessName,
          " · ",
          l.city
        ] }, l.id)) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Channel", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2", children: CHANNELS.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setChannel(c), type: "button", className: `rounded-lg border px-3 py-1.5 text-xs font-medium ${channel === c ? "border-primary bg-primary/10 text-primary" : "border-border bg-background hover:bg-accent"}`, children: c }, c)) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Tone", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2", children: TONES.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setTone(t), type: "button", className: `rounded-lg border px-3 py-1.5 text-xs font-medium ${tone === t ? "border-primary bg-primary/10 text-primary" : "border-border bg-background hover:bg-accent"}`, children: t }, t)) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Language", children: /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: lang, onChange: (e) => setLang(e.target.value), className: "input", children: LANGS.map((l) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: l }, l)) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: generate, disabled: loading, className: "mt-2 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60", children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-4 w-4 animate-spin" }),
          " Generating…"
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-4 w-4" }),
          " Generate message"
        ] }) }),
        !isPro && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-warn/40 bg-warn/10 p-3 text-xs text-warn", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Crown, { className: "mb-1 inline h-3.5 w-3.5" }),
          " Upgrade to Pro to use the AI writer.",
          /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/app/upgrade", className: "font-semibold underline", children: "See plans →" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-2xl border border-border bg-card p-6 shadow-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-semibold", children: channel }),
          output && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => {
            navigator.clipboard.writeText(output);
            toast.success("Copied");
          }, className: "inline-flex items-center gap-1 rounded-lg border border-border bg-background px-3 py-1 text-xs font-medium hover:bg-accent", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "h-3.5 w-3.5" }),
            " Copy"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { value: output, onChange: (e) => setOutput(e.target.value), placeholder: "Your generated message will appear here…", rows: 18, className: "input resize-none" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-xs text-muted-foreground", children: "Tip: edit before sending. The best messages are 80% the AI, 20% you." })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `.input{width:100%;border-radius:.5rem;border:1px solid var(--input);background:var(--background);padding:.55rem .75rem;font-size:.875rem;outline:none}.input:focus{border-color:var(--primary);box-shadow:0 0 0 3px color-mix(in oklab, var(--primary) 18%, transparent)}` })
  ] });
}
function Field({
  label,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mb-1.5 block text-xs font-semibold uppercase tracking-widest text-muted-foreground", children: label }),
    children
  ] });
}
export {
  AIPage as component
};
