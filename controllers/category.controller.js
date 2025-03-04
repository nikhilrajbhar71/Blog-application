import { create, getAll } from "../models/category.model.js";
import AppError from "../utils/AppError.js";
import responseHandler from "../utils/responseHandler.js";
export const createCategory = async (req, res,next) => {
  try {
    const { name } = req.body;
    const result = await create(name, req.user.id);
    if (result) {
      return responseHandler(res, 201, "Category created successfully", {
        result,
      });
    } else {
      return responseHandler(res, 400, "Failed to create category");
    }
  } catch (error) {
    next(error);
  }
};

export const getAllCategories = async (req, res, next) => {
  try {
    const result = await getAll(req.user.id);

    if (result) {
      return responseHandler(res, 200, "All categories fetched successfully", {
        result,
      });
    } else {
      throw new AppError(404, "NO catogry found");
    }
  } catch (error) {
    next(error);
  }
};
