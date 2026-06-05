import { STATUS_META, type PipelineStatus } from "@/data/mockData";
import { cn } from "@/lib/utils";

export function StatusPill({ status, className }: { status: PipelineStatus; className?: string }) {
  const meta = STATUS_META[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
        meta.color,
        className,
      )}
    >
      <span>{meta.emoji}</span>
      <span>{meta.label}</span>
    </span>
  );
}
