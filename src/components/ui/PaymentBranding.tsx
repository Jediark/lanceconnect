import { cn } from "@/lib/utils";

/* ─── Stripe Wordmark ────────────────────────────────────────────────────── */

export function StripeLogo({ className }: { className?: string }) {
  return (
    <svg
      className={cn("h-5 w-auto", className)}
      viewBox="0 0 60 25"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Stripe"
    >
      <path d="M59.64 14.28h-8.06c.19 1.93 1.6 2.55 3.2 2.55 1.64 0 2.96-.37 4.05-.95v3.32a12.3 12.3 0 0 1-4.56.85c-4.05 0-6.83-2.11-6.83-7.07 0-4.28 2.49-7.21 6.3-7.21 3.76 0 5.97 2.87 5.97 7.07 0 .5-.04 1.12-.07 1.44zm-5.86-5.94c-1.2 0-2.07.89-2.23 2.55h4.39c-.03-1.67-.82-2.55-2.16-2.55zM40.95 20.3c-1.44 0-2.32-.6-2.9-1.04l-.02 4.63-4.12.87V6.25h3.57l.18 1.04a4.47 4.47 0 0 1 3.5-1.29c3.07 0 5.26 2.87 5.26 7.08 0 4.93-2.35 7.21-5.47 7.21zm-.77-13.54c-.87 0-1.47.3-1.97.74l.03 5.94c.47.41 1.07.7 1.94.7 1.53 0 2.57-1.55 2.57-3.72 0-2.14-1.04-3.66-2.57-3.66zM28.24 5.57h4.13v14.44h-4.13V5.57zm0-5.19L32.37 0v3.56h-4.13V.38zm-4.32 9.35v10.28h-4.11V6.25h3.56l.18 1.3a5.1 5.1 0 0 1 3.56-1.55v3.87c-.29-.05-.6-.08-.94-.08-1.01 0-1.82.35-2.25.94zM12.2 6c-1.7 0-2.81.56-3.56 1.04L8.3 6.25H4.73v17.42l4.11-.87.01-4.17c.72.46 1.78.87 2.96.87 3.23 0 5.85-2.35 5.85-7.25C17.66 8.42 15.36 6 12.2 6zm-.74 10.76c-.89 0-1.42-.28-1.85-.63l-.03-5.22c.46-.38 1-.67 1.88-.67 1.44 0 2.43 1.55 2.43 3.22 0 1.87-.97 3.3-2.43 3.3zM4.3 7.36C4.3 6.3 3.47 5.57 2.4 5.57c-1.07 0-1.96.73-1.96 1.79 0 1.02.81 1.76 1.96 1.76 1.12 0 1.89-.74 1.89-1.76zm.64 2.48c-.77-.48-1.57-.72-2.53-.72C1.08 9.12 0 10.13 0 11.49c0 1.34 1.03 2.37 2.41 2.37.96 0 1.75-.27 2.53-.76v.05c0 1.26-.87 1.86-2.06 1.86a6.2 6.2 0 0 1-2.4-.51v3.19a9 9 0 0 0 2.75.42c3.14 0 5.07-1.55 5.07-4.98V9.84z" />
    </svg>
  );
}

/* ─── Paystack Shield + Wordmark ─────────────────────────────────────────── */

export function PaystackLogo({ className }: { className?: string }) {
  return (
    <svg
      className={cn("h-5 w-auto", className)}
      viewBox="0 0 100 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Paystack"
    >
      {/* P */}
      <path d="M0 0h6.5c3.6 0 5.8 2.2 5.8 5.3 0 3.1-2.2 5.3-5.8 5.3H3.4v5.8H0V0zm6.2 7.7c1.6 0 2.6-1 2.6-2.4 0-1.4-1-2.4-2.6-2.4H3.4v4.8h2.8z" />
      {/* a */}
      <path d="M16.2 16.4c-1.2 0-2.3-.4-3-1.2v1h-3V4.4h3v4.3c.7-.8 1.8-1.2 3-1.2 2.8 0 4.7 2.2 4.7 4.5 0 2.3-1.9 4.4-4.7 4.4zm-.6-6.6c-1.4 0-2.4 1-2.4 2.2 0 1.2 1 2.2 2.4 2.2s2.4-1 2.4-2.2c0-1.2-1-2.2-2.4-2.2z" />
      {/* y */}
      <path d="M22.5 20.4l1.3-2.6c.5.5 1.4.8 2.1.8.5 0 .9-.2 1.1-.6l.2-.4-4.1-10h3.3l2.3 6.1 2.3-6.1h3.3l-4.4 11.3c-.7 1.8-2 2.7-4 2.7-1.1 0-2.3-.4-3.4-1.2z" />
      {/* s */}
      <path d="M36.5 16.4c-1.7 0-3.4-.7-4.4-1.9l1.9-1.9c.7.8 1.5 1.2 2.5 1.2.7 0 1.1-.3 1.1-.7 0-.5-.5-.7-1.8-1-2-.5-3.3-1.2-3.3-3.2 0-2 1.7-3.3 3.8-3.3 1.6 0 3 .5 4 1.6l-1.8 1.9c-.6-.6-1.3-1-2.2-1-.6 0-.9.2-.9.6 0 .5.5.6 1.8 1 2.1.5 3.3 1.3 3.3 3.2.1 2.1-1.5 3.5-4 3.5z" />
      {/* t */}
      <path d="M44 16.2c-1.7 0-2.8-1.2-2.8-2.9V10h-1.3V7.6h1.3V4.8h3v2.8h2v2.4h-2v2.8c0 .5.3.8.8.8h1.2v2.6H44z" />
      {/* a */}
      <path d="M51.1 16.4c-1.2 0-2.3-.4-3-1.2v1h-3V4.4h3v4.3c.7-.8 1.8-1.2 3-1.2 2.8 0 4.7 2.2 4.7 4.5 0 2.3-1.9 4.4-4.7 4.4zm-.6-6.6c-1.4 0-2.4 1-2.4 2.2 0 1.2 1 2.2 2.4 2.2s2.4-1 2.4-2.2c0-1.2-1-2.2-2.4-2.2z" />
      {/* c */}
      <path d="M60.4 16.4c-2.6 0-4.7-1.9-4.7-4.4 0-2.5 2.1-4.5 4.7-4.5 1.5 0 2.8.6 3.6 1.7l-2 1.7c-.4-.6-1-.9-1.6-.9-1 0-1.8.8-1.8 2 0 1.2.8 2 1.8 2 .6 0 1.2-.3 1.6-.9l2 1.7c-.8 1-2.1 1.6-3.6 1.6z" />
      {/* k */}
      <path d="M64.8 16.2V4.4h3v5.3l3-2.1h3.6l-3.8 2.8 4 5.8h-3.5l-2.5-3.8-.8.6v3.2h-3z" />
      {/* Shield icon */}
      <path d="M82 1.5c2 0 3.6.4 5 1.1v5c0 4.5-2 8.3-5 10.4-3-2.1-5-5.9-5-10.4v-5c1.4-.7 3-1.1 5-1.1z" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M80.5 10.5l1.5 1.5 3-3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ─── Accepted Payment Methods Badges ────────────────────────────────────── */

export function AcceptedCardBadges({ className, variant = "stripe" }: { className?: string; variant?: "stripe" | "paystack" }) {
  if (variant === "paystack") {
    return (
      <span className={cn("inline-flex items-center gap-1.5 text-[10px] text-muted-foreground", className)}>
        Cards · Bank Transfer · USSD
      </span>
    );
  }
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-[10px] text-muted-foreground", className)}>
      Visa · Mastercard · Apple Pay · Google Pay
    </span>
  );
}

/* ─── Branded Payment Button ─────────────────────────────────────────────── */

interface PaymentButtonProps {
  gateway: "stripe" | "paystack";
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  children?: React.ReactNode;
  className?: string;
  type?: "button" | "submit";
  size?: "sm" | "md";
}

export function PaymentButton({
  gateway,
  onClick,
  disabled,
  loading,
  children,
  className,
  type = "button",
  size = "md",
}: PaymentButtonProps) {
  const isStripe = gateway === "stripe";
  const baseColor = isStripe
    ? "bg-[#635BFF] hover:bg-[#7A73FF] shadow-[0_0_20px_rgba(99,91,255,0.2)]"
    : "bg-[#00C3F7] hover:bg-[#33CFFA] shadow-[0_0_20px_rgba(0,195,247,0.2)]";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        "w-full rounded-xl text-white font-bold transition-all duration-200 flex items-center justify-center gap-2.5 disabled:opacity-50 cursor-pointer active:scale-[0.98]",
        baseColor,
        size === "sm" ? "py-2 text-[11px]" : "py-3 text-xs",
        className,
      )}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Redirecting…
        </span>
      ) : (
        <>
          <span className="flex items-center gap-1.5 opacity-90">
            Pay with
          </span>
          {isStripe ? <StripeLogo className="h-[18px]" /> : <PaystackLogo className="h-[16px]" />}
          {children}
        </>
      )}
    </button>
  );
}

/* ─── Dual Gateway Selector ──────────────────────────────────────────────── */

interface DualPaymentProps {
  onStripe?: () => void;
  onPaystack?: () => void;
  stripeLoading?: boolean;
  paystackLoading?: boolean;
  stripeDisabled?: boolean;
  paystackDisabled?: boolean;
  recommended?: "stripe" | "paystack" | null;
  className?: string;
}

export function DualPaymentButtons({
  onStripe,
  onPaystack,
  stripeLoading,
  paystackLoading,
  stripeDisabled,
  paystackDisabled,
  recommended,
  className,
}: DualPaymentProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="relative">
        {recommended === "stripe" && (
          <span className="absolute -top-2 right-3 bg-[#635BFF] text-white text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full z-10">
            Recommended
          </span>
        )}
        <PaymentButton
          gateway="stripe"
          onClick={onStripe}
          loading={stripeLoading}
          disabled={stripeDisabled}
        />
        <AcceptedCardBadges variant="stripe" className="mt-1 flex justify-center" />
      </div>

      <div className="flex items-center gap-2 my-1">
        <div className="flex-1 h-px bg-border" />
        <span className="text-[10px] text-muted-foreground font-medium">or</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      <div className="relative">
        {recommended === "paystack" && (
          <span className="absolute -top-2 right-3 bg-[#00C3F7] text-white text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full z-10">
            Recommended
          </span>
        )}
        <PaymentButton
          gateway="paystack"
          onClick={onPaystack}
          loading={paystackLoading}
          disabled={paystackDisabled}
        />
        <AcceptedCardBadges variant="paystack" className="mt-1 flex justify-center" />
      </div>
    </div>
  );
}

/* ─── Trust Badge (for pricing page footer) ──────────────────────────────── */

export function PaymentTrustBadge({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
        Secure payments powered by
      </p>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 text-muted-foreground/70 hover:text-[#635BFF] transition">
          <StripeLogo className="h-5" />
        </div>
        <div className="h-4 w-px bg-border" />
        <div className="flex items-center gap-1.5 text-muted-foreground/70 hover:text-[#00C3F7] transition">
          <PaystackLogo className="h-5" />
        </div>
      </div>
      <p className="text-[9px] text-muted-foreground font-mono">
        256-bit SSL · PCI DSS Level 1 · No card data stored on our servers
      </p>
    </div>
  );
}
