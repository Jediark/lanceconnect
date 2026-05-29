import { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  Home, Search, Kanban, Mail, Sparkles, Settings as SettingsIcon, Crown, Menu, X,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { PlanUsageBar } from "@/components/ui/PlanUsageBar";
import { Logo } from "@/components/Logo";
import { cn } from "@/lib/utils";

type NavItem = {
  to: string;
  label: string;
  icon: typeof Home;
  badge?: string;
  highlight?: boolean;
};
type NavGroup = { section: string; items: NavItem[] };

const NAV: NavGroup[] = [
  { section: "Main", items: [
    { to: "/app/dashboard", label: "Dashboard", icon: Home },
    { to: "/app/discover",  label: "Discover Leads", icon: Search },
    { to: "/app/pipeline",  label: "My Pipeline", icon: Kanban },
  ]},
  { section: "Tools", items: [
    { to: "/app/templates", label: "Templates", icon: Mail },
    { to: "/app/upgrade",   label: "AI Generator", icon: Sparkles, badge: "Pro" },
  ]},
  { section: "Account", items: [
    { to: "/app/settings",  label: "Settings", icon: SettingsIcon },
    { to: "/app/upgrade",   label: "Upgrade", icon: Crown, highlight: true },
  ]},
];

export function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { user } = useAuth();
  if (!user) return null;

  return (
    <aside className="flex h-full w-60 shrink-0 flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex items-center justify-between px-5 pb-4 pt-5">
        <Link to="/app/dashboard" className="flex items-center gap-2 text-sidebar-active">
          <Logo size={32} />
          <span className="font-display text-base font-bold">FreelanceConnect</span>
        </Link>
        {onClose && (
          <button onClick={onClose} className="text-sidebar-foreground lg:hidden">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 space-y-5 overflow-y-auto px-3 pb-4">
        {NAV.map((group) => (
          <div key={group.section}>
            <div className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/60">
              {group.section}
            </div>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const active = pathname === item.to;
                const Icon = item.icon;
                return (
                  <li key={item.label}>
                    <Link
                      to={item.to}
                      onClick={onClose}
                      className={cn(
                        "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition",
                        active
                          ? "bg-sidebar-active text-sidebar"
                          : "text-sidebar-foreground hover:bg-sidebar-hover hover:text-sidebar-active",
                        item.highlight && !active && "text-amber-300 hover:text-amber-200",
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="flex-1">{item.label}</span>
                      {item.badge && (
                        <span className="rounded-full bg-amber-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-amber-300">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="space-y-3 border-t border-sidebar-border/60 p-3">
        <PlanUsageBar used={user.leadsUsedThisMonth} limit={user.leadsLimit} plan={user.plan} />
        <Link to="/app/upgrade" onClick={onClose} className="block rounded-lg bg-primary/90 px-3 py-2 text-center text-xs font-medium text-primary-foreground hover:bg-primary">
          Upgrade now
        </Link>
        <div className="flex items-center gap-2 px-1 pt-1">
          <div className="grid h-8 w-8 place-items-center rounded-full bg-gradient-brand text-xs font-semibold text-white">
            {user.fullName.split(" ").map((n) => n[0]).join("")}
          </div>
          <div className="min-w-0 leading-tight">
            <p className="truncate text-xs font-medium text-sidebar-active">{user.fullName}</p>
            <p className="truncate text-[11px] text-sidebar-foreground/70">{user.email}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export function MobileSidebarTrigger() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-center rounded-lg border border-border bg-card p-2 lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 animate-in slide-in-from-left">
            <Sidebar onClose={() => setOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
