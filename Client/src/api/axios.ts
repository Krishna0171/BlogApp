import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
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

export default api;
