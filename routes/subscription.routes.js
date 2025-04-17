import express from "express";
import authenticateUser from "../middleware/authenticateUser.js";
import {
  getsubscribers,
  getsubscriptions,
  subscribe,
  unsubscribe,
} from "../controllers/subscription.controller.js";
import verifyAuthor from "../middleware/verifyAuthor.js";

const router = express.Router();
// TODO : Add validators
router.post("/:author_id", authenticateUser, subscribe);
router.get("/getsubscribers", authenticateUser, verifyAuthor, getsubscribers);
router.get("/getsubscriptions", authenticateUser, getsubscriptions);
router.delete("/:id", authenticateUser, unsubscribe);

export default router;
