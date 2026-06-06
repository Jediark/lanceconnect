import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketingShell, PageHeader } from "@/components/marketing/MarketingShell";
import { IMG } from "@/data/content";
import { Check, Heart, HeartHandshake, Shield, Sparkles, HelpCircle } from "lucide-react";
import { usePreferences } from "@/contexts/PreferencesContext";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — LanceConnect is 100% Free" },
      {
        name: "description",
        content:
          "LanceConnect is completely free, with no hidden paywalls or tricks. We run entirely on voluntary donations from freelancers who win projects.",
      },
      { property: "og:title", content: "LanceConnect Pricing — 100% Free" },
      { name: "keywords", content: "lanceconnect free, free lead finder, free CRM for freelancers, B2B lead generation free, voluntary support lanceconnect" },
      {
        property: "og:description",
        content: "LanceConnect is 100% free. No credit card required. All features unlocked.",
      },
    ],
  }),
  component: PricingPage,
});

const features = [
  "Unlimited Lead Discovery & Opportunity Scoring",
  "Full B2B Lead CRM Pipeline & Funnel Management",
  "Unlimited Personalized Email Templates",
  "AI outreach writer (personalized pitches in 8+ languages)",
  "Full CSV Spreadsheet Export",
  "Priority community support & regular lead updates",
];

const faqs = [
  {
    q: "Is LanceConnect really free?",
    a: "Yes. Every single feature—including AI pitch generation, CSV exports, and pipeline management—is completely free for everyone. There are no limits, no credit cards required, and no hidden paywalls.",
  },
  {
    q: "Why did you make it free?",
    a: "We believe freelancers shouldn't have to pay to find work, especially when starting out. We built this to help you win projects. Once you succeed and make money, you can choose to donate to help us keep the servers running.",
  },
  {
    q: "How do donations work?",
    a: "Donations are 100% voluntary. There are no premium features locked behind donation tiers. Donors receive a '❤️ Supporter' badge on their public profile, but the service is identical for everyone.",
  },
  {
    q: "Where do my donations go?",
    a: "Donations directly pay for server hosting, API credits (Google Maps and AI extraction engines), and database upkeep. Any extra funds are reinvested into building new features.",
  },
  {
    q: "Where do the leads come from?",
    a: "We aggregate public business registries, Google Maps listings, and directories. Our AI cleanses, scores, and verifies emails/phones so you get valid contact lines.",
  },
];

function PricingPage() {
  const { t } = usePreferences();

  return (
    <MarketingShell>
      <PageHeader
        eyebrow="no paywalls. no tricks."
        title="LanceConnect is 100% Free."
        subtitle="We run entirely on goodwill. No subscription fees, no locked features, and no credit card required."
        image={IMG.coffeeShop}
      />

      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8 bg-background">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Main Card */}
          <div className="relative rounded-3xl border border-primary/30 bg-card p-8 md:p-12 shadow-[0_0_40px_rgba(6,182,212,0.1)] hover:shadow-[0_0_50px_rgba(6,182,212,0.15)] transition duration-300 overflow-hidden text-center">
            {/* Solid top border instead of gradient */}
            <div className="absolute top-0 inset-x-0 h-1.5 bg-primary" />
            
            <p className="text-xs font-mono text-cyan-400 uppercase tracking-widest">// fully.unlocked.account</p>
            <h2 className="mt-4 font-display text-3xl font-extrabold md:text-4xl text-slate-900 dark:text-white">
              All Features. Zero Cost.
            </h2>
            
            <div className="mt-6 flex justify-center items-baseline gap-1 text-slate-900 dark:text-white">
              <span className="font-display text-6xl font-extrabold">₦0</span>
              <span className="text-sm text-slate-500 dark:text-slate-400">/ forever</span>
            </div>

            <p className="mt-6 text-sm text-slate-700 dark:text-slate-300 max-w-xl mx-auto leading-relaxed">
              We built LanceConnect to help freelancers grow their businesses. No paywalls, no limits on leads, and no monthly fees. You get the complete AI lead generation suite for free.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/register"
                className="rounded-xl bg-primary px-8 py-3 text-sm font-bold text-white hover:bg-primary/90 transition shadow-lg hover:shadow-xl"
              >
                Create Free Account
              </Link>
              <Link
                to="/support-us"
                className="rounded-xl border border-rose-500/30 bg-rose-500/5 px-8 py-3 text-sm font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition flex items-center justify-center gap-1.5"
              >
                <Heart className="h-4 w-4 fill-current text-rose-500" /> Support Our Mission
              </Link>
            </div>

            {/* Included Features List */}
            <div className="mt-12 border-t border-border/60 pt-10 text-left max-w-2xl mx-auto">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-6 text-center">
                What's included in your free account:
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-slate-700 dark:text-slate-300">
                    <Check className="h-4 w-4 text-emerald-500 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-xs leading-normal">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Philosophy Section */}
          <div className="max-w-3xl mx-auto text-center bg-card/40 border border-border p-8 md:p-12 rounded-3xl backdrop-blur-sm">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 mb-4">
              <HeartHandshake className="h-6 w-6" />
            </div>
            <h3 className="font-display text-2xl font-bold text-slate-900 dark:text-white mb-4">
              Our Donation Philosophy
            </h3>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto mb-4">
              Rather than turning LanceConnect into a transaction with paywalled features, we operate on mutual goodwill.
            </p>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto mb-6">
              If the platform helps you win a project worth $500, $1,000, or $5,000, we invite you to pay forward a fraction of that to keep the service running for the next freelancer. If you cannot afford to donate, the platform remains 100% free for you.
            </p>
            <Link
              to="/support-us"
              className="inline-flex items-center gap-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 px-6 py-2.5 text-xs font-bold text-rose-600 dark:text-rose-400 transition"
            >
              ❤️ Support Our Mission <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* FAQs */}
          <div className="pt-8">
            <h3 className="font-display text-2xl font-bold mb-6 text-center text-slate-900 dark:text-white">Frequently Asked Questions</h3>
            <div className="space-y-4 max-w-3xl mx-auto">
              {faqs.map((f, i) => (
                <details key={i} className="group rounded-2xl border border-border bg-card p-4 transition-all duration-300">
                  <summary className="cursor-pointer list-none font-semibold flex items-center justify-between text-slate-800 dark:text-slate-200">
                    <span className="text-sm">{f.q}</span>
                    <span className="ml-2 text-primary group-open:rotate-45 transition">+</span>
                  </summary>
                  <p className="mt-3 text-xs text-muted-foreground leading-relaxed pl-1">
                    {f.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}

function ArrowRight(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}
