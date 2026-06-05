import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { MarketingShell, PageHeader } from "@/components/marketing/MarketingShell";
import { FREELANCER_CATEGORIES } from "@/data/content";
import { CATEGORIES } from "@/data/mockData";
import { supabase } from "@/lib/supabase";
import { ArrowRight, AlertCircle, Building2, Code, Palette, PenTool, TrendingUp, MessageSquare, Video, Camera, Megaphone, Smartphone, Users, MapPin, DollarSign, Mail, Phone, Globe, Github, Linkedin, Twitter, ArrowLeft, Star, ExternalLink, ShieldCheck, GraduationCap, Leaf, Utensils, Package, Factory, BookOpen } from "lucide-react";

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  "web-developers": <Code className="h-5 w-5 text-primary" />,
  "designers": <Palette className="h-5 w-5 text-primary" />,
  "copywriters": <PenTool className="h-5 w-5 text-primary" />,
  "seo-specialists": <TrendingUp className="h-5 w-5 text-primary" />,
  "social-media": <MessageSquare className="h-5 w-5 text-primary" />,
  "videographers": <Video className="h-5 w-5 text-primary" />,
  "photographers": <Camera className="h-5 w-5 text-primary" />,
  "marketers": <Megaphone className="h-5 w-5 text-primary" />,
  "app-developers": <Smartphone className="h-5 w-5 text-primary" />,
  "virtual-assistants": <Users className="h-5 w-5 text-primary" />,
  "online-tutors": <GraduationCap className="h-5 w-5 text-primary" />,
  "african-food-export": <Leaf className="h-5 w-5 text-primary" />,
  "restaurant-suppliers": <Utensils className="h-5 w-5 text-primary" />,
  "product-export": <Package className="h-5 w-5 text-primary" />,
  "b2b-trade": <Factory className="h-5 w-5 text-primary" />,
  "corporate-training": <BookOpen className="h-5 w-5 text-primary" />
};

export const Route = createFileRoute("/freelancers/$slug")({
  loader: async ({ params }) => {
    // 1. Check if slug is a static marketing category landing page
    const cat = FREELANCER_CATEGORIES.find(c => c.slug === params.slug);
    if (cat) {
      return { type: "category" as const, cat, freelancer: null };
    }

    // 2. Otherwise, treat as vanity username or ID and query public freelancer view
    let query = supabase.from("freelancer_directory").select("*");
    if (params.slug.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
      query = query.eq("id", params.slug);
    } else {
      query = query.eq("username", params.slug);
    }

    const { data: freelancer, error } = await query.maybeSingle();
    if (error || !freelancer) {
      throw notFound();
    }
    return { type: "freelancer" as const, cat: null, freelancer };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [] };
    if (loaderData.type === "category") {
      const { cat } = loaderData;
      return {
        meta: [
          { title: `Find clients as a ${cat.label.toLowerCase()} — LanceConnect` },
          { name: "description", content: cat.tagline },
          { property: "og:title", content: `For ${cat.label}` },
          { property: "og:description", content: cat.tagline },
          { property: "og:image", content: cat.image },
        ]
      };
    } else {
      const { freelancer } = loaderData;
      return {
        meta: [
          { title: `${freelancer.full_name} — Professional Freelancer` },
          { name: "description", content: freelancer.bio || `View portfolio, case studies, and contact details for ${freelancer.full_name} directly on LanceConnect.` },
          { property: "og:title", content: `${freelancer.full_name} Profile` },
          { property: "og:description", content: freelancer.bio || "Hire directly off-platform." },
        ]
      };
    }
  },
  notFoundComponent: () => (
    <MarketingShell>
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="font-display text-3xl font-bold">Profile or Category not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">The resource you are trying to reach does not exist or has been made private.</p>
        <Link to="/freelancers" className="mt-5 inline-block text-primary hover:underline">← Back to Directory</Link>
      </div>
    </MarketingShell>
  ),
  errorComponent: ({ reset }) => (
    <MarketingShell>
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <p>Something went wrong loading this profile.</p>
        <button onClick={reset} className="mt-3 rounded bg-primary px-4 py-2 text-sm text-primary-foreground">Retry</button>
      </div>
    </MarketingShell>
  ),
  component: FreelancerSlugPage,
});

function FreelancerSlugPage() {
  const data = Route.useLoaderData();
  if (!data) return null;

  if (data.type === "category") {
    const { cat } = data;
    const others = FREELANCER_CATEGORIES.filter(c => c.slug !== cat.slug).slice(0, 4);
    return (
      <MarketingShell>
        <PageHeader eyebrow={`For ${cat.label}`} title={cat.tagline} subtitle={cat.description} image={cat.image}/>

        <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8 grid gap-10 lg:grid-cols-2">
          <div>
            <div className="inline-grid h-12 w-12 place-items-center rounded-xl bg-warn/15 text-warn"><AlertCircle className="h-6 w-6"/></div>
            <h2 className="mt-4 font-display text-3xl font-bold">What we detect</h2>
            <p className="mt-3 text-muted-foreground">LanceConnect's scoring engine specifically looks for the signals that mean a business is ready to hire {cat.label.toLowerCase()}:</p>
            <ul className="mt-5 space-y-2">
              {cat.problems.map((p: string) => (
                <li key={p} className="flex gap-3 rounded-xl border border-border bg-card p-3 text-sm"><span className="text-primary">●</span>{p}</li>
              ))}
            </ul>
          </div>
          <div>
            <div className="inline-grid h-12 w-12 place-items-center rounded-xl bg-success/15 text-success"><Building2 className="h-6 w-6"/></div>
            <h2 className="mt-4 font-display text-3xl font-bold">Example leads</h2>
            <p className="mt-3 text-muted-foreground">A snapshot of the kind of businesses you'll see on day one.</p>
            <div className="mt-5 space-y-3">
              {cat.sampleBusinesses.map((b: {name:string;reason:string}) => (
                <div key={b.name} className="rounded-xl border border-border bg-card p-4">
                  <p className="font-semibold">{b.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground"><span className="text-primary">Why:</span> {b.reason}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 pb-16 lg:px-8">
          <div className="mx-auto max-w-5xl rounded-3xl bg-primary p-10 text-center text-primary-foreground">
            <h2 className="font-display text-3xl font-bold">Start with 10 free {cat.label.toLowerCase()} leads.</h2>
            <p className="mt-2 text-primary-foreground/90">No credit card. Pick your city and they're in your dashboard in seconds.</p>
            <Link to="/register" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-card px-6 py-3 text-sm font-semibold text-primary hover:scale-105 transition">Get my leads <ArrowRight className="h-4 w-4"/></Link>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-20 lg:px-8">
          <h3 className="font-display text-xl font-bold">Other crafts we serve</h3>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {others.map(o => (
              <Link key={o.slug} to="/freelancers/$slug" params={{slug:o.slug}} className="group rounded-xl border border-border bg-card p-4 hover:border-primary">
                <div className="mb-2 text-primary">{CATEGORY_ICONS[o.slug] || <Code className="h-5 w-5" />}</div>
                <p className="mt-2 font-display font-semibold group-hover:text-primary">{o.label}</p>
                <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{o.tagline}</p>
              </Link>
            ))}
          </div>
        </section>
      </MarketingShell>
    );
  }

  // Otherwise, render the public Freelancer profile detail page!
  const { freelancer } = data;

  const getCategoryLabel = (id: string) => {
    const cat = CATEGORIES.find(c => c.id === id);
    return cat ? `${cat.emoji} ${cat.label}` : id;
  };

  // Safe WhatsApp Link Generator
  const getWhatsAppLink = (phone: string, name: string) => {
    const cleanPhone = phone.replace(/[^0-9+]/g, "");
    const message = encodeURIComponent(`Hi ${name}, I saw your profile on LanceConnect and would love to discuss a project with you!`);
    return `https://wa.me/${cleanPhone.replace("+", "")}?text=${message}`;
  };

  return (
    <MarketingShell>
      {/* Detail Layout Container */}
      <div className="bg-background min-h-screen py-10">
        <div className="mx-auto max-w-6xl px-4 lg:px-8">
          
          {/* Back Button */}
          <Link 
            to="/freelancers" 
            className="inline-flex items-center gap-2 text-xs font-mono text-muted-foreground hover:text-foreground mb-8 transition"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Freelancers Directory
          </Link>

          {/* Profile Header Grid */}
          <div className="grid gap-8 lg:grid-cols-3">
            
            {/* Left/Main Content Column (Bio & Case Studies) */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Profile Card */}
              <div className="rounded-3xl border border-border bg-card p-6 md:p-8 shadow-card flex flex-col md:flex-row gap-6 items-start">
                <div className="h-20 w-20 rounded-full overflow-hidden border-2 border-primary/20 shrink-0 bg-primary/10 flex items-center justify-center font-bold text-primary text-xl">
                  {freelancer.avatar_url ? (
                    <img 
                      src={freelancer.avatar_url} 
                      alt={freelancer.full_name} 
                      className="h-full w-full object-cover" 
                    />
                  ) : (
                    freelancer.full_name.split(" ").map((n: string)=>n[0]).join("").toUpperCase().slice(0, 2)
                  )}
                </div>
                <div className="flex-1 space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="font-display font-extrabold text-2xl tracking-tight text-white">
                      {freelancer.full_name}
                    </h1>
                    <span className="inline-flex items-center gap-1 rounded bg-primary/10 border border-primary/20 px-2 py-0.5 text-[9px] font-mono text-primary font-bold">
                      <ShieldCheck className="h-3 w-3" /> Verified Builder
                    </span>
                  </div>
                  <p className="text-xs font-mono text-primary font-semibold uppercase tracking-wider leading-none">
                    {getCategoryLabel(freelancer.freelancer_category)}
                  </p>
                  
                  {/* Meta Details */}
                  <div className="flex flex-wrap gap-4 text-xs font-mono text-muted-foreground">
                    {(freelancer.city || freelancer.country) && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4 text-slate-500" />
                        {freelancer.city ? `${freelancer.city}, ` : ""}{freelancer.country}
                      </span>
                    )}
                    {freelancer.hourly_rate && (
                      <span className="flex items-center text-emerald-500 font-semibold">
                        <DollarSign className="h-4 w-4" />
                        {freelancer.hourly_rate} USD / hr
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Bio Summary */}
              <div className="rounded-3xl border border-border bg-card p-6 md:p-8 shadow-card space-y-4">
                <h2 className="font-display text-lg font-bold text-foreground">// about.freelancer</h2>
                <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {freelancer.bio || "No detailed bio has been uploaded by the freelancer."}
                </p>
              </div>

              {/* Case Studies Grid */}
              <div className="space-y-4">
                <h2 className="font-display text-lg font-bold text-foreground px-1">// work.showcase</h2>
                
                {!freelancer.portfolio_projects || freelancer.portfolio_projects.length === 0 ? (
                  <div className="rounded-3xl border border-dashed border-border bg-card/40 p-10 text-center select-none">
                    <p className="text-xs text-muted-foreground font-mono">No case studies uploaded for this profile yet.</p>
                  </div>
                ) : (
                  <div className="grid gap-6 sm:grid-cols-2">
                    {freelancer.portfolio_projects.map((proj: any, idx: number) => (
                      <div 
                        key={idx} 
                        className="rounded-3xl border border-border bg-card p-4 shadow-card flex flex-col justify-between hover:border-slate-700 transition"
                      >
                        <div>
                          {proj.image && (
                            <div className="aspect-[16/9] w-full rounded-2xl overflow-hidden mb-3.5 border border-border/40 relative group">
                              <img 
                                src={proj.image} 
                                alt={proj.title} 
                                className="h-full w-full object-cover transition duration-300 group-hover:scale-103" 
                              />
                            </div>
                          )}
                          <h3 className="font-display font-bold text-foreground text-sm truncate leading-snug">
                            {proj.title}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-2 leading-relaxed line-clamp-3">
                            {proj.desc}
                          </p>
                        </div>
                        {proj.link && (
                          <div className="mt-4 pt-3 border-t border-border/40 flex justify-end">
                            <a 
                              href={proj.link} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                            >
                              Explore project <ExternalLink className="h-3 w-3" />
                            </a>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* Right Side Column (Contact Details Panel) */}
            <div className="space-y-6">
              
              {/* Connect Widget */}
              <div className="rounded-3xl border border-border bg-card p-6 md:p-8 shadow-card space-y-6">
                <h2 className="font-display text-lg font-bold text-foreground">// hire.directly</h2>
                <p className="text-xs text-muted-foreground leading-normal">
                  All contracts are managed directly between you and the freelancer. LanceConnect takes 0% commissions or fees.
                </p>

                <div className="space-y-3">
                  
                  {/* Email Button */}
                  <a 
                    href={`mailto:${freelancer.contact_email || freelancer.email}`}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-xs font-bold text-primary-foreground hover:bg-primary/95 transition shadow-sm cursor-pointer"
                  >
                    <Mail className="h-4 w-4 shrink-0" /> Email Freelancer
                  </a>

                  {/* WhatsApp/Phone Button */}
                  {freelancer.contact_phone && (
                    <a 
                      href={getWhatsAppLink(freelancer.contact_phone, freelancer.full_name)}
                      target="_blank"
                      rel="noreferrer"
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] text-white hover:bg-[#20ba59] px-4 py-3 text-xs font-bold transition shadow-sm cursor-pointer"
                    >
                      <MessageSquare className="h-4 w-4 shrink-0" /> WhatsApp Message
                    </a>
                  )}

                  {/* Website Button */}
                  {freelancer.website_url && (
                    <a 
                      href={freelancer.website_url.startsWith("http") ? freelancer.website_url : `https://${freelancer.website_url}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-background border border-border hover:border-slate-600 hover:bg-accent px-4 py-3 text-xs font-bold transition shadow-sm cursor-pointer text-foreground"
                    >
                      <Globe className="h-4 w-4 shrink-0 text-slate-400" /> Personal Website
                    </a>
                  )}

                </div>

                {/* Social icons row */}
                <div className="flex items-center justify-center gap-3 pt-4 border-t border-border/40 select-none">
                  {freelancer.github_url && (
                    <a 
                      href={freelancer.github_url} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="p-2 border border-border bg-background rounded-xl text-slate-400 hover:text-white hover:border-slate-700 transition"
                      title="GitHub"
                    >
                      <Github className="h-4 w-4" />
                    </a>
                  )}
                  {freelancer.linkedin_url && (
                    <a 
                      href={freelancer.linkedin_url} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="p-2 border border-border bg-background rounded-xl text-slate-400 hover:text-white hover:border-slate-700 transition"
                      title="LinkedIn"
                    >
                      <Linkedin className="h-4 w-4" />
                    </a>
                  )}
                  {freelancer.twitter_url && (
                    <a 
                      href={freelancer.twitter_url} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="p-2 border border-border bg-background rounded-xl text-slate-400 hover:text-white hover:border-slate-700 transition"
                      title="Twitter/X"
                    >
                      <Twitter className="h-4 w-4" />
                    </a>
                  )}
                </div>

              </div>

              {/* Safety/Traction Notice */}
              <div className="rounded-3xl border border-border bg-card/60 p-6 shadow-card space-y-3 font-mono text-[10px] leading-relaxed text-muted-foreground select-none">
                <p>💡 **Quick Tips:**</p>
                <p>1. Always establish clear project milestones and payment criteria before starting work.</p>
                <p>2. Ask for visual work drafts or Loom recordings to check progress weekly.</p>
                <p>3. Utilize escrow solutions for large corporate contracts.</p>
              </div>

            </div>

          </div>

        </div>
      </div>
    </MarketingShell>
  );
}
