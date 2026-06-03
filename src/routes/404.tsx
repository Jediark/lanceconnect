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
      <Link to="/" className="flex items-center gap-2"><Logo size={36}/><span className="font-display text-lg font-bold">LanceConnect</span></Link>
      <p className="mt-12 font-mono-data text-sm text-primary">ERROR 404</p>
      <h1 className="mt-2 font-display text-5xl font-bold md:text-6xl">This page wandered off.</h1>
      <p className="mt-4 max-w-md text-muted-foreground">We searched our database for it the same way we search for your leads — but it's not here. It probably never was, or it moved.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link to="/" className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"><Home className="h-4 w-4"/> Back home</Link>
        <Link to="/blog" className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-5 py-2.5 text-sm font-semibold hover:bg-accent"><Search className="h-4 w-4"/> Read the blog</Link>
      </div>
    </div>
  );
}
