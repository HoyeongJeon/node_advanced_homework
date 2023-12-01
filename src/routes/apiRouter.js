import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { ApiController } from "../controllers/apiController.js";
import { ApiRepository } from "../repositories/apiRepository.js";
import { prisma } from "../utils/prisma/index.js";
import { ApiService } from "../services/apiService.js";

const router = express.Router();

const apiRepository = new ApiRepository(prisma);
const apiService = new ApiService(apiRepository);
const apiController = new ApiController(apiService);

// 상품 목록 조회 API (기능 구현 완)
router.get("/products", apiController.getProducts);

// 상품 생성 API o
router.post("/products", authMiddleware, apiController.postProduct);

// 상품 상세 조회 API o
router.get("/products/:productId(\\d+)", apiController.getProductById);

// 상품 정보 수정 o

router.put(
  "/products/:productId(\\d+)",
  authMiddleware,
  apiController.editProduct
);

// 상품 삭제 API
router.delete(
  "/products/:productId(\\d+)",
  authMiddleware,
  apiController.deleteProduct
);

export default router;
