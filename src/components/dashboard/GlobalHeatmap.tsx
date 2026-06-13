import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { RefreshCw, MapPin, ChevronDown } from "lucide-react";

export type RegionItem = {
  city: string;
  country: string;
  lat?: number;
  lng?: number; // (lon)
  savedLeads?: number;
  activeSearches?: number;
  topCategory?: string;
  status?: "active" | "saved" | "contacted";
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
  seattle: { lat: 47.6062, lon: -122.3321 },
  accra: { lat: 5.6037, lon: -0.187 },
  houston: { lat: 29.7604, lon: -95.3698 },
  abuja: { lat: 9.0765, lon: 7.3986 },
  edinburgh: { lat: 55.9533, lon: -3.1883 },
};

function convertLatLngToPercent(lat: number, lon: number) {
  // Longitudinal linear mapping for equirectangular projection
  const left = ((lon + 180) / 360) * 100;
  // Latitudinal linear mapping (higher latitude = closer to top of map)
  const top = ((90 - lat) / 180) * 100;

  return {
    top: `${Math.max(2, Math.min(98, top)).toFixed(2)}%`,
    left: `${Math.max(2, Math.min(98, left)).toFixed(2)}%`,
  };
}

const getCategoryLabel = (id: string) => {
  const map: Record<string, string> = {
    web_dev: "💻 Web Dev",
    designer: "🎨 Design",
    copywriter: "✍️ Copywriting",
    seo: "📈 SEO",
    social_media: "📱 Socials",
    video: "🎥 Video",
    photography: "📸 Photos",
    marketing: "📣 Marketing",
    app_dev: "📲 App Dev",
    va: "🤝 Assistant",
    tutor: "🎓 Tutor",
    personal_trainer: "💪 Fitness",
    landscaping: "🌿 Landscape",
    hairstylist: "✂️ Hairstylist",
    makeup_artist: "💄 Makeup",
    voiceover: "🎙️ Voiceover",
    accounting: "📊 Finance",
    handyman: "🔧 Handyman",
    wedding_planner: "💍 Wedding",
    massage_therapist: "💆 Massage",
    music_teacher: "🎵 Music",
    pet_care: "🐾 Pet Care",
    house_cleaning: "🧹 Cleaning",
  };
  return map[id] || id;
};

export function GlobalHeatmap({
  regions = [],
  className,
  onViewLeads,
}: {
  regions?: RegionItem[];
  className?: string;
  onViewLeads?: (city: string, country: string, category: string) => void;
}) {
  const [resolvedCoords, setResolvedCoords] = useState<
    Record<string, { lat: number; lon: number }>
  >({});
  const [selectedRegion, setSelectedRegion] = useState<RegionItem | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [newCityKey, setNewCityKey] = useState<string | null>(null);
  const prevRegionsRef = useRef<string[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Zoom & Pan states
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  // Mobile Pinch states
  const [touchStartDist, setTouchStartDist] = useState(0);
  const [touchStartZoom, setTouchStartZoom] = useState(1);

  // Legend / Filter state
  const [visibleStatuses, setVisibleStatuses] = useState<Record<string, boolean>>({
    active: true,
    saved: true,
    contacted: true,
  });

  useEffect(() => {
    // Load cache from localStorage
    try {
      const cached = localStorage.getItem("lanceconnect_geo_cache");
      if (cached) {
        setResolvedCoords(JSON.parse(cached));
      }
    } catch (e) {
      console.error("Failed to load geo cache", e);
    }
  }, []);

  // Filter out invalid/empty entries and deduplicate
  const validRegions = regions.filter((r) => r.city && r.city.trim() !== "");
  const uniqueRegions = Array.from(
    new Map(
      validRegions.map((item) => [
        `${item.city.toLowerCase()}-${item.country.toLowerCase()}`,
        item,
      ]),
    ).values(),
  );

  // Animate new markers dropping in
  useEffect(() => {
    const prevKeys = prevRegionsRef.current;
    const currentKeys = uniqueRegions.map(
      (r) => `${r.city.toLowerCase()}-${r.country.toLowerCase()}`,
    );

    const added = currentKeys.find((k) => !prevKeys.includes(k));
    if (added && prevKeys.length > 0) {
      setNewCityKey(added);
      setTimeout(() => setNewCityKey(null), 3000);
    }
    prevRegionsRef.current = currentKeys;
  }, [uniqueRegions]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // Dynamic geocoding effect for unmapped cities
  useEffect(() => {
    const fetchCoords = async () => {
      let updated = false;
      const newCoords = { ...resolvedCoords };

      for (const reg of uniqueRegions) {
        const cityNameOnly = reg.city.split(",")[0].trim();
        const key = cityNameOnly.toLowerCase().replace(/[^a-z]/g, "");

        // Skip if already in database or cache or has custom coords
        if (CITY_DB[key] || resolvedCoords[key] || (reg.lat && reg.lng)) {
          continue;
        }

        try {
          await new Promise((resolve) => setTimeout(resolve, 1000)); // Rate limiting

          const query = `${cityNameOnly}, ${reg.country}`;
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`,
            {
              headers: {
                "User-Agent": "LanceConnect-Dashboard-Heatmap/1.0",
              },
            },
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
  }, [uniqueRegions, resolvedCoords]);

  // Scroll to Zoom wheel handler
  useEffect(() => {
    const container = document.getElementById("heatmap-viewport");
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault(); // Prevent full page scroll

      const rect = container.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const zoomFactor = 1.15;
      const nextZoom =
        e.deltaY < 0 ? Math.min(6, zoom * zoomFactor) : Math.max(1, zoom / zoomFactor);

      if (nextZoom === zoom) return;

      const mapX = (mouseX - pan.x) / zoom;
      const mapY = (mouseY - pan.y) / zoom;

      const newPanX = mouseX - mapX * nextZoom;
      const newPanY = mouseY - mapY * nextZoom;

      const W = container.offsetWidth;
      const H = container.offsetHeight;
      const minX = W * (1 - nextZoom);
      const maxX = 0;
      const minY = H * (1 - nextZoom);
      const maxY = 0;

      setZoom(nextZoom);
      setPan({
        x: Math.max(minX, Math.min(maxX, newPanX)),
        y: Math.max(minY, Math.min(maxY, newPanY)),
      });
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      container.removeEventListener("wheel", handleWheel);
    };
  }, [zoom, pan]);

  // Mouse Pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left click

    const target = e.target as HTMLElement;
    if (
      target.closest("button") ||
      target.closest(".info-card") ||
      target.closest(".region-dropdown")
    ) {
      return;
    }

    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setPanStart({ x: pan.x, y: pan.y });
    e.preventDefault();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;

    const container = document.getElementById("heatmap-viewport");
    if (container) {
      const W = container.offsetWidth;
      const H = container.offsetHeight;

      const minX = W * (1 - zoom);
      const maxX = 0;
      const minY = H * (1 - zoom);
      const maxY = 0;

      setPan({
        x: Math.max(minX, Math.min(maxX, panStart.x + dx)),
        y: Math.max(minY, Math.min(maxY, panStart.y + dy)),
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Mobile Touch Pan / Pinch Zoom handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    const target = e.target as HTMLElement;
    if (
      target.closest("button") ||
      target.closest(".info-card") ||
      target.closest(".region-dropdown")
    ) {
      return;
    }

    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
      setPanStart({ x: pan.x, y: pan.y });
    } else if (e.touches.length === 2) {
      setIsDragging(false);
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY,
      );
      setTouchStartDist(dist);
      setTouchStartZoom(zoom);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && isDragging) {
      const dx = e.touches[0].clientX - dragStart.x;
      const dy = e.touches[0].clientY - dragStart.y;

      const container = document.getElementById("heatmap-viewport");
      if (container) {
        const W = container.offsetWidth;
        const H = container.offsetHeight;
        const minX = W * (1 - zoom);
        const maxX = 0;
        const minY = H * (1 - zoom);
        const maxY = 0;

        setPan({
          x: Math.max(minX, Math.min(maxX, panStart.x + dx)),
          y: Math.max(minY, Math.min(maxY, panStart.y + dy)),
        });
      }
    } else if (e.touches.length === 2 && touchStartDist > 0) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY,
      );
      const scale = dist / touchStartDist;
      const nextZoom = Math.max(1, Math.min(6, touchStartZoom * scale));

      setZoom(nextZoom);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setTouchStartDist(0);
  };

  // Center/focus on a selected dropdown region
  const focusRegion = (reg: RegionItem) => {
    const container = document.getElementById("heatmap-viewport");
    if (!container) return;

    const W = container.offsetWidth;
    const H = container.offsetHeight;

    const cityNameOnly = reg.city.split(",")[0].trim();
    const key = cityNameOnly.toLowerCase().replace(/[^a-z]/g, "");

    let leftPercent = 50;
    let topPercent = 50;

    if (reg.lat && reg.lng) {
      leftPercent = ((reg.lng + 180) / 360) * 100;
      topPercent = ((90 - reg.lat) / 180) * 100;
    } else {
      const dbItem = CITY_DB[key] || resolvedCoords[key];
      if (dbItem) {
        leftPercent = ((dbItem.lon + 180) / 360) * 100;
        topPercent = ((90 - dbItem.lat) / 180) * 100;
      } else {
        let hash = 0;
        for (let i = 0; i < reg.city.length; i++) {
          hash = reg.city.charCodeAt(i) + ((hash << 5) - hash);
        }
        topPercent = Math.abs(Math.sin(hash)) * 50 + 20;
        leftPercent = Math.abs(Math.cos(hash)) * 70 + 15;
      }
    }

    const px = (leftPercent / 100) * W;
    const py = (topPercent / 100) * H;

    const targetZoom = 2.5;
    const targetPanX = W / 2 - px * targetZoom;
    const targetPanY = H / 2 - py * targetZoom;

    const minX = W * (1 - targetZoom);
    const maxX = 0;
    const minY = H * (1 - targetZoom);
    const maxY = 0;

    setZoom(targetZoom);
    setPan({
      x: Math.max(minX, Math.min(maxX, targetPanX)),
      y: Math.max(minY, Math.min(maxY, targetPanY)),
    });

    setSelectedRegion(reg);
    setDropdownOpen(false);
  };

  const toggleStatusFilter = (status: string) => {
    setVisibleStatuses((prev) => ({
      ...prev,
      [status]: !prev[status],
    }));
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border bg-[#020b21] p-5 group flex flex-col justify-between select-none",
        className,
      )}
    >
      <style>{`
        @keyframes softPulseBlue {
          0% { transform: scale(0.95); opacity: 0.85; box-shadow: 0 0 0 0 rgba(45, 108, 255, 0.6); }
          70% { transform: scale(1.15); opacity: 1; box-shadow: 0 0 0 8px rgba(45, 108, 255, 0); }
          100% { transform: scale(0.95); opacity: 0.85; box-shadow: 0 0 0 0 rgba(45, 108, 255, 0); }
        }
        @keyframes softPulseGreen {
          0% { transform: scale(0.95); opacity: 0.85; box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.6); }
          70% { transform: scale(1.15); opacity: 1; box-shadow: 0 0 0 8px rgba(34, 197, 94, 0); }
          100% { transform: scale(0.95); opacity: 0.85; box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
        }
        @keyframes softPulseAmber {
          0% { transform: scale(0.95); opacity: 0.85; box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.6); }
          70% { transform: scale(1.15); opacity: 1; box-shadow: 0 0 0 8px rgba(245, 158, 11, 0); }
          100% { transform: scale(0.95); opacity: 0.85; box-shadow: 0 0 0 0 rgba(245, 158, 11, 0); }
        }
        @keyframes markerBounce {
          0% { transform: translateY(-40px) scale(0.4); opacity: 0; }
          60% { transform: translateY(8px) scale(1.15); opacity: 1; }
          80% { transform: translateY(-4px) scale(0.95); }
          100% { transform: translateY(0) scale(1); }
        }
        .pulse-blue {
          animation: softPulseBlue 2s infinite ease-in-out;
        }
        .pulse-green {
          animation: softPulseGreen 2s infinite ease-in-out;
        }
        .pulse-amber {
          animation: softPulseAmber 2s infinite ease-in-out;
        }
        .marker-drop {
          animation: markerBounce 0.7s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
      `}</style>

      {/* Header Info */}
      <div className="flex items-start justify-between z-10">
        <div>
          <h4 className="text-sm font-bold text-white mb-0.5 flex items-center gap-1.5">
            🗺️ Pipeline Global Heatmap
          </h4>
          <p className="text-[11px] text-slate-400">
            Click markers or select from active searches to inspect local prospect volume
          </p>
        </div>

        {/* Reset View Button */}
        {(zoom > 1 || pan.x !== 0 || pan.y !== 0) && (
          <button
            onClick={() => {
              setZoom(1);
              setPan({ x: 0, y: 0 });
              setSelectedRegion(null);
            }}
            className="bg-slate-900/90 border border-slate-700 hover:border-slate-500 text-white rounded-lg px-2.5 py-1 text-[10px] font-bold shadow-md transition pointer-events-auto flex items-center gap-1 cursor-pointer"
            title="Reset Map View"
          >
            <RefreshCw className="h-3 w-3" /> Reset
          </button>
        )}
      </div>

      {/* Viewport View (Drag and Wheel zoom boundaries) */}
      <div
        id="heatmap-viewport"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={cn(
          "relative w-full h-[220px] rounded-xl overflow-hidden mt-3 border border-slate-800/40 bg-[#060e24] select-none",
          isDragging ? "cursor-grabbing" : "cursor-grab",
        )}
      >
        {/* Faint dot-pattern grid overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

        {/* Dynamic Zoom & Pan Wrapper */}
        <div
          className="w-full h-full relative origin-top-left transition-transform duration-100 ease-out"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          }}
        >
          {/* Refined Vector Map Background */}
          <div className="absolute inset-0 opacity-45 select-none pointer-events-none">
            <img src="/assets/world-map.svg" alt="" className="w-full h-full object-fill" />
          </div>

          {/* Dynamic Map Nodes */}
          {uniqueRegions
            .filter((reg) => visibleStatuses[reg.status || "saved"])
            .map((reg) => {
              const cityNameOnly = reg.city.split(",")[0].trim();
              const key = cityNameOnly.toLowerCase().replace(/[^a-z]/g, "");

              let coords;
              if (reg.lat && reg.lng) {
                coords = convertLatLngToPercent(reg.lat, reg.lng);
              } else {
                const dbItem = CITY_DB[key] || resolvedCoords[key];
                if (dbItem) {
                  coords = convertLatLngToPercent(dbItem.lat, dbItem.lon);
                } else {
                  let hash = 0;
                  for (let i = 0; i < reg.city.length; i++) {
                    hash = reg.city.charCodeAt(i) + ((hash << 5) - hash);
                  }
                  const seedTop = Math.abs(Math.sin(hash)) * 50 + 20;
                  const seedLeft = Math.abs(Math.cos(hash)) * 70 + 15;
                  coords = { top: `${seedTop.toFixed(1)}%`, left: `${seedLeft.toFixed(1)}%` };
                }
              }

              const status = reg.status || "saved";
              const isNewlyAdded =
                newCityKey === `${reg.city.toLowerCase()}-${reg.country.toLowerCase()}`;

              // Color configs
              const colorMap = {
                active:
                  "bg-blue-500 border-blue-400/80 pulse-blue shadow-[0_0_12px_rgba(45,108,255,0.7)]",
                saved:
                  "bg-emerald-500 border-emerald-400/80 pulse-green shadow-[0_0_12px_rgba(34,197,94,0.7)]",
                contacted:
                  "bg-amber-500 border-amber-400/80 pulse-amber shadow-[0_0_12px_rgba(245,158,11,0.7)]",
              };

              return (
                <div
                  key={`${reg.city}-${status}`}
                  className={cn(
                    "absolute flex flex-col items-center z-25 group/marker",
                    isNewlyAdded ? "marker-drop" : "",
                  )}
                  style={{ top: coords.top, left: coords.left }}
                >
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedRegion(selectedRegion?.city === reg.city ? null : reg);
                    }}
                    className={cn(
                      "h-3 w-3 rounded-full border-2 cursor-pointer transition duration-300 transform hover:scale-130 active:scale-95",
                      colorMap[status],
                    )}
                  />

                  {/* Inline Info Card */}
                  {selectedRegion && selectedRegion.city === reg.city && (
                    <div
                      className="absolute bottom-6 left-1/2 -translate-x-1/2 mb-2 w-52 bg-slate-955 border border-slate-700/60 p-3.5 rounded-xl shadow-2xl z-40 pointer-events-auto text-left animate-in fade-in zoom-in-95 duration-200"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 mb-2">
                        <span className="text-[11px] font-bold text-white truncate max-w-[130px] flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-cyan-400 shrink-0" />
                          {reg.city}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedRegion(null);
                          }}
                          className="text-slate-400 hover:text-white text-[10px] bg-slate-800 hover:bg-slate-700 h-4 w-4 rounded-full flex items-center justify-center transition"
                        >
                          ✕
                        </button>
                      </div>

                      <div className="space-y-1.5 text-[10px] text-slate-300 font-mono">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Saved Leads:</span>
                          <span className="text-emerald-400 font-bold">{reg.savedLeads || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Active Searches:</span>
                          <span className="text-blue-400 font-bold">{reg.activeSearches || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Top Skill:</span>
                          <span className="text-amber-400 font-bold truncate max-w-[90px]">
                            {getCategoryLabel(reg.topCategory || "web_dev")}
                          </span>
                        </div>
                      </div>

                      {/* View Leads Action Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onViewLeads) {
                            onViewLeads(reg.city, reg.country, reg.topCategory || "web_dev");
                          }
                          setSelectedRegion(null);
                        }}
                        className="mt-3 w-full bg-[#2D6CFF] hover:bg-[#2D6CFF]/90 text-white font-bold py-1.5 px-2 rounded-lg text-[10px] text-center transition shadow-lg cursor-pointer"
                      >
                        View Leads
                      </button>

                      {/* Small Down pointing Arrow */}
                      <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-slate-950 border-r border-b border-slate-700/60 rotate-45" />
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      </div>

      {/* Footer controls: Dropdown badge + Legend filters */}
      <div className="mt-4 flex flex-col md:flex-row md:items-center justify-between gap-4 select-none z-30">
        {/* Dropdown Badge */}
        <div ref={dropdownRef} className="relative inline-block text-left pointer-events-auto">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 px-3 py-1.5 text-[11px] font-bold text-slate-200 transition cursor-pointer"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            {uniqueRegions.length} Regions
            <ChevronDown
              className={cn("h-3 w-3 text-slate-400 transition", dropdownOpen ? "rotate-180" : "")}
            />
          </button>

          {/* Regions focus list dropdown */}
          {dropdownOpen && (
            <div className="absolute bottom-11 left-0 w-56 bg-slate-955 border border-slate-700/60 rounded-xl shadow-2xl z-40 overflow-hidden text-left pointer-events-auto max-h-48 overflow-y-auto animate-in slide-in-from-bottom-2 duration-150">
              <div className="text-[10px] font-bold text-slate-400 bg-slate-900 px-3 py-2 border-b border-slate-850">
                Pan & Focus Region:
              </div>
              {uniqueRegions.map((reg) => (
                <button
                  key={`${reg.city}-${reg.country}`}
                  onClick={() => focusRegion(reg)}
                  className="w-full text-left px-3 py-2 text-xs text-slate-350 hover:bg-[#2D6CFF]/20 hover:text-white border-b border-slate-800/40 transition flex items-center justify-between cursor-pointer"
                >
                  <span className="truncate max-w-[140px] font-medium">📍 {reg.city}</span>
                  <span className="text-[9px] bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800/50 text-slate-400 font-mono">
                    {reg.savedLeads || 0} leads
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Legend filters */}
        <div className="flex flex-wrap gap-x-4 gap-y-2 pointer-events-auto">
          <button
            onClick={() => toggleStatusFilter("active")}
            className={cn(
              "flex items-center gap-1.5 text-[11px] font-semibold transition cursor-pointer",
              visibleStatuses.active ? "text-slate-200" : "text-slate-500 line-through",
            )}
          >
            <span className="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_8px_#2d6cff]" />
            Active Searches ({uniqueRegions.filter((r) => r.status === "active").length})
          </button>

          <button
            onClick={() => toggleStatusFilter("saved")}
            className={cn(
              "flex items-center gap-1.5 text-[11px] font-semibold transition cursor-pointer",
              visibleStatuses.saved ? "text-slate-200" : "text-slate-500 line-through",
            )}
          >
            <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#22c55e]" />
            Saved Leads ({uniqueRegions.filter((r) => r.status === "saved").length})
          </button>

          <button
            onClick={() => toggleStatusFilter("contacted")}
            className={cn(
              "flex items-center gap-1.5 text-[11px] font-semibold transition cursor-pointer",
              visibleStatuses.contacted ? "text-slate-200" : "text-slate-500 line-through",
            )}
          >
            <span className="h-2 w-2 rounded-full bg-amber-500 shadow-[0_0_8px_#f59e0b]" />
            Contacted ({uniqueRegions.filter((r) => r.status === "contacted").length})
          </button>
        </div>
      </div>
    </div>
  );
}
