import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Logo } from "@/components/Logo";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Login — LanceConnect" }] }),
  component: LoginPage,
});

export function AuthSplit({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-sidebar p-12 text-sidebar-active lg:flex lg:flex-col lg:justify-between">
        <img src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1200&q=80" alt="" className="absolute inset-0 h-full w-full object-cover opacity-25" />
        <div className="absolute inset-0 bg-sidebar/70" />
        <Link to="/" className="relative flex items-center gap-2">
          <Logo size={36} />
          <span className="font-display text-lg font-bold">LanceConnect</span>
        </Link>
        <div className="relative">
          <h2 className="font-display text-3xl font-bold leading-tight">Join 10,000+ freelancers finding clients daily.</h2>
          <ul className="mt-6 space-y-3 text-sm text-sidebar-foreground">
            <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> 10 free leads, no credit card</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> Works for any freelance skill</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> Businesses in 150+ countries</li>
          </ul>
        </div>
        <p className="relative text-xs text-sidebar-foreground/70">"Found 3 clients in my first week." — Taiwo A., Web Dev</p>
      </div>
      <div className="flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-sm">
          <h1 className="font-display text-2xl font-bold">{title}</h1>
          {children}
        </div>
      </div>
    </div>
  );
}

function GoogleButton({ label }: { label: string }) {
  const { login } = useAuth();
  const nav = useNavigate();
  return (
    <button
      type="button"
      onClick={() => { login(); nav({ to: "/app/dashboard" }); }}
      className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium hover:bg-accent"
    >
      <svg width="16" height="16" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303C33.972 32.91 29.418 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/><path fill="#FF3D00" d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/><path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.397 0-9.972-3.066-11.297-7.943l-6.522 5.025C9.527 39.556 16.227 44 24 44z"/><path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/></svg>
      {label}
    </button>
  );
}

import { toast } from "sonner";

function LoginPage() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("alex@example.com");
  const [password, setPassword] = useState("demo1234");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await login(email, password);
    setLoading(false);
    if (error) {
      toast.error(error.message || "Failed to log in.");
    } else {
      toast.success("Welcome back!");
      nav({ to: "/app/dashboard" });
    }
  };

  const handleDemo = async () => {
    setLoading(true);
    await login();
    setLoading(false);
    toast.success("Logged in as Demo User!");
    nav({ to: "/app/dashboard" });
  };

  return (
    <AuthSplit title="Welcome back">
      <p className="mt-1 text-sm text-muted-foreground">Log in to find your next client.</p>
      <GoogleButton label="Continue with Google" />
      <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        or continue with email
        <span className="h-px flex-1 bg-border" />
      </div>
      <form onSubmit={submit} className="space-y-3">
        <input 
          type="email" 
          required 
          placeholder="Email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30" 
        />
        <div className="relative">
          <input 
            type={show ? "text" : "password"} 
            required 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-input bg-background px-3 py-2.5 pr-10 text-sm outline-none focus:ring-2 focus:ring-primary/30" 
          />
          <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground">
            {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        <div className="flex justify-end">
          <Link to="/forgot-password" className="text-xs text-primary hover:underline">Forgot password?</Link>
        </div>
        <button 
          type="submit" 
          disabled={loading}
          className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Log In"}
        </button>
        <button 
          type="button" 
          disabled={loading}
          onClick={handleDemo}
          className="w-full rounded-lg border border-dashed border-primary/40 py-2 text-xs font-medium text-primary hover:bg-primary/5 disabled:opacity-50"
        >
          Continue as Demo User →
        </button>
      </form>
      <p className="mt-5 text-center text-xs text-muted-foreground">
        Don't have an account? <Link to="/register" className="font-medium text-primary hover:underline">Sign up free</Link>
      </p>
    </AuthSplit>
  );
}
