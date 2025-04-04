import express from "express";
import verifyAuthor from "../middleware/verifyAuthor.js";
import upload from "../middleware/upload.js";
import {
  createPost,
  deletePost,
  getAllPost,
  getPost,
  likeComment,
  likePost,
  updateStatus,
} from "../controllers/post.controller.js";
import authenticateUser from "../middleware/authenticateUser.js";
import { validatePostCreation } from "../middleware/validators/posts/postValidator.js";

import { validateGetPost } from "../middleware/validators/posts/getPostValidator.js";

import { validateGetAllposts } from "../middleware/validators/posts/getAllPosts.js";
const router = express.Router();

router.post(
  "/create",
  authenticateUser,
  verifyAuthor,
  upload.single("image"),
  validatePostCreation,
  createPost
);
router.put("/:id/status", authenticateUser, verifyAuthor, updateStatus);
router.delete(
  "/:id",
  authenticateUser,
  verifyAuthor,
  validateGetPost,
  deletePost
);
router.get("/", validateGetAllposts, getAllPost);
router.get("/:id", validateGetPost, getPost);
router.post("/likePost/:id", authenticateUser, validateGetPost, likePost);
router.post("/likecomment/:id", authenticateUser, validateGetPost, likeComment);

export default router;
