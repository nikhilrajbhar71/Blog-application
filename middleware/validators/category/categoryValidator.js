import { body, validationResult } from "express-validator";

export const validateCategoryCreation = [
  body("name").trim().notEmpty().withMessage("name is required"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
