import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { User } from "@/types";
import { supabase } from "@/lib/supabase";

type AuthCtx = {
  user: User | null;
  isAuthenticated: boolean;
  login: (email?: string, password?: string) => Promise<{ error: any | null }>;
  loginWithGoogle: () => Promise<{ error: any | null }>;
  signup: (
    email: string,
    password: string,
    fullName: string,
  ) => Promise<{ error: any | null; session?: any | null }>;
  logout: () => Promise<void>;
  updateUser: (patch: Partial<User>) => void;
  loading: boolean;
};

const AuthContext = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (uid: string, email: string) => {
    try {
      const { data, error } = await supabase.from("profiles").select("*").eq("id", uid).single();

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
        isPublic: data.is_public || false,
        username: data.username,
        hourlyRate: data.hourly_rate ? Number(data.hourly_rate) : null,
        portfolioProjects: data.portfolio_projects || [],
        contactEmail: data.contact_email,
        contactPhone: data.contact_phone,
        githubUrl: data.github_url,
        linkedinUrl: data.linkedin_url,
        dribbbleUrl: data.dribbble_url,
        twitterUrl: data.twitter_url,
        supplierProfile: data.supplier_profile,
      });
    } catch (err) {
      console.error("Error mapping profile:", err);
    }
  };

  useEffect(() => {
    setLoading(true);
    let active = true;

    // 1. Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!active) return;
      if (session?.user) {
        await fetchProfile(session.user.id, session.user.email!);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    // 2. Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!active) return;
      setLoading(true);
      if (session?.user) {
        await fetchProfile(session.user.id, session.user.email!);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email?: string, password?: string) => {
    if (!email || !password) {
      return { error: new Error("Email and password are required") };
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
          redirectTo:
            typeof window !== "undefined" ? window.location.origin + "/app/dashboard" : undefined,
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
          emailRedirectTo:
            typeof window !== "undefined" ? window.location.origin + "/onboarding" : undefined,
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
    if (user) {
      const dbPatch: any = {};
      if (patch.fullName !== undefined) dbPatch.full_name = patch.fullName;
      if (patch.avatarUrl !== undefined) dbPatch.avatar_url = patch.avatarUrl;
      if (patch.freelancerCategory !== undefined)
        dbPatch.freelancer_category = patch.freelancerCategory;
      if (patch.country !== undefined) dbPatch.country = patch.country;
      if (patch.city !== undefined) dbPatch.city = patch.city;
      if (patch.bio !== undefined) dbPatch.bio = patch.bio;
      if (patch.websiteUrl !== undefined) dbPatch.website_url = patch.websiteUrl;
      if (patch.onboardingCompleted !== undefined)
        dbPatch.onboarding_completed = patch.onboardingCompleted;
      if (patch.isPublic !== undefined) dbPatch.is_public = patch.isPublic;
      if (patch.username !== undefined) dbPatch.username = patch.username;
      if (patch.hourlyRate !== undefined) dbPatch.hourly_rate = patch.hourlyRate;
      if (patch.portfolioProjects !== undefined)
        dbPatch.portfolio_projects = patch.portfolioProjects;
      if (patch.contactEmail !== undefined) dbPatch.contact_email = patch.contactEmail;
      if (patch.contactPhone !== undefined) dbPatch.contact_phone = patch.contactPhone;
      if (patch.githubUrl !== undefined) dbPatch.github_url = patch.githubUrl;
      if (patch.linkedinUrl !== undefined) dbPatch.linkedin_url = patch.linkedinUrl;
      if (patch.dribbbleUrl !== undefined) dbPatch.dribbble_url = patch.dribbbleUrl;
      if (patch.twitterUrl !== undefined) dbPatch.twitter_url = patch.twitterUrl;
      if (patch.supplierProfile !== undefined) dbPatch.supplier_profile = patch.supplierProfile;

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
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        loginWithGoogle,
        signup,
        logout,
        updateUser,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}
