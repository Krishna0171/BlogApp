import { createContext, useEffect, useState, type ReactNode } from "react";
import type { User } from "../types/auth";
import { jwtDecode } from "jwt-decode";
import { useAppSnackbar } from "../hooks/useAppSnackbar";
import { LogoutSuccess } from "../constants/SuccessMessages";

interface AuthContextType {
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const { showSuccess } = useAppSnackbar();

  const login = (token: string) => {
    const decode: User = jwtDecode(token);
    setUser(decode);
    localStorage.setItem("token", token);
  };

  const logout = () => {
    setUser(null);
    showSuccess(LogoutSuccess);
    localStorage.removeItem("token");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const deode: User = jwtDecode(token);
        setUser(deode);
      } catch (error) {
        logout();
      }
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
};
