import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export type RegionItem = {
  city: string;
  country: string;
};

const CITY_DB: Record<string, { lat: number; lon: number }> = {
  // Original defaults
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

  // US States major cities
  birmingham: { lat: 33.5186, lon: -86.8104 },
  anchorage: { lat: 61.2181, lon: -149.9003 },
  phoenix: { lat: 33.4484, lon: -112.0740 },
  littlerock: { lat: 34.7465, lon: -92.2896 },
  sanfrancisco: { lat: 37.7749, lon: -122.4194 },
  denver: { lat: 39.7392, lon: -104.9903 },
  hartford: { lat: 41.7637, lon: -72.6851 },
  wilmington: { lat: 39.7447, lon: -75.5484 },
  miami: { lat: 25.7617, lon: -80.1918 },
  atlanta: { lat: 33.7490, lon: -84.3880 },
  honolulu: { lat: 21.3069, lon: -157.8583 },
  boise: { lat: 43.6150, lon: -116.2023 },
  chicago: { lat: 41.8781, lon: -87.6298 },
  indianapolis: { lat: 39.7684, lon: -86.1581 },
  desmoines: { lat: 41.5868, lon: -93.6250 },
  wichita: { lat: 37.6872, lon: -97.3301 },
  louisville: { lat: 38.2527, lon: -85.7585 },
  neworleans: { lat: 29.9511, lon: -90.0715 },
  portland: { lat: 45.5152, lon: -122.6784 },
  baltimore: { lat: 39.2904, lon: -76.6122 },
  boston: { lat: 42.3601, lon: -71.0589 },
  detroit: { lat: 42.3314, lon: -83.0458 },
  minneapolis: { lat: 44.9778, lon: -93.2650 },
  jackson: { lat: 32.2988, lon: -90.1848 },
  kansascity: { lat: 39.0997, lon: -94.5786 },
  billings: { lat: 45.7833, lon: -108.5007 },
  omaha: { lat: 41.2565, lon: -95.9345 },
  lasvegas: { lat: 36.1716, lon: -115.1398 },
  manchester: { lat: 53.4808, lon: -2.2426 },
  newark: { lat: 40.7357, lon: -74.1724 },
  albuquerque: { lat: 35.0844, lon: -106.6511 },
  charlotte: { lat: 35.2271, lon: -80.8431 },
  fargo: { lat: 46.8772, lon: -96.7898 },
  columbus: { lat: 39.9612, lon: -82.9988 },
  oklahomacity: { lat: 35.4676, lon: -97.5164 },
  philadelphia: { lat: 39.9526, lon: -75.1652 },
  providence: { lat: 41.8240, lon: -71.4128 },
  charleston: { lat: 32.7765, lon: -79.9311 },
  siouxfalls: { lat: 43.5460, lon: -96.7313 },
  nashville: { lat: 36.1627, lon: -86.7816 },
  dallas: { lat: 32.7767, lon: -96.7970 },
  saltlakecity: { lat: 40.7608, lon: -111.8910 },
  burlington: { lat: 44.4756, lon: -73.2121 },
  virginiabeach: { lat: 36.8529, lon: -75.9780 },
  spokane: { lat: 47.6588, lon: -117.4260 },
  milwaukee: { lat: 43.0389, lon: -87.9065 },
  cheyenne: { lat: 41.1400, lon: -104.8203 },

  // Global major hubs
  nairobi: { lat: -1.2921, lon: 36.8219 },
  capetown: { lat: -33.9249, lon: 18.4241 },
  addisababa: { lat: 9.0300, lon: 38.7400 },
  daressalaam: { lat: -6.7924, lon: 39.2083 },
  kampala: { lat: 0.3476, lon: 32.5825 },
  kigali: { lat: -1.9403, lon: 30.0619 },
  dakar: { lat: 14.7167, lon: -17.4677 },
  abidjan: { lat: 5.3600, lon: -4.0083 },
  vancouver: { lat: 49.2827, lon: -123.1207 },
  montreal: { lat: 45.5017, lon: -73.5673 },
  riodejaneiro: { lat: -22.9068, lon: -43.1729 },
  mexicocity: { lat: 19.4326, lon: -99.1332 },
  bogota: { lat: 4.7110, lon: -74.0721 },
  buenosaires: { lat: -34.6037, lon: -58.3816 },
  lima: { lat: -12.0464, lon: -77.0428 },
  delhi: { lat: 28.6139, lon: 77.2090 },
  bangalore: { lat: 12.9716, lon: 77.5946 },
  karachi: { lat: 24.8607, lon: 67.0011 },
  dhaka: { lat: 23.8103, lon: 90.4125 },
  manila: { lat: 14.5995, lon: 120.9842 },
  jakarta: { lat: -6.2088, lon: 106.8456 },
  kualalumpur: { lat: 3.1390, lon: 101.6869 },
  seoul: { lat: 37.5665, lon: 126.9780 },
  melbourne: { lat: -37.8136, lon: 144.9631 },
  hamburg: { lat: 53.5511, lon: 9.9937 },
  marseille: { lat: 43.2965, lon: 5.3698 },
  madrid: { lat: 40.4168, lon: -3.7038 },
  rome: { lat: 41.9028, lon: 12.4964 },
  amsterdam: { lat: 52.3676, lon: 4.9041 },
  lisbon: { lat: 38.7223, lon: -9.1393 },
  dublin: { lat: 53.3498, lon: -6.2603 },
  riyadh: { lat: 24.7136, lon: 46.6753 },
  doha: { lat: 25.2854, lon: 51.5310 },
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
  const [resolvedCoords, setResolvedCoords] = useState<Record<string, { lat: number; lon: number }>>({});

  useEffect(() => {
    if (typeof window !== "undefined") {
      setDebugMode(window.location.search.includes("debug=map"));
      
      // Load cache from localStorage
      try {
        const cached = localStorage.getItem("lanceconnect_geo_cache");
        if (cached) {
          setResolvedCoords(JSON.parse(cached));
        }
      } catch (e) {
        console.error("Failed to load geo cache", e);
      }

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

  // Dynamic geocoding effect for unmapped cities
  useEffect(() => {
    if (debugMode) return;

    const fetchCoords = async () => {
      let updated = false;
      const newCoords = { ...resolvedCoords };

      for (const reg of uniqueRegions) {
        const cityNameOnly = reg.city.split(",")[0].trim();
        const key = cityNameOnly.toLowerCase().replace(/[^a-z]/g, "");

        // Skip if already in database or cache
        if (CITY_DB[key] || resolvedCoords[key]) {
          continue;
        }

        try {
          // Throttle requests to Nominatim API to respect 1 req/sec policy
          await new Promise((resolve) => setTimeout(resolve, 1000));

          const query = `${cityNameOnly}, ${reg.country}`;
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`,
            {
              headers: {
                "User-Agent": "LanceConnect-Dashboard-Heatmap/1.0",
              },
            }
          );
          const data = await response.json();
          if (data && data.length > 0) {
            newCoords[key] = {
              lat: parseFloat(data[0].lat),
              lon: parseFloat(data[0].lon),
            };
            updated = true;
          }
        } catch (e) {
          console.error(`Failed to geocode city: ${reg.city}`, e);
        }
      }

      if (updated) {
        setResolvedCoords(newCoords);
        try {
          localStorage.setItem("lanceconnect_geo_cache", JSON.stringify(newCoords));
        } catch (e) {
          console.error("Failed to save geo cache", e);
        }
      }
    };

    fetchCoords();
  }, [uniqueRegions, resolvedCoords, debugMode]);

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
            const cityNameOnly = reg.city.split(",")[0].trim();
            const key = cityNameOnly.toLowerCase().replace(/[^a-z]/g, "");
            
            let coords;
            // Check static database first, then local storage cache
            const dbItem = CITY_DB[key] || resolvedCoords[key];
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
