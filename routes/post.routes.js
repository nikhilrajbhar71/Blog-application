import express from "express";
import verifyAuthor from "../middleware/verifyAuthor.js";
import upload from "../middleware/upload.js";
import {
  comment,
  createPost,
  getAllPost,
  getPost,
  likePost,
  updateStatus,
} from "../controllers/post.controller.js";
import authenticateUser from "../middleware/authenticateUser.js";
import { validatePostCreation } from "../middleware/validators/posts/postValidator.js";
import { validateUpdateStatus } from "../middleware/validators/posts/updatePostValidator.js";
import { validateGetPost } from "../middleware/validators/posts/getPostValidator.js";
import { validateLikePost } from "../middleware/validators/posts/likeValidator.js";
import { validateComment } from "../middleware/validators/posts/commentValidator.js";
const router = express.Router();

router.post(
  "/create",
  authenticateUser,
  verifyAuthor,
  upload.single("image"),
  validatePostCreation,
  createPost
);
router.put(
  "/:id/status",
  authenticateUser,
  verifyAuthor,
  validateUpdateStatus,
  updateStatus
);
router.get("/getallposts", getAllPost);
router.get("/getpost/:id", validateGetPost, getPost);
router.post("/like/:post_id", authenticateUser, validateLikePost, likePost);
router.post("/comment/:id", authenticateUser, validateComment, comment);

export default router;
