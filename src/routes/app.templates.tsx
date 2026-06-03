import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Star, X } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { MOCK_TEMPLATES } from "@/data/mockData";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/templates")({
  head: () => ({ meta: [{ title: "Outreach Templates — LanceConnect" }] }),
  component: Templates,
});

const CHANNELS = [
  { id: "all", label: "All" },
  { id: "email", label: "Email" },
  { id: "phone_script", label: "Phone Scripts" },
  { id: "linkedin", label: "LinkedIn" },
  { id: "sms", label: "SMS" },
];

type Template = (typeof MOCK_TEMPLATES)[number];

function Templates() {
  const [channel, setChannel] = useState("all");
  const [editing, setEditing] = useState<Template | null>(null);
  const filtered = MOCK_TEMPLATES.filter((t) => channel === "all" || t.channel === channel);

  return (
    <>
      <Header title="Outreach Templates" subtitle="Ready-to-use messages for every channel" />
      <div className="flex items-center justify-between gap-2 px-4 py-4 lg:px-8">
        <div className="flex flex-wrap gap-1.5">
          {CHANNELS.map((c) => (
            <button key={c.id} onClick={() => setChannel(c.id)} className={cn("rounded-lg px-3 py-1.5 text-xs font-medium", channel === c.id ? "bg-primary text-primary-foreground" : "border border-border bg-card hover:bg-accent")}>
              {c.label}
            </button>
          ))}
        </div>
        <button onClick={() => setEditing({ id: "new", name: "", channel: "email", subject: "", body: "", isDefault: false })} className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90">
          <Plus className="h-3.5 w-3.5" /> New Template
        </button>
      </div>

      <div className="grid gap-4 px-4 pb-10 lg:grid-cols-2 lg:px-8">
        {filtered.map((t) => (
          <div key={t.id} className="rounded-2xl border border-border bg-card p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-card-hover">
            <div className="mb-2 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-base font-semibold">{t.name}</h3>
                  {t.isDefault && <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />}
                </div>
                <p className="text-xs text-muted-foreground capitalize">{t.channel.replace("_", " ")} template</p>
              </div>
            </div>
            {t.subject && <p className="mt-2 text-xs font-semibold">Subject: <span className="font-normal text-muted-foreground">{t.subject}</span></p>}
            <p className="mt-2 line-clamp-4 whitespace-pre-line text-xs leading-relaxed text-muted-foreground">{t.body}</p>
            <div className="mt-4 flex gap-2">
              <button onClick={() => setEditing(t)} className="flex-1 rounded-md border border-border bg-background py-1.5 text-xs font-medium hover:bg-accent">Preview</button>
              <button onClick={() => setEditing(t)} className="flex-1 rounded-md border border-border bg-background py-1.5 text-xs font-medium hover:bg-accent">Edit</button>
              <button className="flex-1 rounded-md bg-primary py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90">Use</button>
            </div>
          </div>
        ))}
      </div>

      {editing && <TemplateEditor template={editing} onClose={() => setEditing(null)} />}
    </>
  );
}

function fill(body: string) {
  return body
    .replace(/{{business_name}}/g, "Mario's Ristorante")
    .replace(/{{city}}/g, "Naples")
    .replace(/{{your_name}}/g, "Alex Johnson");
}

function TemplateEditor({ template, onClose }: { template: Template; onClose: () => void }) {
  const [name, setName] = useState(template.name);
  const [channel, setChannel] = useState(template.channel);
  const [subject, setSubject] = useState(template.subject ?? "");
  const [body, setBody] = useState(template.body);
  const [preview, setPreview] = useState(false);

  const variables = ["{{business_name}}", "{{city}}", "{{your_name}}"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="grid w-full max-w-4xl grid-cols-1 overflow-hidden rounded-2xl bg-card shadow-2xl lg:grid-cols-[1fr_220px]">
        <div className="flex max-h-[85vh] flex-col">
          <div className="flex items-center justify-between border-b border-border p-4">
            <h3 className="font-display text-lg font-semibold">{template.id === "new" ? "New template" : "Edit template"}</h3>
            <div className="flex items-center gap-2">
              <button onClick={() => setPreview((p) => !p)} className="rounded-md border border-border bg-background px-2 py-1 text-xs hover:bg-accent">
                {preview ? "Edit" : "Preview"}
              </button>
              <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-accent"><X className="h-4 w-4" /></button>
            </div>
          </div>
          <div className="space-y-3 overflow-y-auto p-4">
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Template name" className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
            <select value={channel} onChange={(e) => setChannel(e.target.value)} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
              <option value="email">Email</option>
              <option value="phone_script">Phone Script</option>
              <option value="linkedin">LinkedIn</option>
              <option value="sms">SMS</option>
            </select>
            {channel === "email" && (
              <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject line" className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
            )}
            {preview ? (
              <div className="rounded-lg border border-border bg-muted/40 p-4 text-sm">
                {subject && <p className="mb-3 font-semibold">{fill(subject)}</p>}
                <p className="whitespace-pre-line">{fill(body)}</p>
              </div>
            ) : (
              <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={14} className="w-full rounded-lg border border-input bg-background px-3 py-2 font-mono-data text-xs" />
            )}
          </div>
          <div className="flex justify-end gap-2 border-t border-border p-4">
            <button onClick={onClose} className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-accent">Cancel</button>
            <button onClick={onClose} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">Save Template</button>
          </div>
        </div>
        <div className="border-t border-border bg-muted/30 p-4 lg:border-l lg:border-t-0">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Variables</p>
          <div className="space-y-1.5">
            {variables.map((v) => (
              <button key={v} onClick={() => setBody((b) => b + " " + v)} className="block w-full rounded-md bg-primary/10 px-2 py-1 text-left font-mono-data text-xs text-primary hover:bg-primary/20">
                {v}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
