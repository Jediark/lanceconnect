import { createFileRoute, Link } from "@tanstack/react-router";
import { useAuth } from "@/contexts/AuthContext";
import { User, CreditCard, Bell, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/app/settings/")({
  component: SettingsOverview,
});

function SettingsOverview() {
  const { user } = useAuth();
  if (!user) return null;
  const cards = [
    { to: "/app/settings/profile", icon: User, title: "Profile", desc: "Name, bio, avatar, freelancer category" },
    { to: "/app/settings/subscription", icon: CreditCard, title: "Subscription", desc: `Current plan: ${user.plan}` },
    { to: "/app/settings/notifications", icon: Bell, title: "Notifications", desc: "Email alerts and weekly digest" },
    { to: "/app/settings/danger-zone", icon: AlertTriangle, title: "Danger Zone", desc: "Export or delete your account" },
  ];
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {cards.map(c => (
        <Link key={c.to} to={c.to} className="group rounded-2xl border border-border bg-card p-5 transition hover:border-primary hover:shadow-card">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary"><c.icon className="h-5 w-5"/></div>
          <h3 className="mt-4 font-display text-lg font-semibold group-hover:text-primary">{c.title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{c.desc}</p>
        </Link>
      ))}
    </div>
  );
}
