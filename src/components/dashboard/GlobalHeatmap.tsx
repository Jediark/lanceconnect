import { cn } from "@/lib/utils";
import { MapPin } from "lucide-react";

export function GlobalHeatmap({ className }: { className?: string }) {
  // A stylized global map using a simple rounded grid or SVG paths is too large to embed fully,
  // so we'll use a beautiful abstract representation with pulsing nodes over a world-map-like dotted background.
  return (
    <div className={cn("relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm group", className)}>
      <div className="absolute inset-0 bg-dot-pattern opacity-50" />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
      
      {/* Abstract Map Nodes */}
      <div className="absolute inset-0">
        <MapNode top="30%" left="20%" label="New York" size="lg" />
        <MapNode top="40%" left="15%" label="Los Angeles" size="md" />
        <MapNode top="25%" left="48%" label="London" size="lg" delay="1s" />
        <MapNode top="32%" left="52%" label="Berlin" size="sm" delay="0.5s" />
        <MapNode top="50%" left="50%" label="Lagos" size="md" delay="1.5s" />
        <MapNode top="65%" left="30%" label="São Paulo" size="sm" delay="2s" />
        <MapNode top="45%" left="75%" label="Mumbai" size="lg" delay="0.8s" />
        <MapNode top="70%" left="85%" label="Sydney" size="md" delay="2.5s" />
        <MapNode top="35%" left="80%" label="Tokyo" size="lg" delay="1.2s" />
      </div>

      <div className="relative z-10 p-5 flex flex-col h-full pointer-events-none">
        <h4 className="text-sm font-bold text-foreground mb-1">Global Activity Heatmap</h4>
        <p className="text-xs text-muted-foreground">Live tracking of your leads</p>
        
        <div className="mt-auto pt-10">
          <div className="inline-flex items-center gap-2 rounded-lg bg-background/80 backdrop-blur-sm border border-border px-3 py-1.5 shadow-sm">
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

function MapNode({ top, left, label, size = "md", delay = "0s" }: { top: string, left: string, label: string, size?: "sm"|"md"|"lg", delay?: string }) {
  const sizeMap = { sm: "h-1.5 w-1.5", md: "h-2 w-2", lg: "h-3 w-3" };
  const pingSizeMap = { sm: "h-4 w-4", md: "h-5 w-5", lg: "h-6 w-6" };
  
  return (
    <div className="absolute flex flex-col items-center group-hover:scale-110 transition-transform duration-500" style={{ top, left }}>
      <div className="relative flex items-center justify-center">
        <span 
          className={cn("animate-ping absolute rounded-full bg-primary/40", pingSizeMap[size])} 
          style={{ animationDuration: "3s", animationDelay: delay }}
        />
        <span className={cn("relative rounded-full bg-primary shadow-[0_0_8px_rgba(37,99,235,0.8)]", sizeMap[size])} />
      </div>
      <span className="mt-1 opacity-0 group-hover:opacity-100 transition-opacity text-[9px] font-bold text-foreground bg-background/80 backdrop-blur-sm px-1.5 rounded border border-border">
        {label}
      </span>
    </div>
  );
}
