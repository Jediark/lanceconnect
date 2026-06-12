import { useState, useEffect } from "react";
import { CircleArrowRight, RefreshCw, Calculator, ShieldCheck, Clock, Coins, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";

const SUPPORTED_CURRENCIES = [
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "NGN", name: "Nigerian Naira", symbol: "₦" },
  { code: "GHS", name: "Ghanaian Cedi", symbol: "GH₵" },
  { code: "NPR", name: "Nepalese Rupee", symbol: "₨" },
  { code: "INR", name: "Indian Rupee", symbol: "₹" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "KES", name: "Kenyan Shilling", symbol: "KSh" },
  { code: "ZAR", name: "South African Rand", symbol: "R" },
  { code: "CAD", name: "Canadian Dollar", symbol: "CA$" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$" },
];

const FALLBACK_RATES: Record<string, number> = {
  USD: 1.0,
  NGN: 1500.0,
  GHS: 15.0,
  NPR: 133.0,
  INR: 83.5,
  EUR: 0.92,
  GBP: 0.78,
  KES: 130.0,
  ZAR: 18.5,
  CAD: 1.37,
  AUD: 1.51,
};

interface CurrencyConverterProps {
  className?: string;
  mode?: "all" | "plans" | "client";
  hourlyRate?: number;
  freelancerName?: string;
}

export function CurrencyConverter({
  className,
  mode = "all",
  hourlyRate = 25,
  freelancerName = "the freelancer",
}: CurrencyConverterProps) {
  // If mode is 'client', we default to hourly rate calculation
  const [calculationType, setCalculationType] = useState<"hourly" | "fixed">(
    mode === "client" ? "hourly" : "fixed"
  );
  const [hours, setHours] = useState<string>("40");
  const [customFixedAmount, setCustomFixedAmount] = useState<string>("1000");

  const [amount, setAmount] = useState<string>(
    mode === "client" ? (hourlyRate * 40).toString() : "20"
  );
  const [fromCurrency, setFromCurrency] = useState<string>("USD");
  const [toCurrency, setToCurrency] = useState<string>("NGN");
  const [rates, setRates] = useState<Record<string, number>>(FALLBACK_RATES);
  const [loading, setLoading] = useState<boolean>(true);
  const [lastUpdated, setLastUpdated] = useState<string>("using fallback rates");
  const [activeTab, setActiveTab] = useState<"plans" | "custom">(
    mode === "plans" ? "plans" : mode === "client" ? "custom" : "plans"
  );

  useEffect(() => {
    async function fetchRates() {
      try {
        setLoading(true);
        const res = await fetch("https://open.er-api.com/v6/latest/USD");
        if (!res.ok) throw new Error("Failed to fetch rates");
        const data = await res.json();
        
        if (data && data.rates) {
          const fetchedRates: Record<string, number> = {};
          SUPPORTED_CURRENCIES.forEach((c) => {
            if (data.rates[c.code]) {
              fetchedRates[c.code] = data.rates[c.code];
            } else {
              fetchedRates[c.code] = FALLBACK_RATES[c.code];
            }
          });
          setRates(fetchedRates);
          setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        }
      } catch (err) {
        console.warn("Currency API offline, utilizing fallback rates:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchRates();
  }, []);

  // Sync amount when hourlyRate, hours, customFixedAmount, or calculationType changes in client mode
  useEffect(() => {
    if (mode === "client") {
      if (calculationType === "hourly") {
        const hrs = parseFloat(hours) || 0;
        setAmount((hourlyRate * hrs).toString());
      } else {
        setAmount(customFixedAmount);
      }
    }
  }, [hours, customFixedAmount, calculationType, hourlyRate, mode]);

  // Compute conversion
  const amountNum = parseFloat(amount) || 0;
  
  // Rates are relative to USD
  const amountInUSD = fromCurrency === "USD" ? amountNum : amountNum / (rates[fromCurrency] || 1);
  const convertedAmount = toCurrency === "USD" ? amountInUSD : amountInUSD * (rates[toCurrency] || 1);

  const fromSymbol = SUPPORTED_CURRENCIES.find((c) => c.code === fromCurrency)?.symbol || "";
  const toSymbol = SUPPORTED_CURRENCIES.find((c) => c.code === toCurrency)?.symbol || "";

  return (
    <div className={cn("mx-auto max-w-2xl rounded-3xl border border-border bg-card p-6 shadow-xl backdrop-blur-sm relative overflow-hidden", className)}>
      <div className="absolute top-0 right-0 p-3 flex items-center gap-1 text-[9px] text-muted-foreground font-mono select-none">
        <RefreshCw className={cn("h-2.5 w-2.5", loading && "animate-spin")} />
        {loading ? "syncing..." : `live: ${lastUpdated}`}
      </div>

      <div className="flex items-center gap-2 mb-4">
        <Calculator className="h-5 w-5 text-primary" />
        <h3 className="font-display text-lg font-bold text-foreground">
          {mode === "client" ? "Payment & Cost Calculator" : "Live Currency & Rate Calculator"}
        </h3>
      </div>

      {mode === "client" && (
        <p className="text-xs text-muted-foreground mb-5 leading-normal">
          Estimate what you will pay <strong>{freelancerName}</strong> based on their hourly rate of <strong>${hourlyRate} USD/hr</strong>.
        </p>
      )}

      {/* Mode Switcher for 'all' mode */}
      {mode === "all" && (
        <div className="flex rounded-lg bg-muted p-1 mb-5 select-none">
          <button
            onClick={() => {
              setActiveTab("plans");
              setAmount("20");
              setFromCurrency("USD");
            }}
            className={cn(
              "flex-1 py-1.5 text-xs font-semibold rounded-md transition",
              activeTab === "plans" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
          >
            Convert Plan Prices
          </button>
          <button
            onClick={() => setActiveTab("custom")}
            className={cn(
              "flex-1 py-1.5 text-xs font-semibold rounded-md transition",
              activeTab === "custom" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
          >
            Custom Project & Hourly Rates
          </button>
        </div>
      )}

      {/* Client Mode Calculation Type Selectors */}
      {mode === "client" && (
        <div className="grid grid-cols-2 gap-2 mb-5 select-none">
          <button
            onClick={() => setCalculationType("hourly")}
            className={cn(
              "flex items-center justify-center gap-2 rounded-xl border p-2.5 text-center transition text-xs font-bold",
              calculationType === "hourly" ? "border-primary bg-primary/5 text-primary" : "border-border hover:bg-accent text-foreground"
            )}
          >
            <Clock className="h-3.5 w-3.5" />
            By Hourly Rate
          </button>
          <button
            onClick={() => setCalculationType("fixed")}
            className={cn(
              "flex items-center justify-center gap-2 rounded-xl border p-2.5 text-center transition text-xs font-bold",
              calculationType === "fixed" ? "border-primary bg-primary/5 text-primary" : "border-border hover:bg-accent text-foreground"
            )}
          >
            <Coins className="h-3.5 w-3.5" />
            Fixed Project Budget
          </button>
        </div>
      )}

      {/* LanceConnect Plans Presets (Only for plans/all mode and active plans tab) */}
      {(mode === "plans" || (mode === "all" && activeTab === "plans")) && (
        <div className="grid grid-cols-2 gap-2 mb-5 select-none">
          <button
            onClick={() => setAmount("20")}
            className={cn(
              "rounded-xl border p-3 text-center transition",
              amount === "20" ? "border-primary bg-primary/5 text-primary" : "border-border hover:bg-accent"
            )}
          >
            <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Grow Plan</p>
            <p className="text-lg font-bold">$20 / mo</p>
          </button>
          <button
            onClick={() => setAmount("75")}
            className={cn(
              "rounded-xl border p-3 text-center transition",
              amount === "75" ? "border-primary bg-primary/5 text-primary" : "border-border hover:bg-accent"
            )}
          >
            <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Scale Plan</p>
            <p className="text-lg font-bold">$75 / mo</p>
          </button>
        </div>
      )}

      {/* Input controls based on mode */}
      {mode === "client" ? (
        <div className="grid gap-4 sm:grid-cols-6 items-end mb-5">
          {calculationType === "hourly" ? (
            <>
              {/* Hourly Rate Read-Only */}
              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-[10px] font-mono text-muted-foreground uppercase">Hourly Rate (USD)</label>
                <div className="relative select-none">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">
                    $
                  </span>
                  <input
                    type="text"
                    value={hourlyRate}
                    disabled
                    className="w-full rounded-xl border border-border bg-muted/50 py-2 pl-7 pr-3 text-xs font-semibold focus:outline-none opacity-80"
                  />
                </div>
              </div>
              {/* Hours Input */}
              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-[10px] font-mono text-muted-foreground uppercase">Estimated Hours</label>
                <div className="relative">
                  <input
                    type="number"
                    value={hours}
                    onChange={(e) => setHours(e.target.value)}
                    min="1"
                    className="w-full rounded-xl border border-border bg-background py-2 px-3 text-xs font-semibold focus:outline-none focus:border-primary transition"
                  />
                </div>
              </div>
            </>
          ) : (
            /* Fixed Amount Input */
            <div className="sm:col-span-4 space-y-1.5">
              <label className="text-[10px] font-mono text-muted-foreground uppercase">Project Budget (USD)</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">
                  $
                </span>
                <input
                  type="number"
                  value={customFixedAmount}
                  onChange={(e) => setCustomFixedAmount(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background py-2 pl-7 pr-3 text-xs font-semibold focus:outline-none focus:border-primary transition"
                />
              </div>
            </div>
          )}

          {/* Target Currency Selection */}
          <div className="sm:col-span-2 space-y-1.5">
            <label className="text-[10px] font-mono text-muted-foreground uppercase">Convert To</label>
            <select
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
              className="w-full rounded-xl border border-border bg-background p-2 text-xs font-semibold focus:outline-none focus:border-primary cursor-pointer transition"
            >
              {SUPPORTED_CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} - {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      ) : (
        /* Regular input row for plans/custom conversion */
        <div className="grid gap-4 sm:grid-cols-7 items-center">
          {/* Source Amount */}
          <div className="sm:col-span-3 space-y-1.5">
            <label className="text-[10px] font-mono text-muted-foreground uppercase">Amount</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">
                {fromSymbol}
              </span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={mode === "plans" || activeTab === "plans"}
                className="w-full rounded-xl border border-border bg-background py-2.5 pl-8 pr-3 text-sm font-semibold focus:outline-none focus:border-primary transition"
              />
            </div>
          </div>

          {/* Source Currency */}
          <div className="sm:col-span-2 space-y-1.5">
            <label className="text-[10px] font-mono text-muted-foreground uppercase">From</label>
            <select
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              disabled={mode === "plans" || activeTab === "plans"}
              className="w-full rounded-xl border border-border bg-background p-2.5 text-xs font-semibold focus:outline-none focus:border-primary cursor-pointer transition"
            >
              {SUPPORTED_CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} - {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Target Currency */}
          <div className="sm:col-span-2 space-y-1.5">
            <label className="text-[10px] font-mono text-muted-foreground uppercase">To</label>
            <select
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
              className="w-full rounded-xl border border-border bg-background p-2.5 text-xs font-semibold focus:outline-none focus:border-primary cursor-pointer transition"
            >
              {SUPPORTED_CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} - {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Result Display */}
      <div className="mt-6 border-t border-border/60 pt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-mono text-muted-foreground uppercase">
            {mode === "client" ? "Estimated Cost" : "Converted Amount"}
          </p>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-foreground">
              {toSymbol}
              {convertedAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="text-xs font-bold text-primary">{toCurrency}</span>
          </div>
          <p className="text-[10px] text-muted-foreground mt-1 leading-normal">
            Total USD: ${amountInUSD.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} • 
            Exchange rate: 1 USD = {(rates[toCurrency] / rates[fromCurrency]).toFixed(2)} {toCurrency}
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-medium select-none bg-muted px-3 py-1.5 rounded-lg border border-border/40 sm:self-end">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
          <span>
            {mode === "client" ? "Direct payments, 0% commission" : "Real-time conversion for project pricing"}
          </span>
        </div>
      </div>
    </div>
  );
}
