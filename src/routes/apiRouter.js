import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { ApiController } from "../controllers/apiController.js";
import { ApiRepository } from "../repositories/apiRepository.js";
import { prisma } from "../utils/prisma/index.js";
import { ApiService } from "../services/apiService.js";
const apiRepository = new ApiRepository(prisma);
const apiService = new ApiService(apiRepository);
const apiController = new ApiController(apiService);

const router = express.Router();

router.get("/products", apiController.getProducts);
router.post("/products", authMiddleware, apiController.postProduct);
router.get("/products/:productId(\\d+)", apiController.getProductById);
router.put(
  "/products/:productId(\\d+)",
  authMiddleware,
  apiController.editProduct
);
router.delete(
  "/products/:productId(\\d+)",
  authMiddleware,
  apiController.deleteProduct
);

export default router;
