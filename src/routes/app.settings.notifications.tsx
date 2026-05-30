import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";

export const Route = createFileRoute("/app/settings/notifications")({
  component: NotificationsPage,
});

const opts = [
  { id: "leads", label: "New leads matching my filters", desc: "Daily email when fresh leads land" },
  { id: "weekly", label: "Weekly digest", desc: "Mondays: top 5 leads and pipeline summary" },
  { id: "followup", label: "Follow-up reminders", desc: "Nudges based on your pipeline due dates" },
  { id: "product", label: "Product updates", desc: "New features, every couple of weeks" },
  { id: "tips", label: "Outreach tips", desc: "Real scripts from working freelancers" },
];

function NotificationsPage() {
  return (
    <form onSubmit={e=>{e.preventDefault();toast.success("Notification preferences saved");}} className="max-w-2xl space-y-3 rounded-2xl border border-border bg-card p-6 shadow-card">
      {opts.map(o => (
        <label key={o.id} className="flex items-start justify-between gap-4 rounded-lg border border-border p-4 text-sm">
          <div>
            <p className="font-semibold">{o.label}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{o.desc}</p>
          </div>
          <input type="checkbox" defaultChecked={o.id !== "tips"} className="mt-1 h-4 w-4 accent-primary"/>
        </label>
      ))}
      <button className="mt-4 rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">Save preferences</button>
    </form>
  );
}
