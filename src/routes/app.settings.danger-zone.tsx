import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Download, Trash2, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/app/settings/danger-zone")({
  component: DangerZone,
});

function DangerZone() {
  const { logout } = useAuth();
  const nav = useNavigate();
  return (
    <div className="max-w-2xl space-y-4">
      <div className="rounded-2xl border border-border bg-card p-6">
        <Download className="h-5 w-5 text-primary"/>
        <h3 className="mt-3 font-display text-lg font-semibold">Export your data</h3>
        <p className="mt-1 text-sm text-muted-foreground">Download every lead, note, and template as a single CSV. We email you a link within 5 minutes.</p>
        <button onClick={()=>toast.success("Export started — check your email")} className="mt-4 rounded-lg border border-border bg-background px-4 py-2 text-sm font-semibold hover:bg-accent">Request export</button>
      </div>
      <div className="rounded-2xl border border-destructive/40 bg-destructive/5 p-6">
        <div className="flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-destructive"/><h3 className="font-display text-lg font-semibold text-destructive">Delete account</h3></div>
        <p className="mt-2 text-sm text-destructive/80">This permanently removes your account, leads, pipeline, and templates. We can't undo this.</p>
        <button onClick={()=>{if(confirm("Permanently delete your account? This cannot be undone.")){logout();nav({to:"/"});toast.success("Account deleted");}}} className="mt-4 inline-flex items-center gap-2 rounded-lg bg-destructive px-4 py-2 text-sm font-semibold text-destructive-foreground hover:opacity-90"><Trash2 className="h-4 w-4"/> Delete account</button>
      </div>
    </div>
  );
}
