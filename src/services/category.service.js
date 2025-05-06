import Category from "../models/category.model.js";
import AppError from "../utils/AppError.js";
export const findCategoryByName = async (name) => {
  const category = await Category.findOne({ name });
  if (category) {
    throw new AppError(409, "Category already exists");
  }
};

export const createNewCategory = async (name) => {
  const category = new Category({ name });
  await category.save();
  return category;
};

export const getPaginatedCategories = async (page, limit) => {
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;
  const skip = (page - 1) * limit;

  const categories = await Category.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  return categories;
};

export const deleteCategoryById = async (id) => {
  const category =await Category.findById(id);
  if (!category) {
    throw new AppError(404, "Category doesn't exist");
  }
  await Category.findByIdAndDelete(id);
};
