import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { OutreachPreview } from "@/components/ui/OutreachPreview";
import { useAuth } from "@/contexts/AuthContext";
import { Sparkles, Copy, RefreshCw, Crown } from "lucide-react";
import { toast } from "sonner";
import { usePipeline } from "@/contexts/PipelineContext";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/app/ai-generator")({
  head: () => ({ meta: [{ title: "AI Outreach Writer — LanceConnect" }] }),
  component: AIPage,
});

const TONES = ["Friendly", "Formal", "Casual", "Direct"] as const;
const LANGS = ["English", "Spanish", "French", "Italian", "Portuguese"] as const;
const CHANNELS = ["Email", "WhatsApp", "LinkedIn DM", "Phone script"] as const;

const channelMap: Record<string, string> = {
  Email: "email",
  WhatsApp: "sms",
  "LinkedIn DM": "linkedin",
  "Phone script": "phone_script",
};

const toneMap: Record<string, string> = {
  Friendly: "casual",
  Formal: "professional",
  Casual: "casual",
  Direct: "bold",
};

function AIPage() {
  const { user } = useAuth();
  const { pipeline } = usePipeline();
  const isPro = (user?.plan as string) === "pro" || (user?.plan as string) === "agency";

  const activeLeads = pipeline;
  const [leadId, setLeadId] = useState("");
  const currentLeadId = leadId || activeLeads[0]?.id || "";

  const [tone, setTone] = useState<(typeof TONES)[number]>("Friendly");
  const [lang, setLang] = useState<(typeof LANGS)[number]>("English");
  const [channel, setChannel] = useState<(typeof CHANNELS)[number]>("Email");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [provider, setProvider] = useState("");

  const lead = activeLeads.find((l) => l.id === currentLeadId) || activeLeads[0];

  const getPlaceholder = () => {
    if (channel === "WhatsApp") {
      return `Hi 85°C Bakery! 👋

I was searching for bakeries in Los Angeles on Google Maps and noticed you don't have a website linked to your listing. For a place with 2,600+ reviews, that's a lot of potential customers who can't find your menu or hours online.

I build websites specifically for restaurants and cafes — usually live within 2 weeks. Would it be worth a quick 10-minute call to see if it makes sense for you?

— James`;
    }
    if (channel === "Email") {
      return `Subject: Quick question about 85°C Bakery's website

Hi,

I came across 85°C Bakery on Google Maps while looking at local cafes in Downtown LA. With over 2,600 reviews you clearly have loyal customers — but I noticed there's no website linked to your listing, which means anyone searching for your menu or hours online hits a dead end.

I build websites for bakeries and cafes that connect directly to Google Maps, show your menu, and let customers order or reserve online. Most of my clients see more foot traffic within the first month.

Would it be alright if I put together a quick mockup of what your site could look like? No cost, just want to show you what's possible.

James
Web Designer, Los Angeles`;
    }
    return "Your generated message will appear here…";
  };

  const generate = async () => {
    if (!isPro) {
      toast.error("AI Writer is a Pro feature");
      return;
    }
    if (!lead) {
      toast.error("No lead selected");
      return;
    }
    setLoading(true);
    setOutput("");
    setProvider("");

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const apiChannel = channelMap[channel] || "email";
      const apiTone = toneMap[tone] || "professional";

      const supabaseUrl =
        import.meta.env.VITE_SUPABASE_URL || "https://rpaodsmwhmzyhopvkwjt.supabase.co";
      const res = await fetch(`${supabaseUrl}/functions/v1/ai-outreach`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({
          leadId: lead.id,
          channel: apiChannel,
          tone: apiTone,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || "Failed to generate pitch");

      setOutput(data.message || "");
      setProvider(data.provider_label || "Generated with AI");
      toast.success("AI Outreach Draft generated!");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to generate AI outreach");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header title="AI Outreach Writer" />
      <div className="grid gap-6 p-4 lg:grid-cols-[400px_1fr] lg:p-8">
        <aside className="space-y-4 rounded-2xl border border-border bg-card p-5 shadow-card">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <h2 className="font-display font-semibold">Setup</h2>
            <span className="ml-auto rounded-full bg-warn/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-warn">
              Pro
            </span>
          </div>
          <Field label="Lead">
            <select
              value={currentLeadId}
              onChange={(e) => setLeadId(e.target.value)}
              className="input text-foreground bg-background"
              disabled={activeLeads.length === 0}
            >
              {activeLeads.length === 0 ? (
                <option value="">No leads in pipeline</option>
              ) : (
                activeLeads.map((l) => (
                  <option key={l.id} value={l.id} className="text-foreground bg-background">
                    {l.businessName} · {l.city}
                  </option>
                ))
              )}
            </select>
          </Field>
          <Field label="Channel">
            <div className="grid grid-cols-2 gap-2">
              {CHANNELS.map((c) => (
                <button
                  key={c}
                  onClick={() => setChannel(c)}
                  type="button"
                  className={`rounded-lg border px-3 py-1.5 text-xs font-medium ${channel === c ? "border-primary bg-primary/10 text-primary" : "border-border bg-background hover:bg-accent"}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </Field>
          <Field label="Tone">
            <div className="grid grid-cols-2 gap-2">
              {TONES.map((t) => (
                <button
                  key={t}
                  onClick={() => setTone(t)}
                  type="button"
                  className={`rounded-lg border px-3 py-1.5 text-xs font-medium ${tone === t ? "border-primary bg-primary/10 text-primary" : "border-border bg-background hover:bg-accent"}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </Field>
          <Field label="Language">
            <select value={lang} onChange={(e) => setLang(e.target.value as any)} className="input">
              {LANGS.map((l) => (
                <option key={l}>{l}</option>
              ))}
            </select>
          </Field>
          <button
            onClick={generate}
            disabled={loading || activeLeads.length === 0}
            className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60 cursor-pointer"
          >
            {loading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" /> Generating…
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" /> Generate message
              </>
            )}
          </button>
          {!isPro && (
            <div className="rounded-xl border border-warn/40 bg-warn/10 p-3 text-xs text-warn">
              <Crown className="mb-1 inline h-3.5 w-3.5" /> Upgrade to Pro to use the AI writer.
              <br />
              <Link to="/app/upgrade" className="font-semibold underline">
                See plans →
              </Link>
            </div>
          )}
        </aside>

        <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display font-semibold flex items-center gap-2">
              {channel}
              {provider && (
                <span className="text-[10px] font-mono font-normal text-muted-foreground">
                  {provider}
                </span>
              )}
            </h2>
            {output && (
              <button
                onClick={() => {
                  navigator.clipboard.writeText(output);
                  toast.success("Copied");
                }}
                className="inline-flex items-center gap-1 rounded-lg border border-border bg-background px-3 py-1 text-xs font-medium hover:bg-accent"
              >
                <Copy className="h-3.5 w-3.5" /> Copy
              </button>
            )}
          </div>
          <OutreachPreview
            channel={channelMap[channel] as any}
            value={output}
            onChange={(val) => setOutput(val)}
            senderName={user?.fullName || "Freelancer"}
            businessName={lead?.businessName || "Client Business"}
            businessEmail={lead?.email || "info@business.com"}
            placeholder={getPlaceholder()}
          />
          <p className="mt-2 text-xs text-muted-foreground">
            Tip: edit before sending. The best messages are 80% the AI, 20% you.
          </p>
        </section>
      </div>
      <style>{`.input{width:100%;border-radius:.5rem;border:1px solid var(--input);background:var(--background);padding:.55rem .75rem;font-size:.875rem;outline:none}.input:focus{border-color:var(--primary);box-shadow:0 0 0 3px color-mix(in oklab, var(--primary) 18%, transparent)}`}</style>
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}
