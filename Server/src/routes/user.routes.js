import express from "express";
import {
  getAll,
  getById,
  update,
  remove,
  getMe,
} from "../controllers/user.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", getAll);
router.get("/me", authenticate, getMe);
router.get("/:id", getById);
router.put("/:id", authenticate, update);
router.delete("/:id", authenticate, remove);

export default router;
