import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export const authenticate = (req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.body?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token)
    return res.status(401).json({ message: "Unauthenticated Access!" });

  try {
    const decodeToken = jwt.verify(token, JWT_SECRET);
    req.user = decodeToken;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthenticated Access!" });
  }
};

export const authorize = (roles = []) => {
  return (req, res, next) => {
    const userRole = req.user.role || "";
    if (!roles.includes(userRole)) {
      return res.status(403).json({ message: "Access Denied!" });
    }
    next();
  };
};
