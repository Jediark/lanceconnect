import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { c as cn } from "./router-Co1PU52Q.mjs";
function OpportunityScore({
  score,
  size = "md",
  showLabel = true
}) {
  let bg = "bg-slate-400";
  let label = "Weak";
  if (score >= 85) {
    bg = "bg-emerald-500";
    label = "Hot";
  } else if (score >= 65) {
    bg = "bg-indigo-500";
    label = "Strong";
  } else if (score >= 45) {
    bg = "bg-amber-500";
    label = "Good";
  } else if (score >= 25) {
    bg = "bg-orange-500";
    label = "Possible";
  }
  const sizes = {
    sm: "text-[11px] px-1.5 py-0.5 gap-1",
    md: "text-xs px-2 py-1 gap-1.5",
    lg: "text-sm px-2.5 py-1.5 gap-2"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: cn("inline-flex items-center rounded-full font-semibold text-white font-mono-data", bg, sizes[size]), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: score }),
    showLabel && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-sans font-medium uppercase tracking-wide text-[10px]", children: label })
  ] });
}
export {
  OpportunityScore as O
};
