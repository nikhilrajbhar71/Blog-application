import Category from "../models/category.model.js";
import AppError from "../utils/AppError.js";
export const findCategoryByName = async (name) => {
  const category = await Category.findOne({ where: { name } });
  if (category) {
    throw new AppError(409, "Category already exists");
  }
};

export const createNewCategory = async (name) => {
  return await Category.create({ name });
};

export const getPaginatedCategories = async (page, limit) => {
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;
  const offset = (page - 1) * limit;
  return await Category.findAll({
    limit,
    offset,
    order: [["createdAt", "DESC"]],
  });
};

export const deleteCategoryById = async (id) => {
  return await Category.destroy({ where: { id } });
};
