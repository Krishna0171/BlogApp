import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as userService from "../services/user.service.js";
import * as constants from "../../constants.js";
import * as messageConstants from "../../messageConstants.js";
import ApiError from "../utils/ApiError.js";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

const createAccessToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    {
      expiresIn: "2m",
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

  if (!user.password) {
    throw new ApiError(401, messageConstants.InvalidCredentials);
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new ApiError(401, messageConstants.InvalidCredentials);

  const token = createAccessToken(user);
  const refreshToken = createRefreshToken(user.id, rememberMe ? "10m" : "5m");
  const refreshTokenExpiry = rememberMe ?  10 * 60 * 1000 : 5 * 60 * 1000;

  return res
    .status(200)
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: refreshTokenExpiry,
    })
    .json({
      token,
      refreshToken,
    });
};

//Forgot Password
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await userService.getUserByEmail(email);

  if (!user?.password) {
    throw new ApiError(404, messageConstants.NotExists(constants.User));
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  const resetTokenExpiry = new Date(Date.now() + 1000 * 60 * 2); 
  await userService.updateUser(user.id, {
    resetToken: hashedToken,
    resetTokenExpiry,
  });

  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
  await sendEmail(email, "Reset Your Password.", `Click here : ${resetLink}`);

  return res.sendStatus(200);
};

//Reset Password
export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const users = await userService.getUsers({
    resetToken: hashedToken,
    resetTokenExpiry: { gte: new Date() },
  });
  const user = users?.[0];

  if (!user) {
    throw new ApiError(400, messageConstants.InvalidToken);
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await userService.updateUser(user.id, {
    password: hashedPassword,
    resetToken: null,
    resetTokenExpiry: null,
  });

  return res.sendStatus(200);
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
export const callback = async (req, res) => {
  const user = req.user;

  if (!user) {
    throw new ApiError(401, "Google Authentication Failed!");
  }

  const accessToken = createAccessToken(user);
  const refreshToken = createRefreshToken(user.id, "7d");

  return res
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .redirect(`${process.env.FRONTEND_URL}/oauth-success?token=${accessToken}`);
};
