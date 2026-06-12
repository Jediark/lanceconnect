import { cn } from "@/lib/utils";

export function PlanUsageBar({ used, limit, plan }: { used: number; limit: number; plan: string }) {
  const percentage = limit > 0 ? Math.min(100, Math.max(0, (used / limit) * 100)) : 0;
  
  // Format plan names nicely
  const getDisplayName = (p: string) => {
    if (p === "individual" || p === "grow") return "Grow Plan";
    if (p === "company" || p === "scale") return "Scale Plan";
    return "Free Plan";
  };

  const isUnlimited = limit > 10000;

  return (
    <div className="rounded-xl border border-sidebar-border/40 bg-sidebar-hover/60 p-3 text-sidebar-foreground select-none">
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="font-medium uppercase tracking-wide text-sidebar-active/80">
          {getDisplayName(plan)}
        </span>
        <span className="font-bold text-sidebar-active">
          {isUnlimited ? `${used} / Unlimited` : `${used} / ${limit}`}
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-black/30">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${isUnlimited ? 100 : percentage}%` }}
        />
      </div>
      <p className="mt-2 text-[11px] leading-tight text-sidebar-foreground/80">
        {isUnlimited 
          ? "You have unlimited lead exports this month." 
          : `You have used ${used} of your ${limit} monthly lead searches.`}
      </p>
    </div>
  );
}
