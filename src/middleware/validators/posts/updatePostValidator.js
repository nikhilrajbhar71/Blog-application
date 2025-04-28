import { param, body, validationResult } from "express-validator";
import { throwValidationError } from "../throwValidationError";

function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throwValidationError(res, errors);
  }
  next();
}

export const validateUpdateStatus = [
  param("id")
    .isInt({ gt: 0 })
    .withMessage("Post ID must be a valid positive integer"),

  body("is_published")
    .isIn(["true", "false"])
    .withMessage("is_published must be 'true' or 'false'"),

  handleValidationErrors,
];
