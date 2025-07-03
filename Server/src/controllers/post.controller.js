import {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
} from "../services/post.service.js";

import * as messageConstant from "../../messageConstants.js";
import * as constants from "../../constants.js";
import ApiError from "../utils/ApiError.js";

export const create = async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    throw new ApiError(400, messageConstant.InvalidInput(constants.Post));
  }

  const authorId = req.user.id;
  const post = await createPost({ title, content, authorId });
  return res.status(200).json(post);
};

export const getById = async (req, res) => {
  const id = req.params.id;
  const post = await getPostById(id);
  if (!post) throw new ApiError(404, messageConstant.NotExists(constants.Post));
  return res.status(200).json(post);
};

export const getAll = async (req, res) => {
  const posts = await getAllPosts();
  return res.status(200).json(posts);
};

export const update = async (req, res) => {
  const post = await updatePost(req.params.id, req.body);
  res.json(post);
};

export const remove = async (req, res) => {
  await deletePost(req.params.id);
  res.status(204).send();
};
