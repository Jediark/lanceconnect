import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { M as MarketingShell, P as PageHeader } from "./MarketingShell-DOvfDtzL.mjs";
import { I as IMG } from "./router-BNXXg8Rr.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { a as Mail, l as Clock, m as MessageSquare } from "../_libs/lucide-react.mjs";
import { o as objectType, s as stringType } from "../_libs/zod.mjs";
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
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
const schema = objectType({
  name: stringType().trim().min(1, "Please tell us your name").max(100),
  email: stringType().trim().email("Invalid email").max(255),
  subject: stringType().trim().min(1, "Subject required").max(150),
  message: stringType().trim().min(10, "Tell us a bit more").max(2e3)
});
function ContactPage() {
  const [form, setForm] = reactExports.useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [sending, setSending] = reactExports.useState(false);
  const submit = (e) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setSending(true);
    setTimeout(() => {
      setSending(false);
      toast.success("Message sent! We'll get back within 4 hours.");
      setForm({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
    }, 800);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(MarketingShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { eyebrow: "Contact", title: "We reply within 4 hours.", subtitle: "Real freelancers reading every message. No bots, no ticket numbers. Just a human in Buenos Aires, Lagos or Naples.", image: IMG.workspace }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mx-auto max-w-6xl px-4 py-16 lg:px-8 grid gap-10 lg:grid-cols-[1fr_2fr]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-card p-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "h-5 w-5 text-primary" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground", children: "Email" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "mailto:hello@LanceConnect.app", className: "mt-1 block text-sm font-semibold hover:underline", children: "hello@LanceConnect.app" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-card p-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-5 w-5 text-primary" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground", children: "Response time" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm font-semibold", children: "Under 4 hours, 7 days a week" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: "Avg: 38 minutes" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-card p-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "h-5 w-5 text-primary" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground", children: "Languages" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm font-semibold", children: "EN · ES · PT · IT · FR" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: submit, className: "space-y-4 rounded-2xl border border-border bg-card p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Your name", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: form.name, onChange: (e) => setForm({
            ...form,
            name: e.target.value
          }), className: "input" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Email", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "email", value: form.email, onChange: (e) => setForm({
            ...form,
            email: e.target.value
          }), className: "input" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Subject", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: form.subject, onChange: (e) => setForm({
          ...form,
          subject: e.target.value
        }), className: "input" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Message", children: /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { rows: 6, value: form.message, onChange: (e) => setForm({
          ...form,
          message: e.target.value
        }), className: "input resize-none" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { disabled: sending, className: "rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50", children: sending ? "Sending…" : "Send message" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `.input{width:100%;border:1px solid var(--border);background:var(--background);border-radius:.5rem;padding:.6rem .75rem;font-size:.875rem}.input:focus{outline:none;border-color:var(--primary);box-shadow:0 0 0 3px color-mix(in oklab, var(--primary) 18%, transparent)}` })
  ] });
}
function Field({
  label,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground", children: label }),
    children
  ] });
}
export {
  ContactPage as component
};
