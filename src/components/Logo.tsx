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

import { usePreferences } from "@/contexts/PreferencesContext";

export function LanceConnectLogo({ className }: { className?: string }) {
  const { theme } = usePreferences();
  const logoSrc = theme === "light" ? "/logo-white.png" : "/logo-navy.png";

  return (
    <img 
      src={logoSrc} 
      alt="LanceConnect Logo" 
      style={{ imageRendering: "crisp-edges" }}
      className={cn(
        "h-11 md:h-14 w-auto object-contain transition-all duration-300",
        theme === "light" 
          ? "filter drop-shadow-[0_0_12px_rgba(255,255,255,0.15)] hover:drop-shadow-[0_0_18px_rgba(16,185,129,0.3)] hover:scale-[1.02]" 
          : "filter drop-shadow-[0_0_12px_rgba(37,99,235,0.1)] hover:drop-shadow-[0_0_18px_rgba(99,102,241,0.3)] hover:scale-[1.02]",
        className
      )} 
    />
  );
}