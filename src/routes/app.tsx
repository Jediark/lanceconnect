import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNav } from "@/components/layout/MobileNav";

export const Route = createFileRoute("/app")({
  beforeLoad: () => {
    if (typeof window !== "undefined" && localStorage.getItem("lance_auth") !== "1") {
      throw redirect({ to: "/login" });
    }
  },
  component: AppLayout,
});

function AppLayout() {
  return (
    <div className="flex min-h-screen bg-background">
      <div className="hidden lg:block">
        <Sidebar />
      </div>
      <main className="flex min-h-screen flex-1 flex-col pb-16 lg:pb-0">
        <Outlet />
      </main>
      <MobileNav />
    </div>
  );
}
