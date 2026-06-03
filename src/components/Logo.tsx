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
      <circle cx="14" cy="20" r="6" fill="#2563eb" />
      <circle cx="26" cy="20" r="6" fill="#10B981" />
      <path d="M14 20L26 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M17 20C18.5 18.5 19.5 18.5 22 20C24.5 21.5 25.5 21.5 27 20" stroke="currentColor" strokeWidth="1.5" fill="none" />
    </svg>
  );
}

export function LanceConnectLogo({ className, showText = true, showSlogan = true, size = 32 }: { className?: string; showText?: boolean; showSlogan?: boolean; size?: number }) {
  return (
    <div className={cn("flex items-center gap-3.5", className)}>
      <Logo size={size} />
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-baseline leading-none">
            <span className="font-display text-xl font-bold text-foreground">Lance</span>
            <span className="font-display text-xl font-bold" style={{ color: "#2563eb" }}>Connect</span>
          </div>
          {showSlogan && (
            <span className="font-mono text-[9px] text-[#64748B] mt-1 whitespace-nowrap leading-none tracking-tight">
              The Meeting Point for Freelancers and Clients
            </span>
          )}
        </div>
      )}
    </div>
  );
}