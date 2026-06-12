import { cn } from "@/lib/utils";

/* ─── Stripe Wordmark ────────────────────────────────────────────────────── */

export function StripeLogo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1 font-bold text-current", className)}>
      <svg
        className="h-[1.1em] w-[1.1em] text-[#635BFF] shrink-0"
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.922 3.51 1.631 3.51 2.651 0 .974-.806 1.467-2.26 1.467-2.617 0-5.493-.974-7.248-1.921l-.928 5.679c1.724.779 4.708 1.305 7.822 1.305 2.762 0 5.065-.654 6.6-1.89 1.493-1.222 2.308-3.084 2.308-5.362 0-4.39-2.583-5.919-6.953-7.533z" />
      </svg>
      <span className="leading-none text-current font-extrabold tracking-tight">stripe</span>
    </span>
  );
}

/* ─── Paystack Shield + Wordmark ─────────────────────────────────────────── */

export function PaystackLogo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 font-bold text-current", className)}>
      <svg
        className="h-[1.05em] w-[1.05em] text-[#00C3F7] shrink-0"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 11 2 2 4-4" />
      </svg>
      <span className="leading-none text-current font-extrabold tracking-tight">paystack</span>
    </span>
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
