import express from "express";
import isAuthor from "../middleware/isAuthor.js";
import upload from "../middleware/upload.js";
import {
  createPost,
  getAllPost,
  getPost,
  likePost,
  updateStatus,
} from "../controllers/post.controller.js";
import protectRoute from "../middleware/isAuthor.js";
const router = express.Router();

router.post("/create", upload.single("image"), isAuthor, createPost);
router.put("/:id/status", isAuthor, updateStatus);
router.get("/getallposts", protectRoute, getAllPost);
router.get("/getpost/:id", protectRoute, getPost);
router.post("/like/:id",protectRoute, likePost)

export default router;
