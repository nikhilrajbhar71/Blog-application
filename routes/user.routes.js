import express from "express";
import { refreshToken, userLogin, userRegister } from "../controllers/user.controller.js";
import { validateUserRegister } from "../middleware/validators/users/registerValidator.js";
import { validateUserLogin } from "../middleware/validators/users/loginValidator.js";
const router = express.Router();

router.post("/register", validateUserRegister, userRegister);
router.post("/login", validateUserLogin, userLogin);
router.get("/refresh",  refreshToken);

export default router;
