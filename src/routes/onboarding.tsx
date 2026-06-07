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
  Brain,
  Target,
  Mic,
} from "lucide-react";
import { CATEGORIES, COUNTRIES } from "@/data/mockData";
import { COUNTRY_CITIES } from "@/data/countriesData";
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
  parent_tutor: <Users className="h-5 w-5 text-primary" />,
  african_food_export: <Leaf className="h-5 w-5 text-primary" />,
  restaurant_supplier: <Utensils className="h-5 w-5 text-primary" />,
  product_export: <Package className="h-5 w-5 text-primary" />,
  b2b_trade: <Factory className="h-5 w-5 text-primary" />,
  human_capital: <Brain className="h-5 w-5 text-primary" />,
  training_recruitment: <Target className="h-5 w-5 text-primary" />,
  mc_events: <Mic className="h-5 w-5 text-primary" />,
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
  const [whatsapp, setWhatsapp] = useState(user?.contactPhone || "");

  const selectedCountryName = COUNTRIES.find((c) => c.code === country)?.name || "";
  const suggestedCities = selectedCountryName ? (COUNTRY_CITIES[selectedCountryName] || []) : [];

  // Supplier-specific states
  const [companyName, setCompanyName] = useState("");
  const [productsSupplied, setProductsSupplied] = useState("");
  const [certifications, setCertifications] = useState<string[]>([]);
  const [moq, setMoq] = useState("");
  const [countriesSupply, setCountriesSupply] = useState("");

  // Tutor states
  const [subjects, setSubjects] = useState<string[]>([]);
  const [ageGroups, setAgeGroups] = useState<string[]>([]);
  const [format, setFormat] = useState("both");
  const [qualifications, setQualifications] = useState("");

  // HR/Recruitment states
  const [servicesOffered, setServicesOffered] = useState<string[]>([]);
  const [industriesServed, setIndustriesServed] = useState<string[]>([]);
  const [yearsExperience, setYearsExperience] = useState("");
  const [teamSize, setTeamSize] = useState("");

  useEffect(() => {
    if (user) {
      if (user.fullName && !name) setName(user.fullName);
      if (user.contactPhone && !whatsapp) setWhatsapp(user.contactPhone);
    }
  }, [user]);

  const next = () => setStep((s) => s + 1);

  const handleComplete = () => {
    if (user) {
      const supplierProfile: any = {};
      if (
        ["african_food_export", "restaurant_supplier", "product_export", "b2b_trade"].includes(
          category || "",
        )
      ) {
        supplierProfile.companyName = companyName;
        supplierProfile.products = productsSupplied;
        supplierProfile.certifications = certifications;
        supplierProfile.moq = moq;
        supplierProfile.targetCountries = countriesSupply;
      } else if (category === "parent_tutor") {
        supplierProfile.subjects = subjects;
        supplierProfile.ageGroups = ageGroups;
        supplierProfile.format = format;
        supplierProfile.qualifications = qualifications;
      } else if (["human_capital", "training_recruitment"].includes(category || "")) {
        supplierProfile.companyName = companyName;
        supplierProfile.services = servicesOffered;
        supplierProfile.industries = industriesServed;
        supplierProfile.yearsExperience = yearsExperience;
        supplierProfile.teamSize = teamSize;
      }

      updateUser({
        fullName: name || user.fullName,
        freelancerCategory: category || "web_dev",
        country: country || null,
        city: city || null,
        bio: bio || null,
        websiteUrl: website || null,
        contactPhone: whatsapp || null,
        onboardingCompleted: true,
        supplierProfile: Object.keys(supplierProfile).length > 0 ? supplierProfile : null,
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
            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
                  onChange={(e) => {
                    setCountry(e.target.value);
                    setCity("");
                  }}
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
                  id="onboarding-city-input"
                  autoComplete="off"
                  list="onboarding-cities-list"
                  placeholder="e.g. Lagos, London, São Paulo, New York"
                  className="mt-1 w-full rounded-lg border border-input bg-card px-3 py-2.5 text-sm disabled:opacity-50"
                />
                <datalist id="onboarding-cities-list">
                  {suggestedCities.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
                {suggestedCities.length > 0 && (
                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] text-muted-foreground">Popular:</span>
                    {suggestedCities.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setCity(c)}
                        className="rounded bg-primary/10 border border-primary/20 px-2 py-0.5 text-[10px] font-medium text-primary hover:bg-primary/20 transition cursor-pointer"
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                )}
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
              Configure your profile to find target opportunities.
            </p>
            <div className="mt-8 space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Full name / Contact Name
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
                  WhatsApp Number (with country code, e.g. +2348012345678)
                </label>
                <input
                  type="text"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="e.g. +2348012345678"
                  className="mt-1 w-full rounded-lg border border-input bg-card px-3 py-2.5 text-sm"
                />
                <span className="text-[10px] text-muted-foreground block mt-1">
                  Clients will be routed to message you directly on WhatsApp.
                </span>
              </div>

              {/* Conditional Sub-forms */}
              {[
                "african_food_export",
                "restaurant_supplier",
                "product_export",
                "b2b_trade",
              ].includes(category || "") && (
                <div className="space-y-4 p-4 rounded-xl border border-border bg-card/50">
                  <h3 className="text-sm font-semibold text-primary">Supplier Details</h3>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Company Name
                    </label>
                    <input
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. Je'moorel UK"
                      className="mt-1 w-full rounded-lg border border-input bg-card px-3 py-2 text-sm bg-background"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Products Supplied (e.g. Palm oil, Garri, Ogbono)
                    </label>
                    <input
                      value={productsSupplied}
                      onChange={(e) => setProductsSupplied(e.target.value)}
                      placeholder="Enter products you supply..."
                      className="mt-1 w-full rounded-lg border border-input bg-card px-3 py-2 text-sm bg-background"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Certifications (Select all that apply)
                    </label>
                    <div className="mt-1.5 flex flex-wrap gap-2">
                      {["NAFDAC", "ISO", "Organic", "Halal", "FDA"].map((cert) => {
                        const active = certifications.includes(cert);
                        return (
                          <button
                            type="button"
                            key={cert}
                            onClick={() => {
                              setCertifications((prev) =>
                                active ? prev.filter((c) => c !== cert) : [...prev, cert],
                              );
                            }}
                            className={cn(
                              "px-2.5 py-1 rounded-md text-xs font-semibold border transition cursor-pointer",
                              active
                                ? "bg-primary text-white border-primary"
                                : "bg-card border-border hover:bg-accent text-slate-400",
                            )}
                          >
                            {cert}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Minimum Order Quantity (MOQ)
                    </label>
                    <input
                      value={moq}
                      onChange={(e) => setMoq(e.target.value)}
                      placeholder="e.g. 50 boxes, 1 container"
                      className="mt-1 w-full rounded-lg border border-input bg-card px-3 py-2 text-sm bg-background"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Countries you can supply to
                    </label>
                    <input
                      value={countriesSupply}
                      onChange={(e) => setCountriesSupply(e.target.value)}
                      placeholder="e.g. United Kingdom, Germany, EU"
                      className="mt-1 w-full rounded-lg border border-input bg-card px-3 py-2 text-sm bg-background"
                    />
                  </div>
                </div>
              )}

              {category === "parent_tutor" && (
                <div className="space-y-4 p-4 rounded-xl border border-border bg-card/50">
                  <h3 className="text-sm font-semibold text-primary">Tutor Profile</h3>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Subjects Taught (comma-separated)
                    </label>
                    <input
                      value={subjects.join(", ")}
                      onChange={(e) =>
                        setSubjects(
                          e.target.value
                            .split(",")
                            .map((s) => s.trim())
                            .filter(Boolean),
                        )
                      }
                      placeholder="e.g. Mathematics, Chemistry, English"
                      className="mt-1 w-full rounded-lg border border-input bg-card px-3 py-2 text-sm bg-background"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Age Groups (Select all that apply)
                    </label>
                    <div className="mt-1.5 flex flex-wrap gap-2">
                      {["5-8", "9-12", "13-16", "17-18", "Adult"].map((age) => {
                        const active = ageGroups.includes(age);
                        return (
                          <button
                            type="button"
                            key={age}
                            onClick={() => {
                              setAgeGroups((prev) =>
                                active ? prev.filter((a) => a !== age) : [...prev, age],
                              );
                            }}
                            className={cn(
                              "px-2.5 py-1 rounded-md text-xs font-semibold border transition cursor-pointer",
                              active
                                ? "bg-primary text-white border-primary"
                                : "bg-card border-border hover:bg-accent text-slate-400",
                            )}
                          >
                            {age}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Teaching Format
                    </label>
                    <select
                      value={format}
                      onChange={(e) => setFormat(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-input bg-card px-3 py-2 text-sm bg-background text-foreground"
                    >
                      <option value="both">Both Online and In-Person</option>
                      <option value="online">Online Only</option>
                      <option value="in_person">In-Person Only</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Qualifications
                    </label>
                    <textarea
                      value={qualifications}
                      onChange={(e) => setQualifications(e.target.value)}
                      rows={2}
                      placeholder="e.g. B.Sc. in Mathematics, 5 years teaching experience"
                      className="mt-1 w-full rounded-lg border border-input bg-card px-3 py-2 text-sm bg-background text-foreground"
                    />
                  </div>
                </div>
              )}

              {["human_capital", "training_recruitment"].includes(category || "") && (
                <div className="space-y-4 p-4 rounded-xl border border-border bg-card/50">
                  <h3 className="text-sm font-semibold text-primary">
                    HR / Training Partner Profile
                  </h3>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Company Name
                    </label>
                    <input
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. Je'moorel Capacity Partners"
                      className="mt-1 w-full rounded-lg border border-input bg-card px-3 py-2 text-sm bg-background"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Services Offered (comma-separated)
                    </label>
                    <input
                      value={servicesOffered.join(", ")}
                      onChange={(e) =>
                        setServicesOffered(
                          e.target.value
                            .split(",")
                            .map((s) => s.trim())
                            .filter(Boolean),
                        )
                      }
                      placeholder="e.g. Leadership Training, HR Consulting, Staffing"
                      className="mt-1 w-full rounded-lg border border-input bg-card px-3 py-2 text-sm bg-background"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Industries Served (comma-separated)
                    </label>
                    <input
                      value={industriesServed.join(", ")}
                      onChange={(e) =>
                        setIndustriesServed(
                          e.target.value
                            .split(",")
                            .map((i) => i.trim())
                            .filter(Boolean),
                        )
                      }
                      placeholder="e.g. Banking, Healthcare, Government, Tech"
                      className="mt-1 w-full rounded-lg border border-input bg-card px-3 py-2 text-sm bg-background"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Years of Experience
                      </label>
                      <input
                        value={yearsExperience}
                        onChange={(e) => setYearsExperience(e.target.value)}
                        placeholder="e.g. 5+ years"
                        className="mt-1 w-full rounded-lg border border-input bg-card px-3 py-2 text-sm bg-background"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Team Size
                      </label>
                      <input
                        value={teamSize}
                        onChange={(e) => setTeamSize(e.target.value)}
                        placeholder="e.g. 1-10, 50+"
                        className="mt-1 w-full rounded-lg border border-input bg-card px-3 py-2 text-sm bg-background"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Standard text inputs as fallback/regular */}
              {!["african_food_export", "restaurant_supplier", "product_export", "b2b_trade", "parent_tutor", "human_capital", "training_recruitment"].includes(category || "") && (
                <>
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
                </>
              )}
            </div>

            {/* Quick Safety Tip Panel */}
            <div className="mt-6 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-xs text-amber-500 flex items-start gap-2.5 select-none">
              <span className="text-base leading-none">⚠️</span>
              <div>
                <strong className="font-semibold block mb-0.5">Quick Safety Reminder</strong>
                Always use a written contract, request a 30-50% deposit before starting work, and keep all communications on record. Learn more in our Safety Guide in the footer.
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

