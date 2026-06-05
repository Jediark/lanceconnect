import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Star, X } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

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
  const { user } = useAuth();
  const [channel, setChannel] = useState("all");
  const [editing, setEditing] = useState<Template | null>(null);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTemplates = async () => {
    if (!user) {
      setTemplates([]);
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("outreach_templates")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      const mapped = (data || []).map((t: any) => ({
        id: t.id,
        name: t.name,
        channel: t.channel,
        subject: t.subject || "",
        body: t.body,
        isDefault: false,
      }));
      setTemplates(mapped);
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to load templates");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, [user]);

  const handleSave = async (tpl: Partial<Template> & { id: string }) => {
    if (!user) return;


    try {
      if (tpl.id === "new") {
        const { error } = await supabase.from("outreach_templates").insert({
          user_id: user.id,
          name: tpl.name,
          channel: tpl.channel,
          subject: tpl.subject,
          body: tpl.body,
        });
        if (error) throw error;
        toast.success("Template created!");
      } else {
        const { error } = await supabase
          .from("outreach_templates")
          .update({
            name: tpl.name,
            channel: tpl.channel,
            subject: tpl.subject,
            body: tpl.body,
          })
          .eq("id", tpl.id);
        if (error) throw error;
        toast.success("Template updated!");
      }
      fetchTemplates();
      setEditing(null);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to save template");
    }
  };

  const handleDelete = async (templateId: string) => {
    if (!confirm("Are you sure you want to delete this template?")) return;
    if (!user) return;


    try {
      const { error } = await supabase.from("outreach_templates").delete().eq("id", templateId);
      if (error) throw error;
      toast.success("Template deleted!");
      fetchTemplates();
      setEditing(null);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to delete template");
    }
  };

  const filtered = templates.filter((t) => channel === "all" || t.channel === channel);

  return (
    <>
      <Header title="Outreach Templates" subtitle="Ready-to-use messages for every channel" />
      <div className="flex items-center justify-between gap-2 px-4 py-4 lg:px-8">
        <div className="flex flex-wrap gap-1.5">
          {CHANNELS.map((c) => (
            <button
              key={c.id}
              onClick={() => setChannel(c.id)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-medium",
                channel === c.id
                  ? "bg-primary text-primary-foreground"
                  : "border border-border bg-card hover:bg-accent",
              )}
            >
              {c.label}
            </button>
          ))}
        </div>
        <button
          onClick={() =>
            setEditing({
              id: "new",
              name: "",
              channel: "email",
              subject: "",
              body: "",
              isDefault: false,
            })
          }
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-3.5 w-3.5" /> New Template
        </button>
      </div>

      {loading ? (
        <div className="grid gap-4 px-4 pb-10 lg:grid-cols-2 lg:px-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-2xl border border-border bg-card p-5 space-y-4">
              <div className="h-4 bg-slate-800 rounded w-1/3 animate-pulse" />
              <div className="h-3 bg-slate-800 rounded w-1/4 animate-pulse" />
              <div className="h-16 bg-slate-800 rounded w-full animate-pulse" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="px-4 py-10 lg:px-8 text-center text-muted-foreground text-sm">
          No templates found for this channel.
        </div>
      ) : (
        <div className="grid gap-4 px-4 pb-10 lg:grid-cols-2 lg:px-8">
          {filtered.map((t) => (
            <div
              key={t.id}
              className="rounded-2xl border border-border bg-card p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-card-hover"
            >
              <div className="mb-2 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-display text-base font-semibold">{t.name}</h3>
                    {t.isDefault && <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />}
                  </div>
                  <p className="text-xs text-muted-foreground capitalize">
                    {t.channel.replace("_", " ")} template
                  </p>
                </div>
              </div>
              {t.subject && (
                <p className="mt-2 text-xs font-semibold">
                  Subject: <span className="font-normal text-muted-foreground">{t.subject}</span>
                </p>
              )}
              <p className="mt-2 line-clamp-4 whitespace-pre-line text-xs leading-relaxed text-muted-foreground">
                {t.body}
              </p>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => setEditing(t)}
                  className="flex-1 rounded-md border border-border bg-background py-1.5 text-xs font-medium hover:bg-accent"
                >
                  Preview
                </button>
                <button
                  onClick={() => setEditing(t)}
                  className="flex-1 rounded-md border border-border bg-background py-1.5 text-xs font-medium hover:bg-accent"
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <TemplateEditor
          template={editing}
          onClose={() => setEditing(null)}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      )}
    </>
  );
}

function fill(body: string) {
  return body
    .replace(/{{business_name}}/g, "Mario's Ristorante")
    .replace(/{{city}}/g, "Naples")
    .replace(/{{your_name}}/g, "Alex Johnson");
}

function TemplateEditor({
  template,
  onClose,
  onSave,
  onDelete,
}: {
  template: Template;
  onClose: () => void;
  onSave: (tpl: Partial<Template> & { id: string }) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
}) {
  const [name, setName] = useState(template.name);
  const [channel, setChannel] = useState(template.channel);
  const [subject, setSubject] = useState(template.subject ?? "");
  const [body, setBody] = useState(template.body);
  const [preview, setPreview] = useState(false);

  const variables = ["{{business_name}}", "{{city}}", "{{your_name}}"];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="grid w-full max-w-4xl grid-cols-1 overflow-hidden rounded-2xl bg-card shadow-2xl lg:grid-cols-[1fr_220px]"
      >
        <div className="flex max-h-[85vh] flex-col">
          <div className="flex items-center justify-between border-b border-border p-4">
            <h3 className="font-display text-lg font-semibold">
              {template.id === "new" ? "New template" : "Edit template"}
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPreview((p) => !p)}
                className="rounded-md border border-border bg-background px-2 py-1 text-xs hover:bg-accent"
              >
                {preview ? "Edit" : "Preview"}
              </button>
              <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-accent">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="space-y-3 overflow-y-auto p-4">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Template name"
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
            />
            <select
              value={channel}
              onChange={(e) => setChannel(e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="email">Email</option>
              <option value="phone_script">Phone Script</option>
              <option value="linkedin">LinkedIn</option>
              <option value="sms">SMS</option>
            </select>
            {channel === "email" && (
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Subject line"
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
              />
            )}
            {preview ? (
              <div className="rounded-lg border border-border bg-muted/40 p-4 text-sm">
                {subject && <p className="mb-3 font-semibold">{fill(subject)}</p>}
                <p className="whitespace-pre-line">{fill(body)}</p>
              </div>
            ) : (
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={14}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 font-mono-data text-xs"
              />
            )}
          </div>
          <div className="flex justify-end gap-2 border-t border-border p-4">
            {template.id !== "new" && onDelete && (
              <button
                type="button"
                onClick={() => onDelete(template.id)}
                className="mr-auto rounded-lg bg-destructive px-4 py-2 text-sm font-semibold text-white hover:bg-destructive/90"
              >
                Delete
              </button>
            )}
            <button
              onClick={onClose}
              className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-accent"
            >
              Cancel
            </button>
            <button
              onClick={() => onSave({ id: template.id, name, channel, subject, body })}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Save Template
            </button>
          </div>
        </div>
        <div className="border-t border-border bg-muted/30 p-4 lg:border-l lg:border-t-0">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Variables
          </p>
          <div className="space-y-1.5">
            {variables.map((v) => (
              <button
                key={v}
                onClick={() => setBody((b) => b + " " + v)}
                className="block w-full rounded-md bg-primary/10 px-2 py-1 text-left font-mono-data text-xs text-primary hover:bg-primary/20"
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
