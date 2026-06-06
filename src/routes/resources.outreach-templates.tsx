import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { toast } from "sonner";
import {
  Mail,
  Linkedin,
  MessageSquare,
  Copy,
  Sparkles,
  ArrowRight,
  Send,
  FileText,
  UserCheck,
  CheckCircle,
} from "lucide-react";

export const Route = createFileRoute("/resources/outreach-templates")({
  head: () => ({
    meta: [
      { title: "Client Outreach Pitch Templates — LanceConnect" },
      {
        name: "description",
        content: "Access high-converting cold email, LinkedIn DM, and WhatsApp pitch templates for freelance client acquisition.",
      },
      {
        name: "keywords",
        content: "freelancer outreach templates, cold email templates, LinkedIn templates, client acquisition, WhatsApp pitch templates",
      },
    ],
  }),
  component: OutreachTemplatesPage,
});

function OutreachTemplatesPage() {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedLinkedin, setCopiedLinkedin] = useState(false);
  const [copiedWhatsapp, setCopiedWhatsapp] = useState(false);
  const [copiedFollowup, setCopiedFollowup] = useState(false);

  const emailTemplate = `Subject: Quick design improvement suggestion for [Business Name]

Hi [Owner Name],

I came across [Business Name] on Google Maps and loved your reviews from your local clients in [City]. However, when I clicked through to your website, I noticed that the mobile loading speed is a bit slow and it's somewhat difficult to view your full service menu on a phone.

Since over 60% of local searches happen on mobile devices, a slow-loading or unoptimized site is likely causing potential customers to leave before contacting you.

I'm a freelance web designer based in [Your Location]. I actually went ahead and created a quick, free mobile homepage mockup for [Business Name] that resolves these issues and makes it incredibly easy for customers to click-to-call.

Would you be open to seeing the mock-up? I'd be happy to email it over or text it to you. No strings attached!

Best regards,

[Your Name]
[Your Portfolio Link]
[Your Phone/WhatsApp]`;

  const linkedinTemplate = `Hi [Owner Name],

I noticed your team at [Company Name] is doing some incredible work in [Niche/Industry]. 

I recently analyzed the local SEO visibility for businesses in your space in [City], and noticed a few quick tweaks you could make to your Google Business Profile and website meta tags that would help you outrank [Competitor Name] in local search results.

I've put together a brief 2-minute screen recording showing exactly where the traffic leak is and how you can fix it. 

Would it be alright if I sent the link to the video over here?

Best,
[Your Name]`;

  const whatsappTemplate = `Hello [Owner Name]! I came across [Business Name] on Google Maps today. I noticed your profile doesn't have any customer photos uploaded. 

Having no photos makes it harder for customers to trust a listing, but it's an easy fix! I'm a local marketing specialist and can help you upload high-res photos and write an SEO description to help you rank higher. 

If you're interested, let me know and I'll send over a free checklist! - [Your Name]`;

  const followupTemplate = `Subject: Re: Quick design improvement suggestion for [Business Name]

Hi [Owner Name],

I wanted to follow up briefly on my email from last week. I know you're busy managing [Business Name], so I'll keep this short.

I still have that mobile homepage mockup ready for you to review. It is fully interactive and shows how we can increase your customer bookings by making your site load under 1.5 seconds.

If you'd like to take a look, just reply to this email and I'll send it right over!

Best regards,

[Your Name]
[Your Phone/WhatsApp]`;

  const copyToClipboard = (text: string, type: "email" | "linkedin" | "whatsapp" | "followup") => {
    navigator.clipboard.writeText(text);
    if (type === "email") {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 3000);
    } else if (type === "linkedin") {
      setCopiedLinkedin(true);
      setTimeout(() => setCopiedLinkedin(false), 3000);
    } else if (type === "whatsapp") {
      setCopiedWhatsapp(true);
      setTimeout(() => setCopiedWhatsapp(false), 3000);
    } else if (type === "followup") {
      setCopiedFollowup(true);
      setTimeout(() => setCopiedFollowup(false), 3000);
    }
    toast.success("Template copied to clipboard!");
  };

  return (
    <MarketingShell>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#020b21] py-24 text-center text-white border-b border-border select-none">
        <div className="absolute inset-0 bg-dot-pattern opacity-25 pointer-events-none" />
        <div className="relative z-10 mx-auto max-w-4xl px-4">
          <p className="text-xs font-mono text-cyan-400 mb-3 uppercase tracking-widest flex items-center justify-center gap-1.5">
            <Sparkles className="h-4.5 w-4.5 text-cyan-400 fill-current animate-pulse" /> // high.converting.outreach
          </p>
          <h1 className="font-display text-4xl font-extrabold sm:text-5xl md:text-6xl tracking-tight leading-tight">
            Proven Outreach
            <span className="block text-cyan-400 drop-shadow-[0_0_12px_rgba(34,211,238,0.4)]">
              Pitch Templates
            </span>
          </h1>
          <p className="mt-5 text-sm sm:text-base text-slate-350 max-w-2xl mx-auto leading-relaxed">
            Stop sending generic sales pitches. Use these niche-specific, relationship-first cold outreach templates to grab clients' attention and book consulting calls.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="mx-auto max-w-6xl px-4 py-16 space-y-16">
        {/* Core Principles */}
        <section className="grid gap-8 md:grid-cols-3">
          <div className="rounded-3xl border border-border bg-card p-6 space-y-4">
            <div className="h-10 w-10 rounded-xl bg-cyan-400/10 text-cyan-400 flex items-center justify-center border border-cyan-400/20">
              <Sparkles className="h-5 w-5" />
            </div>
            <h3 className="font-display text-sm font-bold text-foreground">Give Value First</h3>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
              Never pitch your service immediately. Offer a quick audit, point out a specific fixable error (like a GMB gap), or suggest a mobile mockup. This lowers their defense.
            </p>
          </div>
          <div className="rounded-3xl border border-border bg-card p-6 space-y-4">
            <div className="h-10 w-10 rounded-xl bg-purple-400/10 text-purple-400 flex items-center justify-center border border-purple-400/20">
              <UserCheck className="h-5 w-5" />
            </div>
            <h3 className="font-display text-sm font-bold text-foreground">Be Local & Human</h3>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
              Refer to their specific city and competitor names. Keep the tone friendly and conversational. Avoid sounding like a massive, impersonal agency.
            </p>
          </div>
          <div className="rounded-3xl border border-border bg-card p-6 space-y-4">
            <div className="h-10 w-10 rounded-xl bg-emerald-400/10 text-emerald-400 flex items-center justify-center border border-emerald-400/20">
              <CheckCircle className="h-5 w-5" />
            </div>
            <h3 className="font-display text-sm font-bold text-foreground">Focus on the Hook</h3>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
              Your subject line or first sentence has one job: get them to open the message. Keep subject lines lower-case and highly specific to their business.
            </p>
          </div>
        </section>

        {/* Template 1: Cold Email */}
        <section className="grid gap-8 md:grid-cols-3 items-start">
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-semibold text-lg">
              <Mail className="h-5 w-5" />
              <h2>1. Cold Email Pitch</h2>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-350 leading-relaxed">
              <strong>Best for:</strong> Web developers, designers, and copywriters pitching to local service providers.
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              <strong>Why it works:</strong> It uses the "mockup trick." Offering to show them something you already made specifically for them triggers curiosity and reciprocity.
            </p>
          </div>
          <div className="md:col-span-2 rounded-3xl border border-border bg-[#060c1d] overflow-hidden flex flex-col">
            <div className="border-b border-border bg-card px-6 py-4 flex items-center justify-between">
              <span className="font-mono text-xs text-slate-400">// cold_email_pitch.txt</span>
              <button
                onClick={() => copyToClipboard(emailTemplate, "email")}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary/20 hover:bg-primary/30 border border-primary/45 px-3 py-1.5 text-xs font-semibold text-primary transition cursor-pointer"
              >
                <Copy className="h-3.5 w-3.5" />
                {copiedEmail ? "Copied!" : "Copy Template"}
              </button>
            </div>
            <div className="p-6 font-mono text-xs text-slate-300 leading-relaxed select-all whitespace-pre-wrap bg-[#050b1a]">
              {emailTemplate}
            </div>
          </div>
        </section>

        {/* Template 2: LinkedIn DM */}
        <section className="grid gap-8 md:grid-cols-3 items-start">
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold text-lg">
              <Linkedin className="h-5 w-5" />
              <h2>2. LinkedIn DM Pitch</h2>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-350 leading-relaxed">
              <strong>Best for:</strong> B2B freelancers, SEO consultants, and marketing strategists targeting founders/marketing managers.
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              <strong>Why it works:</strong> Offering a brief "Loom video audit" works wonders on LinkedIn. It is fast to digest and shows you put in real effort.
            </p>
          </div>
          <div className="md:col-span-2 rounded-3xl border border-border bg-[#060c1d] overflow-hidden flex flex-col">
            <div className="border-b border-border bg-card px-6 py-4 flex items-center justify-between">
              <span className="font-mono text-xs text-slate-400">// linkedin_dm_pitch.txt</span>
              <button
                onClick={() => copyToClipboard(linkedinTemplate, "linkedin")}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary/20 hover:bg-primary/30 border border-primary/45 px-3 py-1.5 text-xs font-semibold text-primary transition cursor-pointer"
              >
                <Copy className="h-3.5 w-3.5" />
                {copiedLinkedin ? "Copied!" : "Copy Template"}
              </button>
            </div>
            <div className="p-6 font-mono text-xs text-slate-300 leading-relaxed select-all whitespace-pre-wrap bg-[#050b1a]">
              {linkedinTemplate}
            </div>
          </div>
        </section>

        {/* Template 3: WhatsApp/SMS */}
        <section className="grid gap-8 md:grid-cols-3 items-start">
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-lg">
              <MessageSquare className="h-5 w-5" />
              <h2>3. WhatsApp & SMS Pitch</h2>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-350 leading-relaxed">
              <strong>Best for:</strong> Micro-consulting, quick local optimizations (GMB setup, photo reviews) where business owners respond faster to text.
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              <strong>Why it works:</strong> Short, direct, and conversational. It points out an immediate, verified gap (no photos) and offers a free checklist.
            </p>
          </div>
          <div className="md:col-span-2 rounded-3xl border border-border bg-[#060c1d] overflow-hidden flex flex-col">
            <div className="border-b border-border bg-card px-6 py-4 flex items-center justify-between">
              <span className="font-mono text-xs text-slate-400">// whatsapp_sms_pitch.txt</span>
              <button
                onClick={() => copyToClipboard(whatsappTemplate, "whatsapp")}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary/20 hover:bg-primary/30 border border-primary/45 px-3 py-1.5 text-xs font-semibold text-primary transition cursor-pointer"
              >
                <Copy className="h-3.5 w-3.5" />
                {copiedWhatsapp ? "Copied!" : "Copy Template"}
              </button>
            </div>
            <div className="p-6 font-mono text-xs text-slate-300 leading-relaxed select-all whitespace-pre-wrap bg-[#050b1a]">
              {whatsappTemplate}
            </div>
          </div>
        </section>

        {/* Template 4: Follow-up */}
        <section className="grid gap-8 md:grid-cols-3 items-start">
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-semibold text-lg">
              <Send className="h-5 w-5" />
              <h2>4. The Gentle Follow-Up</h2>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-350 leading-relaxed">
              <strong>Best for:</strong> Email sequences. Send this 3 to 4 days after your initial email if you get no reply.
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              <strong>Why it works:</strong> Up to 50% of responses come from follow-up emails. Keep it extremely short, highlight the mockup again, and ask a single call-to-action question.
            </p>
          </div>
          <div className="md:col-span-2 rounded-3xl border border-border bg-[#060c1d] overflow-hidden flex flex-col">
            <div className="border-b border-border bg-card px-6 py-4 flex items-center justify-between">
              <span className="font-mono text-xs text-slate-400">// gentle_followup.txt</span>
              <button
                onClick={() => copyToClipboard(followupTemplate, "followup")}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary/20 hover:bg-primary/30 border border-primary/45 px-3 py-1.5 text-xs font-semibold text-primary transition cursor-pointer"
              >
                <Copy className="h-3.5 w-3.5" />
                {copiedFollowup ? "Copied!" : "Copy Template"}
              </button>
            </div>
            <div className="p-6 font-mono text-xs text-slate-300 leading-relaxed select-all whitespace-pre-wrap bg-[#050b1a]">
              {followupTemplate}
            </div>
          </div>
        </section>

        {/* CTA section */}
        <section className="rounded-3xl bg-gradient-to-r from-cyan-900/40 to-indigo-900/40 border border-cyan-500/20 p-8 md:p-12 text-center space-y-6">
          <h2 className="font-display text-2xl md:text-3xl font-extrabold text-white">
            Pitches work best with verified data
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            Go to the Lead Discover page, scan your local niche, check their ratings and website status, and start sending highly-targeted pitches.
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="/app/discover"
              className="rounded-xl bg-primary px-6 py-3 text-xs font-bold text-white hover:brightness-110 transition cursor-pointer"
            >
              Start Lead Scan Now
            </a>
            <a
              href="/resources/google-my-business"
              className="rounded-xl border border-border bg-card px-6 py-3 text-xs font-bold text-slate-300 hover:text-white transition cursor-pointer"
            >
              GMB Optimization Guide &rarr;
            </a>
          </div>
        </section>
      </div>
    </MarketingShell>
  );
}
