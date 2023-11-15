import express from "express";
import { Product } from "../models";
import { User } from "../models";
import { resBody } from "./authRouter.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// 사용자가 존재하지 않는 url에 요청을 보내면 어떻게 처리할 것인가?

// 상품 목록 조회 API o
router.get("/products", async (req, res) => {
  let order = "desc";
  // query에서 asc로 지정하는 경우 이외엔 전부 desc(최신순)
  if (req.query.sort.toLowerCase() === "asc") {
    order = req.query.sort;
  }

  const products = await Product.findAll({
    include: [{ model: User, attributes: ["name"] }],
    order: [["createdAt", order]]
  });

  const filteredProducts = products.map((product) => ({
    id: product.id,
    title: product.title,
    content: product.content,
    author: product.User.name,
    status: product.status,
    createdAt: product.createdAt
  }));

  return res.json({ data: filteredProducts });
});

// 상품 생성 API o
router.post("/products", authMiddleware, async (req, res) => {
  const {
    body: { title, content }
  } = req; // 상품명, 작성 내용, 작성자명 , 비밀번호, 상품 상태 default:FOR_SALE
  const { loggedInUserId: userId } = res.locals;
  if (!title || !content) {
    return res.status(400).json({
      ...resBody(false, "데이터 형식이 올바르지 않습니다.")
    });
  }
  try {
    await Product.create({ title, content, userId });
    return res
      .status(200)
      .json({ ...resBody(true, "판매 상품을 등록하였습니다.") });
  } catch (error) {
    return res.send(404).json({
      ...resBody(false, "판매 상품 등록에 실패하였습니다.")
    });
  }
});

// 상품 상세 조회 API o
router.get("/products/:productId(\\d+)", async (req, res) => {
  const {
    params: { productId }
  } = req;

  if (!productId) {
    return res.status(400).json({
      ...resBody(false, "데이터 형식이 올바르지 않습니다.")
    });
  }
  try {
    const product = await Product.findByPk(productId, {
      include: [{ model: User, attributes: ["name"] }]
    });
    if (!product) {
      return res
        .status(404)
        .json({ ...resBody(false, "상품 조회에 실패하였습니다.") });
    }

    //  상품 ID, 상품명, 작성 내용, 작성자명, 상품 상태, 작성 날
    return res.status(200).json({
      success: true,
      data: {
        id: product.id,
        title: product.title,
        content: product.content,
        author: product.User.dataValues.name,
        status: product.status,
        createdAt: product.createdAt
      }
    });
  } catch (error) {
    console.error("Error: ", error);
    return res.status(400).send({ success: false });
  }
});

// 상품 정보 수정 ㅅ
// 코드 추후에 더 살펴보기. 쿼리 남발
router.put(
  "/products/:productId(\\d+)/edit",
  authMiddleware,
  async (req, res) => {
    const {
      body: { title, content, status }, // 상품명, 작성 내용, 상품상태, 비밀번호
      params: { productId }
    } = req;
    const { loggedInUserId } = res.locals;

    // 이 부분 따로 함수로 빼는게 좋은건지 질문하기
    if (!title || !content) {
      return res.status(400).json({
        ...resBody(false, "데이터 형식이 올바르지 않습니다.")
      });
    }
    // 상품 존재를 확인하는 exists 함수 있는지 확인
    const product = await Product.findByPk(productId);
    if (!product) {
      // 제품 없는 경우
      return res.status(404).json({
        ...resBody(false, "상품 조회에 실패하였습니다.")
      });
    }
    if (product.userId !== loggedInUserId) {
      return res.status(401).json({
        ...resBody(false, "상품을 수정할 권한이 존재하지 않습니다.")
      });
    }

    await Product.update(
      {
        title,
        content,
        status
      },
      {
        where: { id: productId }
      }
    );

    const updatedProduct = await Product.findByPk(productId, {
      include: [{ model: User, attributes: ["name"] }]
    });
    return res.status(200).json({
      ...resBody(true, "상품 정보가 수정되었습니다."),
      data: {
        id: updatedProduct.id,
        title: updatedProduct.title,
        content: updatedProduct.content,
        author: updatedProduct.User.dataValues.name,
        status: updatedProduct.status,
        createdAt: updatedProduct.createdAt
      }
    });
  }
);

// 상품 삭제 API o
router.delete(
  "/products/:productId(\\d+)/delete",
  authMiddleware,
  async (req, res) => {
    const {
      params: { productId }
    } = req;
    const { loggedInUserId } = res.locals;
    if (!productId) {
      return res.status(400).json({
        ...resBody(false, "데이터 형식이 올바르지 않습니다.")
      });
    }
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({
        ...resBody(false, "상품 조회에 실패하였습니다.")
      });
    }

    // 로그인 유저와 업로드 유저가 다른 경우
    if (product.userId !== loggedInUserId) {
      return res.status(401).json({
        ...resBody(false, "상품을 삭제할 권한이 존재하지 않습니다.")
      });
    }

    try {
      await product.destroy();
      return res.status(200).json({
        ...resBody(true, "상품이 삭제되었습니다.")
      });
    } catch (error) {
      console.error("ERROR", error);
      return res.status(404).json({
        ...resBody(false, "상품 삭제에 실패했습니다.")
      });
    }
  }
);

export default router;
