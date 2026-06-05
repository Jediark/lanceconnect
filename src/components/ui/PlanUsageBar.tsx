import { cn } from "@/lib/utils";

export function PlanUsageBar({ used, limit, plan }: { used: number; limit: number; plan: string }) {
  const pct = Math.min(100, Math.round((used / limit) * 100));
  const urgent = pct >= 80;

  return (
    <div className="rounded-xl border border-sidebar-border/40 bg-sidebar-hover/60 p-3 text-sidebar-foreground">
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="font-medium uppercase tracking-wide text-sidebar-active/80">
          {plan} Plan
        </span>
        <span className="font-bold text-sidebar-active">
          {used}/{limit}
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-black/30">
        <div
          className={cn("h-full transition-all", urgent ? "bg-amber-400" : "bg-primary")}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="mt-2 text-[11px] leading-tight text-sidebar-foreground/80">
        {limit - used} leads left this month
      </p>
    </div>
  );
}
