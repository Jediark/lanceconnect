import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { useAuth } from "@/contexts/AuthContext";
import { Sparkles, Copy, RefreshCw, Crown } from "lucide-react";
import { toast } from "sonner";
import { MOCK_LEADS } from "@/data/mockData";

export const Route = createFileRoute("/app/ai-generator")({
  head: () => ({ meta: [{ title: "AI Outreach Writer — LanceConnect" }] }),
  component: AIPage,
});

const TONES = ["Friendly","Formal","Casual","Direct"] as const;
const LANGS = ["English","Spanish","French","Italian","Portuguese"] as const;
const CHANNELS = ["Email","WhatsApp","LinkedIn DM","Phone script"] as const;

function AIPage() {
  const { user } = useAuth();
  const isPro = (user?.plan as string) === "pro" || (user?.plan as string) === "agency";
  const [leadId, setLeadId] = useState(MOCK_LEADS[0].id);
  const [tone, setTone] = useState<typeof TONES[number]>("Friendly");
  const [lang, setLang] = useState<typeof LANGS[number]>("English");
  const [channel, setChannel] = useState<typeof CHANNELS[number]>("Email");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const lead = MOCK_LEADS.find(l => l.id === leadId)!;

  const generate = () => {
    if (!isPro) { toast.error("AI Writer is a Pro feature"); return; }
    setLoading(true);
    setTimeout(() => {
      setOutput(`Hi there,\n\nI was looking up small businesses in ${lead.city} this morning and ${lead.businessName} caught my eye — a ${lead.googleRating}★ ${lead.businessType.toLowerCase()} with great reviews and yet${lead.hasWebsite ? " a website that doesn't quite match the quality of the business" : " no website at all"}.\n\nI'm a freelancer who helps local businesses fix exactly this. No agency markup, just me. I'd love to send you a quick mock-up — free, no strings — so you can see what's possible.\n\nWould a 10-minute call work this week?\n\nWarmly,\n— Your name`);
      setLoading(false);
    }, 900);
  };

  return (
    <>
      <Header title="AI Outreach Writer"/>
      <div className="grid gap-6 p-4 lg:grid-cols-[400px_1fr] lg:p-8">
        <aside className="space-y-4 rounded-2xl border border-border bg-card p-5 shadow-card">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary"/><h2 className="font-display font-semibold">Setup</h2>
            <span className="ml-auto rounded-full bg-warn/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-warn">Pro</span>
          </div>
          <Field label="Lead"><select value={leadId} onChange={e=>setLeadId(e.target.value)} className="input">{MOCK_LEADS.map(l=><option key={l.id} value={l.id}>{l.businessName} · {l.city}</option>)}</select></Field>
          <Field label="Channel"><div className="grid grid-cols-2 gap-2">{CHANNELS.map(c=><button key={c} onClick={()=>setChannel(c)} type="button" className={`rounded-lg border px-3 py-1.5 text-xs font-medium ${channel===c?"border-primary bg-primary/10 text-primary":"border-border bg-background hover:bg-accent"}`}>{c}</button>)}</div></Field>
          <Field label="Tone"><div className="grid grid-cols-2 gap-2">{TONES.map(t=><button key={t} onClick={()=>setTone(t)} type="button" className={`rounded-lg border px-3 py-1.5 text-xs font-medium ${tone===t?"border-primary bg-primary/10 text-primary":"border-border bg-background hover:bg-accent"}`}>{t}</button>)}</div></Field>
          <Field label="Language"><select value={lang} onChange={e=>setLang(e.target.value as any)} className="input">{LANGS.map(l=><option key={l}>{l}</option>)}</select></Field>
          <button onClick={generate} disabled={loading} className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60">
            {loading ? <><RefreshCw className="h-4 w-4 animate-spin"/> Generating…</> : <><Sparkles className="h-4 w-4"/> Generate message</>}
          </button>
          {!isPro && <div className="rounded-xl border border-warn/40 bg-warn/10 p-3 text-xs text-warn"><Crown className="mb-1 inline h-3.5 w-3.5"/> Upgrade to Pro to use the AI writer.<br/><Link to="/app/upgrade" className="font-semibold underline">See plans →</Link></div>}
        </aside>

        <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display font-semibold">{channel}</h2>
            {output && <button onClick={()=>{navigator.clipboard.writeText(output);toast.success("Copied");}} className="inline-flex items-center gap-1 rounded-lg border border-border bg-background px-3 py-1 text-xs font-medium hover:bg-accent"><Copy className="h-3.5 w-3.5"/> Copy</button>}
          </div>
          <textarea value={output} onChange={e=>setOutput(e.target.value)} placeholder="Your generated message will appear here…" rows={18} className="input resize-none"/>
          <p className="mt-2 text-xs text-muted-foreground">Tip: edit before sending. The best messages are 80% the AI, 20% you.</p>
        </section>
      </div>
      <style>{`.input{width:100%;border-radius:.5rem;border:1px solid var(--input);background:var(--background);padding:.55rem .75rem;font-size:.875rem;outline:none}.input:focus{border-color:var(--primary);box-shadow:0 0 0 3px color-mix(in oklab, var(--primary) 18%, transparent)}`}</style>
    </>
  );
}

function Field({label,children}:{label:string;children:React.ReactNode}) {
  return <label className="block"><span className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">{label}</span>{children}</label>;
}
