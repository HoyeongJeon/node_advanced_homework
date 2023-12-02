import express from "express";
import authMiddleware from "../middlewares/authMiddleware";
import validationCheck from "../middlewares/validationMiddleware";
import { AuthController } from "../controllers/authController";
import { AuthRepository } from "../repositories/authRepository";
import { AuthService } from "../services/authService";
import { prisma } from "../utils/prisma";
const router = express.Router();

const authRepository = new AuthRepository(prisma);
const authService = new AuthService(authRepository);
const authController = new AuthController(authService);

router.post("/signup", validationCheck, authController.signup);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.get("/my-profile", authMiddleware, authController.me);

export default router;
