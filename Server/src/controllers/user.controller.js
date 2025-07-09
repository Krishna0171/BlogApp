import * as userService from "../services/user.service.js";
import * as constants from "../../constants.js";
import * as messageConstants from "../../messageConstants.js";
import ApiError from "../utils/ApiError.js";

const userSafeSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  createdAt: true,
  updatedAt: true,
  createdBy: true,
  updatedBy: true,
};

export const getAll = async (req, res) => {
  const users = await userService.getAllUsers();
  res.status(200).json(users);
};

export const getById = async (req, res) => {
  const { id } = req.params;
  const user = await userService.getUserById(id);
  if (!user) {
    throw new ApiError(404, messageConstants.NotExists(constants.User));
  }
  res.status(200).json(user);
};

export const update = async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  const user = await userService.updateUser(id, { name, email });
  if (!user) {
    throw new ApiError(404, messageConstants.NotExists(constants.User));
  }
  res.status(200).json(user);
};

export const remove = async (req, res) => {
  const { id } = req.params;
  const user = await userService.deleteUser(id);
  if (!user) {
    throw new ApiError(404, messageConstants.NotExists(constants.User));
  }
  res.status(204).send();
};

export const getMe = async (req, res) => {
  const user = await userService.getUserById(req.user.id);
  res.status(200).json(user);
};

