import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { TEAM, IMG } from "@/data/content";
import { Heart, Globe, Coffee, Compass, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — LanceConnect" },
      { name: "description", content: "Bridging the gap between skilled freelancers and the clients looking for their expertise." },
      { property: "og:title", content: "About LanceConnect" },
      { property: "og:description", content: "Connecting freelancers and clients in a simple, trusted, and human way." },
    ],
  }),
  component: () => (
    <MarketingShell>
      {/* Premium Dark Hero */}
      <section className="relative overflow-hidden border-b border-border bg-[#080B14] py-20 lg:py-28 text-center select-none text-white">
        <div className="relative mx-auto max-w-3xl px-4 lg:px-8 z-10">
          <p className="text-xs font-mono text-slate-400 mb-2 tracking-widest uppercase">
            // about.us.connector
          </p>
          <h1 className="font-display text-4xl font-extrabold mt-3 sm:text-5xl tracking-tight leading-tight text-white">
            Connecting Freelancers<br/>and Clients with <span className="text-primary">Purpose.</span>
          </h1>
          <p className="mt-6 text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
            We exist to bridge the gap between skilled professionals and the businesses that need them. Not just another marketplace—a true connector.
          </p>
        </div>
      </section>

      {/* Our Story & Mission/Vision (Split Layout) */}
      <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8 bg-background">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Left: Our Story */}
          <div className="lg:col-span-7 space-y-6">
            <p className="text-xs font-mono text-[#64748B] tracking-widest uppercase">// our.story</p>
            <h2 className="font-display text-3xl font-extrabold tracking-tight leading-tight">
              We built LanceConnect to give talent access to opportunity.
            </h2>
            <div className="space-y-5 text-sm text-muted-foreground leading-relaxed">
              <p>
                We built <strong>LanceConnect</strong> because too many freelancers have the skills, the drive, and the potential—but not the client base to grow their careers. They are ready to work, ready to deliver value, yet they often lack a reliable way to connect with the clients who need their services.
              </p>
              <p>
                The world has shifted into a <strong>connector economy</strong>—where success is built on meaningful connections. But many platforms still connect freelancers to low-paying gigs or short-term opportunities that disappear as quickly as they appear. We believed there had to be a better way.
              </p>
              <p>
                That's why we created <strong>LanceConnect</strong>—a place where freelancers and clients can find each other with purpose. A place where talent meets real opportunity, and businesses connect with people who can help them grow. Not just another marketplace. A true connector.
              </p>
            </div>
          </div>

          {/* Right: Vision & Mission (Bento Grid Cards) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Vision Card */}
            <div className="relative rounded-2xl border border-border bg-card p-6 shadow-card group hover:border-primary/30 transition duration-300">
              <span className="text-[10px] font-mono text-primary uppercase tracking-widest block mb-2">// vision</span>
              <h3 className="font-display text-lg font-bold mb-2">Sustainable Careers</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                To make freelancing sustainable by giving every skilled professional direct access to clients who value their work.
              </p>
            </div>

            {/* Mission Card */}
            <div className="relative rounded-2xl border border-border bg-card p-6 shadow-card group hover:border-[#10B981]/30 transition duration-300">
              <span className="text-[10px] font-mono text-secondary uppercase tracking-widest block mb-2">// mission</span>
              <h3 className="font-display text-lg font-bold mb-2">Human-Centered Connections</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                To connect freelancers and clients in a simple, trusted, and human way—turning skills into opportunities and opportunities into lasting relationships.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What We Believe Section */}
      <section className="bg-muted/50 py-20 border-y border-border">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-12">
            <p className="text-xs font-mono text-[#64748B] mb-2 tracking-widest uppercase">// core.values</p>
            <h2 className="font-display text-3xl font-extrabold tracking-tight">What we believe</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Heart, title: "Real work, real clients", desc: "We hate fake leads. Every business in LanceConnect is verifiable on Google Maps." },
              { icon: Globe, title: "Global by default", desc: "Lagos and London matter equally. Pricing is fair from day one." },
              { icon: Coffee, title: "Boring and useful", desc: "No AI buzzwords. Just tools that get you on the phone with a buyer." },
              { icon: Compass, title: "Freelancer-owned", desc: "No VCs telling us to add 'enterprise tier'. We answer to you." },
            ].map(v => (
              <div key={v.title} className="rounded-2xl border border-border bg-card p-6 shadow-card group hover:border-primary/20 transition duration-300">
                <v.icon className="h-6 w-6 text-primary mb-4" />
                <h3 className="font-display text-base font-bold mb-2">{v.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why We Exist & The Reason Behind LanceConnect */}
      <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8 bg-background">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-start">
          {/* Left Column: Why We Exist */}
          <div className="lg:col-span-5 space-y-6">
            <p className="text-xs font-mono text-[#64748B] tracking-widest uppercase">// purpose</p>
            <h2 className="font-display text-3xl font-extrabold tracking-tight leading-tight">
              Why We Exist
            </h2>
            <ul className="space-y-4">
              {[
                "Because freelancers shouldn't have to struggle to find clients.",
                "Because great talent deserves access to real opportunities.",
                "Because clients shouldn't have to struggle to find the right people.",
                "Because the connector economy needs a platform built for people, not just algorithms."
              ].map((bullet, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="h-5 w-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs shrink-0 mt-0.5 font-bold">✓</span>
                  <span className="text-sm text-muted-foreground leading-relaxed">{bullet}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Column: The Reason Behind LanceConnect */}
          <div className="lg:col-span-7 space-y-6">
            <p className="text-xs font-mono text-[#64748B] tracking-widest uppercase">// mission.details</p>
            <h2 className="font-display text-3xl font-extrabold tracking-tight leading-tight">
              Bridging The Gap
            </h2>
            <div className="space-y-5 text-sm text-muted-foreground leading-relaxed">
              <p>
                We exist to <strong>bridge the gap</strong> between skilled freelancers and the clients looking for their expertise.
              </p>
              <p>
                Our goal is to make freelancing less about chasing leads and more about doing meaningful work. We want to give freelancers a direct path to opportunities and give clients confidence that the right person is only one connection away.
              </p>
              <p className="border-l-2 border-primary pl-4 py-1 text-muted-foreground italic font-medium bg-primary/5 rounded-r-lg">
                "At its core, LanceConnect is built on a simple belief: the right opportunity can change a career, and the right connection can change everything."
              </p>
              <p className="text-xs font-mono text-[#64748B] pt-2">
                // The foundation: freelancers don't lack talent — they lack access to clients and opportunities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Parallax Divider */}
      <section 
        className="bg-parallax relative h-[320px] w-full flex items-center justify-center"
        style={{ backgroundImage: "url('/assets/freelancers/freelancer_14.jpg')" }}
      >
        <div className="absolute inset-0 bg-[#080B14]/75 z-0" />
        <div className="relative z-10 text-center max-w-xl px-4 text-white">
          <p className="text-xs font-mono text-primary uppercase tracking-widest">// human.centered.connection</p>
          <blockquote className="mt-4 font-display text-2xl font-bold italic leading-relaxed text-white">
            "A calm workspace designed for doing your best work, winning clients, and building a sustainable business."
          </blockquote>
        </div>
      </section>

      {/* The Team Section */}
      <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8 bg-background">
        <div className="mx-auto max-w-2xl text-center mb-12">
          <p className="text-xs font-mono text-[#64748B] mb-2 tracking-widest uppercase">// our.team</p>
          <h2 className="font-display text-3xl font-extrabold tracking-tight">Meet the builders</h2>
          <p className="mt-3 text-sm text-muted-foreground">Six people across six time zones, building for freelancers everywhere.</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TEAM.map(m => (
            <div key={m.name} className="flex gap-4 rounded-2xl border border-border bg-card p-5 shadow-card group hover:border-primary/20 transition duration-300">
              <img src={m.avatar} alt={m.name} className="h-14 w-14 shrink-0 rounded-full object-cover border-2 border-primary/20" />
              <div>
                <p className="font-display font-bold text-base leading-snug">{m.name}</p>
                <p className="text-xs text-primary font-medium mt-0.5">{m.role}</p>
                <p className="text-[10px] text-slate-500 font-mono mt-0.5">{m.city}</p>
                <p className="mt-3 text-xs text-muted-foreground leading-relaxed">{m.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 pb-20 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-3xl border border-border bg-card p-12 text-center relative overflow-hidden shadow-2xl">
          <h3 className="font-display text-2xl font-bold relative z-10">Want to help us build LanceConnect?</h3>
          <p className="mt-3 text-sm text-muted-foreground max-w-lg mx-auto relative z-10">We are always looking to partner with talented freelancers who care about this mission.</p>
          <Link to="/contact" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition shadow-lg relative z-10">
            Get in touch <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </MarketingShell>
  ),
});
