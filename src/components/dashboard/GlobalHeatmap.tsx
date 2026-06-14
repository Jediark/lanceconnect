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
        "relative overflow-hidden rounded-2xl flex flex-col justify-between select-none",
        className,
      )}
      style={{
        background: "#0B1220",
        border: "1px solid rgba(45,108,255,0.18)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
        padding: "20px",
      }}
    >
      <style>{`
        @keyframes softPulseBlue {
          0%   { transform: scale(0.95); opacity: 0.85; box-shadow: 0 0 0 0 rgba(45, 108, 255, 0.65); }
          70%  { transform: scale(1.18); opacity: 1;    box-shadow: 0 0 0 9px rgba(45, 108, 255, 0); }
          100% { transform: scale(0.95); opacity: 0.85; box-shadow: 0 0 0 0 rgba(45, 108, 255, 0); }
        }
        @keyframes softPulseGreen {
          0%   { transform: scale(0.95); opacity: 0.85; box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.65); }
          70%  { transform: scale(1.18); opacity: 1;    box-shadow: 0 0 0 9px rgba(34, 197, 94, 0); }
          100% { transform: scale(0.95); opacity: 0.85; box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
        }
        @keyframes softPulseAmber {
          0%   { transform: scale(0.95); opacity: 0.85; box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.65); }
          70%  { transform: scale(1.18); opacity: 1;    box-shadow: 0 0 0 9px rgba(245, 158, 11, 0); }
          100% { transform: scale(0.95); opacity: 0.85; box-shadow: 0 0 0 0 rgba(245, 158, 11, 0); }
        }
        @keyframes markerBounce {
          0%   { transform: translateY(-40px) scale(0.4); opacity: 0; }
          60%  { transform: translateY(8px) scale(1.15);  opacity: 1; }
          80%  { transform: translateY(-4px) scale(0.95); }
          100% { transform: translateY(0) scale(1); }
        }
        .pulse-blue   { animation: softPulseBlue  2.2s infinite ease-in-out; }
        .pulse-green  { animation: softPulseGreen 2.2s infinite ease-in-out; }
        .pulse-amber  { animation: softPulseAmber 2.2s infinite ease-in-out; }
        .marker-drop  { animation: markerBounce 0.7s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
        .lc-heatmap-reset:focus-visible { outline: 2px solid #2D6CFF; outline-offset: 2px; }
        .lc-filter-btn:focus-visible    { outline: 2px solid #2D6CFF; outline-offset: 3px; border-radius: 4px; }
        .lc-dropdown-btn:focus-visible  { outline: 2px solid #2D6CFF; outline-offset: 2px; }
        .lc-region-row:focus-visible    { outline: 2px solid #2D6CFF; outline-offset: -2px; background: rgba(45,108,255,0.15); }
        .lc-view-leads:focus-visible    { outline: 2px solid #2D6CFF; outline-offset: 2px; }
      `}</style>

      {/* ── Header ───────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between z-10">
        <div>
          <h4
            className="text-sm font-bold mb-0.5 flex items-center gap-1.5"
            style={{ color: "#E5E7EB", fontFamily: "Inter, ui-sans-serif, sans-serif" }}
          >
            🗺️ Pipeline Global Heatmap
          </h4>
          <p
            className="text-[11px]"
            style={{ color: "#9CA3AF", fontFamily: "Inter, ui-sans-serif, sans-serif" }}
          >
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
            className="lc-heatmap-reset flex items-center gap-1 rounded-lg px-2.5 py-1 text-[10px] font-bold transition-all duration-150 ease-out cursor-pointer"
            style={{
              background: "#101B30",
              border: "1px solid rgba(45,108,255,0.35)",
              color: "#E5E7EB",
              boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
            }}
            title="Reset Map View"
            aria-label="Reset map zoom and pan"
          >
            <RefreshCw className="h-3 w-3" aria-hidden="true" /> Reset
          </button>
        )}
      </div>

      {/* ── Viewport (drag/wheel zoom) ────────────────────────────────── */}
      <div
        id="heatmap-viewport"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        aria-label="Interactive world map — scroll to zoom, drag to pan"
        role="application"
        className={cn(
          "relative w-full h-[380px] rounded-xl overflow-hidden mt-3 select-none",
          isDragging ? "cursor-grabbing" : "cursor-grab",
        )}
        style={{
          background: "#060e24",
          border: "1px solid rgba(45,108,255,0.18)",
        }}
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
            <img src="/assets/world-map.svg" alt="" className="w-full h-full object-cover" />
          </div>

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

              // Determine whether to show popover card below the marker (if marker is in top 35% of map)
              const topVal = parseFloat(coords.top);
              const showBelow = topVal < 35;

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
                      if (selectedRegion?.city === reg.city) {
                        setSelectedRegion(null);
                      } else {
                        focusRegion(reg);
                      }
                    }}
                    className={cn(
                      "h-3 w-3 rounded-full border-2 cursor-pointer transition duration-300 transform hover:scale-130 active:scale-95",
                      colorMap[status],
                    )}
                  />

                  {/* Inline Info Card — backdrop blur, navy bg, branded border */}
                  {selectedRegion && selectedRegion.city === reg.city && (
                    <div
                      className={cn(
                        "info-card absolute left-1/2 -translate-x-1/2 w-54 pointer-events-auto text-left z-40",
                        "animate-in fade-in zoom-in-95 duration-200",
                        showBelow ? "top-6 mt-2" : "bottom-6 mb-2",
                      )}
                      style={{
                        width: "210px",
                        background: "rgba(11,18,32,0.92)",
                        backdropFilter: "blur(10px)",
                        WebkitBackdropFilter: "blur(10px)",
                        border: "1px solid rgba(45,108,255,0.28)",
                        borderRadius: "14px",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.45), 0 0 0 1px rgba(45,108,255,0.1)",
                        padding: "14px",
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* Card header */}
                      <div
                        className="flex items-center justify-between pb-1.5 mb-2"
                        style={{ borderBottom: "1px solid rgba(45,108,255,0.18)" }}
                      >
                        <span
                          className="text-[11px] font-bold truncate max-w-[130px] flex items-center gap-1"
                          style={{ color: "#E5E7EB", fontFamily: "Inter, ui-sans-serif, sans-serif" }}
                        >
                          <MapPin className="h-3 w-3 flex-shrink-0" style={{ color: "#2D6CFF" }} aria-hidden="true" />
                          {reg.city}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedRegion(null);
                          }}
                          aria-label={`Close details for ${reg.city}`}
                          className="lc-heatmap-reset text-[10px] h-4 w-4 rounded-full flex items-center justify-center transition-all duration-150 ease-out"
                          style={{
                            color: "#9CA3AF",
                            background: "rgba(45,108,255,0.1)",
                            border: "1px solid rgba(45,108,255,0.2)",
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.color = "#E5E7EB";
                            e.currentTarget.style.background = "rgba(45,108,255,0.25)";
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.color = "#9CA3AF";
                            e.currentTarget.style.background = "rgba(45,108,255,0.1)";
                          }}
                        >
                          ✕
                        </button>
                      </div>

                      {/* Stats rows */}
                      <div
                        className="space-y-1.5 text-[10px] font-mono"
                        style={{ color: "#9CA3AF" }}
                      >
                        <div className="flex justify-between">
                          <span>Saved Leads:</span>
                          <span className="font-bold" style={{ color: "#22C55E" }}>{reg.savedLeads || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Active Searches:</span>
                          <span className="font-bold" style={{ color: "#2D6CFF" }}>{reg.activeSearches || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Top Skill:</span>
                          <span className="font-bold truncate max-w-[90px]" style={{ color: "#F59E0B" }}>
                            {getCategoryLabel(reg.topCategory || "web_dev")}
                          </span>
                        </div>
                      </div>

                      {/* View Leads CTA */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onViewLeads) {
                            onViewLeads(reg.city, reg.country, reg.topCategory || "web_dev");
                          }
                          setSelectedRegion(null);
                        }}
                        aria-label={`View leads for ${reg.city}`}
                        className="lc-view-leads mt-3 w-full font-bold py-1.5 px-2 rounded-lg text-[10px] text-center transition-all duration-150 ease-out cursor-pointer"
                        style={{
                          background: "#2D6CFF",
                          color: "#ffffff",
                          boxShadow: "0 2px 10px rgba(45,108,255,0.4)",
                        }}
                        onMouseOver={(e) => { e.currentTarget.style.background = "#3d7aff"; e.currentTarget.style.boxShadow = "0 2px 14px rgba(45,108,255,0.6)"; }}
                        onMouseOut={(e) => { e.currentTarget.style.background = "#2D6CFF"; e.currentTarget.style.boxShadow = "0 2px 10px rgba(45,108,255,0.4)"; }}
                      >
                        View Leads
                      </button>

                      {/* Directional arrow */}
                      <div
                        className={cn(
                          "absolute left-1/2 -translate-x-1/2 w-2.5 h-2.5 rotate-45",
                          showBelow ? "top-[-6px]" : "bottom-[-6px]",
                        )}
                        style={{
                          background: "rgba(11,18,32,0.92)",
                          border: showBelow
                            ? "1px solid rgba(45,108,255,0.28) transparent transparent rgba(45,108,255,0.28)"
                            : "transparent rgba(45,108,255,0.28) rgba(45,108,255,0.28) transparent",
                          borderTop: showBelow ? "1px solid rgba(45,108,255,0.28)" : "none",
                          borderLeft: showBelow ? "1px solid rgba(45,108,255,0.28)" : "none",
                          borderRight: showBelow ? "none" : "1px solid rgba(45,108,255,0.28)",
                          borderBottom: showBelow ? "none" : "1px solid rgba(45,108,255,0.28)",
                        }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      </div>

      {/* ── Footer controls ─────────────────────────────────────────────── */}
      <div className="mt-4 flex flex-col md:flex-row md:items-center justify-between gap-4 select-none z-30">
        {/* Region dropdown badge */}
        <div ref={dropdownRef} className="relative inline-block text-left pointer-events-auto">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            aria-haspopup="listbox"
            aria-expanded={dropdownOpen}
            aria-label="Select region to focus"
            className="lc-dropdown-btn inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-bold transition-all duration-150 ease-out cursor-pointer"
            style={{
              background: "#101B30",
              border: "1px solid rgba(45,108,255,0.3)",
              color: "#E5E7EB",
              fontFamily: "Inter, ui-sans-serif, sans-serif",
            }}
            onMouseOver={(e) => { e.currentTarget.style.borderColor = "rgba(45,108,255,0.65)"; }}
            onMouseOut={(e) => { e.currentTarget.style.borderColor = "rgba(45,108,255,0.3)"; }}
          >
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22C55E] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#22C55E]" />
            </span>
            {uniqueRegions.length} Regions
            <ChevronDown
              className={cn("h-3 w-3 transition-transform duration-200", dropdownOpen ? "rotate-180" : "")}
              style={{ color: "#9CA3AF" }}
              aria-hidden="true"
            />
          </button>

          {/* Regions focus list */}
          {dropdownOpen && (
            <div
              role="listbox"
              aria-label="Regions to focus"
              className="region-dropdown absolute bottom-11 left-0 w-56 rounded-xl overflow-hidden text-left pointer-events-auto max-h-48 overflow-y-auto animate-in slide-in-from-bottom-2 duration-150 z-40"
              style={{
                background: "rgba(11,18,32,0.96)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                border: "1px solid rgba(45,108,255,0.25)",
                boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
              }}
            >
              <div
                className="text-[10px] font-bold px-3 py-2"
                style={{
                  color: "#9CA3AF",
                  background: "#101B30",
                  borderBottom: "1px solid rgba(45,108,255,0.18)",
                  fontFamily: "Inter, ui-sans-serif, sans-serif",
                }}
              >
                Pan &amp; Focus Region:
              </div>
              {uniqueRegions.map((reg) => (
                <button
                  key={`${reg.city}-${reg.country}`}
                  onClick={() => focusRegion(reg)}
                  role="option"
                  aria-label={`Focus on ${reg.city}, ${reg.savedLeads || 0} leads`}
                  className="lc-region-row w-full text-left px-3 py-2 text-xs border-b flex items-center justify-between cursor-pointer transition-all duration-150 ease-out"
                  style={{
                    color: "#E5E7EB",
                    borderColor: "rgba(45,108,255,0.1)",
                    fontFamily: "Inter, ui-sans-serif, sans-serif",
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.background = "rgba(45,108,255,0.18)"; }}
                  onMouseOut={(e) => { e.currentTarget.style.background = "transparent"; }}
                >
                  <span className="truncate max-w-[140px] font-medium">📍 {reg.city}</span>
                  <span
                    className="text-[9px] px-1.5 py-0.5 rounded font-mono"
                    style={{
                      background: "rgba(45,108,255,0.12)",
                      border: "1px solid rgba(45,108,255,0.2)",
                      color: "#9CA3AF",
                    }}
                  >
                    {reg.savedLeads || 0} leads
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Legend / Status filters */}
        <div
          className="flex flex-wrap gap-x-4 gap-y-2 pointer-events-auto"
          role="group"
          aria-label="Filter markers by status"
        >
          <button
            onClick={() => toggleStatusFilter("active")}
            aria-label={`Toggle Active Searches filter, currently ${visibleStatuses.active ? "on" : "off"}`}
            aria-pressed={visibleStatuses.active}
            className="lc-filter-btn flex items-center gap-1.5 text-[11px] font-semibold transition-all duration-150 ease-out cursor-pointer"
            style={{
              color: visibleStatuses.active ? "#E5E7EB" : "#4B5563",
              textDecoration: visibleStatuses.active ? "none" : "line-through",
              fontFamily: "Inter, ui-sans-serif, sans-serif",
            }}
          >
            <span
              className="h-2 w-2 rounded-full bg-[#2D6CFF]"
              style={{ boxShadow: visibleStatuses.active ? "0 0 8px #2D6CFF" : "none" }}
              aria-hidden="true"
            />
            Active Searches ({uniqueRegions.filter((r) => r.status === "active").length})
          </button>

          <button
            onClick={() => toggleStatusFilter("saved")}
            aria-label={`Toggle Saved Leads filter, currently ${visibleStatuses.saved ? "on" : "off"}`}
            aria-pressed={visibleStatuses.saved}
            className="lc-filter-btn flex items-center gap-1.5 text-[11px] font-semibold transition-all duration-150 ease-out cursor-pointer"
            style={{
              color: visibleStatuses.saved ? "#E5E7EB" : "#4B5563",
              textDecoration: visibleStatuses.saved ? "none" : "line-through",
              fontFamily: "Inter, ui-sans-serif, sans-serif",
            }}
          >
            <span
              className="h-2 w-2 rounded-full bg-[#22C55E]"
              style={{ boxShadow: visibleStatuses.saved ? "0 0 8px #22C55E" : "none" }}
              aria-hidden="true"
            />
            Saved Leads ({uniqueRegions.filter((r) => r.status === "saved").length})
          </button>

          <button
            onClick={() => toggleStatusFilter("contacted")}
            aria-label={`Toggle Contacted filter, currently ${visibleStatuses.contacted ? "on" : "off"}`}
            aria-pressed={visibleStatuses.contacted}
            className="lc-filter-btn flex items-center gap-1.5 text-[11px] font-semibold transition-all duration-150 ease-out cursor-pointer"
            style={{
              color: visibleStatuses.contacted ? "#E5E7EB" : "#4B5563",
              textDecoration: visibleStatuses.contacted ? "none" : "line-through",
              fontFamily: "Inter, ui-sans-serif, sans-serif",
            }}
          >
            <span
              className="h-2 w-2 rounded-full bg-[#F59E0B]"
              style={{ boxShadow: visibleStatuses.contacted ? "0 0 8px #F59E0B" : "none" }}
              aria-hidden="true"
            />
            Contacted ({uniqueRegions.filter((r) => r.status === "contacted").length})
          </button>
        </div>
      </div>
    </div>
  );
}
