import { cn } from "@/lib/utils";

export function GlobalHeatmap({ className }: { className?: string }) {
  // Stylized global map with pulsing nodes over dotted background.
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border bg-card group",
        className,
      )}
    >
      <div className="absolute inset-0 bg-dot-pattern opacity-50" />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />

      {/* Abstract Map Nodes */}
      <div className="absolute inset-0">
        <MapNode top="30%" left="20%" label="New York (US)" size="lg" />
        <MapNode top="40%" left="15%" label="Los Angeles (US)" size="md" className="hidden sm:flex" />
        <MapNode top="25%" left="48%" label="London (UK)" size="lg" delay="1s" />
        <MapNode top="32%" left="52%" label="Berlin (DE)" size="sm" delay="0.5s" className="hidden sm:flex" />
        <MapNode top="50%" left="50%" label="Lagos (NG)" size="md" delay="1.5s" />
        <MapNode top="65%" left="30%" label="São Paulo (BR)" size="sm" delay="2s" className="hidden sm:flex" />
        <MapNode top="45%" left="75%" label="Mumbai (IN)" size="lg" delay="0.8s" className="hidden sm:flex" />
        <MapNode top="70%" left="85%" label="Sydney (AU)" size="md" delay="2.5s" className="hidden sm:flex" />
        <MapNode top="35%" left="80%" label="Tokyo (JP)" size="lg" delay="1.2s" className="hidden sm:flex" />
      </div>

      <div className="relative z-10 p-5 flex flex-col h-full pointer-events-none">
        <h4 className="text-sm font-bold text-foreground mb-1">Global Activity Heatmap</h4>
        <p className="text-xs text-muted-foreground">Live tracking of your leads</p>

        <div className="mt-auto pt-10">
          <div className="inline-flex items-center gap-2 rounded-lg bg-background/80 backdrop-blur-sm border border-border px-3 py-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] font-medium text-foreground">14 Active Regions</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function MapNode({
  top,
  left,
  label,
  size = "md",
  delay = "0s",
  className,
}: {
  top: string;
  left: string;
  label: string;
  size?: "sm" | "md" | "lg";
  delay?: string;
  className?: string;
}) {
  const sizeMap = { sm: "h-1.5 w-1.5", md: "h-2 w-2", lg: "h-3 w-3" };
  const pingSizeMap = { sm: "h-4 w-4", md: "h-5 w-5", lg: "h-6 w-6" };

  return (
    <div className={cn("absolute flex flex-col items-center", className)} style={{ top, left }}>
      <div className="relative flex items-center justify-center">
        <span
          className={cn("animate-ping absolute rounded-full bg-primary/40", pingSizeMap[size])}
          style={{ animationDuration: "3s", animationDelay: delay }}
        />
        <span className={cn("relative rounded-full bg-primary", sizeMap[size])} />
      </div>
      <span
        className="mt-1 text-[9px] font-bold text-foreground bg-background/90 backdrop-blur-sm px-1.5 py-0.5 rounded border border-primary/30 tracking-wide animate-pulse"
        style={{ animationDuration: "3s", animationDelay: delay }}
      >
        {label}
      </span>
    </div>
  );
}
