import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { User } from "../types/auth.types";
import { api } from "../../../shared/utils/api";

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 🔴 Todo:
// 1. implement the login and logout functions to update the user state, and pass { user, login, logout } as the Provider's value.
// 2. wrap the AuthProvider around appropriate components in the app (see main.tsx) to provide global state management for authentication.

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  async function login(username: string, password: string) {
    const response = await api.post("/users/login", { username, password });
    const userData: User = response.data.data;
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  }

  function logout() {
    setUser(null);
    localStorage.removeItem("user");
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// 🔴 Todo: finish the useAuth hook
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

