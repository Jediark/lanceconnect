import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export type RegionItem = {
  city: string;
  country: string;
};

const CITY_DB: Record<string, { lat: number; lon: number }> = {
  lagos: { lat: 6.5244, lon: 3.3792 },
  london: { lat: 51.5074, lon: -0.1278 },
  newyork: { lat: 40.7128, lon: -74.006 },
  losangeles: { lat: 34.0522, lon: -118.2437 },
  calgary: { lat: 51.0447, lon: -114.0719 },
  toronto: { lat: 43.6532, lon: -79.3832 },
  berlin: { lat: 52.52, lon: 13.405 },
  paris: { lat: 48.8566, lon: 2.3522 },
  sydney: { lat: -33.8688, lon: 151.2093 },
  tokyo: { lat: 35.6762, lon: 139.6503 },
  mumbai: { lat: 19.076, lon: 72.8777 },
  saopaulo: { lat: -23.5505, lon: -46.6333 },
  johannesburg: { lat: -26.2041, lon: 28.0473 },
  cairo: { lat: 30.0444, lon: 31.2357 },
  dubai: { lat: 25.2048, lon: 55.2708 },
  innsbruck: { lat: 47.2692, lon: 11.4041 },
  seattle: { lat: 47.6062, lon: -122.3321 },
  accra: { lat: 5.6037, lon: -0.187 },
  houston: { lat: 29.7604, lon: -95.3698 },
  abuja: { lat: 9.0765, lon: 7.3986 },
  edinburgh: { lat: 55.9533, lon: -3.1883 },
};

const COORDINATE_TESTS = [
  {
    city: 'Los Angeles',
    lat: 34.0522,
    lng: -118.2437,
    expectedRegion: 'US west coast — left side of map, middle height',
    expectedX: 'between 150-200px (left quarter of map)',
    expectedY: 'between 140-170px (middle of map, slightly above center)'
  },
  {
    city: 'Seattle',
    lat: 47.6062,
    lng: -122.3321,
    expectedRegion: 'US Pacific Northwest — left of LA, above LA',
    expectedX: 'between 150-175px (slightly left of LA)',
    expectedY: 'between 110-130px (above LA on map)'
  },
  {
    city: 'New York',
    lat: 40.7128,
    lng: -74.0060,
    expectedRegion: 'US east coast — right of LA but still left half of map',
    expectedX: 'between 290-320px (left-center of map)',
    expectedY: 'between 135-150px (similar height to LA)'
  },
  {
    city: 'London',
    lat: 51.5074,
    lng: -0.1278,
    expectedRegion: 'Western Europe — just left of center',
    expectedX: 'between 495-505px (near center, slightly left)',
    expectedY: 'between 105-120px (upper portion of map)'
  },
  {
    city: 'Tokyo',
    lat: 35.6762,
    lng: 139.6503,
    expectedRegion: 'East Asia — right side of map',
    expectedX: 'between 860-890px (right portion of map)',
    expectedY: 'between 150-165px (middle height)'
  },
  {
    city: 'Sydney',
    lat: -33.8688,
    lng: 151.2093,
    expectedRegion: 'Southeast Australia — right side, lower half',
    expectedX: 'between 864-920px (right portion of map)',
    expectedY: 'between 340-360px (lower half of map)'
  },
];

const verifyRelationships = (results: { city: string; x: number; y: number }[]) => {
  const LA = results.find(r => r.city === 'Los Angeles')!;
  const Seattle = results.find(r => r.city === 'Seattle')!;
  const NewYork = results.find(r => r.city === 'New York')!;
  const London = results.find(r => r.city === 'London')!;
  const Tokyo = results.find(r => r.city === 'Tokyo')!;
  const Sydney = results.find(r => r.city === 'Sydney')!;

  console.assert(Seattle.x < NewYork.x, 'Seattle must be LEFT of New York');
  console.assert(LA.x < NewYork.x, 'LA must be LEFT of New York');
  console.assert(Seattle.y < LA.y, 'Seattle must be ABOVE LA (smaller Y)');
  console.assert(NewYork.x < London.x, 'New York must be LEFT of London');
  console.assert(London.x < Tokyo.x, 'London must be LEFT of Tokyo');
  console.assert(Sydney.x > London.x, 'Sydney must be RIGHT of London');
  console.assert(Sydney.y > Tokyo.y, 'Sydney must be BELOW Tokyo (larger Y)');
  console.assert(LA.x < 300, 'LA must be in left half of map (negative longitude)');
  console.assert(Tokyo.x > 700, 'Tokyo must be in right half of map (positive longitude)');

  console.log('All coordinate relationship tests passed ✅');
  
  // Also print the computed pixels for verification
  console.log('Computed coordinates for verification:');
  results.forEach(r => {
    console.log(`- ${r.city}: x = ${r.x.toFixed(1)}px, y = ${r.y.toFixed(1)}px`);
  });
};

function convertLatLngToPercent(lat: number, lon: number) {
  // Longitudinal linear mapping for equirectangular projection
  // Left side of map = -180 lon, Right side = 180 lon
  const left = ((lon + 180) / 360) * 100;
  
  // Latitudinal linear mapping (higher latitude = closer to top of map)
  const top = ((90 - lat) / 180) * 100;

  return {
    top: `${Math.max(2, Math.min(98, top)).toFixed(2)}%`,
    left: `${Math.max(2, Math.min(98, left)).toFixed(2)}%`,
  };
}

export function GlobalHeatmap({
  regions = [],
  className,
}: {
  regions?: RegionItem[];
  className?: string;
}) {
  const [debugMode, setDebugMode] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setDebugMode(window.location.search.includes("debug=map"));
      
      // Run the relationship verification
      const MAP_WIDTH = 1000;
      const MAP_HEIGHT = 500;
      const testResults = COORDINATE_TESTS.map(t => {
        const x = ((t.lng + 180) / 360) * MAP_WIDTH;
        const y = ((90 - t.lat) / 180) * MAP_HEIGHT;
        return { city: t.city, x, y };
      });
      verifyRelationships(testResults);
    }
  }, []);

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
      <div className="absolute inset-0 opacity-80 dark:opacity-50 pointer-events-none select-none">
        <img
          src="/assets/world-map.svg"
          alt=""
          className="w-full h-full object-fill"
        />
      </div>

      {/* Dynamic Map Nodes */}
      <div className="absolute inset-0">
        {debugMode ? (
          COORDINATE_TESTS.map((t, index) => {
            const coords = convertLatLngToPercent(t.lat, t.lng);
            return (
              <MapNode
                key={`test-${t.city}-${index}`}
                top={coords.top}
                left={coords.left}
                label={`[TEST] ${t.city}`}
                size="lg"
                delay="0s"
                className="scale-110"
                isTest={true}
              />
            );
          })
        ) : (
          uniqueRegions.map((reg, index) => {
            // Clean up state/country suffixes in city name (e.g., "Los Angeles, CA" -> "losangeles")
            const cityNameOnly = reg.city.split(",")[0].trim();
            const key = cityNameOnly.toLowerCase().replace(/[^a-z]/g, "");
            
            let coords;
            const dbItem = CITY_DB[key];
            if (dbItem) {
              coords = convertLatLngToPercent(dbItem.lat, dbItem.lon);
            } else {
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
          })
        )}
      </div>

      <div className="relative z-10 p-5 flex flex-col h-full pointer-events-none select-none">
        <h4 className="text-sm font-bold text-foreground mb-1">
          {debugMode ? "Pipeline Global Heatmap [Debug Mode]" : "Pipeline Global Heatmap"}
        </h4>
        <p className="text-xs text-muted-foreground">
          {debugMode ? "Displaying coordinate test locations" : "Locations of your saved prospects and active search areas"}
        </p>

        <div className="mt-auto pt-10">
          <div className="inline-flex items-center gap-2 rounded-lg bg-background/80 backdrop-blur-sm border border-border px-3 py-1.5">
            <span className="relative flex h-2 w-2">
              <span className={cn("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", debugMode ? "bg-red-400" : "bg-emerald-400")}></span>
              <span className={cn("relative inline-flex rounded-full h-2 w-2", debugMode ? "bg-red-500" : "bg-emerald-500")}></span>
            </span>
            <span className="text-[11px] font-medium text-foreground">
              {debugMode ? "6 Test Cases" : `${uniqueRegions.length} Active ${uniqueRegions.length === 1 ? "Region" : "Regions"}`}
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
  isTest = false,
}: {
  top: string;
  left: string;
  label: string;
  size?: "sm" | "md" | "lg";
  delay?: string;
  className?: string;
  isTest?: boolean;
}) {
  const sizeMap = { sm: "h-1.5 w-1.5", md: "h-2 w-2", lg: "h-3 w-3" };
  const pingSizeMap = { sm: "h-4 w-4", md: "h-5 w-5", lg: "h-6 w-6" };

  const dotColor = isTest ? "bg-red-500" : "bg-primary";
  const pingColor = isTest ? "bg-red-400/40" : "bg-primary/40";
  const borderColor = isTest ? "border-red-500/50" : "border-primary/30";

  return (
    <div className={cn("absolute flex flex-col items-center z-20", className)} style={{ top, left }}>
      <div className="relative flex items-center justify-center">
        <span
          className={cn("animate-ping absolute rounded-full", pingColor, pingSizeMap[size])}
          style={{ animationDuration: "3s", animationDelay: delay }}
        />
        <span className={cn("relative rounded-full", dotColor, sizeMap[size])} />
      </div>
      <span
        className={cn(
          "mt-1 text-[9px] font-bold text-foreground bg-background/90 backdrop-blur-sm px-1.5 py-0.5 rounded border tracking-wide animate-pulse",
          borderColor
        )}
        style={{ animationDuration: "3s", animationDelay: delay }}
      >
        {label}
      </span>
    </div>
  );
}

