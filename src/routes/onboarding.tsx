import { useState, useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  Check,
  Code,
  Palette,
  PenTool,
  TrendingUp,
  MessageSquare,
  Video,
  Camera,
  Megaphone,
  Smartphone,
  Users,
  Globe,
  GraduationCap,
  Leaf,
  Utensils,
  Package,
  Factory,
  BookOpen,
} from "lucide-react";
import { CATEGORIES, COUNTRIES } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  web_dev: <Code className="h-5 w-5 text-primary" />,
  designer: <Palette className="h-5 w-5 text-primary" />,
  copywriter: <PenTool className="h-5 w-5 text-primary" />,
  seo: <TrendingUp className="h-5 w-5 text-primary" />,
  social_media: <MessageSquare className="h-5 w-5 text-primary" />,
  video: <Video className="h-5 w-5 text-primary" />,
  photography: <Camera className="h-5 w-5 text-primary" />,
  marketing: <Megaphone className="h-5 w-5 text-primary" />,
  app_dev: <Smartphone className="h-5 w-5 text-primary" />,
  va: <Users className="h-5 w-5 text-primary" />,
  tutor: <GraduationCap className="h-5 w-5 text-primary" />,
  african_food_export: <Leaf className="h-5 w-5 text-primary" />,
  restaurant_supplier: <Utensils className="h-5 w-5 text-primary" />,
  product_export: <Package className="h-5 w-5 text-primary" />,
  b2b_trade: <Factory className="h-5 w-5 text-primary" />,
  corporate_training: <BookOpen className="h-5 w-5 text-primary" />,
};

export const Route = createFileRoute("/onboarding")({
  head: () => ({ meta: [{ title: "Welcome — LanceConnect" }] }),
  component: Onboarding,
});

function Onboarding() {
  const { user, updateUser } = useAuth();
  const nav = useNavigate();
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState<string | null>(null);
  const [country, setCountry] = useState<string>("");
  const [city, setCity] = useState("");
  const [worldwide, setWorldwide] = useState(false);
  const [name, setName] = useState(user?.fullName || "");
  const [website, setWebsite] = useState("");
  const [bio, setBio] = useState("");

  useEffect(() => {
    if (user?.fullName && !name) {
      setName(user.fullName);
    }
  }, [user]);

  const next = () => setStep((s) => s + 1);

  const handleComplete = () => {
    if (user && user.id !== "user-1") {
      updateUser({
        fullName: name || user.fullName,
        freelancerCategory: category || "web_dev",
        country: country || null,
        city: city || null,
        bio: bio || null,
        websiteUrl: website || null,
        onboardingCompleted: true,
      });
    }
    nav({ to: "/app/discover" });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 py-10 lg:py-16">
        <div className="mb-8 flex items-center gap-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={cn(
                "h-1.5 flex-1 rounded-full transition",
                i <= step ? "bg-primary" : "bg-border",
              )}
            />
          ))}
        </div>
        <p className="mb-2 text-xs font-mono-data text-muted-foreground">STEP {step} OF 3</p>

        {step === 1 && (
          <>
            <h1 className="font-display text-3xl font-bold md:text-4xl">What do you do?</h1>
            <p className="mt-2 text-muted-foreground">
              We'll find businesses that specifically need your skills.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {CATEGORIES.map((c) => {
                const active = category === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => setCategory(c.id)}
                    className={cn(
                      "relative rounded-xl border bg-card p-4 text-left transition hover:-translate-y-0.5 hover:shadow-card",
                      active ? "border-primary ring-2 ring-primary/30" : "border-border",
                    )}
                  >
                    {active && (
                      <span className="absolute right-2 top-2 grid h-5 w-5 place-items-center rounded-full bg-primary text-primary-foreground">
                        <Check className="h-3 w-3" />
                      </span>
                    )}
                    <div className="mb-2 text-primary">
                      {CATEGORY_ICONS[c.id] || <Code className="h-5 w-5" />}
                    </div>
                    <p className="mt-2 font-display text-sm font-semibold">{c.label}</p>
                    <p className="mt-1 text-[11px] text-muted-foreground">{c.example}</p>
                  </button>
                );
              })}
            </div>
            <div className="mt-10 flex justify-end">
              <button
                onClick={next}
                disabled={!category}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-40"
              >
                Continue <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h1 className="font-display text-3xl font-bold md:text-4xl">Where should we look?</h1>
            <p className="mt-2 text-muted-foreground">
              We find leads globally — start with your best target market.
            </p>
            <div className="mt-8 space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Country
                </label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  disabled={worldwide}
                  className="mt-1 w-full rounded-lg border border-input bg-card px-3 py-2.5 text-sm disabled:opacity-50"
                >
                  <option value="">Select a country</option>
                  {COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  City
                </label>
                <input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  disabled={worldwide}
                  placeholder="e.g. Lagos, London, São Paulo, New York"
                  className="mt-1 w-full rounded-lg border border-input bg-card px-3 py-2.5 text-sm disabled:opacity-50"
                />
              </div>
              <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-border bg-card p-3 text-sm">
                <input
                  type="checkbox"
                  checked={worldwide}
                  onChange={(e) => setWorldwide(e.target.checked)}
                  className="h-4 w-4 accent-primary"
                />
                <Globe className="h-4 w-4 text-muted-foreground" /> <span>Search worldwide</span>
              </label>
            </div>
            <div className="mt-10 flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="rounded-lg border border-border px-5 py-2.5 text-sm font-medium hover:bg-accent"
              >
                Back
              </button>
              <button
                onClick={next}
                disabled={!worldwide && !country}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-40"
              >
                Continue <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h1 className="font-display text-3xl font-bold md:text-4xl">Almost there!</h1>
            <p className="mt-2 text-muted-foreground">
              Tell us a little about yourself so your outreach feels personal.
            </p>
            <div className="mt-8 space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Full name
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Johnson"
                  className="mt-1 w-full rounded-lg border border-input bg-card px-3 py-2.5 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Website or portfolio (optional)
                </label>
                <input
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://your-site.com"
                  className="mt-1 w-full rounded-lg border border-input bg-card px-3 py-2.5 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Short bio — what you offer
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  placeholder="I build fast, affordable websites for restaurants and local businesses."
                  className="mt-1 w-full rounded-lg border border-input bg-card px-3 py-2.5 text-sm"
                />
              </div>
            </div>
            <button
              onClick={handleComplete}
              className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Start Finding Clients <ArrowRight className="h-4 w-4" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
