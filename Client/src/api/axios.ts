import axios from "axios";
import { getToken } from "../utils/jwtUtils";
const api = axios.create({
  baseURL: process.env.NODE_ENV === 'test' ? '/api' : "http://localhost:5000/api",
  withCredentials: true,
});

export const safeRequest = async <T = any>(
  promise: Promise<any>
): Promise<[T | null, string | null]> => {
  try {
    const res = await promise;
    return [res, null];
  } catch (err: any) {
    const message = err?.response?.data?.message || "Something went wrong";
    return [null, message];
  }
};

// Request Interceptor: attach token
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
