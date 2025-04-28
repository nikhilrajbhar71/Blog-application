import express from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
} from "../controllers/category.controller.js";
import authenticateUser from "../middleware/authenticateUser.js";
import { validateCategoryCreation } from "../middleware/validators/category/categoryValidator.js";
import verifyAdmin from "../middleware/verifyAdmin.js";
import { validateGetAllposts } from "../middleware/validators/posts/getAllPosts.js";
const router = express.Router();

router.post(
  "/create",
  authenticateUser,
  verifyAdmin,
  validateCategoryCreation,
  createCategory
);
router.get("/", authenticateUser, validateGetAllposts, getAllCategories);
router.delete("/:id", authenticateUser, verifyAdmin, deleteCategory);
export default router;
