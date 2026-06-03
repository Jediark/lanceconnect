import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Search, Kanban, Mail, Settings as SettingsIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS = [
  { to: "/app/dashboard", label: "Home", icon: Home },
  { to: "/app/discover", label: "Discover", icon: Search },
  { to: "/app/pipeline", label: "Pipeline", icon: Kanban },
  { to: "/app/templates", label: "Templates", icon: Mail },
  { to: "/app/settings", label: "Settings", icon: SettingsIcon },
];

export function MobileNav() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-border bg-card lg:hidden">
      {ITEMS.map(({ to, label, icon: Icon }) => {
        const active = path === to;
        return (
          <Link
            key={to}
            to={to}
            className={cn(
              "flex flex-col items-center gap-0.5 py-2 text-[10px] font-medium",
              active ? "text-primary" : "text-muted-foreground",
            )}
          >
            <Icon className="h-5 w-5" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
