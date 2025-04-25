import { body, validationResult } from "express-validator";
import { throwValidationError } from "../throwValidationError.js";

export const validateCategoryCreation = [
  body("name").trim().notEmpty().withMessage("name is required"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throwValidationError(res, errors);
    }
    next();
  },
];
