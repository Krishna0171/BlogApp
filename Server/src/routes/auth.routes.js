import { Router } from "express";
import {
  register,
  login,
  refreshToken,
  logout,
  googleCallback,
} from "../controllers/auth.controller.js";
import passport from "../config/passport.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh-token", refreshToken);
router.post("/logout", logout);
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  googleCallback
);

export default router;
