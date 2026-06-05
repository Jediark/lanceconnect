import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AuthSplit } from "@/routes/login";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({ meta: [{ title: "Forgot password — LanceConnect" }] }),
  component: ForgotPage,
});

const schema = z.string().trim().email("Please enter a valid email").max(255);

function ForgotPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const r = schema.safeParse(email);
    if (!r.success) {
      toast.error(r.error.issues[0].message);
      return;
    }
    setSent(true);
  };
  return (
    <AuthSplit title="Reset your password">
      {sent ? (
        <div className="mt-4">
          <p className="text-sm text-muted-foreground">
            If an account exists for <b>{email}</b>, we just sent a reset link. Check your inbox
            (and spam).
          </p>
          <Link
            to="/login"
            className="mt-6 inline-block text-sm font-semibold text-primary hover:underline"
          >
            ← Back to login
          </Link>
        </div>
      ) : (
        <>
          <p className="mt-1 text-sm text-muted-foreground">
            Enter your email and we'll send you a link to set a new password.
          </p>
          <form onSubmit={submit} className="mt-5 space-y-3">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30"
            />
            <button className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
              Send reset link
            </button>
          </form>
          <p className="mt-5 text-center text-xs text-muted-foreground">
            <Link to="/login" className="text-primary hover:underline">
              Back to login
            </Link>
          </p>
        </>
      )}
    </AuthSplit>
  );
}
