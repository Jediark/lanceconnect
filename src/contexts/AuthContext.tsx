import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { MOCK_USER } from "@/data/mockData";

type User = typeof MOCK_USER;
type AuthCtx = {
  user: User | null;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  updateUser: (patch: Partial<User>) => void;
};

const AuthContext = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem("fc_auth");
    if (stored === "1") setUser(MOCK_USER);
  }, []);

  const login = () => {
    setUser(MOCK_USER);
    if (typeof window !== "undefined") localStorage.setItem("fc_auth", "1");
  };
  const logout = () => {
    setUser(null);
    if (typeof window !== "undefined") localStorage.removeItem("fc_auth");
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
