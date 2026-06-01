import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/Logo";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export function MarketingNav() {
  const [open, setOpen] = useState(false);
  const links = [
    { to: "/features", label: "Features" },
    { to: "/how-it-works", label: "How it works" },
    { to: "/pricing", label: "Pricing" },
    { to: "/blog", label: "Blog" },
    { to: "/about", label: "About" },
  ];
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <Logo size={32} />
          <span className="font-display text-base font-bold tracking-tight">FreelanceConnect</span>
        </Link>
        <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
          {links.map((l) => (
            <Link key={l.to} to={l.to} className="hover:text-foreground" activeProps={{ className: "text-foreground font-semibold" }}>
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <Link to="/login" className="rounded-lg px-3 py-1.5 text-sm font-medium hover:bg-accent">Login</Link>
          <Link to="/register" className="rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90">Start Free</Link>
        </div>
        <button onClick={() => setOpen(!open)} className="md:hidden rounded-lg p-2 hover:bg-accent" aria-label="Menu">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <div className="flex flex-col px-4 py-3">
            {links.map((l) => (
              <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="rounded-md px-3 py-2 text-sm hover:bg-accent">
                {l.label}
              </Link>
            ))}
            <Link to="/login" onClick={() => setOpen(false)} className="rounded-md px-3 py-2 text-sm hover:bg-accent">Login</Link>
            <Link to="/register" onClick={() => setOpen(false)} className="mt-1 rounded-md bg-primary px-3 py-2 text-center text-sm font-semibold text-primary-foreground">Start Free</Link>
          </div>
        </div>
      )}
    </header>
  );
}

export function MarketingFooter() {
  const cols = [
    { title: "Product", links: [["Features","/features"],["Pricing","/pricing"],["How it works","/how-it-works"],["Changelog","/changelog"]] as const },
    { title: "Company", links: [["About","/about"],["Blog","/blog"],["Contact","/contact"]] as const },
    { title: "For freelancers", links: [["Web Developers","/freelancers/web-developers"],["Designers","/freelancers/designers"],["Copywriters","/freelancers/copywriters"],["SEO Specialists","/freelancers/seo-specialists"]] as const },
    { title: "Legal", links: [["Privacy Policy","/privacy"],["Terms of Service","/terms"]] as const },
  ];
  return (
    <footer className="border-t border-border bg-paper">
      <div className="mx-auto max-w-7xl px-4 py-14 lg:px-8">
        <div className="grid gap-10 md:grid-cols-5">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2">
              <Logo size={28} />
              <span className="font-display text-sm font-bold">FreelanceConnect</span>
            </Link>
            <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
              Lead generation built by freelancers, for freelancers. Find businesses that need your skills in 150+ countries.
            </p>
          </div>
          {cols.map((c) => (
            <div key={c.title}>
              <p className="text-xs font-semibold uppercase tracking-widest text-foreground">{c.title}</p>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                {c.links.map(([label, href]) => (
                  <li key={label}>
                    <Link to={href} className="hover:text-foreground">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} FreelanceConnect. Made by freelancers, for freelancers.</p>
          <p>Crafted in Lagos · Naples · Buenos Aires</p>
        </div>
      </div>
    </footer>
  );
}

export function MarketingShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <MarketingNav />
      <main className="flex-1">{children}</main>
      <MarketingFooter />
    </div>
  );
}

/** Reusable simple page header for inner marketing pages. Uses a full-bleed background image. */
export function PageHeader({
  eyebrow,
  title,
  subtitle,
  image,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  image?: string;
}) {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="absolute inset-0">
        {image && <img src={image} alt="" className="h-full w-full object-cover" />}
        <div className="absolute inset-0 bg-[color:var(--ink-bg)]/85" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[color:var(--ink-bg)]/40 to-[color:var(--ink-bg)]/70" />
      </div>
      <div className="relative mx-auto max-w-5xl px-4 py-20 text-center text-white lg:px-8 lg:py-28">
        {eyebrow && (
          <span className="inline-block rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-white/90 backdrop-blur">
            {eyebrow}
          </span>
        )}
        <h1 className="mt-5 font-display text-4xl font-semibold tracking-[-0.02em] md:text-5xl lg:text-6xl">{title}</h1>
        {subtitle && <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/80 md:text-lg">{subtitle}</p>}
      </div>
    </section>
  );
}
