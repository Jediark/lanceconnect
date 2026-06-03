import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: number;
}

export function Logo({ className, size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(className)}
    >
      <circle cx="14" cy="20" r="6" fill="#6366F1" />
      <circle cx="26" cy="20" r="6" fill="#10B981" />
      <path d="M14 20L26 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M17 20C18.5 18.5 19.5 18.5 22 20C24.5 21.5 25.5 21.5 27 20" stroke="currentColor" strokeWidth="1.5" fill="none" />
    </svg>
  );
}

export function LanceConnectLogo({ className, showText = true }: { className?: string; showText?: boolean }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Logo size={32} />
      {showText && (
        <div className="flex items-baseline">
          <span className="font-display text-xl font-bold text-foreground">Lance</span>
          <span className="font-display text-xl font-bold" style={{ color: "#6366F1" }}>Connect</span>
        </div>
      )}
    </div>
  );
}