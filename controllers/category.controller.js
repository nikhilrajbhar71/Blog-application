import CategoryResource from "../resources/category.resource.js";
import {
  createNewCategory,
  deleteCategoryById,
  findCategoryByName,
  getPaginatedCategories,
} from "../services/category.service.js";
import responseHandler from "../utils/responseHandler.js";
export const createCategory = async (req, res, next) => {
  try {
    let name = req.body.name.trim().toLowerCase();

    await findCategoryByName(name);

    const category = await createNewCategory(name);

    return responseHandler(res, 200, "Category created successfully", {
      category,
    });
  } catch (error) {
    next(error);
  }
};
export const getAllCategories = async (req, res, next) => {
  try {
    let { page, limit } = req.query;

    const categories = await getPaginatedCategories(page, limit);

    return responseHandler(
      res,
      200,
      "All categories fetched successfully",
      CategoryResource.collection(categories)
    );
  } catch (error) {
    next(error);
  }
};
export const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    await deleteCategoryById(id);

    return responseHandler(res, 200, "Category deleted successfully", {});
  } catch (error) {
    next(error);
  }
};
