import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";

const JWT_SECRET = process.env.JWT_SECRET;

export const authenticate = async (req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.body?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  const refreshToken = req.cookies?.refreshToken;

  if (!token || !refreshToken)
    throw new ApiError(401, "Unauthenticated Access!");

  try {
    const decodeToken = jwt.verify(token, JWT_SECRET);
    req.user = decodeToken;
    next();
  } catch (error) {
    throw new ApiError(401, "Unauthenticated Access!");
  }
};

export const authorize = (roles = []) => {
  return (req, res, next) => {
    const userRole = req.user.role || "";
    if (!roles.includes(userRole)) {
      throw new ApiError(403, "Unauthorized Access!");
    }
    next();
  };
};
