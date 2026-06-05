import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/contexts/AuthContext";
import { CATEGORIES, COUNTRIES } from "@/data/mockData";
import { SettingsField } from "@/routes/app.settings";
import { toast } from "sonner";

export const Route = createFileRoute("/app/settings/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const { user, updateUser } = useAuth();
  if (!user) return null;

  const [fullName, setFullName] = useState(user.fullName || "");
  const [bio, setBio] = useState(user.bio || "");
  const [websiteUrl, setWebsiteUrl] = useState(user.websiteUrl || "");
  const [category, setCategory] = useState(user.freelancerCategory || "web_dev");
  const [country, setCountry] = useState(user.country || "NG");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({
      fullName,
      bio,
      websiteUrl,
      freelancerCategory: category,
      country
    });
    toast.success("Profile saved successfully!");
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-4 rounded-2xl border border-border bg-card p-6 shadow-card">
      <div className="flex items-center gap-4">
        <div className="grid h-16 w-16 place-items-center rounded-full bg-primary text-lg font-semibold text-primary-foreground">
          {(fullName || "User").split(" ").map(n=>n[0]).join("")}
        </div>
      </div>
      
      <SettingsField label="Full name">
        <input 
          value={fullName} 
          onChange={e=>setFullName(e.target.value)} 
          className="input text-foreground bg-background" 
        />
      </SettingsField>
      
      <SettingsField label="Email">
        <input 
          value={user.email} 
          disabled 
          type="email" 
          className="input opacity-60 cursor-not-allowed text-foreground bg-background" 
        />
      </SettingsField>
      
      <SettingsField label="Bio">
        <textarea 
          value={bio} 
          onChange={e=>setBio(e.target.value)} 
          rows={3} 
          placeholder="A short line about what you offer..." 
          className="input text-foreground bg-background" 
        />
      </SettingsField>
      
      <SettingsField label="Website / Portfolio">
        <input 
          value={websiteUrl} 
          onChange={e=>setWebsiteUrl(e.target.value)} 
          placeholder="https://" 
          className="input text-foreground bg-background" 
        />
      </SettingsField>
      
      <SettingsField label="Freelancer category">
        <select 
          value={category} 
          onChange={e=>setCategory(e.target.value)} 
          className="input text-foreground bg-background"
        >
          {CATEGORIES.map(c=><option key={c.id} value={c.id}>{c.emoji} {c.label}</option>)}
        </select>
      </SettingsField>
      
      <SettingsField label="Country">
        <select 
          value={country} 
          onChange={e=>setCountry(e.target.value)} 
          className="input text-foreground bg-background"
        >
          {COUNTRIES.map(c=><option key={c.code} value={c.code}>{c.flag} {c.name}</option>)}
        </select>
      </SettingsField>
      
      <button className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 cursor-pointer">
        Save changes
      </button>
    </form>
  );
}
