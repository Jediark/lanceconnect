import { cn } from "@/lib/utils";

export function PlanUsageBar({ used, limit, plan }: { used: number; limit: number; plan: string }) {
  return (
    <div className="rounded-xl border border-sidebar-border/40 bg-sidebar-hover/60 p-3 text-sidebar-foreground">
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="font-medium uppercase tracking-wide text-sidebar-active/80">
          Free Forever
        </span>
        <span className="font-bold text-sidebar-active">
          Unlimited
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-black/30">
        <div
          className="h-full bg-primary"
          style={{ width: "100%" }}
        />
      </div>
      <p className="mt-2 text-[11px] leading-tight text-sidebar-foreground/80">
        Find and save as many leads as you need. No limits.
      </p>
    </div>
  );
}
