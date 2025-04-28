import { query, validationResult } from "express-validator";
import { throwValidationError } from "../throwValidationError.js";

function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throwValidationError(res, errors);
  }
  next();
}

export const validateGetAllposts = [
  query("limit")
    .isInt({ gt: 0 })
    .withMessage("limit must be a valid positive integer"),
  query("page")
    .isInt({ gt: 0 })
    .withMessage("page must be a valid positive integer"),

  handleValidationErrors,
];
