import express from "express";
import { createCategory, getAllCategories } from "../controllers/category.controller.js";
import isAuthor from "../middleware/isAuthor.js";
const router = express.Router();

router.post("/create", isAuthor, createCategory);
router.get("/getallcategories", isAuthor, getAllCategories);
export default router;
