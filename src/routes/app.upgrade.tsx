import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Loader2, Info, X } from "lucide-react";
import { DualPaymentButtons } from "@/components/ui/PaymentBranding";
import { Header } from "@/components/layout/Header";
import { z } from "zod";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { usePreferences } from "@/contexts/PreferencesContext";
import { initiateCheckout } from "@/lib/checkout";
import { toast } from "sonner";

const upgradeSearchSchema = z.object({
  canceled: z.string().optional(),
});

export const Route = createFileRoute("/app/upgrade")({
  head: () => ({ meta: [{ title: "Upgrade — LanceConnect" }] }),
  validateSearch: upgradeSearchSchema,
  component: UpgradePage,
});

function UpgradePage() {
  const { user } = useAuth();
  const [annual, setAnnual] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [loadingGateway, setLoadingGateway] = useState<"stripe" | "paystack" | null>(null);
  const { t, formatPrice, getCurrencySymbol, currency } = usePreferences();
  const { canceled } = Route.useSearch();


  const PLANS = [
    {
      id: "free",
      name: t("plan_free"),
      monthly: 0,
      yearly: 0,
      leads: "10/mo",
      cta: t("plan_cta_free"),
      popular: false,
      features: [
        t("plan_free_feature_1"),
        t("plan_free_feature_2"),
        t("plan_free_feature_3"),
      ],
    },
    {
      id: "individual",
      name: t("plan_indiv"),
      monthly: 9,
      yearly: 90,
      leads: "Unlimited",
      cta: t("plan_cta_indiv"),
      popular: true,
      features: [
        t("plan_indiv_feature_1"),
        t("plan_indiv_feature_2"),
        t("plan_indiv_feature_3"),
        t("plan_indiv_feature_4"),
      ],
    },
    {
      id: "company",
      name: t("plan_comp"),
      monthly: 29,
      yearly: 290,
      leads: "Unlimited",
      cta: t("plan_cta_comp"),
      popular: false,
      features: [
        t("plan_comp_feature_1"),
        t("plan_comp_feature_2"),
        t("plan_comp_feature_3"),
        t("plan_comp_feature_4"),
        t("plan_comp_feature_5"),
      ],
    },
  ];

  const handleCheckout = async (planId: string, gateway?: "stripe" | "paystack") => {
    if (planId === "free") {
      toast.info("You're already on the free plan!");
      return;
    }

    setLoadingPlan(planId);
    if (gateway) {
      setLoadingGateway(gateway);
    }
    try {
      const selectedCurrency = gateway === "paystack"
        ? "NGN"
        : (currency === "NGN" ? "USD" : currency);

      const res = await initiateCheckout({
        planName: planId as "individual" | "company",
        currency: selectedCurrency,
        customerEmail: user?.email,
      });

      if (res.url) {
        window.location.href = res.url;
      }
    } finally {
      setLoadingPlan(null);
      setLoadingGateway(null);
    }
  };

  return (
    <>
      <Header title="Upgrade" />
      <div className="space-y-6 px-4 py-6 lg:px-8">
        {canceled && (
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 text-sm text-foreground flex items-center gap-3">
            <Info className="h-5 w-5 text-amber-500 shrink-0" />
            <span>Checkout was canceled. No charges were made. You can try again anytime.</span>
          </div>
        )}
        {user && (
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 text-sm text-foreground">
            LanceConnect is now <strong className="text-primary font-bold">100% Free and Unlimited</strong> for everyone! There are no billing limits, search quotas, or paid plans.
          </div>
        )}

        <div className="flex justify-center">
          <div className="inline-flex rounded-full border border-border bg-card p-1">
            <button
              onClick={() => setAnnual(false)}
              className={cn(
                "rounded-full px-4 py-1.5 text-xs font-medium",
                !annual && "bg-primary text-primary-foreground",
              )}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={cn(
                "rounded-full px-4 py-1.5 text-xs font-medium",
                annual && "bg-primary text-primary-foreground",
              )}
            >
              Annual <span className="ml-1 text-emerald-500">−20%</span>
            </button>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
          {PLANS.map((p) => {
            const rawPrice = annual ? Math.round(p.monthly * 0.8) : p.monthly;
            const isLoading = loadingPlan === p.id;
            return (
              <div
                key={p.name}
                className={cn(
                  "relative rounded-2xl border bg-card p-6",
                  p.popular
                    ? "border-primary shadow-card-hover lg:-translate-y-3"
                    : "border-border shadow-card",
                )}
              >
                {p.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
                    Most Popular
                  </span>
                )}
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  {p.name}
                </p>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="font-display text-4xl font-bold">
                    {getCurrencySymbol()}
                    {formatPrice(rawPrice)}
                  </span>
                  <span className="text-sm text-muted-foreground">{t("plan_mo")}</span>
                </div>
                <p className="mt-1 text-sm font-mono-data text-primary">
                  {p.leads} {t("plan_leads_mo")}
                </p>
                <ul className="mt-5 space-y-2 text-sm">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                      <span className="text-foreground/80">{f}</span>
                    </li>
                  ))}
                </ul>
                {user?.plan === p.id ? (
                  <div className="mt-6 w-full rounded-lg py-2.5 text-sm font-semibold text-center text-muted-foreground border border-border bg-background">
                    Current Plan
                  </div>
                ) : p.id === "free" ? (
                  <button
                    onClick={() => handleCheckout(p.id)}
                    className="mt-6 w-full rounded-lg py-2.5 text-sm font-semibold transition border border-border bg-background hover:bg-accent"
                  >
                    {p.cta}
                  </button>
                ) : (
                  <div className="mt-6">
                    <DualPaymentButtons
                      onStripe={() => handleCheckout(p.id, "stripe")}
                      onPaystack={() => handleCheckout(p.id, "paystack")}
                      stripeLoading={loadingPlan === p.id && loadingGateway === "stripe"}
                      paystackLoading={loadingPlan === p.id && loadingGateway === "paystack"}
                      recommended={currency === "NGN" ? "paystack" : "stripe"}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
