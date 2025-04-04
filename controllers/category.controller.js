import Category from "../models/category.model.js";
import AppError from "../utils/AppError.js";
import responseHandler from "../utils/responseHandler.js";
export const createCategory = async (req, res, next) => {
  try {
    let name = req.body.name.trim().toLowerCase();
    const existingCategory = await Category.findOne({ where: { name } });

    if (existingCategory) {
      throw new AppError(409, "Category already exists");
    }
    const category = await Category.create({
      name,
    });

    return responseHandler(res, 201, "Category created successfully", {
      category,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllCategories = async (req, res, next) => {
  try {
    let { page, limit } = req.query;

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const offset = (page - 1) * limit;

    const categories = await Category.findAll({
      limit: limit,
      offset: offset,
      order: [["createdAt", "DESC"]],
      where: {},
    });

    return responseHandler(res, 200, "All categories fetched successfully", {
      categories,
    });
  } catch (error) {
    next(error);
  }
};
export const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedCategory = await Category.destroy({
      where: { id: id },
    });

    return responseHandler(res, 200, "Category deleted successfully", {
      post: deletedCategory,
    });
  } catch (error) {
    next(error);
  }
};
