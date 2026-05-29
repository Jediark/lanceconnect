import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Bookmark, CheckCircle2, Globe, LineChart, Mail, Map, Play, Search, Sparkles, Star, Target, Users } from "lucide-react";
import { Logo } from "@/components/Logo";
import { CATEGORIES } from "@/data/mockData";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FreelanceConnect — Find clients. Win work. Grow your freelance business." },
      { name: "description", content: "FreelanceConnect scans the internet for businesses that need your skills and hands you their contact details, ready to reach out. Free plan with 10 leads — no credit card required." },
      { property: "og:title", content: "FreelanceConnect — Lead generation for freelancers" },
      { property: "og:description", content: "Find local businesses that need your skills. Built for freelancers in 150+ countries." },
    ],
  }),
  component: Landing,
});

function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <Logo size={32} />
          <span className="font-display text-base font-bold">FreelanceConnect</span>
        </Link>
        <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
          <a href="#features" className="hover:text-foreground">Features</a>
          <a href="#pricing" className="hover:text-foreground">Pricing</a>
          <a href="#how" className="hover:text-foreground">How it works</a>
        </nav>
        <div className="flex items-center gap-2">
          <Link to="/login" className="rounded-lg px-3 py-1.5 text-sm font-medium text-foreground hover:bg-accent">Login</Link>
          <Link to="/register" className="rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90">Start Free</Link>
        </div>
      </div>
    </header>
  );
}

function MiniLeadCard({ name, type, city, score, color }: { name: string; type: string; city: string; score: number; color: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 shadow-card">
      <div className="grid h-10 w-10 place-items-center rounded-lg bg-gradient-brand text-white">
        <Globe className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">{name}</p>
        <p className="truncate text-[11px] text-muted-foreground">{type} · {city}</p>
      </div>
      <span className={`relative inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold text-white font-mono-data ${color}`}>
        {score === 96 && <span className="absolute -left-1 -top-1 h-2 w-2 animate-pulse-dot rounded-full bg-red-400" />}
        {score}
      </span>
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-60" />
      <div className="absolute -left-32 top-20 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute -right-32 top-40 h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl" />
      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-16 lg:grid-cols-2 lg:gap-8 lg:px-8 lg:py-24">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/80 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
            🌍 Works in 150+ countries
          </span>
          <h1 className="mt-5 font-display text-5xl font-bold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
            Find clients.<br />
            <span className="text-gradient-brand">Win work.</span><br />
            Grow your<br />
            freelance business.
          </h1>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-muted-foreground md:text-lg">
            FreelanceConnect scans the internet for businesses that need your skills — then hands you their contact details, ready to reach out.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link to="/register" className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition hover:bg-primary/90">
              Start for Free <ArrowRight className="h-4 w-4" />
            </Link>
            <a href="#how" className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-3 text-sm font-semibold hover:bg-accent">
              <Play className="h-4 w-4" /> See how it works
            </a>
          </div>
          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> No credit card required</span>
            <span className="flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> 10 free leads instantly</span>
            <span className="flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Cancel anytime</span>
          </div>
        </div>

        <div className="relative">
          <div className="relative mx-auto max-w-md rounded-2xl border border-border bg-card p-4 shadow-2xl">
            <div className="mb-3 flex items-center gap-2 border-b border-border pb-3">
              <Search className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Web Dev · Italy · No website</span>
              <span className="ml-auto rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">8 leads</span>
            </div>
            <div className="space-y-2">
              <MiniLeadCard name="Boulangerie Dupont" type="Bakery" city="Lyon" score={96} color="bg-emerald-500" />
              <MiniLeadCard name="Mario's Ristorante" type="Restaurant" city="Naples" score={92} color="bg-emerald-500" />
              <MiniLeadCard name="Café Mirador" type="Café" city="Buenos Aires" score={88} color="bg-emerald-500" />
              <MiniLeadCard name="Lagos Hair Studio" type="Salon" city="Lagos" score={78} color="bg-indigo-500" />
              <MiniLeadCard name="Smith & Sons" type="Plumbing" city="Manchester" score={61} color="bg-amber-500" />
            </div>
          </div>
          <div className="absolute -bottom-4 -right-4 hidden rounded-xl border border-border bg-card px-3 py-2 shadow-lg sm:block">
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Avg response rate</p>
            <p className="font-display text-lg font-bold text-emerald-600">+34%</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function SocialProof() {
  const items = ["Web Developers", "Graphic Designers", "Copywriters", "SEO Specialists", "Videographers", "Photographers", "Social Media Managers", "App Developers", "Virtual Assistants", "Consultants"];
  return (
    <section className="border-y border-border bg-muted/40 py-8">
      <p className="text-center text-xs font-medium uppercase tracking-widest text-muted-foreground">
        Trusted by freelancers in 50+ countries
      </p>
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
        <div className="absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent md:block" />
        {steps.map((s, i) => (
          <div key={s.title} className="relative rounded-2xl border border-border bg-card p-6 shadow-card">
            <div className="mb-4 grid h-14 w-14 place-items-center rounded-xl bg-gradient-brand text-white">
              <s.icon className="h-6 w-6" />
            </div>
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
    { icon: Star, title: "Opportunity Scoring", desc: "AI-powered score showing how much a business needs you." },
    { icon: Mail, title: "Contact Details", desc: "Phone numbers, emails, and social profiles in one click." },
    { icon: Bookmark, title: "Built-in CRM", desc: "Track your outreach with a simple, freelancer-friendly pipeline." },
    { icon: Users, title: "Outreach Templates", desc: "Ready-made emails, phone scripts, and DM templates." },
    { icon: Sparkles, title: "AI Message Writer", desc: "Personalized outreach generated in seconds. (Pro)" },
  ];
  return (
    <section id="features" className="bg-muted/30 py-20">
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
          <div key={c.id} className="rounded-xl border border-border bg-card p-4 transition hover:border-primary/50 hover:shadow-card">
            <div className="text-3xl">{c.emoji}</div>
            <p className="mt-2 font-display text-sm font-semibold">{c.label}</p>
            <p className="mt-1 text-xs text-muted-foreground">{c.example}</p>
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
    <section id="pricing" className="bg-muted/30 py-20">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold md:text-4xl">Simple, transparent pricing</h2>
          <p className="mt-3 text-muted-foreground">Start free. Upgrade when you're winning work.</p>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {plans.map((p) => (
            <div key={p.name} className={`relative rounded-2xl border bg-card p-6 ${p.popular ? "border-primary shadow-card-hover lg:-translate-y-3" : "border-border shadow-card"}`}>
              {p.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
                  Most Popular
                </span>
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
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
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

function Testimonials() {
  const items = [
    { quote: "I found 3 new clients in my first week. The opportunity scoring tells me exactly which businesses to call first.", name: "Taiwo A.", role: "Web Developer", city: "Lagos", color: "bg-emerald-500" },
    { quote: "As a copywriter, I never knew how to find leads. Now I have a full pipeline every Monday morning.", name: "Maria S.", role: "Copywriter", city: "São Paulo", color: "bg-pink-500" },
    { quote: "The phone call scripts are gold. I went from zero cold calls to booking 2 meetings a day.", name: "James K.", role: "SEO Specialist", city: "Nairobi", color: "bg-indigo-500" },
  ];
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-display text-3xl font-bold md:text-4xl">Freelancers love FreelanceConnect</h2>
      </div>
      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {items.map((t) => (
          <div key={t.name} className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <div className="mb-3 flex gap-0.5 text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
            </div>
            <p className="text-sm leading-relaxed text-foreground/90">"{t.quote}"</p>
            <div className="mt-5 flex items-center gap-3">
              <div className={`grid h-10 w-10 place-items-center rounded-full text-sm font-semibold text-white ${t.color}`}>
                {t.name.charAt(0)}
              </div>
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

function CTA() {
  return (
    <section className="px-4 py-16 lg:px-8">
      <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl bg-gradient-brand p-12 text-center text-white shadow-2xl">
        <h2 className="font-display text-3xl font-bold md:text-4xl">Start finding clients today</h2>
        <p className="mt-3 text-white/90">Join thousands of freelancers who've stopped waiting for work to come to them.</p>
        <Link to="/register" className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-primary shadow-lg transition hover:scale-105">
          Create Free Account <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}

function Footer() {
  const cols = [
    { title: "Product", links: ["Features", "Pricing", "How it works", "Changelog"] },
    { title: "Company", links: ["About", "Blog", "Contact", "Careers"] },
    { title: "Resources", links: ["Help Center", "Templates", "API Docs"] },
    { title: "Legal", links: ["Privacy Policy", "Terms of Service", "Cookie Policy"] },
  ];
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="grid gap-8 md:grid-cols-5">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2">
              <Logo size={32} />
              <span className="font-display font-bold">FreelanceConnect</span>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">Lead generation built for freelancers worldwide.</p>
          </div>
          {cols.map((c) => (
            <div key={c.title}>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">{c.title}</p>
              <ul className="space-y-2 text-sm">
                {c.links.map((l) => <li key={l}><a href="#" className="text-foreground/70 hover:text-foreground">{l}</a></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          © 2026 FreelanceConnect. Built for freelancers worldwide. 🌍
        </div>
      </div>
    </footer>
  );
}

function Landing() {
  return (
    <div>
      <Nav />
      <Hero />
      <SocialProof />
      <HowItWorks />
      <Features />
      <WhoFor />
      <Pricing />
      <Testimonials />
      <CTA />
      <Footer />
    </div>
  );
}
