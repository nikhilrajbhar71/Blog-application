import express from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
} from "../controllers/category.controller.js";
import verifyAuthor from "../middleware/verifyAuthor.js";
import authenticateUser from "../middleware/authenticateUser.js";
import { validateCategoryCreation } from "../middleware/validators/category/categoryValidator.js";
import verifyAdmin from "../middleware/verifyAdmin.js";
const router = express.Router();

router.post(
  "/create",
  authenticateUser,
  verifyAdmin,
  validateCategoryCreation,
  createCategory
);
router.get("/getallcategories", authenticateUser, getAllCategories);
router.delete("/delete/:id", authenticateUser, verifyAdmin, deleteCategory);
export default router;
