import { Outlet, createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { TopNav } from "@/components/layout/TopNav";

export const Route = createFileRoute("/app")({
  beforeLoad: () => {
    if (typeof window !== "undefined") {
      const isDemo = localStorage.getItem("lance_auth") === "1";
      const hasSupabaseSession = Object.keys(localStorage).some(
        (k) => k.startsWith("sb-") && k.endsWith("-auth-token"),
      );
      if (!isDemo && !hasSupabaseSession) {
        throw redirect({ to: "/login" });
      }
    }
  },
  component: AppLayout,
});

function AppLayout() {
  const { user, loading } = useAuth();
  const nav = useNavigate();

  useEffect(() => {
    if (!loading && user && user.id !== "user-1" && !user.onboardingCompleted) {
      nav({ to: "/onboarding" });
    }
  }, [user, loading, nav]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <TopNav />
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
    </div>
  );
}
