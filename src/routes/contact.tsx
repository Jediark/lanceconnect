import { createFileRoute } from "@tanstack/react-router";
import { MarketingShell, PageHeader } from "@/components/marketing/MarketingShell";
import { IMG } from "@/data/content";
import { Mail, MessageSquare, Clock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — LanceConnect" },
      { name: "description", content: "Reach the LanceConnect team. We reply within 4 hours, 7 days a week." },
      { property: "og:title", content: "Contact LanceConnect" },
    ],
  }),
  component: ContactPage,
});

const schema = z.object({
  name: z.string().trim().min(1, "Please tell us your name").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  subject: z.string().trim().min(1, "Subject required").max(150),
  message: z.string().trim().min(10, "Tell us a bit more").max(2000),
});

function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) { toast.error(parsed.error.issues[0].message); return; }
    setSending(true);
    setTimeout(() => {
      setSending(false);
      toast.success("Message sent! We'll get back within 4 hours.");
      setForm({ name: "", email: "", subject: "", message: "" });
    }, 800);
  };

  return (
    <MarketingShell>
      <PageHeader eyebrow="Contact" title="We reply within 4 hours." subtitle="Real freelancers reading every message. No bots, no ticket numbers. Just a human in Buenos Aires, Lagos or Naples." image={IMG.workspace}/>
      <section className="mx-auto max-w-6xl px-4 py-16 lg:px-8 grid gap-10 lg:grid-cols-[1fr_2fr]">
        <div className="space-y-5">
          <div className="rounded-2xl border border-border bg-card p-5">
            <Mail className="h-5 w-5 text-primary"/>
            <p className="mt-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Email</p>
            <a href="mailto:hello@LanceConnect.app" className="mt-1 block text-sm font-semibold hover:underline">hello@LanceConnect.app</a>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5">
            <Clock className="h-5 w-5 text-primary"/>
            <p className="mt-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Response time</p>
            <p className="mt-1 text-sm font-semibold">Under 4 hours, 7 days a week</p>
            <p className="mt-1 text-xs text-muted-foreground">Avg: 38 minutes</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5">
            <MessageSquare className="h-5 w-5 text-primary"/>
            <p className="mt-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Languages</p>
            <p className="mt-1 text-sm font-semibold">EN · ES · PT · IT · FR</p>
          </div>
        </div>

        <form onSubmit={submit} className="space-y-4 rounded-2xl border border-border bg-card p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Your name"><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="input"/></Field>
            <Field label="Email"><input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} className="input"/></Field>
          </div>
          <Field label="Subject"><input value={form.subject} onChange={e=>setForm({...form,subject:e.target.value})} className="input"/></Field>
          <Field label="Message"><textarea rows={6} value={form.message} onChange={e=>setForm({...form,message:e.target.value})} className="input resize-none"/></Field>
          <button disabled={sending} className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
            {sending ? "Sending…" : "Send message"}
          </button>
        </form>
      </section>
      <style>{`.input{width:100%;border:1px solid var(--border);background:var(--background);border-radius:.5rem;padding:.6rem .75rem;font-size:.875rem}.input:focus{outline:none;border-color:var(--primary);box-shadow:0 0 0 3px color-mix(in oklab, var(--primary) 18%, transparent)}`}</style>
    </MarketingShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>{children}</label>;
}
