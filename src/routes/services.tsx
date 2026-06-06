import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketingShell, PageHeader } from "@/components/marketing/MarketingShell";
import { CATEGORIES } from "@/data/mockData";
import { IMG } from "@/data/content";
import {
  Code2,
  Palette,
  PenTool,
  LineChart,
  Smartphone,
  Film,
  Camera,
  Megaphone,
  AppWindow,
  Handshake,
  GraduationCap,
  Leaf,
  Utensils,
  Package,
  Factory,
  Brain,
  Target,
  Users,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Service Directories — LanceConnect" },
      {
        name: "description",
        content:
          "Browse specialized lead directories for 18+ freelancing and niche trade categories across 150+ countries.",
      },
      { property: "og:title", content: "LanceConnect Services" },
    ],
  }),
  component: ServicesPage,
});

const CATEGORY_ICONS: Record<string, React.ComponentType<any>> = {
  web_dev: Code2,
  designer: Palette,
  copywriter: PenTool,
  seo: LineChart,
  social_media: Smartphone,
  video: Film,
  photography: Camera,
  marketing: Megaphone,
  app_dev: AppWindow,
  va: Handshake,
  tutor: GraduationCap,
  african_food_export: Leaf,
  restaurant_supplier: Utensils,
  product_export: Package,
  b2b_trade: Factory,
  human_capital: Brain,
  training_recruitment: Target,
  parent_tutor: Users,
};

function categorySlug(id: string) {
  const map: Record<string, string> = {
    web_dev: "web-developers",
    designer: "designers",
    copywriter: "copywriters",
    seo: "seo-specialists",
    social_media: "social-media",
    video: "videographers",
    photography: "photographers",
    marketing: "marketers",
    app_dev: "app-developers",
    va: "virtual-assistants",
    tutor: "online-tutors",
    african_food_export: "african-food-export",
    restaurant_supplier: "restaurant-suppliers",
    product_export: "product-export",
    b2b_trade: "b2b-trade",
    human_capital: "human-capital-development",
    training_recruitment: "training-recruitment",
    parent_tutor: "parent-tutor-matching",
  };
  return map[id] ?? id;
}

function ServicesPage() {
  return (
    <MarketingShell>
      <PageHeader
        eyebrow="Services"
        title="Directories for every craft & trade."
        subtitle="Select a category to view verified client leads, local opportunities, and custom templates."
        image={IMG.workspace}
      />

      <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8 bg-background">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {CATEGORIES.map((c) => {
            const Icon = CATEGORY_ICONS[c.id] || Sparkles;
            return (
              <Link
                to="/freelancers/$slug"
                params={{ slug: categorySlug(c.id) }}
                key={c.id}
                className="group rounded-2xl border border-border bg-card p-6 transition hover:border-foreground/30 hover:shadow-card-hover flex flex-col justify-between"
              >
                <div>
                  <div className="text-primary h-10 w-10 flex items-center justify-center rounded-xl bg-primary/10 border border-primary/20 transition group-hover:bg-primary/20">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="mt-5 font-display text-base font-bold text-foreground">
                    {c.label}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    {c.example}
                  </p>
                </div>
                <div className="mt-6">
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary group-hover:underline">
                    Explore Directory <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Parallax Divider */}
      <section
        className="bg-parallax relative h-[280px] w-full flex items-center justify-center rounded-3xl my-12"
        style={{ backgroundImage: "url('/assets/freelancers/freelancer_15.jpg')" }}
      >
        <div className="absolute inset-0 bg-[#020b21] opacity-80 mix-blend-multiply z-0" />
        <div className="relative z-10 text-center max-w-xl px-4 text-white">
          <p className="text-xs font-mono text-primary uppercase tracking-widest">
            // trade.and.service.intelligence
          </p>
          <h3 className="mt-4 font-display text-2xl font-bold tracking-tight text-white">
            Need a custom lead category?
          </h3>
          <p className="mt-2 text-sm text-slate-300">
            Tell us about your target clients. We regularly set up new filters and custom scripts.
          </p>
          <Link
            to="/contact"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary/95 transition shadow-lg"
          >
            Contact us <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>
    </MarketingShell>
  );
}
