import { createFileRoute, Link } from "@tanstack/react-router";
import { Logo } from "@/components/Logo";
import { Home, Search } from "lucide-react";

export const Route = createFileRoute("/404")({
  head: () => ({ meta: [{ title: "Page not found — LanceConnect" }] }),
  component: NotFound,
});

function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <Link to="/" className="flex items-center gap-2">
        <Logo size={36} />
        <span className="font-display text-lg font-bold">LanceConnect</span>
      </Link>
      <p className="mt-12 font-mono-data text-xs uppercase tracking-widest text-primary">// page.not.found</p>
      <h1 className="mt-2 font-display text-5xl font-bold md:text-6xl">404</h1>
      <p className="mt-4 max-w-md text-muted-foreground">This page doesn't exist. But 2.4 million leads do.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link to="/" className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
          <Home className="h-4 w-4" /> Back home
        </Link>
        <Link to="/app/discover" className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-5 py-2.5 text-sm font-semibold hover:bg-accent">
          <Search className="h-4 w-4" /> Find leads
        </Link>
      </div>
    </div>
  );
}
