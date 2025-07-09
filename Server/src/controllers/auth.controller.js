import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as userService from "../services/user.service.js";
import * as constants from "../../constants.js";
import * as messageConstants from "../../messageConstants.js";
import ApiError from "../utils/ApiError.js";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

const createAccessToken = (user) => {
  console.log(user);
  return jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    {
      expiresIn: "15m",
    }
  );
};

const createRefreshToken = (id, expiresIn) => {
  return jwt.sign(
    {
      id,
    },
    JWT_REFRESH_SECRET,
    {
      expiresIn,
    }
  );
};

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
  const { email, password, rememberMe } = req.body;

  const user = await userService.getUserByEmail(email);
  if (!user) throw new ApiError(401, messageConstants.InvalidCredentials);

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new ApiError(401, messageConstants.InvalidCredentials);

  const token = createAccessToken(user);
  const refreshToken = createRefreshToken(user.id, rememberMe ? "7d" : "1d");

  return res
    .status(200)
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: rememberMe ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000, // in ms
    })
    .json({
      token,
      refreshToken,
    });
};

//Logout
export const logout = (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  return res.sendStatus(200);
};

//RefreshToken
export const refreshToken = async (req, res) => {
  const token = req.cookies?.refreshToken || req.body?.refreshToken;
  if (!token) throw new ApiError(401, "No token");

  try {
    const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await userService.getUserById(payload.id);
    if (!user) throw new ApiError(401, "User not found!");

    const newAccessToken = createAccessToken(user);
    res.json({ accessToken: newAccessToken });
  } catch (e) {
    throw new ApiError(403, "Invalid refresh token!");
  }
};

//OAUTH
export const googleCallback = async (req, res) => {
  const user = req.user;

  if (!user) {
    throw new ApiError(401, "Google Authentication Failed!");
  }
  
  const token = createAccessToken(user);
  return res.redirect(
    `${process.env.FRONTEND_URL}/oauth-success?token=${token}`
  );
};
