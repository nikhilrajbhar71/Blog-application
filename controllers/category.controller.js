import { create, getAll } from "../models/category.model.js";
export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const result = await create(name, req.user.id);
    // console.log("result " + JSON.stringify(result));
    if (result) {
      res
        .status(201)
        .json({ message: "Category created successfully", result });
    } else {
      res.status(400).json({ message: "Failed to create category" });
    }
  } catch (error) {
    console.log("error at crate category " + error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllCategories = async (req, res) => {
  try {
    const result = await getAll(req.user.id);
    // console.log("result " + JSON.stringify(result));
    if (result) {
      res
        .status(200)
        .json({ message: "All categories fetched successfully", result });
    } else {
      res.status(400).json({ message: "Failed to create category" });
    }
  } catch (error) {
    console.log("error at get all categories " + error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
