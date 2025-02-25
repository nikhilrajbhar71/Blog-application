import express from "express";
import isAuthor from "../middleware/isAuthor.js";
import upload from "../middleware/upload.js";
import { createPost, updateStatus } from "../controllers/post.controller.js";
const router = express.Router();

router.post("/create", upload.single("image"), isAuthor, createPost);
router.put("/:id/status", isAuthor, updateStatus);
export default router;
