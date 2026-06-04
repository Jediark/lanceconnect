import { Link, useRouterState } from "@tanstack/react-router";
import { User, CreditCard, Bell, ShieldAlert, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";

const SETTINGS_NAV = [
  { to: "/app/settings", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/app/settings/profile", label: "Profile", icon: User },
  { to: "/app/settings/subscription", label: "Billing & Plan", icon: CreditCard },
  { to: "/app/settings/notifications", label: "Notifications", icon: Bell },
  { to: "/app/settings/danger-zone", label: "Security & Danger Zone", icon: ShieldAlert },
];

export function SettingsSidebar() {
  const pathname = useRouterState({ select: s => s.location.pathname });

  return (
    <aside className="w-full md:w-64 shrink-0 pr-4 md:border-r border-border md:pr-8 mb-6 md:mb-0">
      <nav className="flex flex-row md:flex-col gap-1 overflow-x-auto pb-4 md:pb-0">
        {SETTINGS_NAV.map((item) => {
          const active = item.exact 
            ? pathname === item.to || pathname === "/app/settings/" 
            : pathname === item.to;
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to as any}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition whitespace-nowrap",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
