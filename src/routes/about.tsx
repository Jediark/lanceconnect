import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketingShell, PageHeader } from "@/components/marketing/MarketingShell";
import { TEAM, IMG } from "@/data/content";
import { Heart, Globe, Coffee, Compass } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — LanceConnect" },
      { name: "description", content: "We're freelancers building the lead-gen tool we always wished existed. Meet the team." },
      { property: "og:title", content: "About LanceConnect" },
      { property: "og:description", content: "Built by freelancers across 6 countries, for freelancers everywhere." },
    ],
  }),
  component: () => (
    <MarketingShell>
      <PageHeader
        eyebrow="About us"
        title="Built by freelancers, for freelancers."
        subtitle="We started LanceConnect because in 2023 we were freelancers ourselves, refreshing job boards at 11pm and wondering why finding clients was harder than doing the work."
        image={IMG.team}
      />
      <section className="mx-auto max-w-4xl px-4 py-16 lg:px-8">
        <h2 className="font-display text-3xl font-bold">Our story</h2>
        <div className="mt-5 space-y-4 text-base leading-relaxed text-muted-foreground">
          <p>In Lagos, Taiwo was a junior web developer sending 30 cold emails a week and getting 2 replies. In São Paulo, Maria was a designer waiting on referrals that never came. In Nairobi, James was building SEO funnels for clients he found by walking into shops.</p>
          <p>We met in a Slack group for freelancers in 2024, and within a month we'd built the first ugly version of what is now LanceConnect — a Python script that scraped Google Maps for businesses with no website, in our cities.</p>
          <p>It worked. Embarrassingly well. We each landed our first 3 clients in under two weeks. Then we showed it to a few friends. Then 50 freelancers were using it. Then we quit our other gigs to build this properly.</p>
          <p>LanceConnect today is what we wished we'd had on day one of freelancing: a list of real businesses, in our city, that we could realistically help. Nothing fancy. Just the boring, useful thing.</p>
        </div>
      </section>

      <section className="bg-paper py-16 border-y border-border">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <h2 className="font-display text-3xl font-bold text-center">What we believe</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {[
              {icon:Heart,title:"Real work, real clients",desc:"We hate fake leads. Every business in LanceConnect is verifiable on Google Maps."},
              {icon:Globe,title:"Global by default",desc:"Lagos and London matter equally. Pricing is fair from day one."},
              {icon:Coffee,title:"Boring and useful",desc:"No AI buzzwords. Just tools that get you on the phone with a buyer."},
              {icon:Compass,title:"Freelancer-owned",desc:"No VCs telling us to add 'enterprise tier'. We answer to you."},
            ].map(v => (
              <div key={v.title} className="rounded-2xl border border-border bg-card p-6">
                <v.icon className="h-6 w-6 text-primary"/>
                <h3 className="mt-4 font-display text-lg font-semibold">{v.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <h2 className="font-display text-3xl font-bold text-center">The team</h2>
        <p className="mt-3 text-center text-muted-foreground">Six people across six time zones.</p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TEAM.map(m => (
            <div key={m.name} className="flex gap-4 rounded-2xl border border-border bg-card p-5">
              <img src={m.avatar} alt={m.name} className="h-16 w-16 shrink-0 rounded-full object-cover" />
              <div>
                <p className="font-display font-semibold">{m.name}</p>
                <p className="text-xs text-primary">{m.role}</p>
                <p className="text-xs text-muted-foreground">{m.city}</p>
                <p className="mt-2 text-sm text-muted-foreground">{m.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 pb-16 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-2xl bg-foreground p-10 text-center text-background">
          <h3 className="font-display text-2xl font-bold">Want to help us build this?</h3>
          <p className="mt-2 text-sm text-background/80">We're a small team. We hire freelancers we already trust.</p>
          <Link to="/contact" className="mt-5 inline-block rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90">Get in touch</Link>
        </div>
      </section>
    </MarketingShell>
  ),
});
