import { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { initiateDonation } from "@/lib/checkout";
import { toast } from "sonner";
import { Heart, Globe, CreditCard, ShieldCheck, Cpu, Code, HelpCircle, ArrowRight, Loader2 } from "lucide-react";
import { PaymentButton, PaymentTrustBadge } from "@/components/ui/PaymentBranding";

export const Route = createFileRoute("/support-us")({
  head: () => ({
    meta: [
      { title: "Keep LanceConnect Free for Everyone — Support Us" },
      {
        name: "description",
        content: "LanceConnect is free and always will be. Voluntary donations keep us running for freelancers globally.",
      },
    ],
  }),
  component: SupportUsPage,
});

function SupportUsPage() {
  const { user } = useAuth();

  // ── International (Stripe) donation state ──
  const [stripeAmount, setStripeAmount] = useState<number | "">(5);
  const [stripeCurrency, setStripeCurrency] = useState<"USD" | "EUR" | "GBP">("USD");
  const [stripeSubmitting, setStripeSubmitting] = useState(false);

  // ── Nigerian (Paystack) donation state ──
  const [donationAmount, setDonationAmount] = useState<number | "">(1000);
  const [donorName, setDonorName] = useState(user?.fullName || "");
  const [showOnWall, setShowOnWall] = useState(true);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // ── Supporters wall ──
  const [supporters, setSupporters] = useState<any[]>([]);

  useEffect(() => {
    async function loadSupporters() {
      try {
        const { data, error } = await supabase
          .from("donations")
          .select("donor_name, created_at, profiles(city, country)")
          .eq("show_on_wall", true)
          .order("created_at", { ascending: false })
          .limit(30);
        if (!error && data) {
          setSupporters(data);
        }
      } catch (err) {
        console.error("Failed to load supporters wall:", err);
      }
    }
    loadSupporters();
  }, []);

  // ── Stripe Donation Handler ──
  const handleStripeDonation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripeAmount || stripeAmount <= 0) {
      toast.error("Please enter a valid donation amount.");
      return;
    }

    setStripeSubmitting(true);
    try {
      const res = await initiateDonation({
        amount: Number(stripeAmount),
        currency: stripeCurrency,
        email: user?.email || "",
        donorName: user?.fullName || "Anonymous",
      });

      if (res.url) {
        window.location.href = res.url;
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to initialize Stripe donation.");
    } finally {
      setStripeSubmitting(false);
    }
  };

  // ── Paystack Donation Handler ──
  const handlePaystackDonation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please log in first to donate via Paystack so we can verify your account.");
      return;
    }
    if (!donationAmount || donationAmount <= 0) {
      toast.error("Please enter a valid donation amount.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await initiateDonation({
        amount: Number(donationAmount),
        currency: "NGN",
        email: user.email || "",
        donorName: donorName || "Anonymous",
        message,
        showOnWall,
      });

      if (res.url) {
        window.location.href = res.url;
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to initialize Paystack donation.");
    } finally {
      setSubmitting(false);
    }
  };

  const currencySymbol = stripeCurrency === "EUR" ? "€" : stripeCurrency === "GBP" ? "£" : "$";

  return (
    <MarketingShell>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#020b21] py-20 text-center text-white border-b border-border select-none">
        <div className="absolute inset-0 bg-dot-pattern opacity-30 pointer-events-none" />
        <div className="relative z-10 mx-auto max-w-3xl px-4">
          <p className="text-xs font-mono text-cyan-400 mb-3 uppercase tracking-widest flex items-center justify-center gap-1.5">
            <Heart className="h-4.5 w-4.5 text-rose-500 fill-current animate-pulse" /> // support.our.mission
          </p>
          <h1 className="font-display text-4xl font-extrabold sm:text-5xl md:text-6xl tracking-tight leading-tight">
            LanceConnect is free.
            <span className="block text-cyan-400 drop-shadow-[0_0_12px_rgba(34,211,238,0.4)]">
              It will always be free.
            </span>
          </h1>
          <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-xl mx-auto font-mono">
            No tricks. No hidden paywalls. No credit card required. Ever.
          </p>
          <p className="mt-6 text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Building and maintaining this platform costs real money every month — servers, APIs, data, development and support.
          </p>
          <p className="mt-4 text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
            If LanceConnect has helped you find a client, land a deal, grow your business, or connect with an opportunity you wouldn't have found otherwise — please consider donating any amount to keep it running for the thousands of freelancers and businesses who depend on it worldwide.
          </p>
          <p className="mt-4 text-xs sm:text-sm font-semibold text-slate-300 max-w-xl mx-auto">
            Every contribution, big or small, goes directly into keeping this platform free for everyone. 🌍
          </p>
        </div>
      </section>

      {/* Donation Grid */}
      <section className="mx-auto max-w-5xl px-4 py-16">
        <div className="grid gap-8 md:grid-cols-2">
          {/* Option 1 — International (Stripe) */}
          <div className="rounded-3xl border border-border bg-card p-8 flex flex-col justify-between shadow-lg hover:border-primary/20 transition-all duration-300">
            <div className="space-y-4">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 font-bold">
                🌍
              </span>
              <h3 className="font-display text-lg font-bold text-foreground">International Supporters</h3>
              <p className="text-xs text-muted-foreground">
                Pay in USD, GBP, or EUR securely via Stripe. Cards, Google Pay, and Apple Pay accepted.
              </p>

              <form onSubmit={handleStripeDonation} className="space-y-3 pt-2">
                <div>
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Currency
                  </label>
                  <div className="mt-1 flex gap-1.5">
                    {(["USD", "EUR", "GBP"] as const).map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setStripeCurrency(c)}
                        className={`rounded-lg px-3 py-1.5 text-[11px] font-bold border transition ${
                          stripeCurrency === c
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border bg-background text-muted-foreground hover:border-primary/30"
                        }`}
                      >
                        {c === "USD" ? "$ USD" : c === "EUR" ? "€ EUR" : "£ GBP"}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Donation Amount ({currencySymbol})
                  </label>
                  <div className="mt-1 flex gap-1.5">
                    {[3, 5, 10, 25].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setStripeAmount(amt)}
                        className={`rounded-lg px-3 py-1.5 text-[11px] font-bold border transition ${
                          stripeAmount === amt
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border bg-background text-muted-foreground hover:border-primary/30"
                        }`}
                      >
                        {currencySymbol}{amt}
                      </button>
                    ))}
                  </div>
                  <input
                    type="number"
                    min="1"
                    placeholder="Or enter custom amount"
                    value={stripeAmount}
                    onChange={(e) => setStripeAmount(e.target.value === "" ? "" : Number(e.target.value))}
                    className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-mono text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary h-[38px]"
                  />
                </div>
                <PaymentButton
                  gateway="stripe"
                  type="submit"
                  loading={stripeSubmitting}
                  disabled={stripeSubmitting}
                />
              </form>
            </div>
            <p className="text-[10px] text-center text-muted-foreground mt-4 italic font-mono">
              PCI-DSS Level 1 certified · 256-bit SSL encryption
            </p>
          </div>

          {/* Option 2 — Nigeria (Paystack) */}
          <div className="rounded-3xl border border-border bg-card p-8 flex flex-col justify-between shadow-lg hover:border-primary/20 transition-all duration-300">
            <div className="space-y-4">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 font-bold">
                🇳🇬
              </span>
              <h3 className="font-display text-lg font-bold text-foreground">Nigerian Supporters</h3>
              <p className="text-xs text-muted-foreground">
                Pay in Naira via card, bank transfer, or USSD code.
              </p>

              {user ? (
                <form onSubmit={handlePaystackDonation} className="space-y-3 pt-2">
                  <div>
                    <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Donation Amount (₦)
                    </label>
                    <div className="mt-1 flex gap-1.5">
                      {[500, 1000, 5000, 10000].map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => setDonationAmount(amt)}
                          className={`rounded-lg px-2.5 py-1.5 text-[11px] font-bold border transition ${
                            donationAmount === amt
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border bg-background text-muted-foreground hover:border-primary/30"
                          }`}
                        >
                          ₦{amt.toLocaleString()}
                        </button>
                      ))}
                    </div>
                    <input
                      type="number"
                      required
                      min="100"
                      placeholder="Or enter custom amount"
                      value={donationAmount}
                      onChange={(e) => setDonationAmount(e.target.value === "" ? "" : Number(e.target.value))}
                      className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-mono text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary h-[38px]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Display Name on Wall
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Taiwo A., Anonymous"
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary h-[38px]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Heartfelt Message (optional)
                    </label>
                    <textarea
                      placeholder="Your words keep us motivated..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={1}
                      className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                    />
                  </div>
                  <label className="flex cursor-pointer items-center gap-2 py-1 select-none text-[11px] text-muted-foreground">
                    <input
                      type="checkbox"
                      checked={showOnWall}
                      onChange={(e) => setShowOnWall(e.target.checked)}
                      className="h-3.5 w-3.5 accent-primary rounded"
                    />
                    <span>Show my name on the supporter wall below</span>
                  </label>
                  <PaymentButton
                    gateway="paystack"
                    type="submit"
                    loading={submitting}
                    disabled={submitting}
                  />
                </form>
              ) : (
                <div className="pt-6 pb-2 text-center space-y-4">
                  <p className="text-xs text-amber-500 border border-amber-500/20 bg-amber-500/5 rounded-xl p-3">
                    🔒 Logged-in accounts only can initiate Naira Paystack transactions for auditing/receipting.
                  </p>
                  <Link
                    to="/login"
                    className="inline-flex w-full justify-center items-center gap-1.5 rounded-xl bg-primary py-2.5 text-xs font-bold text-white hover:brightness-110 transition cursor-pointer"
                  >
                    Log In to Donate via Paystack <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              )}
            </div>
            <p className="text-[10px] text-center text-muted-foreground mt-4 italic font-mono">
              Paystack is CBN-licensed · PCI-DSS compliant
            </p>
          </div>
        </div>
      </section>

      {/* Transparency Section */}
      <section className="border-y border-border bg-card/30 py-16">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="font-display text-2xl font-bold text-foreground text-center flex items-center justify-center gap-2">
            <ShieldCheck className="h-6 w-6 text-primary" /> Transparency: Where your donation goes
          </h2>
          <p className="mt-2 text-xs text-muted-foreground text-center max-w-md mx-auto">
            We operate under pure goodwill. Every single cent and kobo is accounted for and spent directly on maintaining LanceConnect.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {[
              {
                icon: Cpu,
                title: "Server & hosting costs",
                desc: "Keeping our search engines, caching, and server routing online 24/7/365.",
              },
              {
                icon: Globe,
                title: "API services",
                desc: "Data verification API calls (phone lookups, SMTP checks, scraper credits).",
              },
              {
                icon: Code,
                title: "Platform development",
                desc: "Adding new countries, tracking opportunities, and building features.",
              },
              {
                icon: ShieldCheck,
                title: "Security & maintenance",
                desc: "SSL certificates, database security parameters, and backup utilities.",
              },
              {
                icon: HelpCircle,
                title: "Support & community",
                desc: "Providing verification assistance and keeping spam off the platform.",
              },
            ].map((item, idx) => (
              <div key={idx} className="rounded-2xl border border-border bg-card p-5 space-y-2.5">
                <div className="text-primary">
                  <item.icon className="h-5 w-5" />
                </div>
                <h4 className="text-xs font-bold text-foreground">{item.title}</h4>
                <p className="text-[11px] text-muted-foreground leading-normal">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center font-mono text-[11px] text-slate-500">
            💡 LanceConnect is built by freelancers, for freelancers. Your support means we can keep expanding, listing more members, and staying free for everyone.
          </div>
        </div>
      </section>

      {/* Payment Trust */}
      <section className="py-8">
        <PaymentTrustBadge />
      </section>

      {/* Supporter Wall Section */}
      <section className="mx-auto max-w-4xl px-4 py-16 text-center">
        <h2 className="font-display text-2xl font-bold text-foreground flex items-center justify-center gap-2">
          ❤️ Thank you to our supporters
        </h2>
        <p className="mt-2 text-xs text-muted-foreground">
          Generous builders and businesses who keep LanceConnect free for the global freelancer community.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {supporters.length === 0 ? (
            <div className="text-xs text-muted-foreground font-mono italic">
              Become our first supporter and show your name on the wall! 🙏
            </div>
          ) : (
            supporters.map((sup, idx) => {
              const name = sup.donor_name || "Anonymous Supporter";
              const profile = sup.profiles as any;
              const location = profile?.city ? `${profile.city}, ${profile.country}` : profile?.country || "";
              return (
                <div
                  key={idx}
                  className="rounded-full bg-slate-900 border border-slate-800/80 px-4 py-1.5 text-xs text-slate-200 flex items-center gap-1.5 shadow-sm hover:border-rose-500/20 transition duration-200 select-none animate-in fade-in zoom-in-95"
                >
                  <span className="text-rose-500">❤️</span>
                  <span className="font-semibold text-[11px]">{name}</span>
                  {location && (
                    <span className="text-[10px] text-slate-500 font-mono">({location})</span>
                  )}
                </div>
              );
            })
          )}
        </div>
      </section>
    </MarketingShell>
  );
}
