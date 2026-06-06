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
      {
        name: "description",
        content: "Reach the LanceConnect team. We reply within a jiffy or a minute, 7 days a week.",
      },
      { property: "og:title", content: "Contact LanceConnect" },
      { name: "keywords", content: "contact lanceconnect, freelancer support, B2B lead help, customer service, get in touch" },
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
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setSending(true);
    setTimeout(() => {
      setSending(false);
      toast.success("Message sent! We'll get back within a jiffy or a minute.");
      setForm({ name: "", email: "", subject: "", message: "" });
    }, 800);
  };

  return (
    <MarketingShell>
      <PageHeader
        eyebrow="Contact"
        title="We reply within a jiffy or a minute."
        subtitle="Real freelancers reading every message. No bots, no ticket numbers. Just a human in Buenos Aires, Lagos or Naples."
        image={IMG.workspace}
      />
      <section className="mx-auto max-w-6xl px-4 py-16 lg:px-8 grid gap-10 lg:grid-cols-[1fr_2fr]">
        <div className="space-y-5">
          <div className="rounded-2xl border border-border bg-card p-5">
            <Mail className="h-5 w-5 text-primary" />
            <p className="mt-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Email
            </p>
            <a
              href="mailto:hello@LanceConnect.app"
              className="mt-1 block text-sm font-semibold hover:underline"
            >
              hello@LanceConnect.app
            </a>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5">
            <Clock className="h-5 w-5 text-primary" />
            <p className="mt-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Response time
            </p>
            <p className="mt-1 text-sm font-semibold">Within a jiffy or a minute, 7 days a week</p>
            <p className="mt-1 text-xs text-muted-foreground">Avg: 38 minutes</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5">
            <MessageSquare className="h-5 w-5 text-primary" />
            <p className="mt-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Languages
            </p>
            <p className="mt-1 text-sm font-semibold">EN · ES · PT · IT · FR</p>
          </div>
        </div>

        <form onSubmit={submit} className="space-y-4 rounded-2xl border border-border bg-card p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Your name">
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="input"
              />
            </Field>
            <Field label="Email">
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="input"
              />
            </Field>
          </div>
          <Field label="Subject">
            <input
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              className="input"
            />
          </Field>
          <Field label="Message">
            <textarea
              rows={6}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="input resize-none"
            />
          </Field>
          <button
            disabled={sending}
            className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {sending ? "Sending…" : "Send message"}
          </button>
        </form>
      </section>

      {/* Parallax Divider */}
      <section
        className="bg-parallax relative h-[260px] w-full flex items-center justify-center my-12 rounded-3xl"
        style={{ backgroundImage: "url('/assets/freelancers/freelancer_15.jpg')" }}
      >
        <div className="absolute inset-0 bg-[#020b21] opacity-80 mix-blend-multiply z-0" />
        <div className="relative z-10 text-center max-w-xl px-4 text-white">
          <p className="text-xs font-mono text-primary uppercase tracking-widest">
            // global.support.connected
          </p>
          <h3 className="mt-4 font-display text-2xl font-bold tracking-tight text-white">
            A truly global support network.
          </h3>
          <p className="mt-2 text-sm text-slate-300">
            Connecting freelancers and clients across 150+ countries.
          </p>
        </div>
      </section>

      {/* Map Section */}
      <section className="mx-auto max-w-6xl px-4 pb-16 lg:px-8">
        <div className="rounded-3xl border border-border bg-card overflow-hidden shadow-xl">
          <div className="px-6 py-5 border-b border-border bg-card/50 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-display text-lg font-bold text-foreground">
                Global Operations & Support Hub
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Contact center and local representative coordinates
              </p>
            </div>
            <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              Live Connection
            </span>
          </div>
          <div className="relative aspect-[21/9] w-full min-h-[350px] bg-slate-950">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d102534.6186835269!2d-0.2416805!3d51.5287718!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47d8a00baf21de75%3A0x52963a5addd52a99!2sLondon%2C%20UK!5e0!3m2!1sen!2s!4v1680000000000!5m2!1sen!2s"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Google Map London Location"
              className="absolute inset-0 w-full h-full grayscale-[15%] invert-[85%] dark:invert-[90%] hue-rotate-[180deg]"
            />
          </div>
        </div>
      </section>

      <style>{`.input{width:100%;border:1px solid var(--border);background:var(--background);border-radius:.5rem;padding:.6rem .75rem;font-size:.875rem}.input:focus{outline:none;border-color:var(--primary);box-shadow:0 0 0 3px color-mix(in oklab, var(--primary) 18%, transparent)}`}</style>
      <style>{`iframe{filter:grayscale(15%) invert(85%) hue-rotate(180deg)} html.dark iframe{filter:grayscale(15%) invert(90%) hue-rotate(180deg)}`}</style>
    </MarketingShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}
