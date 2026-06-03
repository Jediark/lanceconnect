import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { usePreferences } from "@/contexts/PreferencesContext";

export const Route = createFileRoute("/app/upgrade")({
  head: () => ({ meta: [{ title: "Upgrade — LanceConnect" }] }),
  component: UpgradePage,
});

function UpgradePage() {
  const { user } = useAuth();
  const [annual, setAnnual] = useState(false);
  const { t, formatPrice, getCurrencySymbol } = usePreferences();

  const PLANS = [
    { name: t("plan_free"), monthly: 0, leads: "10", cta: t("plan_cta_free"), popular: false, features: [t("plan_free_feature_1"), t("plan_free_feature_2"), t("plan_free_feature_3")] },
    { name: t("plan_individual"), monthly: 5, leads: "200", cta: t("plan_cta_ind"), popular: true, features: [t("plan_ind_feature_1"), t("plan_ind_feature_2"), t("plan_ind_feature_3"), t("plan_ind_feature_4"), t("plan_ind_feature_5")] },
    { name: t("plan_company"), monthly: 20, leads: "Unlimited", cta: t("plan_cta_comp"), popular: false, features: [t("plan_comp_feature_1"), t("plan_comp_feature_2"), t("plan_comp_feature_3"), t("plan_comp_feature_4"), t("plan_comp_feature_5")] },
  ];

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

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
          {PLANS.map((p) => {
            const rawPrice = annual ? Math.round(p.monthly * 0.8) : p.monthly;
            return (
              <div key={p.name} className={cn("relative rounded-2xl border bg-card p-6", p.popular ? "border-primary shadow-card-hover lg:-translate-y-3" : "border-border shadow-card")}>
                {p.popular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">Most Popular</span>}
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{p.name}</p>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="font-display text-4xl font-bold">{getCurrencySymbol()}{formatPrice(rawPrice)}</span>
                  <span className="text-sm text-muted-foreground">{t("plan_mo")}</span>
                </div>
                <p className="mt-1 text-sm font-mono-data text-primary">{p.leads} {t("plan_leads_mo")}</p>
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
