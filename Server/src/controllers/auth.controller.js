import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as userService from "../services/user.service.js";
import * as constants from "../../constants.js";
import * as messageConstants from "../../messageConstants.js";
import ApiError from "../utils/ApiError.js";

const JWT_SECRET = process.env.JWT_SECRET;

// Register
export const register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    throw new ApiError(400, messageConstants.InvalidInput(constants.User));
  }

  const exists = await userService.getUserByEmail(email);
  if (exists) {
    throw new ApiError(400, messageConstants.AlreadyExist(constants.User));
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const user = await userService.createUser({
    name,
    email,
    password: hashPassword,
  });

  return res.status(201).json(user);
};

// Login
export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await userService.getUserByEmail(email);
  if (!user) throw new ApiError(401, messageConstants.InvalidCredentials);

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new ApiError(401, messageConstants.InvalidCredentials);

  const token = jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );

  return res.status(200).json({
    token
  });
};
