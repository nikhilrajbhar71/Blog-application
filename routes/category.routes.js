import express from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
} from "../controllers/category.controller.js";
import verifyAuthor from "../middleware/verifyAuthor.js";
import authenticateUser from "../middleware/authenticateUser.js";
import { validateCategoryCreation } from "../middleware/validators/category/categoryValidator.js";
const router = express.Router();

router.post(
  "/create",
  authenticateUser,
  verifyAuthor,
  validateCategoryCreation,
  createCategory
);
router.get(
  "/getallcategories",
  authenticateUser,
  verifyAuthor,
  getAllCategories
);
router.delete("/delete/:id", authenticateUser, verifyAuthor, deleteCategory);
export default router;
