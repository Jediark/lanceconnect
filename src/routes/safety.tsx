import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import {
  ShieldAlert,
  UserCheck,
  Building,
  Truck,
  MessageSquareWarning,
  X,
  AlertTriangle,
  Send,
  Loader2,
  CheckCircle,
  XCircle,
  ArrowRight,
} from "lucide-react";

export const Route = createFileRoute("/safety")({
  head: () => ({
    meta: [
      { title: "Safety Guidelines & Verification — LanceConnect" },
      {
        name: "description",
        content: "LanceConnect is built on trust and safety. Read our guidelines for freelancers, clients, and suppliers, and report suspicious activities.",
      },
    ],
  }),
  component: SafetyPage,
});

function SafetyPage() {
  const { user } = useAuth();
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reason, setReason] = useState("fake_profile");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please log in to submit a formal report.");
      return;
    }
    if (!description.trim()) {
      toast.error("Please provide a description of the issue.");
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.from("reports").insert({
        reporter_id: user.id,
        reason,
        description,
        status: "pending",
      });

      if (error) throw error;

      toast.success("Thank you. Your report has been submitted successfully. We will investigate within 24 hours.");
      setReportModalOpen(false);
      setDescription("");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to submit report. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <MarketingShell>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#020b21] py-20 text-center text-white border-b border-border select-none">
        <div className="absolute inset-0 bg-dot-pattern opacity-30 pointer-events-none" />
        <div className="relative z-10 mx-auto max-w-3xl px-4">
          <p className="text-xs font-mono text-cyan-400 mb-3 uppercase tracking-widest flex items-center justify-center gap-1.5">
            <ShieldAlert className="h-4.5 w-4.5 text-cyan-400 fill-current animate-pulse" /> // trust.and.safety
          </p>
          <h1 className="font-display text-4xl font-extrabold sm:text-5xl md:text-6xl tracking-tight leading-tight">
            Your Safety is Our
            <span className="block text-cyan-400 drop-shadow-[0_0_12px_rgba(34,211,238,0.4)]">
              Highest Priority
            </span>
          </h1>
          <p className="mt-4 text-sm sm:text-base text-slate-350 max-w-xl mx-auto leading-relaxed">
            LanceConnect connects people. We want every connection to be safe, professional, and mutually beneficial.
          </p>
        </div>
      </section>

      {/* Safety Guidelines Grid */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Section 1 — For Freelancers */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-md hover:border-primary/20 transition duration-300">
            <div className="flex items-center gap-2.5 mb-5 text-primary">
              <UserCheck className="h-5.5 w-5.5 text-cyan-400" />
              <h3 className="font-display text-base font-bold text-foreground">For Freelancers</h3>
            </div>
            <div className="space-y-3">
              {[
                "Always use a written contract before starting work",
                "Request a 30-50% deposit before beginning any project",
                "Use milestone payments for large or long-term projects",
                "Verify client identity before sharing sensitive work",
                "Use trusted payment platforms: PayPal, Paystack, Wise, Flutterwave or bank transfer",
                "Keep all communication documented",
              ].map((text, i) => (
                <div key={i} className="flex items-start gap-2 text-[11px] text-slate-700 dark:text-slate-300">
                  <CheckCircle className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{text}</span>
                </div>
              ))}

              {[
                "Never work for free as a trial",
                "Never send money to a client for any reason",
                "Never share complete work before receiving payment",
                "Never share personal banking details upfront",
              ].map((text, i) => (
                <div key={i} className="flex items-start gap-2 text-[11px] text-slate-700 dark:text-slate-300">
                  <XCircle className="h-3.5 w-3.5 text-rose-500 shrink-0 mt-0.5" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2 — For Clients */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-md hover:border-primary/20 transition duration-300">
            <div className="flex items-center gap-2.5 mb-5 text-primary">
              <Building className="h-5.5 w-5.5 text-indigo-400" />
              <h3 className="font-display text-base font-bold text-foreground">For Clients</h3>
            </div>
            <div className="space-y-3">
              {[
                "Review freelancer portfolio before hiring",
                "Start with a small test project for new freelancers",
                "Agree on deliverables in writing before paying",
                "Use milestone payments for large projects",
              ].map((text, i) => (
                <div key={i} className="flex items-start gap-2 text-[11px] text-slate-700 dark:text-slate-300">
                  <CheckCircle className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{text}</span>
                </div>
              ))}

              {[
                "Never pay 100% upfront to an unknown freelancer",
                "Never share confidential data before signing an NDA",
              ].map((text, i) => (
                <div key={i} className="flex items-start gap-2 text-[11px] text-slate-700 dark:text-slate-300">
                  <XCircle className="h-3.5 w-3.5 text-rose-500 shrink-0 mt-0.5" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3 — For B2B Suppliers */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-md hover:border-primary/20 transition duration-300">
            <div className="flex items-center gap-2.5 mb-5 text-primary">
              <Truck className="h-5.5 w-5.5 text-emerald-400" />
              <h3 className="font-display text-base font-bold text-foreground">For B2B Suppliers</h3>
            </div>
            <div className="space-y-3">
              {[
                "Verify buyer company registration before shipping",
                "Use Letter of Credit for large international orders",
                "Request 50% deposit before production or shipment",
                "Use trade insurance for high-value shipments",
                "Confirm delivery address independently",
              ].map((text, i) => (
                <div key={i} className="flex items-start gap-2 text-[11px] text-slate-700 dark:text-slate-300">
                  <CheckCircle className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{text}</span>
                </div>
              ))}

              {[
                "Never ship goods without confirmed payment",
                "Never share exclusive agreements without legal review",
              ].map((text, i) => (
                <div key={i} className="flex items-start gap-2 text-[11px] text-slate-700 dark:text-slate-300">
                  <XCircle className="h-3.5 w-3.5 text-rose-500 shrink-0 mt-0.5" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Report Suspicious Activity CTA */}
      <section className="mx-auto max-w-4xl px-4 pb-20">
        <div className="rounded-3xl border border-border bg-card p-8 md:p-12 text-center relative overflow-hidden shadow-xl">
          <div className="absolute inset-0 bg-rose-500/5 pointer-events-none" />
          <h3 className="font-display text-xl font-bold text-foreground flex items-center justify-center gap-2">
            <AlertTriangle className="h-5 w-5 text-rose-500 animate-pulse" /> Report Suspicious Activity
          </h3>
          <p className="mt-3 text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto">
            If you encounter a suspicious profile, fake business, or scam attempt — report it immediately. We investigate all reports within 24 hours.
          </p>
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => setReportModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white px-6 py-2.5 text-xs font-semibold uppercase tracking-wider transition cursor-pointer shadow-[0_0_15px_rgba(239,68,68,0.2)]"
            >
              Report Now <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Report Modal */}
      {reportModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-in fade-in select-none"
          onClick={() => setReportModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md overflow-hidden rounded-2xl bg-card border border-border animate-in zoom-in-95 font-sans"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border p-5">
              <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2">
                <MessageSquareWarning className="h-5 w-5 text-rose-500" /> Submit Safety Report
              </h3>
              <button
                onClick={() => setReportModalOpen(false)}
                className="rounded-lg p-1 text-slate-500 hover:text-white hover:bg-accent cursor-pointer"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Body */}
            {user ? (
              <form onSubmit={handleReportSubmit} className="p-5 space-y-4">
                <div>
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Reason for Report
                  </label>
                  <select
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none cursor-pointer h-[38px]"
                  >
                    <option value="fake_profile">Fake Profile</option>
                    <option value="scam">Scam Attempt</option>
                    <option value="harassment">Harassment</option>
                    <option value="fake_business">Fake Business Listing</option>
                    <option value="spam">Spamming / Solicitation</option>
                    <option value="impersonation">Impersonation</option>
                    <option value="other">Other Violation</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Description & Details
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Please provide details, usernames, URLs, or other information that will help us investigate this issue..."
                    className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs py-2.5 h-[38px] transition duration-200 uppercase tracking-wider disabled:opacity-50 cursor-pointer shadow-md"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" /> Submit Report
                    </>
                  )}
                </button>
              </form>
            ) : (
              <div className="p-6 text-center space-y-4">
                <p className="text-xs text-amber-500 border border-amber-500/20 bg-amber-500/5 rounded-xl p-4">
                  🔒 You must be logged in to submit a safety report. This helps us verify reporter identity and prevent spam reports.
                </p>
                <div className="flex gap-3 justify-center">
                  <Link
                    to="/login"
                    onClick={() => setReportModalOpen(false)}
                    className="rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white hover:brightness-110 cursor-pointer"
                  >
                    Log In
                  </Link>
                  <a
                    href="mailto:safety@lanceconnect.app?subject=Safety Violation Report"
                    className="rounded-xl border border-border px-4 py-2 text-xs font-semibold text-foreground hover:bg-accent flex items-center justify-center"
                  >
                    Email Safety Team
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </MarketingShell>
  );
}
