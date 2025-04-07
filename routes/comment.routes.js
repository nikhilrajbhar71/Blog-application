import express from "express";
import {
  comment,
  deleteComment,
  getAllComment,
  getAllReplies,
  ReplyOnComment,
} from "../controllers/comment.controller.js";
import authenticateUser from "../middleware/authenticateUser.js";

import { validateGetPost } from "../middleware/validators/posts/getPostValidator.js";

import { validateComment } from "../middleware/validators/posts/commentValidator.js";

const router = express.Router();
//TODO : update comment route
router.post("/:id", authenticateUser, validateComment, comment);
router.get("/:id", authenticateUser, validateGetPost, getAllComment);
router.delete("/:id", authenticateUser, validateGetPost, deleteComment);
router.post("/reply/:id", authenticateUser, validateComment, ReplyOnComment);
router.get("/getreplies/:id", authenticateUser, validateGetPost, getAllReplies);

export default router;
