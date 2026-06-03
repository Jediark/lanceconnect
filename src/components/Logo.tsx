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
  const logoSrc = theme === "light" ? "/logo-navy.png" : "/logo-white.png";

  return (
    <img 
      src={logoSrc} 
      alt="LanceConnect Logo" 
      className={cn("h-11 md:h-14 w-auto object-contain", className)} 
    />
  );
}