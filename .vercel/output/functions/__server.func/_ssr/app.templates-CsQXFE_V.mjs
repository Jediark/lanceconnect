import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { H as Header } from "./Header-ACOVRNP1.mjs";
import { M as MOCK_TEMPLATES, c as cn } from "./router-Co1PU52Q.mjs";
import "../_libs/sonner.mjs";
import { V as Plus, f as Star, $ as X } from "../_libs/lucide-react.mjs";
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
import "./Sidebar-KdI4WnCn.mjs";
import "./PlanUsageBar-BMnEdB6K.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
const CHANNELS = [{
  id: "all",
  label: "All"
}, {
  id: "email",
  label: "📧 Email"
}, {
  id: "phone_script",
  label: "📞 Phone Scripts"
}, {
  id: "linkedin",
  label: "💬 LinkedIn"
}, {
  id: "sms",
  label: "📱 SMS"
}];
function Templates() {
  const [channel, setChannel] = reactExports.useState("all");
  const [editing, setEditing] = reactExports.useState(null);
  const filtered = MOCK_TEMPLATES.filter((t) => channel === "all" || t.channel === channel);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Header, { title: "Outreach Templates", subtitle: "Ready-to-use messages for every channel" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2 px-4 py-4 lg:px-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5", children: CHANNELS.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setChannel(c.id), className: cn("rounded-lg px-3 py-1.5 text-xs font-medium", channel === c.id ? "bg-primary text-primary-foreground" : "border border-border bg-card hover:bg-accent"), children: c.label }, c.id)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setEditing({
        id: "new",
        name: "",
        channel: "email",
        subject: "",
        body: "",
        isDefault: false
      }), className: "inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5" }),
        " New Template"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4 px-4 pb-10 lg:grid-cols-2 lg:px-8", children: filtered.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-card p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-card-hover", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-2 flex items-start justify-between", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-base font-semibold", children: t.name }),
          t.isDefault && /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-3.5 w-3.5 fill-amber-400 text-amber-400" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground capitalize", children: [
          t.channel.replace("_", " "),
          " template"
        ] })
      ] }) }),
      t.subject && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-2 text-xs font-semibold", children: [
        "Subject: ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-normal text-muted-foreground", children: t.subject })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 line-clamp-4 whitespace-pre-line text-xs leading-relaxed text-muted-foreground", children: t.body }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setEditing(t), className: "flex-1 rounded-md border border-border bg-background py-1.5 text-xs font-medium hover:bg-accent", children: "Preview" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setEditing(t), className: "flex-1 rounded-md border border-border bg-background py-1.5 text-xs font-medium hover:bg-accent", children: "Edit" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "flex-1 rounded-md bg-primary py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90", children: "Use" })
      ] })
    ] }, t.id)) }),
    editing && /* @__PURE__ */ jsxRuntimeExports.jsx(TemplateEditor, { template: editing, onClose: () => setEditing(null) })
  ] });
}
function fill(body) {
  return body.replace(/{{business_name}}/g, "Mario's Ristorante").replace(/{{city}}/g, "Naples").replace(/{{your_name}}/g, "Alex Johnson");
}
function TemplateEditor({
  template,
  onClose
}) {
  const [name, setName] = reactExports.useState(template.name);
  const [channel, setChannel] = reactExports.useState(template.channel);
  const [subject, setSubject] = reactExports.useState(template.subject ?? "");
  const [body, setBody] = reactExports.useState(template.body);
  const [preview, setPreview] = reactExports.useState(false);
  const variables = ["{{business_name}}", "{{city}}", "{{your_name}}"];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4", onClick: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { onClick: (e) => e.stopPropagation(), className: "grid w-full max-w-4xl grid-cols-1 overflow-hidden rounded-2xl bg-card shadow-2xl lg:grid-cols-[1fr_220px]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex max-h-[85vh] flex-col", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between border-b border-border p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-lg font-semibold", children: template.id === "new" ? "New template" : "Edit template" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setPreview((p) => !p), className: "rounded-md border border-border bg-background px-2 py-1 text-xs hover:bg-accent", children: preview ? "Edit" : "Preview" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "rounded-lg p-1.5 hover:bg-accent", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 overflow-y-auto p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: name, onChange: (e) => setName(e.target.value), placeholder: "Template name", className: "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: channel, onChange: (e) => setChannel(e.target.value), className: "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "email", children: "Email" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "phone_script", children: "Phone Script" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "linkedin", children: "LinkedIn" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "sms", children: "SMS" })
        ] }),
        channel === "email" && /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: subject, onChange: (e) => setSubject(e.target.value), placeholder: "Subject line", className: "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" }),
        preview ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border bg-muted/40 p-4 text-sm", children: [
          subject && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-3 font-semibold", children: fill(subject) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "whitespace-pre-line", children: fill(body) })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { value: body, onChange: (e) => setBody(e.target.value), rows: 14, className: "w-full rounded-lg border border-input bg-background px-3 py-2 font-mono-data text-xs" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2 border-t border-border p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-accent", children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90", children: "Save Template" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border bg-muted/30 p-4 lg:border-l lg:border-t-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground", children: "Variables" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1.5", children: variables.map((v) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setBody((b) => b + " " + v), className: "block w-full rounded-md bg-primary/10 px-2 py-1 text-left font-mono-data text-xs text-primary hover:bg-primary/20", children: v }, v)) })
    ] })
  ] }) });
}
export {
  Templates as component
};
