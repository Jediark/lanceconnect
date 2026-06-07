import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AuthSplit } from "@/routes/login";
import { MailCheck, ArrowRight, Lock, Sparkles } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/lib/supabase";

const verifySearchSchema = z.object({
  email: z.string().optional(),
});

export const Route = createFileRoute("/verify-email")({
  validateSearch: verifySearchSchema,
  head: () => ({ meta: [{ title: "Verify your email — LanceConnect" }] }),
  component: VerifyPage,
});

function VerifyPage() {
  const { email } = Route.useSearch();
  const navigate = useNavigate();
  const [activeEmail, setActiveEmail] = useState(email || "");
  const [isEditingEmail, setIsEditingEmail] = useState(!email);
  const [code, setCode] = useState<string[]>(Array(6).fill(""));
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);

  // Sync state if search param changes
  useEffect(() => {
    if (email) {
      setActiveEmail(email);
      setIsEditingEmail(false);
    }
  }, [email]);

  const handleChange = (val: string, index: number) => {
    if (val && isNaN(Number(val))) return; // numbers only

    const newCode = [...code];
    newCode[index] = val.substring(val.length - 1);
    setCode(newCode);

    // Auto-focus next input
    if (val !== "" && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && code[index] === "" && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  // Paste handler for convenience
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    if (pastedData.length === 6 && !isNaN(Number(pastedData))) {
      setCode(pastedData.split(""));
      document.getElementById("otp-5")?.focus();
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const enteredToken = code.join("");
    if (!activeEmail) {
      toast.error("Please enter your email address.");
      return;
    }
    if (enteredToken.length < 6) {
      toast.error("Please enter the 6-digit code.");
      return;
    }
    setVerifying(true);
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: activeEmail,
        token: enteredToken,
        type: "signup",
      });

      if (error) {
        toast.error(error.message || "Verification failed. Check the code.");
      } else {
        toast.success("Email verified successfully!");
        setTimeout(() => {
          navigate({ to: "/onboarding" });
        }, 800);
      }
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred.");
    } finally {
      setVerifying(false);
    }
  };

  const resendEmail = async () => {
    if (!activeEmail) {
      toast.error("Please enter your email first.");
      return;
    }
    setResending(true);
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: activeEmail,
        options: {
          emailRedirectTo:
            typeof window !== "undefined" ? window.location.origin + "/onboarding" : undefined,
        },
      });

      if (error) {
        toast.error(error.message || "Failed to resend verification code.");
      } else {
        toast.success("Verification code resent to your inbox!");
      }
    } catch (err: any) {
      toast.error("Failed to resend code.");
    } finally {
      setResending(false);
    }
  };

  return (
    <AuthSplit title="Confirm your email">
      <p className="mt-1 text-sm text-muted-foreground">
        We sent a 6-digit confirmation code to your email.
      </p>

      {/* Target Email Info / Toggle Input */}
      <div className="mt-5 bg-paper border border-border/80 rounded-xl p-3.5 flex items-center justify-between text-xs gap-3">
        {isEditingEmail ? (
          <input
            type="email"
            value={activeEmail}
            onChange={(e) => setActiveEmail(e.target.value)}
            placeholder="Confirm email address"
            className="flex-1 bg-background border border-input rounded-md px-2.5 py-1.5 text-xs text-foreground outline-none focus:ring-1 focus:ring-primary"
          />
        ) : (
          <div className="truncate">
            <span className="text-muted-foreground block text-[10px] uppercase font-bold tracking-wider">
              Verifying Address
            </span>
            <span className="font-semibold text-foreground truncate block">{activeEmail}</span>
          </div>
        )}
        <button
          type="button"
          onClick={() => setIsEditingEmail(!isEditingEmail)}
          className="text-primary hover:underline font-semibold shrink-0 cursor-pointer"
        >
          {isEditingEmail ? "Save" : "Change"}
        </button>
      </div>

      <form onSubmit={submit} className="mt-6 space-y-6">
        <div className="space-y-2">
          <label className="block text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
            6-Digit Verification Code
          </label>
          {/* OTP Input Grid */}
          <div className="grid grid-cols-6 gap-2">
            {code.map((digit, idx) => (
              <input
                key={idx}
                id={`otp-${idx}`}
                type="text"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                onPaste={idx === 0 ? handlePaste : undefined}
                onChange={(e) => handleChange(e.target.value, idx)}
                className="w-full text-center aspect-square font-mono text-xl font-bold rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary/30 outline-none transition"
              />
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={verifying}
          className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-lg transition"
        >
          {verifying ? (
            "Verifying..."
          ) : (
            <>
              Confirm Email <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      {/* Helper resend link */}
      <div className="mt-8 text-center space-y-3">
        <p className="text-xs text-muted-foreground">
          Didn't receive the code? Check spam or{" "}
          <button
            type="button"
            disabled={resending}
            onClick={resendEmail}
            className="text-primary hover:underline font-semibold cursor-pointer"
          >
            {resending ? "Resending..." : "click here to resend"}
          </button>
        </p>

        <p className="text-[10px] text-muted-foreground pt-4 border-t border-border/40">
          Make sure your Supabase Auth Email Template is updated to use the code parameter.
        </p>
      </div>
    </AuthSplit>
  );
}
