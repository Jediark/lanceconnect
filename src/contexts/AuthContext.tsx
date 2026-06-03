import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { User } from "@/types";

type AuthCtx = {
  user: User | null;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  updateUser: (patch: Partial<User>) => void;
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

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem("lance_auth");
    if (stored === "1") setUser(DEFAULT_USER);
  }, []);

  const login = () => {
    setUser(DEFAULT_USER);
    if (typeof window !== "undefined") localStorage.setItem("lance_auth", "1");
  };
  const logout = () => {
    setUser(null);
    if (typeof window !== "undefined") localStorage.removeItem("lance_auth");
  };
  const updateUser = (patch: Partial<User>) =>
    setUser((u) => (u ? { ...u, ...patch } : u));

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}
