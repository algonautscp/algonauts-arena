"use client";

import { createContext, useContext, useState } from "react";
import { isTokenExpired } from "@/lib/auth";

type Role = "ADMIN" | "MENTOR" | "MEMBER";

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  codeforcesUsername?: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

function getInitialAuth() {
  if (typeof window === "undefined") {
    return { token: null, user: null };
  }

  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  if (!token || !user || isTokenExpired(token)) {
    localStorage.clear();
    return { token: null, user: null };
  }

  try {
    return {
      token,
      user: JSON.parse(user) as User,
    };
  } catch {
    localStorage.clear();
    return { token: null, user: null };
  }
}

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [{ token, user }, setAuth] = useState(getInitialAuth);

  const login = (jwt: string, userData: User) => {
    localStorage.setItem("token", jwt);
    localStorage.setItem("user", JSON.stringify(userData));
    setAuth({ token: jwt, user: userData });
  };

  const updateProfile = (updates: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...updates };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setAuth({ token, user: updatedUser });
  };

  const logout = () => {
    localStorage.clear();
    setAuth({ token: null, user: null });
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(user),
        login,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
}
