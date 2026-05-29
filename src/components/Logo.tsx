import logoUrl from "@/assets/logo.png";
import { cn } from "@/lib/utils";

export function Logo({ className, size = 32 }: { className?: string; size?: number }) {
  return (
    <img
      src={logoUrl}
      alt="FreelanceConnect"
      width={size}
      height={size}
      className={cn("object-contain", className)}
    />
  );
}
