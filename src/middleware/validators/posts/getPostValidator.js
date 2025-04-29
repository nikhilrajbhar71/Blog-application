import { param, validationResult } from "express-validator";
import { throwValidationError } from "../throwValidationError.js";

function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throwValidationError(res, errors);
  }
  next();
}

export const validateGetPost = [
  param("id")
    .isString({ gt: 0 })
    .withMessage("Post ID must be a valid positive integer"),

  handleValidationErrors,
];
