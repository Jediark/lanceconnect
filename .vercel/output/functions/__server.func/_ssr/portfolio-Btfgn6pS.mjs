import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { M as MarketingShell } from "./MarketingShell-BDz3y-zJ.mjs";
import "../_libs/sonner.mjs";
import { e as Search, f as Star, g as MapPin, h as ExternalLink, A as ArrowRight } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "./router-DdjAxO3q.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
const CATEGORIES = [{
  id: "all",
  label: "All Skills"
}, {
  id: "web-developers",
  label: "Web Dev"
}, {
  id: "designers",
  label: "Design"
}, {
  id: "seo-specialists",
  label: "SEO & Writing"
}, {
  id: "social-media",
  label: "Social Media"
}, {
  id: "videographers",
  label: "Video & Photo"
}, {
  id: "virtual-assistants",
  label: "Virtual Assistants"
}];
const PORTFOLIO_FREELANCERS = [{
  name: "Taiwo Adeyemi",
  role: "Full-stack Developer",
  category: "web-developers",
  avatar: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=300&q=80&fit=crop&crop=face",
  city: "Lagos, Nigeria",
  rating: "4.9",
  skills: ["React", "Node.js", "Tailwind CSS", "Next.js"],
  projects: [{
    title: "SaaS Dashboard Interface",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80",
    desc: "A modern analytics app built with React & Tailwind."
  }, {
    title: "Bespoke Hotel Portal",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80",
    desc: "Online booking engine and CMS for a boutique hotel."
  }]
}, {
  name: "Maria Silva",
  role: "Brand Designer & UI Expert",
  category: "designers",
  avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&q=80&fit=crop&crop=face",
  city: "São Paulo, Brazil",
  rating: "5.0",
  skills: ["Figma", "Branding", "UI/UX", "Illustrator"],
  projects: [{
    title: "Neobank Visual System",
    image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400&q=80",
    desc: "Full rebranding, mobile interfaces and guidelines."
  }, {
    title: "Organic Cosmetics Pack",
    image: "https://images.unsplash.com/photo-1608248597481-496100c8c836?w=400&q=80",
    desc: "Eco-friendly retail box and bottle design."
  }]
}, {
  name: "James Kariuki",
  role: "SEO Consultant & Copywriter",
  category: "seo-specialists",
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80&fit=crop&crop=face",
  city: "Nairobi, Kenya",
  rating: "4.8",
  skills: ["SEO Auditing", "Technical Writing", "Keyword Research"],
  projects: [{
    title: "Fintech Content Funnel",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&q=80",
    desc: "Scale traffic from 10k to 150k monthly visits."
  }, {
    title: "SaaS Launch Ebook",
    image: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=400&q=80",
    desc: "Complete copy strategy and PDF lead magnet."
  }]
}, {
  name: "Priya Patel",
  role: "Social Media Strategist",
  category: "social-media",
  avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&q=80&fit=crop&crop=face",
  city: "Mumbai, India",
  rating: "4.9",
  skills: ["Copywriting", "Campaign Ads", "Content Calendars"],
  projects: [{
    title: "Fitness App Launch Campaign",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&q=80",
    desc: "Drove 12k app signups via Instagram Reels strategy."
  }, {
    title: "B2B SaaS LinkedIn Growth",
    image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=400&q=80",
    desc: "Organically grew CEO profile to 25k followers."
  }]
}, {
  name: "Sofia Romano",
  role: "Videographer & Motion Artist",
  category: "videographers",
  avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=300&q=80&fit=crop&crop=face",
  city: "Naples, Italy",
  rating: "5.0",
  skills: ["Premiere", "After Effects", "Color Grading"],
  projects: [{
    title: "Commercial Coffee Ad",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80",
    desc: "Social campaign commercial video."
  }, {
    title: "Real Estate Cinematic Tour",
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&q=80",
    desc: "Luxury video tour booked on YouTube."
  }]
}, {
  name: "Lucas Fernández",
  role: "Virtual Assistant & Operations",
  category: "virtual-assistants",
  avatar: "https://images.unsplash.com/photo-1556157382-97eda2d62296?w=300&q=80&fit=crop&crop=face",
  city: "Buenos Aires, Argentina",
  rating: "4.9",
  skills: ["Calendar Sync", "Invoicing", "Customer Support"],
  projects: [{
    title: "Inbox & Ops Architecture",
    image: "https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=400&q=80",
    desc: "Automated standard workflows and scheduling."
  }, {
    title: "Shopify Store Customer System",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&q=80",
    desc: "Intercom integration and customer support scaling."
  }]
}];
function PortfolioPage() {
  const [activeCategory, setActiveCategory] = reactExports.useState("all");
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const filteredFreelancers = PORTFOLIO_FREELANCERS.filter((f) => {
    const matchesCategory = activeCategory === "all" || f.category === activeCategory;
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase()) || f.role.toLowerCase().includes(searchQuery.toLowerCase()) || f.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(MarketingShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "relative overflow-hidden border-b border-border bg-[#080B14] py-16 text-center select-none", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-grid-pattern opacity-15 z-0" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mx-auto max-w-4xl px-4 lg:px-8 z-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-mono text-[#64748B] mb-2 tracking-widest uppercase", children: "// portfolio.showcase" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-4xl font-extrabold text-white sm:text-5xl tracking-tight leading-tight", children: [
          "Explore Work from Top ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-gradient-to-r from-primary to-[#818CF8] bg-clip-text text-transparent", children: "Freelancers." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-sm text-slate-400 max-w-xl mx-auto leading-relaxed", children: "See the actual projects delivered by our global community. Verify their expertise, view their styles, and hire directly with confidence." })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "bg-[#0F172A]/40 border-b border-border py-6 select-none", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-4 lg:px-8 flex flex-col md:flex-row md:items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5 overflow-x-auto pb-2 md:pb-0", children: CATEGORIES.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setActiveCategory(c.id), className: `rounded-full px-3.5 py-1.5 text-xs font-mono font-medium transition cursor-pointer border ${activeCategory === c.id ? "bg-primary border-primary text-white" : "border-border bg-card text-slate-400 hover:text-white hover:border-slate-700"}`, children: c.label }, c.id)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative max-w-xs w-full", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", placeholder: "Search skills, name, role...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "w-full rounded-xl border border-border bg-[#080B14] pl-9 pr-4 py-2 text-xs font-mono text-white placeholder-slate-500 focus:border-primary focus:outline-none transition" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "mx-auto max-w-7xl px-4 py-16 lg:px-8 bg-[#080B14]", children: filteredFreelancers.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-16 border border-dashed border-border rounded-3xl bg-card/40", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-400 font-mono", children: "No portfolios match your filters." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
        setActiveCategory("all");
        setSearchQuery("");
      }, className: "mt-3 text-xs font-semibold text-primary hover:underline cursor-pointer", children: "Reset Filters" })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-10 md:grid-cols-2", children: filteredFreelancers.map((free) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl border border-border bg-[#0F172A]/85 p-6 shadow-card hover:shadow-card-hover transition duration-300 flex flex-col justify-between group hover:border-primary/20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: free.avatar, alt: free.name, className: "h-12 w-12 rounded-full object-cover border-2 border-primary/20" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-bold text-white text-base leading-snug truncate", children: free.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 text-amber-500 text-xs shrink-0 font-bold", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-3.5 w-3.5 fill-current" }),
                free.rating
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-primary font-medium", children: free.role }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-slate-500 font-mono flex items-center gap-1 mt-0.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-3 w-3 shrink-0" }),
              free.city
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 flex flex-wrap gap-1.5", children: free.skills.map((skill) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded bg-[#080B14] border border-border px-2 py-0.5 text-[9px] font-mono text-slate-300", children: skill }, skill)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 grid gap-4 grid-cols-2", children: free.projects.map((proj) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative rounded-2xl overflow-hidden border border-border bg-[#080B14] group/proj cursor-pointer", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "aspect-[4/3] w-full overflow-hidden relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: proj.image, alt: proj.title, className: "h-full w-full object-cover transition duration-300 group-hover/proj:scale-105" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 bg-[#080B14]/80 opacity-0 group-hover/proj:opacity-100 transition duration-300 flex flex-col justify-end p-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[9px] font-mono text-primary font-bold uppercase tracking-widest flex items-center gap-0.5", children: [
                "Case Study ",
                /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "h-2.5 w-2.5" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9px] text-slate-400 leading-normal line-clamp-2 mt-1", children: proj.desc })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2.5 border-t border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-[10px] font-display font-semibold text-white truncate leading-none", children: proj.title }) })
        ] }, proj.title)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 pt-4 border-t border-border/40 flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-mono text-[#64748B]", children: "Ready for new contracts" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/contact", className: "inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline", children: [
          "Discuss project ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-3 w-3" })
        ] })
      ] })
    ] }, free.name)) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "px-4 pb-20 lg:px-8 bg-[#080B14]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-5xl rounded-3xl border border-border bg-gradient-to-r from-[#0F172A] to-[#080B14] p-12 text-center relative overflow-hidden shadow-2xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-2xl font-bold text-white relative z-10", children: "Showcase your own portfolio work" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-sm text-slate-400 max-w-lg mx-auto relative z-10", children: "Are you a freelancer? Create your profile, upload your portfolio items, and show your work directly to high-paying clients looking to hire." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/register", className: "mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-black hover:bg-white/95 transition shadow-lg relative z-10", children: [
        "Create your profile ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4" })
      ] })
    ] }) })
  ] });
}
export {
  PortfolioPage as component
};
