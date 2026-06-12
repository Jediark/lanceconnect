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

  // ── Unified donation state ──
  const [currency, setCurrency] = useState<"USD" | "EUR" | "GBP" | "NGN">("USD");
  const [amount, setAmount] = useState<number | "">(5);
  const [guestEmail, setGuestEmail] = useState("");
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

  const handleCurrencyChange = (newCurrency: "USD" | "EUR" | "GBP" | "NGN") => {
    setCurrency(newCurrency);
    if (newCurrency === "NGN") {
      setAmount(1000);
    } else {
      setAmount(5);
    }
  };

  // ── Donation Handler ──
  const handleDonationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const donationEmail = user?.email || guestEmail;
    if (!donationEmail || !donationEmail.trim()) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (!amount || amount <= 0) {
      toast.error("Please enter a valid donation amount.");
      return;
    }

    const isNgn = currency === "NGN";
    if (isNgn && amount < 100) {
      toast.error("Minimum donation amount for Naira is ₦100.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await initiateDonation({
        amount: Number(amount),
        currency: currency,
        email: donationEmail,
        donorName: donorName || "Anonymous",
        message: message,
        showOnWall: showOnWall,
      });

      if (res.url) {
        window.location.href = res.url;
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || `Failed to initialize ${isNgn ? "Paystack" : "Stripe"} donation.`);
    } finally {
      setSubmitting(false);
    }
  };

  const currencySymbol = currency === "EUR" ? "€" : currency === "GBP" ? "£" : currency === "NGN" ? "₦" : "$";
  const isStripe = currency !== "NGN";

  const stripePresets = [3, 5, 10, 25];
  const paystackPresets = [500, 1000, 5000, 10000];
  const presets = isStripe ? stripePresets : paystackPresets;

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

      {/* Unified Donation Form */}
      <section className="mx-auto max-w-xl px-4 py-16">
        <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 flex flex-col justify-between shadow-lg hover:border-primary/20 transition-all duration-300">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 font-bold">
                ❤️
              </span>
              <div>
                <h3 className="font-display text-lg font-bold text-foreground">Support LanceConnect</h3>
                <p className="text-xs text-muted-foreground">
                  Select your currency and support amount below.
                </p>
              </div>
            </div>

            <form onSubmit={handleDonationSubmit} className="space-y-4">
              {/* Currency Selector Toggle */}
              <div>
                <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block mb-1.5">
                  Select Currency
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {(["USD", "EUR", "GBP", "NGN"] as const).map((c) => {
                    const label = c === "USD" ? "🇺🇸 USD" : c === "EUR" ? "🇪🇺 EUR" : c === "GBP" ? "🇬🇧 GBP" : "🇳🇬 NGN";
                    return (
                      <button
                        key={c}
                        type="button"
                        onClick={() => handleCurrencyChange(c)}
                        className={`rounded-lg py-2 text-center text-[10px] sm:text-xs font-bold border transition duration-200 cursor-pointer ${
                          currency === c
                            ? "border-primary bg-primary/10 text-primary shadow-sm"
                            : "border-border bg-background text-muted-foreground hover:border-primary/30"
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Amount Selection */}
              <div>
                <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block mb-1.5">
                  Donation Amount ({currencySymbol})
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {presets.map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setAmount(amt)}
                      className={`flex-1 min-w-[70px] rounded-lg py-2 text-xs font-bold border transition duration-200 cursor-pointer ${
                        amount === amt
                          ? "border-primary bg-primary/10 text-primary shadow-sm"
                          : "border-border bg-background text-muted-foreground hover:border-primary/30"
                      }`}
                    >
                      {currencySymbol}{amt.toLocaleString()}
                    </button>
                  ))}
                </div>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-xs font-mono text-slate-500 select-none">
                    {currencySymbol}
                  </span>
                  <input
                    type="number"
                    required
                    min={currency === "NGN" ? "100" : "1"}
                    placeholder="Or enter custom amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value === "" ? "" : Number(e.target.value))}
                    className="w-full rounded-xl border border-border bg-background pl-8 pr-3 py-2 text-xs font-mono text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary h-[38px]"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
                  Email Address
                </label>
                {user ? (
                  <div className="w-full rounded-xl border border-border bg-muted/30 px-3 py-2 text-xs text-muted-foreground h-[38px] flex items-center font-mono">
                    Logged in as: {user.email}
                  </div>
                ) : (
                  <input
                    type="email"
                    required
                    placeholder="Enter your email to receive invoice/receipt"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary h-[38px] font-mono"
                  />
                )}
              </div>

              {/* Display Name on Supporter Wall */}
              <div>
                <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
                  Display Name on Wall
                </label>
                <input
                  type="text"
                  placeholder="e.g. Alex M., Anonymous"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary h-[38px]"
                />
              </div>

              {/* Heartfelt Message */}
              <div>
                <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
                  Heartfelt Message (optional)
                </label>
                <textarea
                  placeholder="Your words keep us motivated..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={2}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                />
              </div>

              {/* Supporter Wall Checkbox */}
              <label className="flex cursor-pointer items-center gap-2 py-1 select-none text-[11px] text-muted-foreground">
                <input
                  type="checkbox"
                  checked={showOnWall}
                  onChange={(e) => setShowOnWall(e.target.checked)}
                  className="h-3.5 w-3.5 accent-primary rounded"
                />
                <span>Show my name on the supporter wall below</span>
              </label>

              {/* Submit Payment Button */}
              <PaymentButton
                gateway={isStripe ? "stripe" : "paystack"}
                type="submit"
                loading={submitting}
                disabled={submitting}
                className="mt-2"
              />
            </form>
          </div>

          <p className="text-[10px] text-center text-muted-foreground mt-5 italic font-mono">
            {isStripe 
              ? "🔒 PCI-DSS Level 1 certified · 256-bit SSL encryption"
              : "🔒 Paystack is CBN-licensed · PCI-DSS compliant"
            }
          </p>
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
