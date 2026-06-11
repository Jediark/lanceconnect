import React, { useState } from "react";

// Simplified SVG paths for the 50 US states (viewBox="0 0 959 593")
// Hand-optimized for speed and aesthetic clean outlines
const STATE_MAP_DATA = [
  { id: "AK", name: "Alaska", path: "M 20,480 L 120,480 L 150,560 L 50,560 Z" }, // Stylized inset
  { id: "HI", name: "Hawaii", path: "M 180,520 A 10,10 0 1,1 170,530 Z M 200,540 A 8,8 0 1,1 195,545 Z" }, // Stylized inset
  { id: "AL", name: "Alabama", path: "M 670,410 L 702,406 L 696,488 L 659,484 L 666,410 Z" },
  { id: "AR", name: "Arkansas", path: "M 579,360 L 626,360 L 623,414 L 575,414 Z" },
  { id: "AZ", name: "Arizona", path: "M 200,320 L 260,310 L 245,410 L 185,395 Z" },
  { id: "CA", name: "California", path: "M 120,130 L 154,140 L 140,240 L 200,370 L 184,395 L 120,290 Z" },
  { id: "CO", name: "Colorado", path: "M 320,225 L 398,225 L 398,285 L 320,285 Z" },
  { id: "CT", name: "Connecticut", path: "M 885,182 L 905,182 L 902,197 L 882,197 Z" },
  { id: "DE", name: "Delaware", path: "M 855,235 L 865,235 L 862,250 L 852,250 Z" },
  { id: "FL", name: "Florida", path: "M 700,485 L 750,485 L 795,565 L 775,575 L 725,505 L 695,502 Z" },
  { id: "GA", name: "Georgia", path: "M 702,406 L 745,398 L 748,460 L 710,480 L 696,488 Z" },
  { id: "ID", name: "Idaho", path: "M 185,60 L 210,60 L 212,120 L 255,160 L 250,225 L 180,210 Z" },
  { id: "IL", name: "Illinois", path: "M 605,210 L 642,205 L 638,285 L 602,280 Z" },
  { id: "IN", name: "Indiana", path: "M 645,205 L 675,200 L 670,268 L 638,272 Z" },
  { id: "IA", name: "Iowa", path: "M 525,205 L 595,205 L 595,260 L 525,260 Z" },
  { id: "KS", name: "Kansas", path: "M 405,275 L 505,275 L 505,330 L 405,330 Z" },
  { id: "KY", name: "Kentucky", path: "M 625,282 L 705,272 L 690,320 L 625,320 Z" },
  { id: "LA", name: "Louisiana", path: "M 575,420 L 623,420 L 620,455 L 605,455 L 600,480 L 565,470 Z" },
  { id: "ME", name: "Maine", path: "M 885,60 L 920,80 L 900,150 L 865,130 Z" },
  { id: "MD", name: "Maryland", path: "M 815,225 L 855,225 L 850,242 L 810,242 Z" },
  { id: "MA", name: "Massachusetts", path: "M 865,150 L 915,150 L 910,170 L 860,170 Z" },
  { id: "MI", name: "Michigan", path: "M 620,130 L 680,120 L 685,190 L 642,195 Z M 575,120 L 610,120 L 600,140 L 575,135 Z" },
  { id: "MN", name: "Minnesota", path: "M 495,100 L 560,95 L 565,200 L 500,200 Z" },
  { id: "MS", name: "Mississippi", path: "M 626,412 L 670,410 L 659,484 L 620,480 L 623,415 Z" },
  { id: "MO", name: "Missouri", path: "M 515,270 L 600,270 L 595,350 L 515,340 Z" },
  { id: "MT", name: "Montana", path: "M 215,65 L 395,75 L 385,170 L 212,150 Z" },
  { id: "NE", name: "Nebraska", path: "M 395,200 L 518,205 L 518,265 L 398,260 Z" },
  { id: "NV", name: "Nevada", path: "M 155,140 L 230,155 L 210,305 L 140,240 Z" },
  { id: "NH", name: "New Hampshire", path: "M 870,110 L 890,110 L 880,165 L 860,165 Z" },
  { id: "NJ", name: "New Jersey", path: "M 865,198 L 880,198 L 870,234 L 855,234 Z" },
  { id: "NM", name: "New Mexico", path: "M 262,310 L 332,310 L 322,410 L 247,410 Z" },
  { id: "NY", name: "New York", path: "M 795,145 L 860,135 L 855,195 L 790,195 Z" },
  { id: "NC", name: "North Carolina", path: "M 740,325 L 825,315 L 805,362 L 722,360 Z" },
  { id: "ND", name: "North Dakota", path: "M 396,80 L 492,82 L 492,142 L 387,142 Z" },
  { id: "OH", name: "Ohio", path: "M 682,198 L 730,190 L 725,250 L 672,260 Z" },
  { id: "OK", name: "Oklahoma", path: "M 405,335 L 565,335 L 565,372 L 405,372 Z" },
  { id: "OR", name: "Oregon", path: "M 110,80 L 190,95 L 180,205 L 98,190 Z" },
  { id: "PA", name: "Pennsylvania", path: "M 740,195 L 845,195 L 835,230 L 735,230 Z" },
  { id: "RI", name: "Rhode Island", path: "M 910,175 L 920,175 L 918,190 L 908,190 Z" },
  { id: "SC", name: "South Carolina", path: "M 725,365 L 795,365 L 770,410 L 715,402 Z" },
  { id: "SD", name: "South Dakota", path: "M 390,145 L 495,145 L 495,200 L 392,200 Z" },
  { id: "TN", name: "Tennessee", path: "M 626,350 L 730,340 L 718,382 L 626,382 Z" },
  { id: "TX", name: "Texas", path: "M 334,312 L 402,312 L 402,374 L 562,374 L 562,420 L 492,510 L 422,510 L 372,442 L 324,412 Z" },
  { id: "UT", name: "Utah", path: "M 233,155 L 298,168 L 298,212 L 316,212 L 316,298 L 247,298 Z" },
  { id: "VT", name: "Vermont", path: "M 845,115 L 865,115 L 855,165 L 835,165 Z" },
  { id: "VA", name: "Virginia", path: "M 732,265 L 825,255 L 812,298 L 730,298 Z" },
  { id: "WA", name: "Washington", path: "M 115,35 L 195,50 L 185,100 L 105,85 Z" },
  { id: "WV", name: "West Virginia", path: "M 720,248 L 760,240 L 755,278 L 715,282 Z" },
  { id: "WI", name: "Wisconsin", path: "M 565,130 L 610,125 L 610,200 L 565,200 Z" },
  { id: "WY", name: "Wyoming", path: "M 300,165 L 395,175 L 395,220 L 300,220 Z" }
];

interface InteractiveUSMapProps {
  selectedState: string | null;
  onStateSelect: (stateSlug: string) => void;
  hoveredState: string | null;
  setHoveredState: (state: string | null) => void;
}

export default function InteractiveUSMap({
  selectedState,
  onStateSelect,
  hoveredState,
  setHoveredState
}: InteractiveUSMapProps) {
  return (
    <div className="relative w-full aspect-[960/600] bg-slate-950/40 border border-slate-800/80 rounded-3xl p-4 md:p-6 overflow-hidden backdrop-blur-sm shadow-inner group">
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-dot-pattern opacity-10 pointer-events-none" />

      {/* SVG Map Canvas */}
      <svg
        viewBox="0 0 960 600"
        className="w-full h-full select-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="states">
          {STATE_MAP_DATA.map((state) => {
            const slug = state.name.toLowerCase().replace(/\s+/g, "-");
            const isSelected = selectedState === slug;
            const isHovered = hoveredState === state.name;

            return (
              <g key={state.id} className="cursor-pointer">
                <path
                  d={state.path}
                  fill={
                    isSelected
                      ? "var(--color-indigo-600, #4f46e5)"
                      : isHovered
                      ? "var(--color-indigo-500/20, #6366f133)"
                      : "var(--color-slate-900, #0f172a)"
                  }
                  stroke={
                    isSelected
                      ? "var(--color-indigo-400, #818cf8)"
                      : isHovered
                      ? "var(--color-indigo-500, #6366f1)"
                      : "var(--color-slate-800, #1e293b)"
                  }
                  strokeWidth={isSelected || isHovered ? "2.5" : "1.5"}
                  className="transition-all duration-200"
                  onMouseEnter={() => setHoveredState(state.name)}
                  onMouseLeave={() => setHoveredState(null)}
                  onClick={() => onStateSelect(slug)}
                />
                {/* State Label Text (Centered roughly on path centroids) */}
                <text
                  x={getPathCentroidX(state.id)}
                  y={getPathCentroidY(state.id)}
                  fill={isSelected ? "#ffffff" : isHovered ? "#818cf8" : "#94a3b8"}
                  fontSize="10"
                  fontWeight="bold"
                  textAnchor="middle"
                  className="pointer-events-none select-none transition-colors duration-200 font-mono"
                >
                  {state.id}
                </text>
              </g>
            );
          })}
        </g>
      </svg>

      {/* Hover Info Badge */}
      <div className="absolute top-4 right-4 bg-slate-900/90 border border-slate-800 rounded-xl px-4 py-2 text-xs font-mono backdrop-blur-md shadow-lg pointer-events-none transition-all duration-200">
        <span className="text-slate-500">State: </span>
        <span className="text-white font-bold">{hoveredState || "Hover map"}</span>
      </div>
    </div>
  );
}

// Approximate centroids for labelling state abbreviation labels on the SVG
function getPathCentroidX(id: string): number {
  const centroids: Record<string, number> = {
    AK: 70, HI: 185, AL: 681, AR: 601, AZ: 222, CA: 147, CO: 359, CT: 893, DE: 858,
    FL: 735, GA: 722, ID: 216, IL: 622, IN: 657, IA: 560, KS: 455, KY: 665, LA: 595,
    ME: 892, MD: 832, MA: 887, MI: 663, MN: 530, MS: 645, MO: 557, MT: 303, NE: 458,
    NV: 185, NH: 875, NJ: 867, NM: 289, NY: 822, NC: 772, ND: 444, OH: 701, OK: 485,
    OR: 144, PA: 785, RI: 914, SC: 755, SD: 443, TN: 672, TX: 432, UT: 278, VT: 850,
    VA: 771, WA: 150, WV: 737, WI: 587, WY: 347
  };
  return centroids[id] || 480;
}

function getPathCentroidY(id: string): number {
  const centroids: Record<string, number> = {
    AK: 520, HI: 535, AL: 445, AR: 387, AZ: 355, CA: 220, CO: 255, CT: 190, DE: 242,
    FL: 525, GA: 438, ID: 130, IL: 245, IN: 234, IA: 232, KS: 302, KY: 296, LA: 445,
    ME: 105, MD: 233, MA: 160, MI: 157, MN: 147, MS: 447, MO: 307, MT: 118, NE: 232,
    NV: 220, NH: 137, NJ: 216, NM: 360, NY: 170, NC: 342, ND: 111, OH: 220, OK: 353,
    OR: 142, PA: 212, RI: 182, SC: 387, SD: 172, TN: 361, TX: 435, UT: 220, VT: 140,
    VA: 276, WA: 68, WV: 265, WI: 162, WY: 192
  };
  return centroids[id] || 300;
}
