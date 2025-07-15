import express from "express";
import * as postController from "../controllers/post.controller.js";
import { authenticate, authorize } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = express.Router();

router.get("/", authenticate, postController.getAll);
router.get("/favorites", authenticate, postController.getFavorites);
router.get("/:id", authenticate, postController.getById);
router.post(
  "/",
  authenticate,
  authorize(["admin"]),
  upload.single("image"),
  postController.create
);
router.put(
  "/:id",
  authenticate,
  authorize(["admin"]),
  upload.single("image"),
  postController.update
);
router.delete(
  "/:id",
  authenticate,
  authorize(["admin"]),
  postController.remove
);
router.patch(
  "/:id",
  authenticate,
  authorize(["admin"]),
  postController.toggleFavorite
);

export default router;
