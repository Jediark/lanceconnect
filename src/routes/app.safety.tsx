import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/layout/Header";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import {
  ShieldAlert,
  UserCheck,
  Building,
  Truck,
  MessageSquareWarning,
  AlertTriangle,
  Send,
  Loader2,
  CheckCircle,
  XCircle,
} from "lucide-react";

export const Route = createFileRoute("/app/safety")({
  head: () => ({
    meta: [
      { title: "Safety Guidelines & Verification — LanceConnect" },
    ],
  }),
  component: AppSafetyPage,
});

function AppSafetyPage() {
  const { user } = useAuth();
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
      setDescription("");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to submit report. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Header 
        title="Safety Guidelines & Trust Center" 
        subtitle="Best practices for secure, professional off-platform transactions and safety reporting."
      />
      
      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8 space-y-8">
        
        {/* Guidelines Grid */}
        <div className="grid gap-6 md:grid-cols-3">
          
          {/* Section 1 — For Freelancers */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm hover:border-primary/25 transition duration-300">
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
                "Use trusted payment platforms (PayPal, Wise, Paystack, bank transfer)",
                "Keep all communication documented",
              ].map((text, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-350">
                  <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{text}</span>
                </div>
              ))}

              {[
                "Never work for free as a trial",
                "Never send money to a client for any reason",
                "Never share complete work before receiving payment",
                "Never share personal banking details upfront",
              ].map((text, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-350">
                  <XCircle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2 — For Clients */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm hover:border-primary/25 transition duration-300">
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
                <div key={i} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-350">
                  <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{text}</span>
                </div>
              ))}

              {[
                "Never pay 100% upfront to an unknown freelancer",
                "Never share confidential data before signing an NDA",
              ].map((text, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-350">
                  <XCircle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3 — For B2B Suppliers */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm hover:border-primary/25 transition duration-300">
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
                <div key={i} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-350">
                  <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{text}</span>
                </div>
              ))}

              {[
                "Never ship goods without confirmed payment",
                "Never share exclusive agreements without legal review",
              ].map((text, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-350">
                  <XCircle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Report Suspicious Activity Card */}
        <div className="grid gap-6 md:grid-cols-3">
          
          <div className="md:col-span-2 rounded-2xl border border-border bg-card p-6 md:p-8 relative overflow-hidden shadow-sm flex flex-col justify-between">
            <div className="absolute inset-0 bg-rose-500/[0.02] pointer-events-none" />
            <div>
              <h3 className="font-display text-lg font-bold text-foreground flex items-center gap-2 mb-3">
                <AlertTriangle className="h-5.5 w-5.5 text-rose-500 animate-pulse" /> Community Trust & Safety
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl">
                LanceConnect works to maintain a secure environment. However, since transactions and final hires take place off-platform directly, you must exercise prudence.
              </p>
              <div className="mt-5 space-y-3 text-xs text-slate-500">
                <div className="flex gap-2">
                  <span className="text-amber-500">💡</span>
                  <span><strong>Communication Tip:</strong> Always keep written records of chats, agreements, and receipts. If disputes occur off-platform, screenshots and written logs are your best protection.</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-amber-500">💡</span>
                  <span><strong>Verification:</strong> Look for the "Verified" badge on businesses. If you identify a fake profile, spoofed business details, or fraudulent recruiter activity, report it immediately using the form.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Embedded Report Form */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2 mb-4">
              <MessageSquareWarning className="h-5 w-5 text-rose-500" /> Submit Safety Report
            </h3>
            
            <form onSubmit={handleReportSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
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
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Description & Details
                </label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Please provide details such as business name, phone, URLs, or other information..."
                  className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs py-2.5 h-[38px] transition duration-200 uppercase tracking-wider disabled:opacity-50 cursor-pointer shadow-sm"
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
          </div>

        </div>

      </div>
    </>
  );
}
