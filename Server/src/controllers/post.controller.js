import {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  getFavoritePosts,
} from "../services/post.service.js";

import * as messageConstant from "../../messageConstants.js";
import * as constants from "../../constants.js";
import ApiError from "../utils/ApiError.js";

const fileStoragePath = process.env.FILE_STORAGE_PATH;

export const create = async (req, res) => {
  const { title, content } = req.body;
  const image = req.file?.filename;
  const imageUrl = image ? fileStoragePath + image : null;

  if (!title || !content) {
    throw new ApiError(400, messageConstant.InvalidInput(constants.Post));
  }

  const authorId = req.user.id;
  const post = await createPost({ title, content, authorId, imageUrl });
  return res.status(200).json(post);
};

export const getById = async (req, res) => {
  const id = req.params.id;
  const post = await getPostById(id);
  if (!post) throw new ApiError(404, messageConstant.NotExists(constants.Post));
  return res.status(200).json(post);
};

export const getAll = async (req, res) => {
  let { searchQuery, page, limit } = req.query;
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 5;
  searchQuery = searchQuery || "";

  const posts = await getAllPosts(searchQuery, page, limit);
  return res.status(200).json(posts);
};

export const getFavorites = async (req, res) => {
  let { searchQuery, page, limit } = req.query;
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 5;
  searchQuery = searchQuery || "";

  const posts = await getFavoritePosts(searchQuery, page, limit);
  return res.status(200).json(posts);
};

export const update = async (req, res) => {
  const { title, content, imageUrl } = req.body;

  if (!title || !content) {
    throw new ApiError(400, messageConstant.InvalidInput(constants.Post));
  }
  const image = req.file?.filename;
  const updatedImageUrl = image ? fileStoragePath + image : imageUrl;

  const id = req.params.id;
  const existingPost = await getPostById(id);
  if (!existingPost) {
    throw new ApiError(400, messageConstant.NotExists(constants.Post));
  }

  if (req.user.id != existingPost.authorId) {
    throw new ApiError(400, "Only Author can edit post!");
  }

  const post = await updatePost(id, {
    title,
    content,
    imageUrl: updatedImageUrl,
  });
  res.json(post);
};

export const remove = async (req, res) => {
  const id = req.params.id;
  const existingPost = await getPostById(id);
  if (!existingPost) {
    throw new ApiError(400, messageConstant.NotExists(constants.Post));
  }

  if (req.user.id != existingPost.authorId) {
    throw new ApiError(400, "Only Author can delete post!");
  }

  await deletePost(id);
  res.status(204).send();
};

export const toggleFavorite = async (req, res) => {
  const id = req.params.id;

  const existingPost = await getPostById(id);
  if (!existingPost) {
    throw new ApiError(400, messageConstant.NotExists(constants.Post));
  }

  if (req.user.id != existingPost.authorId) {
    throw new ApiError(400, "Only Author can toggle favorite posts!");
  }

  const post = await updatePost(id, { isFavorite: !existingPost.isFavorite });
  res.status(200).json(post);
};
