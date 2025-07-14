import {
  createContext,
  useEffect,
  useState,
  type ReactNode,
  useRef,
} from "react";
import type { User } from "../interfaces/interfaces";
import {
  getUserFromToken,
  setToken,
  removeToken,
  isTokenValid,
  getTokenExpiry,
} from "../utils/jwtUtils";
import { refreshAccessToken } from "../services/authService";
import { logoutDialog } from "../utils/sweetAlert";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../constants/Routes";
import { toast } from "react-toastify";
import { LogoutSuccess } from "../constants/SuccessMessages";
import { ACCESS_TOKEN_REFRESH_BEFORE } from "../constants/Constants";

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

  const navigate = useNavigate();
  const refreshTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const logoutTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = () => {
    if (refreshTimeoutRef.current) clearTimeout(refreshTimeoutRef.current);
    if (logoutTimeoutRef.current) clearTimeout(logoutTimeoutRef.current);
  };

  const logout = () => {
    clearTimers();
    setUser(null);
    removeToken();
    navigate(ROUTES.Login);
    toast.success(LogoutSuccess);
  };

  const scheduleLogout = (delay: number) => {
    logoutTimeoutRef.current = setTimeout(() => logout(), delay);
  };

  const scheduleTokenRefresh = (expiry: number) => {
    const now = Date.now();
    const timeUntilExpiry = expiry * 1000 - now;
    const delay = Math.max(0, timeUntilExpiry - ACCESS_TOKEN_REFRESH_BEFORE);

    refreshTimeoutRef.current = setTimeout(async () => {
      const result = await refreshAccessToken();
      if (result.isSuccess && result.Data?.accessToken) {
        const newToken = result.Data.accessToken;
        setToken(newToken);
        const decoded = getUserFromToken();
        if (decoded) {
          setUser(decoded);
          scheduleTokenRefresh(getTokenExpiry());
        } else {
          logout();
        }
      } else {
        const logoutDelay = Math.max(0, expiry * 1000 - Date.now());
        scheduleLogout(logoutDelay);

        const shouldLogout = await logoutDialog(logoutDelay);
        if (shouldLogout) logout();
      }
    }, delay);
  };

  const login = (token: string) => {
    setToken(token);
    const decoded = getUserFromToken();
    if (decoded) {
      setUser(decoded);
      scheduleTokenRefresh(getTokenExpiry());
    } else {
      logout();
    }
  };

  const initializeAuth = async () => {
    const valid = isTokenValid();
    if (valid) {
      const decoded = getUserFromToken();
      setUser(decoded);
      scheduleTokenRefresh(getTokenExpiry());
    } else {
      const result = await refreshAccessToken();

      if (result.isSuccess && result.Data?.accessToken) {
        const token = result.Data.accessToken;
        setToken(token);
        const decoded = getUserFromToken();
        setUser(decoded);
        scheduleTokenRefresh(getTokenExpiry());
      } else {
        removeToken();
        setUser(null);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    initializeAuth();
    return clearTimers;
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
};
