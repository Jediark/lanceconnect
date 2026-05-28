import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Header } from "@/components/layout/Header";
import { CATEGORIES, COUNTRIES } from "@/data/mockData";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/settings")({
  head: () => ({ meta: [{ title: "Settings — FreelanceConnect" }] }),
  component: SettingsPage,
});

const TABS = ["Profile", "Subscription", "Notifications", "Danger Zone"] as const;
type Tab = typeof TABS[number];

function SettingsPage() {
  const [tab, setTab] = useState<Tab>("Profile");
  const { user, updateUser, logout } = useAuth();
  const nav = useNavigate();
  if (!user) return null;

  return (
    <>
      <Header title="Settings" />
      <div className="px-4 py-6 lg:px-8">
        <div className="mb-6 flex flex-wrap gap-1 border-b border-border">
          {TABS.map((t) => (
            <button key={t} onClick={() => setTab(t)} className={cn("border-b-2 px-3 py-2 text-sm font-medium transition", tab === t ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground")}>
              {t}
            </button>
          ))}
        </div>

        {tab === "Profile" && (
          <form onSubmit={(e) => { e.preventDefault(); toast.success("Saved!"); }} className="max-w-xl space-y-4 rounded-2xl border border-border bg-card p-6 shadow-card">
            <div className="flex items-center gap-4">
              <div className="grid h-16 w-16 place-items-center rounded-full bg-gradient-brand text-lg font-semibold text-white">
                {user.fullName.split(" ").map((n) => n[0]).join("")}
              </div>
              <button type="button" className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium hover:bg-accent">Upload photo</button>
            </div>
            <Field label="Full name"><input defaultValue={user.fullName} onChange={(e) => updateUser({ fullName: e.target.value })} className="input" /></Field>
            <Field label="Email"><input defaultValue={user.email} type="email" className="input" /></Field>
            <Field label="Bio"><textarea rows={3} placeholder="What you offer..." className="input" /></Field>
            <Field label="Website / Portfolio"><input placeholder="https://" className="input" /></Field>
            <Field label="Freelancer category">
              <select defaultValue={user.freelancerCategory} className="input">
                {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.emoji} {c.label}</option>)}
              </select>
            </Field>
            <Field label="Country">
              <select defaultValue="NG" className="input">
                {COUNTRIES.map((c) => <option key={c.code} value={c.code}>{c.flag} {c.name}</option>)}
              </select>
            </Field>
            <button className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">Save changes</button>
          </form>
        )}

        {tab === "Subscription" && (
          <div className="max-w-xl space-y-4">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Current plan</p>
              <p className="mt-1 font-display text-2xl font-bold capitalize">{user.plan} Plan</p>
              <p className="mt-1 text-sm text-muted-foreground">{user.leadsUsedThisMonth}/{user.leadsLimit} leads used this month</p>
              <Link to="/app/upgrade" className="mt-4 inline-block rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">Upgrade Plan</Link>
            </div>
            <button className="text-xs text-muted-foreground hover:text-red-600">Cancel subscription</button>
          </div>
        )}

        {tab === "Notifications" && (
          <div className="max-w-xl space-y-3 rounded-2xl border border-border bg-card p-6 shadow-card">
            {["New leads matching my filters", "Weekly digest", "Follow-up reminders", "Product updates"].map((n) => (
              <label key={n} className="flex items-center justify-between rounded-lg border border-border p-3 text-sm">
                <span>{n}</span>
                <input type="checkbox" defaultChecked className="accent-primary" />
              </label>
            ))}
          </div>
        )}

        {tab === "Danger Zone" && (
          <div className="max-w-xl rounded-2xl border border-red-200 bg-red-50 p-6">
            <h3 className="font-display text-lg font-semibold text-red-700">Delete my account</h3>
            <p className="mt-1 text-sm text-red-700/80">This permanently removes your account, leads, and templates. This can't be undone.</p>
            <button onClick={() => { if (confirm("Delete your account?")) { logout(); nav({ to: "/" }); } }} className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700">
              Delete account
            </button>
          </div>
        )}
      </div>

      <style>{`.input { width:100%; border-radius:.5rem; border:1px solid var(--input); background:var(--background); padding:.55rem .75rem; font-size:.875rem; outline:none; } .input:focus { box-shadow: 0 0 0 3px rgba(99,102,241,.25); }`}</style>
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
