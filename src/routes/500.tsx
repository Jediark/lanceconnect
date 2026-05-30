import { createFileRoute, Link } from "@tanstack/react-router";
import { Logo } from "@/components/Logo";
import { RotateCw } from "lucide-react";

export const Route = createFileRoute("/500")({
  head: () => ({ meta: [{ title: "Something broke — FreelanceConnect" }] }),
  component: ServerError,
});

function ServerError() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <Link to="/" className="flex items-center gap-2"><Logo size={36}/><span className="font-display text-lg font-bold">FreelanceConnect</span></Link>
      <p className="mt-12 font-mono-data text-sm text-destructive">ERROR 500</p>
      <h1 className="mt-2 font-display text-5xl font-bold md:text-6xl">Something broke on our end.</h1>
      <p className="mt-4 max-w-md text-muted-foreground">Not your fault. We've already been notified and a real person in Buenos Aires is probably looking at it right now.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button onClick={()=>window.location.reload()} className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"><RotateCw className="h-4 w-4"/> Try again</button>
        <Link to="/contact" className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-5 py-2.5 text-sm font-semibold hover:bg-accent">Contact support</Link>
      </div>
    </div>
  );
}
