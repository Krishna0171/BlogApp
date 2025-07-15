import api, { safeRequest } from "../api/axios";
import { API_ROUTES } from "../constants/Routes";
import type { CreatePostData } from "../interfaces/interfaces";
import { errorResult, successResult } from "./ResultHandler";

export const fetchBlogs = async (
  searchQuery: string = "",
  page: number = 1,
  limit: number = 5
) => {
  const [res, error] = await safeRequest(
    api.get(
      API_ROUTES.FetchBlogs +
        `?searchQuery=${searchQuery}&page=${page}&limit=${limit}`
    )
  );
  if (error) return errorResult(error);
  return successResult(res);
};

export const fetchFavoriteBlogs = async (
  searchQuery: string = "",
  page: number = 1,
  limit: number = 5
) => {
  const [res, error] = await safeRequest(
    api.get(
      API_ROUTES.FetchFavoriteBlogs +
        `?searchQuery=${searchQuery}&page=${page}&limit=${limit}`
    )
  );
  if (error) return errorResult(error);
  return successResult(res);
};

export const createPost = async (data: FormData) => {
  const [res, error] = await safeRequest(
    api.post(API_ROUTES.CreatePost, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
  );
  if (error) return errorResult(error);
  return successResult(res);
};

export const getPostById = async (id: string) => {
  const [res, error] = await safeRequest(api.get(API_ROUTES.GetPostById(id)));
  if (error) return errorResult(error);
  return successResult(res);
};

export const updatePost = async (id: string, data: FormData) => {
  console.log(data)
  const [res, error] = await safeRequest(
    api.put(API_ROUTES.updatePost(id), data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
  );
  if (error) return errorResult(error);
  return successResult(res);
};

export const deletePost = async (id: string) => {
  const [res, error] = await safeRequest(api.delete(API_ROUTES.deletePost(id)));
  if (error) return errorResult(error);
  return successResult(res);
};

export const toggleFavoritePost = async (id: string) => {
  const [res, error] = await safeRequest(
    api.patch(API_ROUTES.FavoritePost(id))
  );
  if (error) return errorResult(error);
  return successResult(res);
};
