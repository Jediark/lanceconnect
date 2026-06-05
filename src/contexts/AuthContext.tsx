import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { User } from "@/types";
import { supabase } from "@/lib/supabase";

type AuthCtx = {
  user: User | null;
  isAuthenticated: boolean;
  login: (email?: string, password?: string) => Promise<{ error: any | null }>;
  loginWithGoogle: () => Promise<{ error: any | null }>;
  signup: (email: string, password: string, fullName: string) => Promise<{ error: any | null; session?: any | null }>;
  logout: () => Promise<void>;
  updateUser: (patch: Partial<User>) => void;
  loading: boolean;
};

const AuthContext = createContext<AuthCtx | null>(null);

const DEFAULT_USER: User = {
  id: "user-1",
  fullName: "Alex Johnson",
  email: "alex@example.com",
  freelancerCategory: "web_dev",
  plan: "free",
  leadsUsedThisMonth: 7,
  leadsLimit: 10,
  country: "Nigeria",
  avatarUrl: null,
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (uid: string, email: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", uid)
        .single();

      if (error) {
        console.error("Error fetching profile, creating default fallback state:", error);
        const fallbackUser: User = {
          id: uid,
          email: email,
          fullName: email.split("@")[0],
          avatarUrl: null,
          freelancerCategory: "web_dev",
          plan: "free",
          leadsUsedThisMonth: 0,
          leadsLimit: 10,
          country: null,
          city: null,
          bio: null,
          websiteUrl: null,
          onboardingCompleted: false,
        };
        setUser(fallbackUser);
        return;
      }

      setUser({
        id: data.id,
        email: data.email,
        fullName: data.full_name,
        avatarUrl: data.avatar_url,
        freelancerCategory: data.freelancer_category || "web_dev",
        country: data.country,
        city: data.city,
        bio: data.bio,
        websiteUrl: data.website_url,
        onboardingCompleted: data.onboarding_completed || false,
        plan: (data.plan as any) || "free",
        leadsUsedThisMonth: data.leads_used_this_month || 0,
        leadsLimit: data.leads_limit || 10,
        stripeCustomerId: data.stripe_customer_id,
        stripeSubscriptionId: data.stripe_subscription_id,
      });
    } catch (err) {
      console.error("Error mapping profile:", err);
    }
  };

  useEffect(() => {
    setLoading(true);
    // 1. Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchProfile(session.user.id, session.user.email!);
      } else {
        const stored = localStorage.getItem("lance_auth");
        if (stored === "1") {
          setUser(DEFAULT_USER);
        } else {
          setUser(null);
        }
      }
      setLoading(false);
    });

    // 2. Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setLoading(true);
      if (session?.user) {
        fetchProfile(session.user.id, session.user.email!);
      } else {
        if (localStorage.getItem("lance_auth") !== "1") {
          setUser(null);
        }
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email?: string, password?: string) => {
    if (!email || !password) {
      setUser(DEFAULT_USER);
      if (typeof window !== "undefined") {
        localStorage.setItem("lance_auth", "1");
      }
      return { error: null };
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        return { error };
      }
      if (data.user) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("lance_auth");
        }
        await fetchProfile(data.user.id, data.user.email!);
      }
      return { error: null };
    } catch (err: any) {
      return { error: err };
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: typeof window !== "undefined" ? window.location.origin + "/app/dashboard" : undefined,
        },
      });
      return { error };
    } catch (err: any) {
      return { error: err };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, password: string, fullName: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });
      if (error) {
        return { error };
      }
      if (data.user) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("lance_auth");
        }
        if (data.session) {
          await fetchProfile(data.user.id, data.user.email!);
        } else {
          setUser(null);
        }
      }
      return { error: null, session: data.session };
    } catch (err: any) {
      return { error: err };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("lance_auth");
    }
    setUser(null);
    await supabase.auth.signOut();
  };

  const updateUser = (patch: Partial<User>) => {
    setUser((u) => (u ? { ...u, ...patch } : u));
    if (user && user.id !== "user-1") {
      const dbPatch: any = {};
      if (patch.fullName !== undefined) dbPatch.full_name = patch.fullName;
      if (patch.avatarUrl !== undefined) dbPatch.avatar_url = patch.avatarUrl;
      if (patch.freelancerCategory !== undefined) dbPatch.freelancer_category = patch.freelancerCategory;
      if (patch.country !== undefined) dbPatch.country = patch.country;
      if (patch.city !== undefined) dbPatch.city = patch.city;
      if (patch.bio !== undefined) dbPatch.bio = patch.bio;
      if (patch.websiteUrl !== undefined) dbPatch.website_url = patch.websiteUrl;
      if (patch.onboardingCompleted !== undefined) dbPatch.onboarding_completed = patch.onboardingCompleted;

      supabase
        .from("profiles")
        .update(dbPatch)
        .eq("id", user.id)
        .then(({ error }) => {
          if (error) console.error("Error updating profile in db:", error);
        });
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, loginWithGoogle, signup, logout, updateUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}
