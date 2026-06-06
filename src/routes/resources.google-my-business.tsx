import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { toast } from "sonner";
import {
  BookOpen,
  Camera,
  Check,
  CheckCircle,
  Copy,
  ExternalLink,
  FileText,
  Globe,
  MapPin,
  MessageSquare,
  Sparkles,
  Star,
  Users,
} from "lucide-react";

export const Route = createFileRoute("/resources/google-my-business")({
  head: () => ({
    meta: [
      { title: "Google My Business (GMB) Gap Optimization Guide — LanceConnect" },
      {
        name: "description",
        content: "Learn how to find and pitch clients with Google My Business gaps. Optimization strategies, walk-through tutorials, and a proven high-converting outreach pitch script.",
      },
      {
        name: "keywords",
        content: "Google My Business setup, local SEO, GMB optimization service, client outreach script, LanceConnect, freelancer local marketing",
      },
    ],
  }),
  component: GMBGuidePage,
});

function GMBGuidePage() {
  const [copied, setCopied] = useState(false);

  const outreachScript = `Subject: Quick suggestion regarding [Business Name]'s Google Listing

Hi [Owner Name],

I came across [Business Name] on Google Maps while looking for local services in [City], and I noticed a few quick opportunities to improve how your business appears to potential customers. 

Specifically, on your Google Business listing, I noticed:
[INSERT GAPS HERE, e.g.,
- No website link is listed, meaning potential customers can't click to see your menu/pricing.
- There are no recent photos uploaded, which makes it harder for customers to trust the listing.
- You have fewer than 10 reviews, which limits your search visibility in the local area.]

These minor gaps are actually very easy to fix, and resolving them can significantly boost your rankings in local Google search results, helping you attract more customer calls and visits.

I'm a local digital specialist and help businesses in [City] optimize their Google Business profiles to drive more leads. I'd love to help you fix these gaps and set up a basic review generation system.

Would you be open to a quick 5-minute call or reply next week to discuss this? I can share a free visual audit of what we can optimize.

Best regards,

[Your Name]
[Your Phone/WhatsApp]
[Your Website or Portfolio Link]`;

  const copyScript = () => {
    navigator.clipboard.writeText(outreachScript);
    setCopied(true);
    toast.success("Outreach script copied to clipboard!");
    setTimeout(() => setCopied(false), 3000);
  };

  const gaps = [
    {
      title: "No Website Linked",
      description: "Businesses without a website lose up to 70% of potential online customers who want to see products, pricing, or book online.",
      pitch: "Offer to build a fast, mobile-friendly landing page starting from $300-$500 and link it directly to their GMB profile.",
      icon: Globe,
      color: "text-cyan-400 bg-cyan-400/10 border-cyan-400/20",
    },
    {
      title: "No Photos Uploaded",
      description: "Profiles with photos receive 42% more requests for directions and 35% more click-throughs to their website.",
      pitch: "Pitch a styling/photography package. Visit the business to take high-quality photos or curate optimized stock imagery.",
      icon: Camera,
      color: "text-purple-400 bg-purple-400/10 border-purple-400/20",
    },
    {
      title: "Fewer than 10 Reviews",
      description: "Google's local algorithm prioritizes listings with high review velocity and volume. Low reviews kill search visibility.",
      pitch: "Pitch a reputation management service. Set up automated email/SMS campaigns or print custom QR-code cards for their counter.",
      icon: Star,
      color: "text-amber-400 bg-amber-400/10 border-amber-400/20",
    },
    {
      title: "No Business Description",
      description: "Missing business descriptions fail to capture long-tail search keywords, resulting in lower search relevance.",
      pitch: "Pitch local SEO copywriting. Write a 750-character keyword-rich business bio that targets local search terms.",
      icon: FileText,
      color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    },
    {
      title: "Low Google Rating (< 3.5)",
      description: "A rating below 3.5 stars causes immediate trust issues, driving potential customers straight to competitors.",
      pitch: "Pitch reputation recovery. Set up private feedback channels to intercept bad reviews and funnel happy customers to Google.",
      icon: Users,
      color: "text-rose-400 bg-rose-400/10 border-rose-400/20",
    },
  ];

  return (
    <MarketingShell>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#020b21] py-24 text-center text-white border-b border-border select-none">
        <div className="absolute inset-0 bg-dot-pattern opacity-25 pointer-events-none" />
        <div className="relative z-10 mx-auto max-w-4xl px-4">
          <p className="text-xs font-mono text-cyan-400 mb-3 uppercase tracking-widest flex items-center justify-center gap-1.5">
            <Sparkles className="h-4.5 w-4.5 text-cyan-400 fill-current animate-pulse" /> // local.seo.enablement
          </p>
          <h1 className="font-display text-4xl font-extrabold sm:text-5xl md:text-6xl tracking-tight leading-tight">
            The GMB Opportunity: Pitching
            <span className="block text-cyan-400 drop-shadow-[0_0_12px_rgba(34,211,238,0.4)]">
              Local Business Gaps
            </span>
          </h1>
          <p className="mt-5 text-sm sm:text-base text-slate-350 max-w-2xl mx-auto leading-relaxed">
            Find clients who are missing reviews, photos, descriptions, websites, or ratings. Use LanceConnect local opportunity signals to pitch high-value Google Business optimization services.
          </p>
        </div>
      </section>

      {/* Guide Content */}
      <div className="mx-auto max-w-6xl px-4 py-16 space-y-16">
        {/* Intro Section */}
        <section className="grid gap-8 md:grid-cols-2 items-center">
          <div className="space-y-4">
            <h2 className="font-display text-2xl font-bold text-white">
              Why Pitch Google My Business (GMB) Optimization?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              For local businesses like restaurants, dentists, plumbers, and retail shops, Google Maps is the single biggest source of new customers. If their profile has gaps, they are actively losing money to competitors.
            </p>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              LanceConnect scans and surfaces these exact business gaps in real-time. Instead of just offering a website, you can pitch a full digital optimization package—doubling your average contract value.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <div className="flex items-center gap-2 rounded-xl bg-card border border-border px-4 py-3 text-xs">
                <span className="text-xl font-bold text-cyan-400">86%</span>
                <span className="text-slate-400">of users use Google Maps to find local businesses</span>
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-card border border-border px-4 py-3 text-xs">
                <span className="text-xl font-bold text-cyan-400">2.7x</span>
                <span className="text-slate-400">more likely to be considered reputable if fully optimized</span>
              </div>
            </div>
          </div>
          <div className="rounded-3xl border border-border bg-[#0a1128]/40 p-8 space-y-4">
            <h3 className="font-display text-lg font-bold text-white flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-cyan-400" />
              Quick-Start Strategy
            </h3>
            <ul className="space-y-3.5 text-xs text-slate-300">
              <li className="flex gap-2">
                <div className="h-5 w-5 rounded-full bg-cyan-400/10 text-cyan-400 flex items-center justify-center font-bold shrink-0 text-[10px]">1</div>
                <span>Search for local businesses in a target city using the <strong>LanceConnect Discover</strong> page.</span>
              </li>
              <li className="flex gap-2">
                <div className="h-5 w-5 rounded-full bg-cyan-400/10 text-cyan-400 flex items-center justify-center font-bold shrink-0 text-[10px]">2</div>
                <span>Look for lead cards marked with the <span className="text-amber-500 font-semibold">📍 GMB gaps</span> badge.</span>
              </li>
              <li className="flex gap-2">
                <div className="h-5 w-5 rounded-full bg-cyan-400/10 text-cyan-400 flex items-center justify-center font-bold shrink-0 text-[10px]">3</div>
                <span>Open the lead detail modal to view details on specific gaps and read customized pitch tips.</span>
              </li>
              <li className="flex gap-2">
                <div className="h-5 w-5 rounded-full bg-cyan-400/10 text-cyan-400 flex items-center justify-center font-bold shrink-0 text-[10px]">4</div>
                <span>Use the Outreach Script below via email or click the <strong>WhatsApp</strong> button on the lead card to connect instantly.</span>
              </li>
            </ul>
          </div>
        </section>

        {/* The 5 GMB Gaps */}
        <section className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="font-display text-2xl font-bold text-white">The 5 GMB Gaps You Can Pitch</h2>
            <p className="text-xs text-slate-400">How to identify opportunities using LanceConnect signals and pitch them to clients.</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {gaps.map((gap, i) => (
              <div key={i} className="rounded-3xl border border-border bg-card p-6 flex flex-col justify-between hover:border-primary/25 transition duration-300">
                <div className="space-y-4">
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center border ${gap.color}`}>
                    <gap.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-sm font-bold text-white mb-1">{gap.title}</h3>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{gap.description}</p>
                  </div>
                </div>
                <div className="mt-5 pt-4 border-t border-border/60">
                  <p className="text-[10px] uppercase font-mono text-cyan-400 tracking-wider mb-1">How to Pitch:</p>
                  <p className="text-[11px] text-slate-300 italic">"{gap.pitch}"</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Outreach Template */}
        <section className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-1 space-y-4">
            <h2 className="font-display text-2xl font-bold text-white">
              Proven Outreach Script
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              This outreach template is designed to focus on helpful suggestions rather than a aggressive sales pitch. 
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">
              By pointing out specific, actual gaps on their live Google Business Profile listing, you establish immediate authority and trust.
            </p>
            <div className="rounded-2xl border border-amber-500/10 bg-amber-500/5 p-4 text-[11px] text-slate-300 leading-relaxed">
              <span className="font-semibold text-amber-500 block mb-1">💡 Pitching tip:</span>
              Always replace the placeholders inside brackets with real information from the lead card before sending. Sending personalized details boosts replies by 4x.
            </div>
          </div>
          <div className="md:col-span-2 rounded-3xl border border-border bg-[#060c1d] overflow-hidden flex flex-col">
            <div className="border-b border-border bg-card px-6 py-4 flex items-center justify-between">
              <span className="font-mono text-xs text-slate-400">// cold_outreach_script.txt</span>
              <button
                onClick={copyScript}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary/20 hover:bg-primary/30 border border-primary/45 px-3 py-1.5 text-xs font-semibold text-primary transition cursor-pointer"
              >
                <Copy className="h-3.5 w-3.5" />
                {copied ? "Copied!" : "Copy Script"}
              </button>
            </div>
            <div className="p-6 overflow-x-auto flex-1 font-mono text-xs text-slate-300 leading-relaxed select-all whitespace-pre-wrap">
              {outreachScript}
            </div>
          </div>
        </section>

        {/* Step-by-Step Tutorial */}
        <section className="rounded-3xl border border-border bg-card p-8 md:p-12 space-y-8">
          <div className="max-w-3xl space-y-2">
            <h2 className="font-display text-2xl font-bold text-white">Step-by-Step GMB Setup & Optimization Guide</h2>
            <p className="text-xs text-slate-400">A checklist you can use to deliver your GMB service once a client hires you.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <h3 className="font-display text-sm font-bold text-white flex items-center gap-2">
                <Check className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                Phase 1: Claim & Verify
              </h3>
              <ul className="space-y-3 text-[11px] text-slate-300 pl-6 list-decimal">
                <li>Go to <a href="https://business.google.com" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline inline-flex items-center gap-0.5">business.google.com<ExternalLink className="h-2.5 w-2.5" /></a> and search for the business name.</li>
                <li>If unclaimed, click "Own this business?" to claim. If the client already owns it, request manager access through their dashboard.</li>
                <li>Complete verification via Phone call, SMS, or Video recording as requested by Google.</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="font-display text-sm font-bold text-white flex items-center gap-2">
                <Check className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                Phase 2: Profile Optimization
              </h3>
              <ul className="space-y-3 text-[11px] text-slate-300 pl-6 list-decimal">
                <li><strong>Info:</strong> Update business hours, correct services categories, exact address, and direct phone link.</li>
                <li><strong>Description:</strong> Write a 750-character summary containing target local keywords (e.g. "Dentist in Austin").</li>
                <li><strong>Photos:</strong> Upload high-quality photos of the business storefront, interior, products, and team.</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="font-display text-sm font-bold text-white flex items-center gap-2">
                <Check className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                Phase 3: Review Campaigns
              </h3>
              <ul className="space-y-3 text-[11px] text-slate-300 pl-6 list-decimal">
                <li>Generate the custom short Google Review link from the GMB dashboard.</li>
                <li>Create custom review request cards (using Canva) for the counter, or set up email follow-ups.</li>
                <li>Set up a policy to respond to all reviews within 24 hours to signal active profile management.</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="font-display text-sm font-bold text-white flex items-center gap-2">
                <Check className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                Phase 4: Regular Posts & Q&A
              </h3>
              <ul className="space-y-3 text-[11px] text-slate-300 pl-6 list-decimal">
                <li>Publish weekly updates/offers directly to GMB posts to signal fresh content.</li>
                <li>Pre-populate common questions and answers in the Q&A section of the maps listing.</li>
                <li>Monitor monthly search performance metrics (impressions, calls, directions) and share with the client.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Call To Action */}
        <section className="rounded-3xl bg-gradient-to-r from-cyan-900/40 to-indigo-900/40 border border-cyan-500/20 p-8 md:p-12 text-center space-y-6">
          <h2 className="font-display text-2xl md:text-3xl font-extrabold text-white">
            Ready to find GMB leads?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            Start scanning cities for restaurants, agencies, medical practices, or contractors, and look for profile opportunities.
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="/register"
              className="rounded-xl bg-primary px-6 py-3 text-xs font-bold text-white hover:brightness-110 transition cursor-pointer"
            >
              Get Started Free
            </a>
            <a
              href="/app/discover"
              className="rounded-xl border border-border bg-card px-6 py-3 text-xs font-bold text-slate-300 hover:text-white transition cursor-pointer"
            >
              Go to Lead Discover &rarr;
            </a>
          </div>
        </section>
      </div>
    </MarketingShell>
  );
}
