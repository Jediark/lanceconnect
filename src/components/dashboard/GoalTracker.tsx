import { cn } from "@/lib/utils";
import { Target } from "lucide-react";

export function GoalTracker({
  current = 34,
  target = 50,
  className,
}: {
  current?: number;
  target?: number;
  className?: string;
}) {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const percent = Math.min(100, Math.round((current / target) * 100));
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <div
      className={cn(
        "flex items-center gap-6 p-4 rounded-2xl border border-border bg-card shadow-sm",
        className,
      )}
    >
      <div className="relative flex items-center justify-center">
        <svg className="transform -rotate-90 w-24 h-24">
          <circle
            className="text-muted stroke-current"
            strokeWidth="8"
            cx="48"
            cy="48"
            r={radius}
            fill="transparent"
          />
          <circle
            className="text-primary stroke-current transition-all duration-1000 ease-out"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            cx="48"
            cy="48"
            r={radius}
            fill="transparent"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-lg font-bold text-foreground">{percent}%</span>
        </div>
      </div>
      <div>
        <h4 className="text-sm font-bold text-foreground flex items-center gap-1.5 mb-1">
          <Target className="h-4 w-4 text-primary" /> Weekly Target
        </h4>
        <p className="text-xs text-muted-foreground mb-3">
          You need {Math.max(0, target - current)} more leads to hit your goal.
        </p>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-extrabold text-foreground">{current}</span>
          <span className="text-xs text-muted-foreground">/ {target} Contacted</span>
        </div>
      </div>
    </div>
  );
}
