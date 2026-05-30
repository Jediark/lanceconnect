import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Bookmark, CheckCircle2, Globe, LineChart, Mail, Map, Play, Search, Sparkles, Star, Target, Users } from "lucide-react";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { CATEGORIES } from "@/data/mockData";
import { IMG } from "@/data/content";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FreelanceConnect — Find clients. Win work. Grow your freelance business." },
      { name: "description", content: "FreelanceConnect scans the internet for businesses that need your skills and hands you their contact details. Free plan with 10 leads — no credit card required." },
      { property: "og:title", content: "FreelanceConnect — Lead generation for freelancers" },
      { property: "og:description", content: "Find local businesses that need your skills. Built for freelancers in 150+ countries." },
      { property: "og:image", content: IMG.heroFreelancer },
    ],
  }),
  component: () => (<MarketingShell><Hero/><SocialProof/><HowItWorks/><Features/><WhoFor/><Testimonials/><Pricing/><CTA/></MarketingShell>),
});

function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="absolute inset-0 bg-dot-pattern opacity-40" />
      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-16 lg:grid-cols-2 lg:gap-12 lg:px-8 lg:py-24">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse-dot" />
            Works in 150+ countries
          </span>
          <h1 className="mt-5 font-display text-5xl font-bold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
            Find clients.<br />
            <span className="text-primary">Win work.</span><br />
            Grow your<br />
            freelance business.
          </h1>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-muted-foreground md:text-lg">
            FreelanceConnect scans the internet for businesses that need your skills — then hands you their contact details, ready to reach out.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link to="/register" className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-card-hover transition hover:bg-primary/90">
              Start for Free <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/how-it-works" className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-3 text-sm font-semibold hover:bg-accent">
              <Play className="h-4 w-4" /> See how it works
            </Link>
          </div>
          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5 text-success" /> No credit card required</span>
            <span className="flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5 text-success" /> 10 free leads instantly</span>
            <span className="flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5 text-success" /> Cancel anytime</span>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-3 rounded-3xl bg-primary/10" />
          <img src={IMG.heroFreelancer} alt="Freelancer working from her laptop" className="relative aspect-[4/5] w-full rounded-3xl object-cover shadow-2xl" />
          <div className="absolute -left-4 -bottom-6 hidden rounded-xl border border-border bg-card p-3 shadow-2xl sm:flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary text-primary-foreground"><Search className="h-4 w-4" /></div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">8 new leads</p>
              <p className="text-sm font-semibold">Web Dev · Italy</p>
            </div>
          </div>
          <div className="absolute -right-4 top-8 hidden rounded-xl border border-border bg-card p-3 shadow-2xl sm:block">
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Avg response rate</p>
            <p className="font-display text-lg font-bold text-success">+34%</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function SocialProof() {
  const items = ["Web Developers","Graphic Designers","Copywriters","SEO Specialists","Videographers","Photographers","Social Media Managers","App Developers","Virtual Assistants","Consultants"];
  return (
    <section className="border-b border-border bg-paper py-8">
      <p className="text-center text-xs font-medium uppercase tracking-widest text-muted-foreground">Trusted by freelancers in 50+ countries</p>
      <div className="mt-5 overflow-hidden">
        <div className="flex w-max animate-ticker gap-10">
          {[...items, ...items].map((it, i) => (
            <span key={i} className="text-sm font-medium text-foreground/70">✦ {it}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { icon: Target, title: "Pick your skill", desc: "Select your freelance category — web dev, design, copywriting, and more." },
    { icon: Map, title: "Choose your market", desc: "Target any city or country in the world." },
    { icon: LineChart, title: "Discover leads", desc: "Get a scored list of businesses that need you." },
    { icon: Mail, title: "Reach out", desc: "Use ready-made templates to contact them instantly." },
  ];
  return (
    <section id="how" className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-display text-3xl font-bold md:text-4xl">From zero to outreach in minutes</h2>
        <p className="mt-3 text-muted-foreground">A simple workflow built around how freelancers actually find clients.</p>
      </div>
      <div className="relative mt-12 grid gap-6 md:grid-cols-4">
        <div className="absolute left-0 right-0 top-7 hidden h-px bg-border md:block" />
        {steps.map((s, i) => (
          <div key={s.title} className="relative rounded-2xl border border-border bg-card p-6 shadow-card">
            <div className="mb-4 grid h-14 w-14 place-items-center rounded-xl bg-primary text-primary-foreground"><s.icon className="h-6 w-6" /></div>
            <p className="text-xs font-mono-data text-muted-foreground">STEP {i + 1}</p>
            <h3 className="mt-1 font-display text-lg font-semibold">{s.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Features() {
  const features = [
    { icon: Globe, title: "Global Lead Discovery", desc: "Find businesses without websites in any country, any city." },
    { icon: Star, title: "Opportunity Scoring", desc: "Lead score showing how much a business needs you." },
    { icon: Mail, title: "Contact Details", desc: "Phone numbers, emails, and social profiles in one click." },
    { icon: Bookmark, title: "Built-in CRM", desc: "Track your outreach with a simple, freelancer-friendly pipeline." },
    { icon: Users, title: "Outreach Templates", desc: "Ready-made emails, phone scripts, and DM templates." },
    { icon: Sparkles, title: "AI Message Writer", desc: "Personalized outreach generated in seconds. (Pro)" },
  ];
  return (
    <section id="features" className="bg-paper py-20 border-y border-border">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold md:text-4xl">Everything you need to get clients</h2>
          <p className="mt-3 text-muted-foreground">No bloat. Just the tools freelancers actually use to win work.</p>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="group rounded-2xl border border-border bg-card p-6 transition hover:-translate-y-0.5 hover:shadow-card-hover">
              <div className="mb-4 inline-grid h-11 w-11 place-items-center rounded-lg bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="font-display text-lg font-semibold">{f.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhoFor() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-display text-3xl font-bold md:text-4xl">Built for every freelancer</h2>
        <p className="mt-3 text-muted-foreground">Whatever skill you sell, we'll help you find businesses that need it.</p>
      </div>
      <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {CATEGORIES.map((c) => (
          <Link to="/freelancers/$slug" params={{slug: categorySlug(c.id)}} key={c.id} className="rounded-xl border border-border bg-card p-4 transition hover:border-primary hover:shadow-card">
            <div className="text-2xl">{c.emoji}</div>
            <p className="mt-2 font-display text-sm font-semibold">{c.label}</p>
            <p className="mt-1 text-xs text-muted-foreground">{c.example}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

function categorySlug(id: string) {
  const map: Record<string,string> = {
    web_dev:"web-developers",designer:"designers",copywriter:"copywriters",seo:"seo-specialists",
    social_media:"social-media",video:"videographers",photography:"photographers",marketing:"marketers",
    app_dev:"app-developers",va:"virtual-assistants"
  };
  return map[id] ?? id;
}

function Testimonials() {
  const items = [
    { quote: "I found 3 new clients in my first week. The opportunity scoring tells me exactly which businesses to call first.", name: "Taiwo A.", role: "Web Developer", city: "Lagos", avatar: IMG.face1 },
    { quote: "As a copywriter, I never knew how to find leads. Now I have a full pipeline every Monday morning.", name: "Maria S.", role: "Copywriter", city: "São Paulo", avatar: IMG.face2 },
    { quote: "The phone scripts are gold. I went from zero cold calls to booking 2 meetings a day.", name: "James K.", role: "SEO Specialist", city: "Nairobi", avatar: IMG.face3 },
  ];
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-display text-3xl font-bold md:text-4xl">Freelancers love FreelanceConnect</h2>
      </div>
      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {items.map((t) => (
          <div key={t.name} className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <div className="mb-3 flex gap-0.5 text-warn">
              {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
            </div>
            <p className="text-sm leading-relaxed text-foreground/90">"{t.quote}"</p>
            <div className="mt-5 flex items-center gap-3">
              <img src={t.avatar} alt={t.name} className="h-10 w-10 rounded-full object-cover" />
              <div className="text-xs">
                <p className="font-semibold">{t.name}</p>
                <p className="text-muted-foreground">{t.role} · {t.city}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Pricing() {
  const plans = [
    { name: "Free", price: "0", leads: "10", popular: false, cta: "Start Free", features: ["Basic filters", "1 template", "1 team seat"] },
    { name: "Starter", price: "19", leads: "100", popular: false, cta: "Get Started", features: ["All filters", "5 templates", "CRM pipeline", "CSV export"] },
    { name: "Pro", price: "49", leads: "500", popular: true, cta: "Go Pro", features: ["Everything in Starter", "Unlimited templates", "AI outreach writer", "Priority support"] },
    { name: "Agency", price: "99", leads: "Unlimited", popular: false, cta: "Scale Up", features: ["Everything in Pro", "3 team seats", "API access", "White-label option"] },
  ];
  return (
    <section id="pricing" className="bg-paper py-20 border-y border-border">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold md:text-4xl">Simple, transparent pricing</h2>
          <p className="mt-3 text-muted-foreground">Start free. Upgrade when you're winning work.</p>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {plans.map((p) => (
            <div key={p.name} className={`relative rounded-2xl border bg-card p-6 ${p.popular ? "border-primary shadow-card-hover lg:-translate-y-3" : "border-border shadow-card"}`}>
              {p.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">Most Popular</span>
              )}
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{p.name}</p>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="font-display text-4xl font-bold">${p.price}</span>
                <span className="text-sm text-muted-foreground">/mo</span>
              </div>
              <p className="mt-1 text-sm font-mono-data text-primary">{p.leads} leads / month</p>
              <ul className="mt-5 space-y-2 text-sm">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                    <span className="text-foreground/80">{f}</span>
                  </li>
                ))}
              </ul>
              <Link to="/register" className={`mt-6 block rounded-lg py-2.5 text-center text-sm font-semibold transition ${p.popular ? "bg-primary text-primary-foreground hover:bg-primary/90" : "border border-border bg-background hover:bg-accent"}`}>
                {p.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="px-4 py-16 lg:px-8">
      <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl bg-primary p-12 text-center text-primary-foreground shadow-2xl">
        <h2 className="font-display text-3xl font-bold md:text-4xl">Start finding clients today</h2>
        <p className="mt-3 text-primary-foreground/90">Join thousands of freelancers who've stopped waiting for work to come to them.</p>
        <Link to="/register" className="mt-7 inline-flex items-center gap-2 rounded-xl bg-card px-6 py-3 text-sm font-semibold text-primary shadow-lg transition hover:scale-105">
          Create Free Account <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
