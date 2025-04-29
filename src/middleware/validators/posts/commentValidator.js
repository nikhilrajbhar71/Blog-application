import { param, body, validationResult } from "express-validator";
import responseHandler from "../../../utils/responseHandler.js";
import { throwValidationError } from "../throwValidationError.js";

function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throwValidationError(res, errors);
  }
  next();
}

export const validateComment = [
  param("id")
    .isString({ gt: 0 })
    .withMessage("Post ID must be a valid positive integer"),

  body("comment")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Comment must be at least 3 characters long"),

  handleValidationErrors,
];
