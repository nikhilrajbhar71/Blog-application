import express from "express";
import {
  deleteUserProfile,
  getUserProfile,
  refreshToken,
  userLogin,
  userRegister,
} from "../controllers/user.controller.js";
import { validateUserRegister } from "../middleware/validators/users/registerValidator.js";
import { validateUserLogin } from "../middleware/validators/users/loginValidator.js";
import verifyRefreshToken from "../middleware/verifyRefreshToken.js";
import { validateGetPost } from "../middleware/validators/posts/getPostValidator.js";
import authenticateUser from "../middleware/authenticateUser.js";

const router = express.Router();

router.post("/register", validateUserRegister, userRegister);
router.post("/login", validateUserLogin, userLogin);
router.get("/refresh", verifyRefreshToken, refreshToken);
router.get("/:id", validateGetPost, getUserProfile);
router.delete("/", authenticateUser, deleteUserProfile);

export default router;
