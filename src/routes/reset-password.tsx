import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AuthSplit } from "@/routes/login";
import { useState } from "react";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: [{ title: "Set new password — FreelanceConnect" }] }),
  component: ResetPage,
});

function ResetPage() {
  const nav = useNavigate();
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [show, setShow] = useState(false);
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pw.length < 8) { toast.error("Password must be at least 8 characters"); return; }
    if (pw !== pw2) { toast.error("Passwords don't match"); return; }
    toast.success("Password updated. Please log in.");
    nav({ to: "/login" });
  };
  return (
    <AuthSplit title="Set a new password">
      <p className="mt-1 text-sm text-muted-foreground">Choose a strong password — at least 8 characters.</p>
      <form onSubmit={submit} className="mt-5 space-y-3">
        <div className="relative">
          <input type={show?"text":"password"} required value={pw} onChange={e=>setPw(e.target.value)} placeholder="New password" className="w-full rounded-lg border border-input bg-background px-3 py-2.5 pr-10 text-sm outline-none focus:ring-2 focus:ring-primary/30"/>
          <button type="button" onClick={()=>setShow(s=>!s)} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground">{show?<EyeOff className="h-4 w-4"/>:<Eye className="h-4 w-4"/>}</button>
        </div>
        <input type={show?"text":"password"} required value={pw2} onChange={e=>setPw2(e.target.value)} placeholder="Confirm new password" className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30"/>
        <button className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90">Update password</button>
      </form>
      <p className="mt-5 text-center text-xs text-muted-foreground"><Link to="/login" className="text-primary hover:underline">Back to login</Link></p>
    </AuthSplit>
  );
}
