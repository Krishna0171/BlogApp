import { createContext, useEffect, useState, type ReactNode } from "react";
import type { User } from "../interfaces/interfaces";
import {
  getUserFromToken,
  setToken,
  removeToken,
  isTokenValid,
} from "../utils/jwtUtils";

interface AuthContextType {
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const login = (token: string) => {
    setToken(token);
    const decode = getUserFromToken<User>();
    if (decode) {
      setUser(decode);
    } else {
      removeToken();
    }
  };

  const logout = () => {
    setUser(null);
    removeToken();
  };

  useEffect(() => {
    if (isTokenValid()) {
      setUser(getUserFromToken<User>());
    } else {
      logout();
    }
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
};
