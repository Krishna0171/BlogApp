import { Router } from "express";
import {
  register,
  login,
  refreshToken,
  logout,
  callback,
  forgotPassword,
  resetPassword,
  forceLogout,
  logoutAll,
  getSessions
} from "../controllers/auth.controller.js";
import passport from "../config/passport.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh-token", refreshToken);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

router.post("/sessions/:sessionId", authenticate, forceLogout);
router.post("/sessions/logout-all", authenticate, logoutAll);
router.get("/sessions", authenticate, getSessions);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: process.env.FRONTEND_URL + "/login",
  }),
  callback
);

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);
router.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: process.env.FRONTEND_URL + "/login",
  }),
  callback
);

export default router;
