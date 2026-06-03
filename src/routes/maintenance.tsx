import { createFileRoute, Link } from "@tanstack/react-router";
import { Logo } from "@/components/Logo";
import { Wrench } from "lucide-react";

export const Route = createFileRoute("/maintenance")({
  head: () => ({ meta: [{ title: "Down for maintenance — LanceConnect" }] }),
  component: () => (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <Link to="/" className="flex items-center gap-2"><Logo size={36}/><span className="font-display text-lg font-bold">LanceConnect</span></Link>
      <div className="mt-12 grid h-16 w-16 place-items-center rounded-2xl bg-primary/10 text-primary"><Wrench className="h-7 w-7"/></div>
      <h1 className="mt-5 font-display text-4xl font-bold md:text-5xl">We'll be right back.</h1>
      <p className="mt-4 max-w-md text-muted-foreground">LanceConnect is down for a short upgrade. Usually 15 minutes — never more than an hour. Thanks for your patience.</p>
      <p className="mt-6 font-mono-data text-xs text-muted-foreground">Status: <a className="text-primary hover:underline" href="https://status.LanceConnect.app">status.LanceConnect.app</a></p>
    </div>
  ),
});
