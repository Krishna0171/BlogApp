import axios from "axios";
import { getToken, setToken } from "../utils/jwtUtils";
import { toast } from "react-toastify";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
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

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (err.response.status === 401) {
      try {
        const refreshRes = await axios.post("http://localhost:5000/api/auth/refresh-token", null);
        const newAccessToken = refreshRes.data?.accessToken;
        setToken(newAccessToken);

        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newAccessToken}`;
        err.config.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return axios(err.config);
      } catch (refreshErr) {
        toast.error(err?.response?.message);
      }
    }
    return Promise.reject(err);
  }
);

export default api;
