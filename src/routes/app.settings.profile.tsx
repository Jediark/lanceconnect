import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/contexts/AuthContext";
import { CATEGORIES, COUNTRIES } from "@/data/mockData";
import { COUNTRY_CITIES } from "@/data/countriesData";
import { SettingsField } from "@/routes/app.settings";
import { toast } from "sonner";
import {
  User as UserIcon,
  Eye,
  FolderKanban,
  Plus,
  Trash2,
  Globe,
  Github,
  Linkedin,
  Twitter,
  MessageSquare,
  Phone,
  Mail,
  Link as LinkIcon,
  Camera,
} from "lucide-react";

export const Route = createFileRoute("/app/settings/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const { user, updateUser } = useAuth();

  const [activeTab, setActiveTab] = useState<"basic" | "directory" | "portfolio">("basic");

  // Basic Details States
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [websiteUrl, setWebsiteUrl] = useState(user?.websiteUrl || "");
  const [category, setCategory] = useState(user?.freelancerCategory || "web_dev");
  const [country, setCountry] = useState(user?.country || "NG");
  const [city, setCity] = useState(user?.city || "");

  const selectedCountryName = COUNTRIES.find((c) => c.code === country)?.name || "";
  const suggestedCities = selectedCountryName ? (COUNTRY_CITIES[selectedCountryName] || []) : [];

  // Directory Settings States
  const [isPublic, setIsPublic] = useState(user?.isPublic || false);
  const [username, setUsername] = useState(user?.username || "");
  const [hourlyRate, setHourlyRate] = useState(user?.hourlyRate || "");
  const [contactEmail, setContactEmail] = useState(user?.contactEmail || "");
  const [contactPhone, setContactPhone] = useState(user?.contactPhone || "");

  // Social Links States
  const [githubUrl, setGithubUrl] = useState(user?.githubUrl || "");
  const [linkedinUrl, setLinkedinUrl] = useState(user?.linkedinUrl || "");
  const [dribbbleUrl, setDribbbleUrl] = useState(user?.dribbbleUrl || "");
  const [twitterUrl, setTwitterUrl] = useState(user?.twitterUrl || "");

  // Portfolio Projects States
  const [portfolioProjects, setPortfolioProjects] = useState<any[]>(user?.portfolioProjects || []);
  const [newProjTitle, setNewProjTitle] = useState("");
  const [newProjDesc, setNewProjDesc] = useState("");
  const [newProjLink, setNewProjLink] = useState("");
  const [newProjImage, setNewProjImage] = useState("");

  if (!user) return null;

  const handleAddProject = () => {
    if (!newProjTitle.trim()) {
      toast.error("Project title is required.");
      return;
    }
    const newProj = {
      title: newProjTitle,
      desc: newProjDesc,
      link: newProjLink,
      image:
        newProjImage || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&q=80",
    };
    setPortfolioProjects([...portfolioProjects, newProj]);
    setNewProjTitle("");
    setNewProjDesc("");
    setNewProjLink("");
    setNewProjImage("");
    toast.success("Project added! Remember to save changes to make it permanent.");
  };

  const handleRemoveProject = (index: number) => {
    setPortfolioProjects(portfolioProjects.filter((_, i) => i !== index));
    toast.success("Project removed! Remember to save changes to persist it.");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isPublic && !username) {
      toast.error("Vanity username is required when profile is public.");
      return;
    }

    if (username && !/^[a-zA-Z0-9_-]{3,30}$/.test(username)) {
      toast.error(
        "Vanity username must be between 3 and 30 characters and only contain letters, numbers, hyphens, or underscores.",
      );
      return;
    }

    updateUser({
      fullName,
      bio,
      websiteUrl,
      freelancerCategory: category,
      country,
      city: city || null,
      isPublic,
      username: username || null,
      hourlyRate: hourlyRate ? Number(hourlyRate) : null,
      portfolioProjects,
      contactEmail: contactEmail || null,
      contactPhone: contactPhone || null,
      githubUrl: githubUrl || null,
      linkedinUrl: linkedinUrl || null,
      dribbbleUrl: dribbbleUrl || null,
      twitterUrl: twitterUrl || null,
    });
    toast.success("Profile saved successfully!");
  };

  return (
    <div className="max-w-3xl space-y-6">
      {/* Premium Tab Navigation */}
      <div className="flex gap-1.5 border-b border-border pb-2.5 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab("basic")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold font-mono tracking-tight transition whitespace-nowrap cursor-pointer ${
            activeTab === "basic"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:bg-card hover:text-foreground border border-transparent hover:border-border/60"
          }`}
        >
          <UserIcon className="h-4 w-4" /> Basic Details
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("directory")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold font-mono tracking-tight transition whitespace-nowrap cursor-pointer ${
            activeTab === "directory"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:bg-card hover:text-foreground border border-transparent hover:border-border/60"
          }`}
        >
          <Eye className="h-4 w-4" /> Public Directory
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("portfolio")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold font-mono tracking-tight transition whitespace-nowrap cursor-pointer ${
            activeTab === "portfolio"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:bg-card hover:text-foreground border border-transparent hover:border-border/60"
          }`}
        >
          <FolderKanban className="h-4 w-4" /> Portfolio Projects
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-3xl border border-border bg-card p-6 md:p-8 shadow-card transition duration-300"
      >
        {/* TAB 1: BASIC DETAILS */}
        {activeTab === "basic" && (
          <div className="space-y-5">
            <div className="flex items-center gap-4 border-b border-border/40 pb-4">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 border border-primary/20 text-md font-bold text-primary">
                {(fullName || "User")
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </div>
              <div>
                <h3 className="font-display font-bold text-foreground text-sm">Account Bio Info</h3>
                <p className="text-xs text-muted-foreground">
                  This metadata is displayed globally across your outreach panels.
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <SettingsField label="Full name">
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Alex Johnson"
                  className="input text-foreground bg-background"
                  required
                />
              </SettingsField>

              <SettingsField label="Email (Private Login)">
                <input
                  value={user.email}
                  disabled
                  type="email"
                  className="input opacity-60 cursor-not-allowed text-foreground bg-background"
                />
              </SettingsField>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <SettingsField label="Freelancer category">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="input text-foreground bg-background cursor-pointer"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.emoji} {c.label}
                    </option>
                  ))}
                </select>
              </SettingsField>

              <SettingsField label="Country">
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="input text-foreground bg-background cursor-pointer"
                >
                  {COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.name}
                    </option>
                  ))}
                </select>
              </SettingsField>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <SettingsField label="City">
                <input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  list="profile-cities-list"
                  placeholder="e.g. Lagos or London"
                  className="input text-foreground bg-background"
                />
                <datalist id="profile-cities-list">
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
              </SettingsField>

              <SettingsField label="Personal Website / Link">
                <input
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="input text-foreground bg-background"
                />
              </SettingsField>
            </div>

            <SettingsField label="Short Bio / Pitch Summary">
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                placeholder="Briefly state your expertise and target value proposition..."
                className="input text-foreground bg-background"
              />
            </SettingsField>
          </div>
        )}

        {/* TAB 2: PUBLIC DIRECTORY */}
        {activeTab === "directory" && (
          <div className="space-y-6">
            <div className="flex items-start gap-4 border-b border-border/40 pb-4">
              <Eye className="h-6 w-6 text-primary shrink-0 mt-0.5" />
              <div>
                <h3 className="font-display font-bold text-foreground text-sm">
                  Directory Listing Settings
                </h3>
                <p className="text-xs text-muted-foreground">
                  Control how clients find you. Public profiles allow clients to contact you
                  directly off-platform.
                </p>
              </div>
            </div>

            {/* Visibility toggle card */}
            <div className="rounded-2xl border border-border bg-background p-4 flex items-center justify-between shadow-sm">
              <div className="space-y-1">
                <span className="text-xs font-semibold font-mono block">
                  Show Profile in Directory
                </span>
                <span className="text-xs text-muted-foreground block leading-normal">
                  Allows anonymous clients to browse your credentials in search outputs.
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-10 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            {/* Config fields, only enabled/critical if isPublic is true */}
            <div
              className={`space-y-5 transition duration-200 ${isPublic ? "opacity-100" : "opacity-50 pointer-events-none select-none"}`}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <SettingsField label="Vanity Username">
                  <div className="relative">
                    <input
                      value={username}
                      onChange={(e) =>
                        setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))
                      }
                      placeholder="e.g. alex-dev"
                      className="input text-foreground bg-background"
                      required={isPublic}
                    />
                  </div>
                  {username && (
                    <span className="text-[10px] font-mono text-primary block mt-1.5 leading-none">
                      Preview URL: lanceconnect.com/freelancers/{username}
                    </span>
                  )}
                </SettingsField>

                <SettingsField label="Hourly Rate ($/hr)">
                  <input
                    type="number"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(e.target.value)}
                    placeholder="e.g. 50"
                    min="1"
                    className="input text-foreground bg-background"
                  />
                </SettingsField>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 border-t border-border/40 pt-4">
                <SettingsField label="Public Contact Email">
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="e.g. contact@alexjohnson.com"
                    className="input text-foreground bg-background"
                  />
                  <span className="text-[9px] text-muted-foreground block mt-1">
                    If blank, defaults to your private account email.
                  </span>
                </SettingsField>

                <SettingsField label="Public Phone / WhatsApp">
                  <input
                    type="text"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="e.g. +2348012345678"
                    className="input text-foreground bg-background"
                  />
                  <span className="text-[9px] text-muted-foreground block mt-1">
                    Enter in international format (with +) for direct WhatsApp links.
                  </span>
                </SettingsField>
              </div>

              {/* Social Links Sub-section */}
              <div className="border-t border-border/40 pt-4 space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Social Presence
                </h4>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="flex items-center gap-2">
                    <span className="p-2 border border-border bg-background rounded-lg text-slate-400">
                      <Github className="h-4 w-4" />
                    </span>
                    <input
                      value={githubUrl}
                      onChange={(e) => setGithubUrl(e.target.value)}
                      placeholder="GitHub URL"
                      className="input text-foreground bg-background"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="p-2 border border-border bg-background rounded-lg text-slate-400">
                      <Linkedin className="h-4 w-4" />
                    </span>
                    <input
                      value={linkedinUrl}
                      onChange={(e) => setLinkedinUrl(e.target.value)}
                      placeholder="LinkedIn URL"
                      className="input text-foreground bg-background"
                    />
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="flex items-center gap-2">
                    <span className="p-2 border border-border bg-background rounded-lg text-slate-400">
                      <Globe className="h-4 w-4" />
                    </span>
                    <input
                      value={dribbbleUrl}
                      onChange={(e) => setDribbbleUrl(e.target.value)}
                      placeholder="Dribbble/Portfolio Link"
                      className="input text-foreground bg-background"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="p-2 border border-border bg-background rounded-lg text-slate-400">
                      <Twitter className="h-4 w-4" />
                    </span>
                    <input
                      value={twitterUrl}
                      onChange={(e) => setTwitterUrl(e.target.value)}
                      placeholder="Twitter/X URL"
                      className="input text-foreground bg-background"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PORTFOLIO PROJECTS */}
        {activeTab === "portfolio" && (
          <div className="space-y-6">
            <div className="flex items-start gap-4 border-b border-border/40 pb-4">
              <FolderKanban className="h-6 w-6 text-primary shrink-0 mt-0.5" />
              <div>
                <h3 className="font-display font-bold text-foreground text-sm">
                  Portfolio Case Studies
                </h3>
                <p className="text-xs text-muted-foreground">
                  List visual representations of your past client deliveries. Add titles,
                  descriptions, and mock/live screenshots.
                </p>
              </div>
            </div>

            {/* List of existing projects */}
            <div className="space-y-3">
              {portfolioProjects.length === 0 ? (
                <div className="text-center py-8 border border-dashed border-border rounded-2xl bg-background">
                  <p className="text-xs text-muted-foreground font-mono">
                    No portfolio projects uploaded yet.
                  </p>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {portfolioProjects.map((p, idx) => (
                    <div
                      key={idx}
                      className="relative group border border-border bg-background rounded-2xl p-4 flex flex-col justify-between hover:border-slate-700 transition"
                    >
                      <div>
                        {p.image && (
                          <img
                            src={p.image}
                            alt={p.title}
                            className="aspect-[16/9] w-full rounded-lg object-cover mb-3 border border-border/60"
                          />
                        )}
                        <h4 className="text-xs font-bold text-foreground truncate">{p.title}</h4>
                        <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                          {p.desc}
                        </p>
                      </div>
                      <div className="mt-4 flex items-center justify-between border-t border-border/40 pt-2 text-[10px] font-mono">
                        <span className="text-primary truncate max-w-[120px]">
                          {p.link || "No links"}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveProject(idx)}
                          className="text-red-500 hover:text-red-600 transition flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="h-3 w-3" /> Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Inline creation widget */}
            <div className="rounded-2xl border border-border bg-background/50 p-5 space-y-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Plus className="h-4 w-4 text-primary" /> Add New Project Case Study
              </h4>

              <div className="grid gap-3 sm:grid-cols-2">
                <SettingsField label="Project Title *">
                  <input
                    value={newProjTitle}
                    onChange={(e) => setNewProjTitle(e.target.value)}
                    placeholder="e.g. E-Commerce Platform"
                    className="input text-foreground bg-background"
                  />
                </SettingsField>
                <SettingsField label="Live URL / Link">
                  <input
                    value={newProjLink}
                    onChange={(e) => setNewProjLink(e.target.value)}
                    placeholder="https://example.com/project"
                    className="input text-foreground bg-background"
                  />
                </SettingsField>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <SettingsField label="Project Image URL (Optional)">
                  <input
                    value={newProjImage}
                    onChange={(e) => setNewProjImage(e.target.value)}
                    placeholder="https://images.unsplash.com/... or blank"
                    className="input text-foreground bg-background"
                  />
                </SettingsField>
                <div className="flex flex-col justify-end">
                  <button
                    type="button"
                    onClick={handleAddProject}
                    className="h-10 w-full rounded-lg bg-accent text-foreground hover:bg-accent/80 border border-border/60 hover:border-border text-xs font-semibold transition cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Plus className="h-4 w-4" /> Add to List
                  </button>
                </div>
              </div>

              <SettingsField label="Short Case Description">
                <textarea
                  value={newProjDesc}
                  onChange={(e) => setNewProjDesc(e.target.value)}
                  rows={2}
                  placeholder="Describe the client problem you solved and the output delivered..."
                  className="input text-foreground bg-background"
                />
              </SettingsField>
            </div>
          </div>
        )}

        {/* Global Save Button */}
        <div className="pt-4 border-t border-border/40 flex justify-end">
          <button
            type="submit"
            className="rounded-xl bg-primary px-6 py-2.5 text-xs font-bold text-primary-foreground hover:bg-primary/95 transition shadow-sm hover:shadow cursor-pointer"
          >
            Save changes
          </button>
        </div>
      </form>
    </div>
  );
}
