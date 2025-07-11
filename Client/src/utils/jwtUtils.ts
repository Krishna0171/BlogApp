import { jwtDecode } from "jwt-decode";
import { type User } from "../interfaces/interfaces";

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

export const getUserFromToken = (): User | null => {
  const token = getToken();
  if (!token) return null;

  try {
    return jwtDecode<User>(token);
  } catch (error) {
    console.error("Invalid JWT", error);
    return null;
  }
};

export const isTokenValid = (): boolean => {
  const exp = getTokenExpiry();
  return Date.now() <= exp * 1000;
};

export const getTokenExpiry = (): number => {
  const token = getToken();
  if (!token) return 0;
  try {
    const decode = jwtDecode<DecodedToken>(token);
    return decode.exp;
  } catch (error) {
    return 0;
  }
};
