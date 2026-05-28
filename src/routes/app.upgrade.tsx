import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/upgrade")({
  head: () => ({ meta: [{ title: "Upgrade — FreelanceConnect" }] }),
  component: UpgradePage,
});

const PLANS = [
  { name: "Free", monthly: 0, leads: "10", cta: "Current Plan", popular: false, features: ["Basic filters", "1 template", "1 seat"] },
  { name: "Starter", monthly: 19, leads: "100", cta: "Get Started", popular: false, features: ["All filters", "5 templates", "CRM pipeline", "CSV export"] },
  { name: "Pro", monthly: 49, leads: "500", cta: "Go Pro", popular: true, features: ["All Starter features", "Unlimited templates", "AI outreach writer", "Priority support"] },
  { name: "Agency", monthly: 99, leads: "Unlimited", cta: "Scale Up", popular: false, features: ["All Pro features", "3 team seats", "API access", "White-label"] },
];

function UpgradePage() {
  const { user } = useAuth();
  const [annual, setAnnual] = useState(false);

  return (
    <>
      <Header title="Upgrade" />
      <div className="space-y-6 px-4 py-6 lg:px-8">
        {user && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            You're on the <strong className="capitalize">{user.plan}</strong> plan · {user.leadsUsedThisMonth}/{user.leadsLimit} leads used this month.
            Upgrade to unlock unlimited leads, AI outreach, and more.
          </div>
        )}

        <div className="flex justify-center">
          <div className="inline-flex rounded-full border border-border bg-card p-1">
            <button onClick={() => setAnnual(false)} className={cn("rounded-full px-4 py-1.5 text-xs font-medium", !annual && "bg-primary text-primary-foreground")}>Monthly</button>
            <button onClick={() => setAnnual(true)} className={cn("rounded-full px-4 py-1.5 text-xs font-medium", annual && "bg-primary text-primary-foreground")}>Annual <span className="ml-1 text-emerald-500">−20%</span></button>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {PLANS.map((p) => {
            const price = annual ? Math.round(p.monthly * 0.8) : p.monthly;
            return (
              <div key={p.name} className={cn("relative rounded-2xl border bg-card p-6", p.popular ? "border-primary shadow-card-hover lg:-translate-y-3" : "border-border shadow-card")}>
                {p.popular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">Most Popular</span>}
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{p.name}</p>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="font-display text-4xl font-bold">${price}</span>
                  <span className="text-sm text-muted-foreground">/mo</span>
                </div>
                <p className="mt-1 text-sm font-mono-data text-primary">{p.leads} leads / month</p>
                <ul className="mt-5 space-y-2 text-sm">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                      <span className="text-foreground/80">{f}</span>
                    </li>
                  ))}
                </ul>
                <button className={cn("mt-6 w-full rounded-lg py-2.5 text-sm font-semibold transition", p.popular ? "bg-primary text-primary-foreground hover:bg-primary/90" : "border border-border bg-background hover:bg-accent")}>
                  {p.cta}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
