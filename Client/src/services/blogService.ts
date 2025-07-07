import api, { safeRequest } from "../api/axios";
import { ApiRoutes } from "../constants/Routes";
import { errorResult, successResult } from "./ResultHandler";

export const fetchBlogs = async (
  searchQuery: string = "",
  page: number = 1,
  limit: number = 5
) => {
  const [res, error] = await safeRequest(
    api.get(ApiRoutes.FetchBlogs + `?searchQuery=${searchQuery}&page=${page}&limit=${limit}`)
  );
  if (error) return errorResult(error);
  return successResult(res);
};
