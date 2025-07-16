import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as userService from "../services/user.service.js";
import * as sessionService from "../services/session.service.js";
import * as constants from "../../constants.js";
import * as messageConstants from "../../messageConstants.js";
import ApiError from "../utils/ApiError.js";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js";
import { UAParser } from "ua-parser-js";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const createCookieOptions = {
  httpOnly: true,
  secure: true,
  maxAge: 1000 * 60 * 60 * 24 * 7,
};

const clearCookieOptions = {
  httpOnly: true,
  secure: true,
};

const createAccessToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      sessionId: user.sessionId,
    },
    JWT_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY_TIME,
    }
  );
};

const createRefreshToken = (id, sessionId, rememberMe) => {
  return jwt.sign(
    {
      id,
      sessionId,
    },
    JWT_REFRESH_SECRET,
    {
      expiresIn: rememberMe
        ? process.env.REFRESH_TOKEN_EXPIRY_TIME_WITH_REMEMBER_ME
        : process.env.REFRESH_TOKEN_EXPIRY_TIME_WITHOUT_REMEMBER_ME,
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

  const parser = new UAParser(req.headers["user-agent"]);
  const result = parser.getResult();

  const sessionData = {
    userId: user.id,
    userAgent: `${result.browser.name} from ${result.os.name}`,
    ipAddress: req.ip,
    expiresAt: new Date(
      Date.now() + (rememberMe ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000)
    ),
  };

  const session = await sessionService.createSession(sessionData);

  const refreshToken = createRefreshToken(user.id, session.id, rememberMe);
  const token = createAccessToken({ ...user, sessionId: session.id });

  const io = req.app.get("io");
  io.to(user.id).emit("session-changed");

  return res
    .status(200)
    .cookie("refreshToken", refreshToken, createCookieOptions)
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
export const logout = async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) return res.sendStatus(204);

  try {
    const decodeToken = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    await sessionService.deleteSessionById(decodeToken.sessionId);

    const io = req.app.get("io");
    io.to(decodeToken.id).emit("session-changed");
  } catch (error) {}
  res.clearCookie("refreshToken", clearCookieOptions);
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

    const session = (
      await sessionService.getSessions({ id: payload.sessionId })
    )?.[0];
    if (!session) throw new ApiError(401, "Session not found!");

    const newAccessToken = createAccessToken({
      ...user,
      sessionId: payload.sessionId,
    });
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

  const parser = new UAParser(req.headers["user-agent"]);
  const result = parser.getResult();

  const sessionData = {
    userId: user.id,
    userAgent: `${result.browser.name} from ${result.os.name}`,
    ipAddress: req.ip,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  };

  const session = await sessionService.createSession(sessionData);

  const accessToken = createAccessToken(user);
  const refreshToken = createRefreshToken(user.id, session.id, true);

  const io = req.app.get("io");
  io.to(user.id).emit("session-changed");

  return res
    .cookie("refreshToken", refreshToken, createCookieOptions)
    .redirect(`${process.env.FRONTEND_URL}/oauth-success?token=${accessToken}`);
};

// Force Logout
export const forceLogout = async (req, res) => {
  const { sessionId } = req.params;
  const user = req.user;

  console.log(sessionId);
  const session = (await sessionService.getSessions({ id: sessionId }))?.[0];
  if (!session || session.userId != user.id) {
    throw new ApiError(403, "You are not authorized to logout this session");
  }

  await sessionService.deleteSessionById(sessionId);

  const io = req.app.get("io");
  io.to(user.id).emit("session-changed");
  io.to(sessionId).emit("force-logout");

  return res.sendStatus(200);
};

//Logut All
export const logoutAll = async (req, res) => {
  const user = req.user;
  const sessions = await sessionService.deleteAllUserSessions(user.id);
  if (sessions.count > 0) {
    const io = req.app.get("io");
    io.to(user.id).emit("session-changed");
  }
  return res.sendStatus(200);
};

//Get sessions
export const getSessions = async (req, res) => {
  const user = req.user;
  const sessions = await sessionService.getSessions({ userId: user.id });
  return res.status(200).json(sessions);
};
