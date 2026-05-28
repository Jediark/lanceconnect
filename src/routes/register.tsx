import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { AuthSplit } from "./login";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Create account — FreelanceConnect" }] }),
  component: RegisterPage,
});

function strength(pwd: string) {
  let s = 0;
  if (pwd.length >= 8) s++;
  if (/[A-Z]/.test(pwd)) s++;
  if (/\d/.test(pwd)) s++;
  if (/[^\w\s]/.test(pwd)) s++;
  return s;
}

function GoogleSignup() {
  const { login } = useAuth();
  const nav = useNavigate();
  return (
    <button onClick={() => { login(); nav({ to: "/onboarding" }); }} type="button" className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium hover:bg-accent">
      <svg width="16" height="16" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303C33.972 32.91 29.418 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/><path fill="#FF3D00" d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/><path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.397 0-9.972-3.066-11.297-7.943l-6.522 5.025C9.527 39.556 16.227 44 24 44z"/><path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/></svg>
      Continue with Google
    </button>
  );
}

function RegisterPage() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [show, setShow] = useState(false);
  const [pwd, setPwd] = useState("");
  const s = strength(pwd);
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][s];
  const strengthColor = ["bg-border", "bg-red-500", "bg-amber-500", "bg-indigo-500", "bg-emerald-500"][s];

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    login();
    nav({ to: "/onboarding" });
  };

  return (
    <AuthSplit title="Create your free account">
      <p className="mt-1 text-sm text-muted-foreground">Start with 10 free leads — no card required.</p>
      <GoogleSignup />
      <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" /> or continue with email <span className="h-px flex-1 bg-border" />
      </div>
      <form onSubmit={submit} className="space-y-3">
        <input required placeholder="Full Name" className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30" />
        <input type="email" required placeholder="Email Address" className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30" />
        <div className="relative">
          <input value={pwd} onChange={(e) => setPwd(e.target.value)} type={show ? "text" : "password"} required placeholder="Password" className="w-full rounded-lg border border-input bg-background px-3 py-2.5 pr-10 text-sm outline-none focus:ring-2 focus:ring-primary/30" />
          <button type="button" onClick={() => setShow((v) => !v)} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground">
            {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {pwd && (
          <div className="flex items-center gap-2">
            <div className="h-1 flex-1 overflow-hidden rounded-full bg-border">
              <div className={`h-full transition-all ${strengthColor}`} style={{ width: `${(s / 4) * 100}%` }} />
            </div>
            <span className="text-[11px] text-muted-foreground">{strengthLabel}</span>
          </div>
        )}
        <button type="submit" className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
          Create Account
        </button>
      </form>
      <p className="mt-4 text-center text-[11px] text-muted-foreground">
        By signing up, you agree to our Terms and Privacy Policy.
      </p>
      <p className="mt-3 text-center text-xs text-muted-foreground">
        Already have an account? <Link to="/login" className="font-medium text-primary hover:underline">Log in</Link>
      </p>
    </AuthSplit>
  );
}
