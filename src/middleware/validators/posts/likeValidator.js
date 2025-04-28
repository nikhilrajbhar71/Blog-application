import { query, validationResult } from "express-validator";
import { throwValidationError } from "../throwValidationError.js";

function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throwValidationError(res, errors);

  }
  next();
}

export const validateLikePost = [
  query("id")
    .isInt({ gt: 0 })
    .withMessage("Post ID must be a valid positive integer"),
  query("type")
    .trim()
    .isLength({ min: 1 })
    .withMessage("type must be at least 1 characters long"),
  // Middleware to handle validation errors
  handleValidationErrors,
];
