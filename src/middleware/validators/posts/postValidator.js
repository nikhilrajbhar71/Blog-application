import { body, validationResult } from "express-validator";
import { throwValidationError } from "../throwValidationError.js";

function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throwValidationError(res, errors);
  }
  next();
}

export const validatePostCreation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 3 })
    .withMessage("Title must be at least 3 characters long"),

  body("content")
    .trim()
    .notEmpty()
    .withMessage("Content is required")
    .isLength({ min: 10 })
    .withMessage("Content must be at least 10 characters long"),

  body("categoryId")
    .isInt({ gt: 0 })
    .withMessage("Category ID must be a valid positive integer"),

  body("is_published")
    .optional()
    .isIn([1, 0])
    .withMessage("is_published must be 'true' or 'false'"),

  handleValidationErrors,
];
