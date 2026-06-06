import { createFileRoute } from "@tanstack/react-router";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import {
  FileText,
  Sparkles,
  Download,
  Database,
  Mail,
  Check,
  ExternalLink,
  ChevronRight,
  ArrowRight,
} from "lucide-react";

export const Route = createFileRoute("/resources/export-guide")({
  head: () => ({
    meta: [
      { title: "Lead Export & CRM Integration Guide — LanceConnect" },
      {
        name: "description",
        content: "Learn how to export business leads into CSV and sync with CRM pipelines for automated outreach campaigns.",
      },
      {
        name: "keywords",
        content: "export leads to CSV, CRM integration, Hubspot sync, Salesforce sync, lead generation, instantly, lemlist",
      },
    ],
  }),
  component: ExportGuidePage,
});

function ExportGuidePage() {
  const csvColumns = [
    { name: "Business Name", type: "Text", description: "The official name of the business entity." },
    { name: "Type", type: "Text", description: "Business category (e.g. Italian Restaurant, Dental Clinic)." },
    { name: "City", type: "Text", description: "Target city of the business." },
    { name: "Country", type: "Text", description: "Target country." },
    { name: "Address", type: "Text", description: "Full street address of the location." },
    { name: "Phone", type: "Phone", description: "Business contact number, formatted globally." },
    { name: "Email", type: "Email", description: "Discovered public/verified email address, if available." },
    { name: "Website", type: "URL", description: "Official website link." },
    { name: "Opportunity Score", type: "Number", description: "The calculated digital opportunity score (0-100)." },
    { name: "Google Rating", type: "Number", description: "Google Maps average star rating (1.0 - 5.0)." },
    { name: "Reviews", type: "Number", description: "Total number of Google reviews." },
  ];

  return (
    <MarketingShell>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#020b21] py-24 text-center text-white border-b border-border select-none">
        <div className="absolute inset-0 bg-dot-pattern opacity-25 pointer-events-none" />
        <div className="relative z-10 mx-auto max-w-4xl px-4">
          <p className="text-xs font-mono text-cyan-400 mb-3 uppercase tracking-widest flex items-center justify-center gap-1.5">
            <Sparkles className="h-4.5 w-4.5 text-cyan-400 fill-current animate-pulse" /> // data.pipeline.sync
          </p>
          <h1 className="font-display text-4xl font-extrabold sm:text-5xl md:text-6xl tracking-tight leading-tight">
            Lead Export & CRM
            <span className="block text-cyan-400 drop-shadow-[0_0_12px_rgba(34,211,238,0.4)]">
              Integration Guide
            </span>
          </h1>
          <p className="mt-5 text-sm sm:text-base text-slate-350 max-w-2xl mx-auto leading-relaxed">
            Take your lead generation to the next level. Learn how to export verified lists of local prospects and sync them into your sales CRM or email outreach software.
          </p>
        </div>
      </section>

      {/* Guide Content */}
      <div className="mx-auto max-w-6xl px-4 py-16 space-y-16">
        {/* Core Steps Overview */}
        <section className="grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-border bg-card p-6 space-y-4">
            <div className="h-10 w-10 rounded-xl bg-cyan-400/10 text-cyan-400 flex items-center justify-center border border-cyan-400/20">
              <Download className="h-5 w-5" />
            </div>
            <h3 className="font-display text-sm font-bold text-white">1. Export CSV</h3>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Run scans on the Lead Discover page, apply website and opportunity score filters, and export high-intent leads to CSV with one click.
            </p>
          </div>
          <div className="rounded-3xl border border-border bg-card p-6 space-y-4">
            <div className="h-10 w-10 rounded-xl bg-purple-400/10 text-purple-400 flex items-center justify-center border border-purple-400/20">
              <Database className="h-5 w-5" />
            </div>
            <h3 className="font-display text-sm font-bold text-white">2. Sync with CRM</h3>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Import contacts directly into CRM pipelines (HubSpot, Salesforce, Zoho) to track conversations, stages, deals, and notes.
            </p>
          </div>
          <div className="rounded-3xl border border-border bg-card p-6 space-y-4">
            <div className="h-10 w-10 rounded-xl bg-emerald-400/10 text-emerald-400 flex items-center justify-center border border-emerald-400/20">
              <Mail className="h-5 w-5" />
            </div>
            <h3 className="font-display text-sm font-bold text-white">3. Automate Outreach</h3>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Upload leads to automated cold email platforms (Instantly, Lemlist) using merge tags to deliver highly-personalized outreach.
            </p>
          </div>
        </section>

        {/* Export Details */}
        <section className="space-y-6">
          <h2 className="font-display text-xl font-bold text-white flex items-center gap-2">
            <span className="h-6 w-6 rounded-full bg-cyan-400/10 text-cyan-400 flex items-center justify-center text-xs font-bold font-mono">1</span>
            Exporting Leads from LanceConnect
          </h2>
          <div className="grid gap-8 md:grid-cols-2 items-center">
            <div className="space-y-4 text-xs sm:text-sm text-slate-350 leading-relaxed">
              <p>
                To export leads, navigate to the <a href="/app/discover" className="text-cyan-400 hover:underline">Lead Discover</a> page. Type in a niche (e.g. "Italian Restaurant") and a target city (e.g. "Chicago").
              </p>
              <p>
                Apply filters to match your agency service:
              </p>
              <ul className="space-y-2 text-xs pl-4">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-cyan-400" />
                  <span><strong>No Website Only:</strong> If you sell landing pages or web development.</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-cyan-400" />
                  <span><strong>Opportunity Score 70+:</strong> Only focus on high-win prospects.</span>
                </li>
              </ul>
              <p>
                Once results are loaded, click the <strong>Export CSV</strong> button at the top-right of the results card.
              </p>
            </div>
            <div className="rounded-3xl border border-border bg-[#0a1128]/40 p-6 space-y-4">
              <h3 className="font-display text-xs font-bold uppercase tracking-wider text-slate-400">CSV Column Structure</h3>
              <div className="max-h-64 overflow-y-auto space-y-2 pr-2">
                {csvColumns.map((col, idx) => (
                  <div key={idx} className="flex justify-between border-b border-border/60 pb-1.5 text-xs">
                    <div>
                      <span className="font-bold text-white font-mono">{col.name}</span>
                      <p className="text-[10px] text-slate-400 mt-0.5">{col.description}</p>
                    </div>
                    <span className="font-mono text-[10px] text-cyan-400 self-start">{col.type}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CRM Integration Guides */}
        <section className="space-y-6">
          <h2 className="font-display text-xl font-bold text-white flex items-center gap-2">
            <span className="h-6 w-6 rounded-full bg-cyan-400/10 text-cyan-400 flex items-center justify-center text-xs font-bold font-mono">2</span>
            CRM Integration Walkthrough
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-border bg-card p-6 space-y-4">
              <div className="flex items-center gap-2 text-orange-400 font-bold text-sm">
                <span className="rounded bg-orange-400/10 px-2 py-0.5 text-[10px] font-mono uppercase">HubSpot</span>
                <h3>HubSpot Import Steps</h3>
              </div>
              <ul className="space-y-3.5 text-xs text-slate-350 list-decimal pl-6">
                <li>Log in to HubSpot and navigate to <strong>Contacts</strong> &rarr; <strong>Import</strong>.</li>
                <li>Upload the CSV file exported from LanceConnect.</li>
                <li>Choose <strong>One file</strong> &rarr; <strong>Multiple objects</strong> (select Contacts & Companies).</li>
                <li>Map the CSV column headers:
                  <ul className="mt-1.5 space-y-1 text-[10px] text-slate-400 list-disc pl-4 font-mono">
                    <li>Business Name &rarr; Company Name</li>
                    <li>Phone &rarr; Mobile Phone Number</li>
                    <li>Email &rarr; Email Address</li>
                    <li>Website &rarr; Company Domain Name</li>
                  </ul>
                </li>
                <li>Click <strong>Finish Import</strong>. HubSpot will auto-create Company and Contact linkages.</li>
              </ul>
            </div>
            <div className="rounded-3xl border border-border bg-card p-6 space-y-4">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                <span className="rounded bg-cyan-400/10 px-2 py-0.5 text-[10px] font-mono uppercase">Salesforce</span>
                <h3>Salesforce Import Steps</h3>
              </div>
              <ul className="space-y-3.5 text-xs text-slate-350 list-decimal pl-6">
                <li>Navigate to the <strong>Setup</strong> panel in Salesforce and open the <strong>Data Import Wizard</strong>.</li>
                <li>Select <strong>Leads</strong> under the standard objects list.</li>
                <li>Choose <strong>Add new records</strong>.</li>
                <li>Drag and drop your LanceConnect CSV file.</li>
                <li>Map the fields:
                  <ul className="mt-1.5 space-y-1 text-[10px] text-slate-400 list-disc pl-4 font-mono">
                    <li>Business Name &rarr; Company</li>
                    <li>Phone &rarr; Phone</li>
                    <li>Email &rarr; Email</li>
                    <li>Website &rarr; Website</li>
                  </ul>
                </li>
                <li>Click <strong>Start Import</strong>. Leads will load into your pipeline queue.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Cold Email Automation Setup */}
        <section className="space-y-6">
          <h2 className="font-display text-xl font-bold text-white flex items-center gap-2">
            <span className="h-6 w-6 rounded-full bg-cyan-400/10 text-cyan-400 flex items-center justify-center text-xs font-bold font-mono">3</span>
            Setting up Automated Cold Email Outreach
          </h2>
          <div className="rounded-3xl border border-border bg-card p-8 md:p-12 space-y-6">
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Sending 1-on-1 manual emails is highly effective but time-consuming. To scale your freelance client acquisition, use automated outbound senders like <strong>Instantly.ai</strong>, <strong>Lemlist</strong>, or <strong>Woodpecker</strong>.
            </p>
            <div className="grid gap-6 md:grid-cols-3 pt-4 border-t border-border">
              <div className="space-y-2">
                <h4 className="font-bold text-white text-xs">Step A: Setup Senders</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Purchase auxiliary domains (e.g. yournameagency.com) and set up SPF, DKIM, and DMARC verification records to ensure your emails land in the primary inbox.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-bold text-white text-xs">Step B: Upload Leads</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Upload your CSV lead list directly. Instantly and Lemlist will automatically recognize fields like Business Name, Phone, and Email as merge tags.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-bold text-white text-xs">Step C: Write Campaigns</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Draft email steps using dynamic variables:
                  <code className="block mt-1 bg-black/30 border border-border px-2 py-1 rounded text-[10px] text-amber-500 font-mono">
                    "Hey, I noticed your profile for {"{{company_name}}"} in {"{{city}}"} has no photos..."
                  </code>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA section */}
        <section className="rounded-3xl bg-gradient-to-r from-cyan-900/40 to-indigo-900/40 border border-cyan-500/20 p-8 md:p-12 text-center space-y-6">
          <h2 className="font-display text-2xl md:text-3xl font-extrabold text-white">
            Ready to export client lists?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            Go to the Lead Discover page, run a localized search query, filter the data, and export your list to CSV.
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="/app/discover"
              className="rounded-xl bg-primary px-6 py-3 text-xs font-bold text-white hover:brightness-110 transition cursor-pointer"
            >
              Go to Lead Discover
            </a>
            <a
              href="/resources/outreach-templates"
              className="rounded-xl border border-border bg-card px-6 py-3 text-xs font-bold text-slate-300 hover:text-white transition cursor-pointer"
            >
              Get Outreach Templates &rarr;
            </a>
          </div>
        </section>
      </div>
    </MarketingShell>
  );
}
