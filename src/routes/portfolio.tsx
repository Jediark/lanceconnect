import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { useState } from "react";
import { Star, MapPin, Search, ArrowRight, ExternalLink } from "lucide-react";
import { IMG } from "@/data/content";

export const Route = createFileRoute("/portfolio")({
  head: () => ({
    meta: [
      { title: "Freelancer Portfolios — LanceConnect" },
      {
        name: "description",
        content:
          "Explore portfolios of top-tier global freelancers across web development, design, SEO, and copywriting.",
      },
      { property: "og:title", content: "LanceConnect Portfolio Directory" },
      {
        property: "og:description",
        content: "See visual work showcases and hire professional freelancers directly.",
      },
    ],
  }),
  component: PortfolioPage,
});

const CATEGORIES = [
  { id: "all", label: "All Skills" },
  { id: "web-developers", label: "Web Dev" },
  { id: "designers", label: "Design" },
  { id: "seo-specialists", label: "SEO & Writing" },
  { id: "social-media", label: "Social Media" },
  { id: "videographers", label: "Video & Photo" },
  { id: "virtual-assistants", label: "Virtual Assistants" },
  { id: "african-food-export", label: "African Food Export" },
];

const PORTFOLIO_FREELANCERS = [
  {
    name: "Trendtactics Digital",
    role: "Premium Web Design & Digital Growth Agency",
    category: "web-developers",
    avatar: "/assets/freelancers/freelancer_11.jpg",
    city: "Lagos, Nigeria",
    rating: "5.0",
    skills: ["Web Development", "UI/UX Design", "Custom App Solutions", "Digital Growth Strategies"],
    projects: [
      {
        title: "Midway Health Inc.",
        image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&q=80",
        desc: "Premium healthcare services portal built at midwayhealthinc.com.",
      },
      {
        title: "Edvoura Learning Hub",
        image: "/assets/freelancers/edvoura_flyer.jpg",
        desc: "Education ecosystem and tutoring portal built at edvouralearninghub.com.",
      },
      {
        title: "Allen Green Transportation",
        image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&q=80",
        desc: "Logistics and transportation service platform built at allengreentransportation.com.",
      },
      {
        title: "VocalEdge AI Assistant",
        image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&q=80",
        desc: "AI-powered singing assistant and vocal training platform at vocaledge.vercel.app.",
      },
    ],
  },
  {
    name: "Emmanuel Edward",
    role: "AI Web Dev Trainer & Founder of Techfields Digital",
    category: "web-developers",
    avatar: "/assets/freelancers/freelancer_5.jpg",
    city: "Lagos, Nigeria",
    rating: "4.9",
    skills: ["WordPress", "AI Sourcing", "Front-end Dev", "UI Design"],
    projects: [
      {
        title: "Techfields Digital Portfolio",
        image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&q=80",
        desc: "Pioneer AI-powered web development training portal at techfieldsdigital.com.ng.",
      },
    ],
  },
  {
    name: "Akinola Olujobi",
    role: "Premium Event Host, MC & Strategic Anchor",
    category: "videographers",
    avatar: "/assets/freelancers/freelancer_8.jpg",
    city: "Lagos, Nigeria",
    rating: "5.0",
    skills: ["Event Anchoring", "Corporate MC", "Public Speaking", "Communications"],
    projects: [
      {
        title: "Akinola Olujobi MC Services",
        image: "/assets/freelancers/akinola_mc_card.jpg",
        desc: "Premium Event Host, Master of Ceremonies, and Strategic Anchor portfolio at akinolaolujobi.com.",
      },
    ],
  },
  {
    name: "Edvoura Learning Hub",
    role: "Premium K-12 Global Online Tutoring Hub",
    category: "seo-specialists",
    avatar: "/assets/freelancers/freelancer_4.jpg",
    city: "Lagos, Nigeria",
    rating: "5.0",
    skills: ["Online Tutoring", "K-12 Education", "WAEC/JAMB Prep", "Interactive Dashboards"],
    projects: [
      {
        title: "Edvoura Tutoring System",
        image: "/assets/freelancers/edvoura_flyer.jpg",
        desc: "Premium global learning ecosystem dedicated to bridging educational gaps at edvouralearninghub.com.",
      },
    ],
  },
  {
    name: "Margaret Ogunleye (Je'moorel UK)",
    role: "Managing Director & HR/Workforce Development Lead",
    category: "african-food-export",
    avatar: "/assets/freelancers/freelancer_6.jpg",
    city: "London, UK",
    rating: "4.9",
    skills: ["African Food Export", "HR & Workforce Development", "Leadership Training", "Wholesale Supply", "Bulk Logistics"],
    projects: [
      {
        title: "Je'moorel UK Wholesale Food Supply",
        image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=80",
        desc: "Wholesale supply portal for authentic African ingredients, bulk palm oil, egusi, and dried proteins.",
      },
    ],
  },
];

function PortfolioPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFreelancers = PORTFOLIO_FREELANCERS.filter((f) => {
    const matchesCategory = activeCategory === "all" || f.category === activeCategory;
    const matchesSearch =
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <MarketingShell>
      {/* Portfolio Header */}
      <section className="relative overflow-hidden border-b border-border bg-[#020b21] py-16 text-center select-none text-white">
        <div className="absolute inset-0 z-0 select-none pointer-events-none">
          <img
            src={IMG.workspace}
            className="w-full h-full object-cover opacity-35"
            alt=""
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#020b21]/95 via-[#020b21]/80 to-[#020b21]/40" />
        </div>
        <div className="relative mx-auto max-w-4xl px-4 lg:px-8 z-10">
          <p className="text-xs font-mono text-slate-400 mb-2 tracking-widest uppercase">
            // portfolio.showcase
          </p>
          <h1 className="font-display text-4xl font-extrabold sm:text-5xl tracking-tight leading-tight text-white">
            Explore Work from Top <span className="text-primary">Freelancers.</span>
          </h1>
          <p className="mt-4 text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            See the actual projects delivered by our global community. Verify their expertise, view
            their styles, and hire directly with confidence.
          </p>
        </div>
      </section>

      {/* Filters & Search Section */}
      <section className="bg-card/40 border-b border-border py-6 select-none">
        <div className="mx-auto max-w-7xl px-4 lg:px-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-1.5 overflow-x-auto pb-2 md:pb-0">
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveCategory(c.id)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-mono font-medium transition cursor-pointer border ${
                  activeCategory === c.id
                    ? "bg-primary border-primary text-white"
                    : "border-border bg-card text-muted-foreground hover:text-foreground hover:border-slate-700"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search skills, name, role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-border bg-background pl-9 pr-4 py-2 text-xs font-mono text-foreground placeholder-slate-500 focus:border-primary focus:outline-none transition"
            />
          </div>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8 bg-background">
        {filteredFreelancers.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-border rounded-3xl bg-card/40">
            <p className="text-sm text-muted-foreground font-mono">
              No portfolios match your filters.
            </p>
            <button
              onClick={() => {
                setActiveCategory("all");
                setSearchQuery("");
              }}
              className="mt-3 text-xs font-semibold text-primary hover:underline cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid gap-10 md:grid-cols-2">
            {filteredFreelancers.map((free) => (
              <div
                key={free.name}
                className="rounded-3xl border border-border bg-card p-6 shadow-card hover:shadow-card-hover transition duration-300 flex flex-col justify-between group hover:border-primary/20"
              >
                <div>
                  {/* Bio Info Header */}
                  <div className="flex items-start gap-4">
                    <img
                      src={free.avatar}
                      alt={free.name}
                      className="h-12 w-12 rounded-full object-cover border-2 border-primary/20"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-display font-bold text-foreground text-base leading-snug truncate">
                          {free.name}
                        </h3>
                        <div className="flex items-center gap-1 text-amber-500 text-xs shrink-0 font-bold">
                          <Star className="h-3.5 w-3.5 fill-current" />
                          {free.rating}
                        </div>
                      </div>
                      <p className="text-xs text-primary font-medium">{free.role}</p>
                      <p className="text-[10px] text-muted-foreground font-mono flex items-center gap-1 mt-0.5">
                        <MapPin className="h-3 w-3 shrink-0" />
                        {free.city}
                      </p>
                    </div>
                  </div>

                  {/* Skills List */}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {free.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded bg-background border border-border px-2 py-0.5 text-[9px] font-mono text-muted-foreground"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Projects Showcase Mini Grid */}
                  <div className="mt-6 grid gap-4 grid-cols-2">
                    {free.projects.map((proj) => (
                      <div
                        key={proj.title}
                        className="relative rounded-2xl overflow-hidden border border-border bg-background group/proj cursor-pointer"
                      >
                        <div className="aspect-[4/3] w-full overflow-hidden relative">
                          <img
                            src={proj.image}
                            alt={proj.title}
                            className="h-full w-full object-cover transition duration-300 group-hover/proj:scale-105"
                          />
                          <div className="absolute inset-0 bg-background/95 opacity-0 group-hover/proj:opacity-100 transition duration-300 flex flex-col justify-end p-3">
                            <span className="text-[9px] font-mono text-primary font-bold uppercase tracking-widest flex items-center gap-0.5">
                              Case Study <ExternalLink className="h-2.5 w-2.5" />
                            </span>
                            <p className="text-[9px] text-muted-foreground leading-normal line-clamp-2 mt-1">
                              {proj.desc}
                            </p>
                          </div>
                        </div>
                        <div className="p-2.5 border-t border-border">
                          <h4 className="text-[10px] font-display font-semibold text-foreground truncate leading-none">
                            {proj.title}
                          </h4>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Action Link */}
                <div className="mt-6 pt-4 border-t border-border/40 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-muted-foreground">
                    Ready for new contracts
                  </span>
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                  >
                    Discuss project <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Joint Showcase CTA */}
      <section className="px-4 pb-20 lg:px-8 bg-background">
        <div className="mx-auto max-w-5xl rounded-3xl border border-border bg-card p-12 text-center relative overflow-hidden shadow-2xl">
          <h3 className="font-display text-2xl font-bold relative z-10">
            Showcase your own portfolio work
          </h3>
          <p className="mt-3 text-sm text-muted-foreground max-w-lg mx-auto relative z-10">
            Are you a freelancer? Create your profile, upload your portfolio items, and show your
            work directly to high-paying clients looking to hire.
          </p>
          <Link
            to="/register"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition shadow-lg relative z-10"
          >
            Create your profile <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </MarketingShell>
  );
}
