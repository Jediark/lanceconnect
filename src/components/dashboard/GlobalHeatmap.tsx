import { cn } from "@/lib/utils";

export type RegionItem = {
  city: string;
  country: string;
};

const CITY_COORDINATES: Record<string, { top: string; left: string }> = {
  lagos: { top: "54%", left: "49%" },
  london: { top: "28%", left: "47%" },
  newyork: { top: "34%", left: "26%" },
  losangeles: { top: "38%", left: "15%" },
  calgary: { top: "28%", left: "18%" },
  toronto: { top: "31%", left: "22%" },
  berlin: { top: "26%", left: "51%" },
  paris: { top: "29%", left: "48%" },
  sydney: { top: "72%", left: "86%" },
  tokyo: { top: "36%", left: "82%" },
  mumbai: { top: "44%", left: "68%" },
  saopaulo: { top: "62%", left: "34%" },
  johannesburg: { top: "68%", left: "53%" },
  cairo: { top: "40%", left: "53%" },
  dubai: { top: "42%", left: "60%" },
  innsbruck: { top: "28%", left: "50%" },
};

export function GlobalHeatmap({
  regions = [],
  className,
}: {
  regions?: RegionItem[];
  className?: string;
}) {
  // Filter out invalid/empty entries and deduplicate
  const validRegions = regions.filter((r) => r.city && r.city.trim() !== "");
  const uniqueRegions = Array.from(
    new Map(validRegions.map((item) => [`${item.city.toLowerCase()}-${item.country.toLowerCase()}`, item])).values()
  );

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border bg-card group",
        className,
      )}
    >
      <div className="absolute inset-0 bg-dot-pattern opacity-50 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />

      {/* Stylized Vector World Map Background */}
      <div className="absolute inset-0 opacity-[0.07] dark:opacity-[0.12] pointer-events-none select-none">
        <img
          src="/assets/world-map.svg"
          alt=""
          className="w-full h-full object-fill invert dark:invert-0 filter brightness-105"
        />
      </div>

      {/* Dynamic Map Nodes */}
      <div className="absolute inset-0">
        {uniqueRegions.map((reg, index) => {
          const key = reg.city.toLowerCase().replace(/[^a-z]/g, "");
          let coords = CITY_COORDINATES[key];

          if (!coords) {
            // Generate stable pseudo-random coordinates based on city name characters
            let hash = 0;
            for (let i = 0; i < reg.city.length; i++) {
              hash = reg.city.charCodeAt(i) + ((hash << 5) - hash);
            }
            const seedTop = Math.abs(Math.sin(hash)) * 50 + 20; // 20% to 70%
            const seedLeft = Math.abs(Math.cos(hash)) * 70 + 15; // 15% to 85%
            coords = { top: `${seedTop.toFixed(1)}%`, left: `${seedLeft.toFixed(1)}%` };
          }

          const delay = `${(index * 0.4).toFixed(1)}s`;
          const size = index % 3 === 0 ? "lg" : index % 3 === 1 ? "md" : "sm";

          return (
            <MapNode
              key={`${reg.city}-${index}`}
              top={coords.top}
              left={coords.left}
              label={`${reg.city}`}
              size={size}
              delay={delay}
            />
          );
        })}
      </div>

      <div className="relative z-10 p-5 flex flex-col h-full pointer-events-none select-none">
        <h4 className="text-sm font-bold text-foreground mb-1">Pipeline Global Heatmap</h4>
        <p className="text-xs text-muted-foreground">Locations of your saved prospects and active search areas</p>

        <div className="mt-auto pt-10">
          <div className="inline-flex items-center gap-2 rounded-lg bg-background/80 backdrop-blur-sm border border-border px-3 py-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] font-medium text-foreground">
              {uniqueRegions.length} Active {uniqueRegions.length === 1 ? "Region" : "Regions"}
            </span>
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
    <div className={cn("absolute flex flex-col items-center z-20", className)} style={{ top, left }}>
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
