import express from "express";
import authMiddleware from "../middlewares/authMiddleware";
import validationCheck from "../middlewares/validationMiddleware";
import { AuthController } from "../controllers/authController";
const router = express.Router();

const authController = new AuthController();

router.post("/signup", validationCheck, authController.signup);
router.post("/login", authController.login);
router.get("/my-profile", authMiddleware, authController.me);

export default router;
