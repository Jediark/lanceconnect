import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthSplit } from "@/routes/login";
import { MailCheck } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/verify-email")({
  head: () => ({ meta: [{ title: "Verify your email — LanceConnect" }] }),
  component: VerifyPage,
});

function VerifyPage() {
  return (
    <AuthSplit title="Check your inbox">
      <div className="mt-3 flex items-center gap-3 rounded-xl border border-border bg-paper p-4">
        <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary"><MailCheck className="h-5 w-5"/></div>
        <p className="text-sm text-muted-foreground">We sent a confirmation link to your email address.</p>
      </div>
      <ol className="mt-5 space-y-2 text-sm text-foreground/80">
        <li><span className="text-primary">1.</span> Open the email from <b>hello@LanceConnect.app</b></li>
        <li><span className="text-primary">2.</span> Click the "Confirm my email" button</li>
        <li><span className="text-primary">3.</span> You'll land on your dashboard</li>
      </ol>
      <button onClick={()=>toast.success("Verification email resent")} className="mt-6 w-full rounded-lg border border-border bg-card py-2.5 text-sm font-medium hover:bg-accent">Resend email</button>
      <p className="mt-5 text-center text-xs text-muted-foreground">Wrong address? <Link to="/register" className="text-primary hover:underline">Sign up again</Link></p>
    </AuthSplit>
  );
}
