import { Bell, Crown } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useAuth } from "@/contexts/AuthContext";
import { MobileSidebarTrigger } from "./Sidebar";

export function Header({ title, subtitle }: { title: string; subtitle?: string }) {
  const { user } = useAuth();
  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-background/80 px-4 py-3 backdrop-blur lg:px-8">
      <MobileSidebarTrigger />
      <div className="min-w-0 flex-1">
        <h1 className="truncate font-display text-xl font-semibold leading-tight">{title}</h1>
        {subtitle && <p className="truncate text-xs text-muted-foreground">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-2">
        <Link to="/app/upgrade" className="hidden items-center gap-1.5 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-600 sm:inline-flex">
          <Crown className="h-3.5 w-3.5" /> Upgrade to Pro
        </Link>
        <button className="relative grid h-9 w-9 place-items-center rounded-lg border border-border bg-card hover:bg-accent">
          <Bell className="h-4 w-4" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
        </button>
        {user && (
          <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-brand text-xs font-semibold text-white">
            {(user.fullName || "User").split(" ").map((n) => n[0]).join("")}
          </div>
        )}
      </div>
    </header>
  );
}
