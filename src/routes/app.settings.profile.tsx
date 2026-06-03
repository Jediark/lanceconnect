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
  return (
    <form onSubmit={e=>{e.preventDefault();toast.success("Profile saved");}} className="max-w-2xl space-y-4 rounded-2xl border border-border bg-card p-6 shadow-card">
      <div className="flex items-center gap-4">
        <div className="grid h-16 w-16 place-items-center rounded-full bg-primary text-lg font-semibold text-primary-foreground">
          {(user.fullName || "User").split(" ").map(n=>n[0]).join("")}
        </div>
        <button type="button" className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium hover:bg-accent">Upload photo</button>
      </div>
      <SettingsField label="Full name"><input defaultValue={user.fullName || ""} onChange={e=>updateUser({fullName:e.target.value})} className="input"/></SettingsField>
      <SettingsField label="Email"><input defaultValue={user.email} type="email" className="input"/></SettingsField>
      <SettingsField label="Bio"><textarea rows={3} placeholder="A short line about what you offer..." className="input"/></SettingsField>
      <SettingsField label="Website / Portfolio"><input placeholder="https://" className="input"/></SettingsField>
      <SettingsField label="Freelancer category">
        <select defaultValue={user.freelancerCategory} className="input">
          {CATEGORIES.map(c=><option key={c.id} value={c.id}>{c.emoji} {c.label}</option>)}
        </select>
      </SettingsField>
      <SettingsField label="Country">
        <select defaultValue="NG" className="input">
          {COUNTRIES.map(c=><option key={c.code} value={c.code}>{c.flag} {c.name}</option>)}
        </select>
      </SettingsField>
      <button className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">Save changes</button>
    </form>
  );
}
