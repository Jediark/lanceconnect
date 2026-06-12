import { createFileRoute, Link } from "@tanstack/react-router";
import { useAuth } from "@/contexts/AuthContext";
import { PlanUsageBar } from "@/components/ui/PlanUsageBar";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";
import { z } from "zod";

const subscriptionSearchSchema = z.object({
  success: z.string().optional(),
});

export const Route = createFileRoute("/app/settings/subscription")({
  validateSearch: subscriptionSearchSchema,
  component: SubscriptionPage,
});

function SubscriptionPage() {
  const { user } = useAuth();
  const { success } = Route.useSearch();
  if (!user) return null;
  return (
    <div className="max-w-2xl space-y-4">
      {success && (
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4 text-sm text-foreground flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
            <span>Payment successful! Your plan has been upgraded. Thank you for supporting LanceConnect. 🎉</span>
          </div>
          <Link
            to="/app/dashboard"
            className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 text-xs font-semibold transition shrink-0 self-start sm:self-auto shadow-sm shadow-emerald-600/10 active:scale-[0.98]"
          >
            &larr; Back to Dashboard
          </Link>
        </div>
      )}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
        <div className="flex items-baseline justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Current plan
            </p>
            <p className="mt-1 font-display text-2xl font-bold capitalize">{user.plan} Plan</p>
          </div>
          <p className="text-xs text-muted-foreground">Renews May 28, 2026</p>
        </div>
        <div className="mt-5">
          <PlanUsageBar used={user.leadsUsedThisMonth} limit={user.leadsLimit} plan={user.plan} />
        </div>
        <div className="mt-5 flex gap-2">
          <Link
            to="/app/upgrade"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            Upgrade plan
          </Link>
          <button
            onClick={() => toast.success("Invoice emailed")}
            className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-accent"
          >
            Download invoices
          </button>
        </div>
      </div>
      <div className="rounded-2xl border border-border bg-card p-6">
        <h3 className="font-display font-semibold">Billing history</h3>
        <table className="mt-4 w-full text-sm">
          <thead className="text-left text-xs text-muted-foreground">
            <tr>
              <th className="pb-2">Date</th>
              <th className="pb-2">Plan</th>
              <th className="pb-2">Amount</th>
              <th className="pb-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["May 1, 2026", "Free", "$0", "Active"],
              ["Apr 1, 2026", "Free", "$0", "Active"],
            ].map((r) => (
              <tr key={r[0]} className="border-t border-border">
                <td className="py-2 font-mono-data text-xs">{r[0]}</td>
                <td className="py-2">{r[1]}</td>
                <td className="py-2 font-mono-data">{r[2]}</td>
                <td className="py-2 text-success">{r[3]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        onClick={() => toast.error("Are you sure? Email us — we'd love to know why.")}
        className="text-xs text-muted-foreground hover:text-destructive"
      >
        Cancel subscription
      </button>
    </div>
  );
}
