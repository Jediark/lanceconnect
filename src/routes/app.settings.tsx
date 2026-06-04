import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Header } from "@/components/layout/Header";
import { SettingsSidebar } from "@/components/layout/SettingsSidebar";

export const Route = createFileRoute("/app/settings")({
  head: () => ({ meta: [{ title: "Settings — LanceConnect" }] }),
  component: SettingsLayout,
});

function SettingsLayout() {
  return (
    <>
      <Header title="Account & Settings" subtitle="Manage your profile, billing, and preferences." />
      <div className="flex flex-col md:flex-row px-4 py-8 lg:px-8 max-w-7xl mx-auto w-full">
        <SettingsSidebar />
        <div className="flex-1 min-w-0 md:pl-8">
          <Outlet />
        </div>
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
