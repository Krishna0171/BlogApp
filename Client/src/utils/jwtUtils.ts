import { jwtDecode } from "jwt-decode";

const TOKEN_KEY = "token";

type DecodedToken = {
  exp: number;
  [key: string]: any;
};

export const setToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const getUserFromToken = <T>(): T | null => {
  const token = getToken();
  if (!token) return null;

  try {
    return jwtDecode<T>(token);
  } catch (error) {
    console.error("Invalid JWT", error);
    return null;
  }
};

export const isTokenValid = (): boolean => {
  const token = getToken();
  if (!token) return false;

  try {
    const decoded = jwtDecode<DecodedToken>(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp > currentTime;
  } catch (error) {
    return false;
  }
};
