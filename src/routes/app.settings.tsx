import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { Header } from "@/components/layout/Header";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/settings")({
  head: () => ({ meta: [{ title: "Settings — FreelanceConnect" }] }),
  component: SettingsLayout,
});

const TABS: { to: string; label: string; exact?: boolean }[] = [
  { to: "/app/settings", label: "Overview", exact: true },
  { to: "/app/settings/profile", label: "Profile" },
  { to: "/app/settings/subscription", label: "Subscription" },
  { to: "/app/settings/notifications", label: "Notifications" },
  { to: "/app/settings/danger-zone", label: "Danger Zone" },
];

function SettingsLayout() {
  const pathname = useRouterState({ select: s => s.location.pathname });
  return (
    <>
      <Header title="Settings" />
      <div className="px-4 py-6 lg:px-8">
        <div className="mb-6 flex flex-wrap gap-1 border-b border-border overflow-x-auto">
          {TABS.map(t => {
            const active = t.exact ? pathname === t.to || pathname === "/app/settings/" : pathname === t.to;
            return (
              <Link key={t.to} to={t.to as any} className={cn("whitespace-nowrap border-b-2 px-3 py-2 text-sm font-medium transition", active ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground")}>
                {t.label}
              </Link>
            );
          })}
        </div>
        <Outlet />
      </div>
      <style>{`.input{width:100%;border-radius:.5rem;border:1px solid var(--input);background:var(--background);padding:.55rem .75rem;font-size:.875rem;outline:none}.input:focus{box-shadow:0 0 0 3px color-mix(in oklab, var(--primary) 18%, transparent);border-color:var(--primary)}`}</style>
    </>
  );
}

export function SettingsField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
