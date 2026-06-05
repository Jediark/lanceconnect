import { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  Home,
  Search,
  Kanban,
  Mail,
  Sparkles,
  Settings as SettingsIcon,
  Crown,
  Menu,
  X,
  Loader2,
  Sun,
  Moon,
  Bell,
  ChevronDown,
  LogOut,
  Briefcase,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { usePreferences } from "@/contexts/PreferencesContext";
import { LanceConnectLogo } from "@/components/Logo";
import { cn } from "@/lib/utils";
import { PlanUsageBar } from "@/components/ui/PlanUsageBar";

export function TopNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { user, loading } = useAuth();
  const { theme, setTheme } = usePreferences();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [outreachDropdownOpen, setOutreachDropdownOpen] = useState(false);

  if (!user && !loading) return null;

  return (
    <>
      <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b border-border bg-card px-4 lg:px-8 shadow-sm">
        {/* Logo */}
        <Link to="/app/dashboard" className="flex items-center gap-2 shrink-0 mr-4">
          <LanceConnectLogo className="h-7 w-auto" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1 flex-1">
          <NavLink
            to="/app/dashboard"
            icon={Home}
            label="Dashboard"
            active={pathname === "/app/dashboard"}
          />
          <NavLink
            to="/app/discover"
            icon={Search}
            label="Discover"
            active={pathname === "/app/discover"}
          />
          <NavLink
            to="/app/pipeline"
            icon={Kanban}
            label="Pipeline"
            active={pathname === "/app/pipeline"}
          />

          {/* Dropdown: Outreach */}
          <div className="relative" onMouseLeave={() => setOutreachDropdownOpen(false)}>
            <button
              onMouseEnter={() => setOutreachDropdownOpen(true)}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition",
                pathname.includes("/templates") || pathname.includes("/ai-generator")
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground",
              )}
            >
              <Mail className="h-4 w-4" /> Outreach <ChevronDown className="h-3 w-3" />
            </button>

            {outreachDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-56 rounded-xl border border-border bg-popover shadow-lg py-2 animate-in fade-in slide-in-from-top-2">
                <Link
                  to="/app/templates"
                  className="flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-accent transition"
                >
                  <Mail className="h-4 w-4 text-muted-foreground" /> Email Templates
                </Link>
                <Link
                  to="/app/ai-generator"
                  className="flex items-center justify-between px-4 py-2 text-sm text-foreground hover:bg-accent transition"
                >
                  <div className="flex items-center gap-3">
                    <Sparkles className="h-4 w-4 text-violet-500" /> AI Generator
                  </div>
                  <span className="rounded-full bg-amber-500/20 px-1.5 py-0.5 text-[10px] font-bold text-amber-500">
                    PRO
                  </span>
                </Link>
              </div>
            )}
          </div>
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center gap-3 ml-auto">
          <Link
            to="/app/upgrade"
            className="hidden lg:flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground hover:brightness-110 transition shadow-sm glow-primary"
          >
            <Crown className="h-3.5 w-3.5" /> Upgrade
          </Link>

          <button className="relative grid h-9 w-9 place-items-center rounded-lg border border-border bg-background hover:bg-accent transition">
            <Bell className="h-4 w-4 text-foreground" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
          </button>

          {loading ? (
            <div className="h-9 w-9 rounded-full bg-accent animate-pulse" />
          ) : user ? (
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 rounded-full border border-border bg-background p-0.5 pr-2 hover:bg-accent transition"
              >
                <div className="grid h-8 w-8 place-items-center rounded-full bg-gradient-brand text-xs font-bold text-white shadow-sm">
                  {(user.fullName || "User")
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <ChevronDown className="h-3 w-3 text-muted-foreground" />
              </button>

              {profileDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setProfileDropdownOpen(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 w-64 rounded-xl border border-border bg-popover shadow-xl z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="p-4 border-b border-border">
                      <p className="text-sm font-bold text-foreground truncate">{user.fullName}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                    <div className="p-4 border-b border-border">
                      <PlanUsageBar
                        used={user.leadsUsedThisMonth}
                        limit={user.leadsLimit}
                        plan={user.plan}
                      />
                    </div>
                    <div className="py-2">
                      <Link
                        to="/app/settings"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-accent transition"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        <SettingsIcon className="h-4 w-4 text-muted-foreground" /> Account Settings
                      </Link>
                      <Link
                        to="/app/settings/subscription"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-accent transition"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        <Briefcase className="h-4 w-4 text-muted-foreground" /> Billing & Plan
                      </Link>
                    </div>
                    <div className="p-2 border-t border-border flex items-center justify-between">
                      <button
                        onClick={() => {
                          setTheme(theme === "dark" ? "light" : "dark");
                          setProfileDropdownOpen(false);
                        }}
                        className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition"
                      >
                        {theme === "light" ? (
                          <>
                            <Moon className="h-3.5 w-3.5" /> Dark Mode
                          </>
                        ) : (
                          <>
                            <Sun className="h-3.5 w-3.5" /> Light Mode
                          </>
                        )}
                      </button>
                      <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg text-red-500 hover:bg-red-500/10 transition">
                        <LogOut className="h-3.5 w-3.5" /> Logout
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : null}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden grid h-9 w-9 place-items-center rounded-lg border border-border bg-background"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Mobile Navigation Sheet */}
      <div
        className={cn(
          "fixed inset-0 z-[100] lg:hidden transition-all duration-300",
          mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        )}
      >
        <div
          className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />
        <div
          className={cn(
            "absolute inset-y-0 right-0 w-3/4 max-w-sm bg-card border-l border-border shadow-2xl transition-transform duration-300 ease-in-out",
            mobileMenuOpen ? "translate-x-0" : "translate-x-full",
          )}
        >
          <div className="flex items-center justify-between p-4 border-b border-border">
            <LanceConnectLogo className="h-6 w-auto" />
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-accent"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="p-4 space-y-4">
            <MobileNavLink
              to="/app/dashboard"
              icon={Home}
              label="Dashboard"
              active={pathname === "/app/dashboard"}
              onClick={() => setMobileMenuOpen(false)}
            />
            <MobileNavLink
              to="/app/discover"
              icon={Search}
              label="Discover"
              active={pathname === "/app/discover"}
              onClick={() => setMobileMenuOpen(false)}
            />
            <MobileNavLink
              to="/app/pipeline"
              icon={Kanban}
              label="Pipeline"
              active={pathname === "/app/pipeline"}
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="pt-4 border-t border-border">
              <p className="px-3 text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                Outreach
              </p>
              <MobileNavLink
                to="/app/templates"
                icon={Mail}
                label="Email Templates"
                active={pathname.includes("/templates")}
                onClick={() => setMobileMenuOpen(false)}
              />
              <MobileNavLink
                to="/app/ai-generator"
                icon={Sparkles}
                label="AI Generator"
                active={pathname.includes("/ai-generator")}
                onClick={() => setMobileMenuOpen(false)}
              />
            </div>
            <div className="pt-4 border-t border-border">
              <MobileNavLink
                to="/app/settings"
                icon={SettingsIcon}
                label="Settings"
                active={pathname.includes("/settings")}
                onClick={() => setMobileMenuOpen(false)}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function NavLink({
  to,
  icon: Icon,
  label,
  active,
}: {
  to: string;
  icon: any;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition",
        active
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:bg-accent hover:text-foreground",
      )}
    >
      <Icon className="h-4 w-4" /> {label}
    </Link>
  );
}

function MobileNavLink({
  to,
  icon: Icon,
  label,
  active,
  onClick,
}: {
  to: string;
  icon: any;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-bold transition",
        active ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-accent",
      )}
    >
      <Icon className="h-5 w-5" /> {label}
    </Link>
  );
}
