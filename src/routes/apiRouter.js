import express from "express";
import { Product } from "../../models/index.js";
import { User } from "../../models/index.js";
import { resBody } from "../utils/resBody.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import { ApiController } from "../controllers/apiController.js";

const router = express.Router();

const apiController = new ApiController();
// 상품 목록 조회 API (기능 구현 완)
router.get("/products", apiController.getProducts);
// router.get("/products", async (req, res) => {
//   // QueryString으로 sort 항목을 받아서 정렬 방식을 결정
//   // query에서 asc로 지정하는 경우 이외엔 전부 desc(최신순) , 대소문자 구분 X

//   let order = "desc";
//   if (req.query.sort === undefined) {
//     order = "desc";
//   } else {
//     if (req.query.sort.toLowerCase() === "asc") {
//       order = req.query.sort;
//     }
//   }

//   const products = await Product.findAll({
//     include: [{ model: User, attributes: ["name"] }],
//     order: [["createdAt", order]]
//   });
//   // 상품 ID, 상품명, 작성 내용, 작성자명, 상품 상태, 작성 날짜 조회
//   const filteredProducts = products.map((product) => ({
//     id: product.id,
//     title: product.title,
//     content: product.content,
//     author: product.User.name, // 사용자 Table의 JOIN
//     status: product.status,
//     createdAt: product.createdAt
//   }));

//   return res.status(200).send({ data: filteredProducts });
// });

// 상품 생성 API o
router.post("/products", authMiddleware, apiController.postProduct);
// router.post("/products", authMiddleware, async (req, res) => {
//   const {
//     title,
//     content // 상품명, 작성 내용
//   } = req.body;
//   const { loggedInUserId: userId } = res.locals;
//   if (!title || !content) {
//     return res.status(400).json({
//       ...resBody(false, "데이터 형식이 올바르지 않습니다.")
//     });
//   }
//   try {
//     await Product.create({ title, content, userId });
//     return res
//       .status(201)
//       .json({ ...resBody(true, "판매 상품을 등록하였습니다.") });
//   } catch (error) {
//     return res.send(500).json({
//       ...resBody(false, "판매 상품 등록에 실패하였습니다.")
//     });
//   }
// });

// 상품 상세 조회 API o
router.get("/products/:productId(\\d+)", async (req, res) => {
  const { productId } = req.params;

  try {
    const product = await Product.findByPk(productId, {
      // 테이블 조인
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
    return res
      .status(500)
      .send({ ...resBody(false, "상품 조회에 실패했습니다.") });
  }
});

// 상품 정보 수정 o
router.put(
  "/products/:productId(\\d+)",
  authMiddleware, // 인증 기능 추가
  async (req, res) => {
    const {
      body: { title, content, status }, // 상품명, 작성 내용, 상품상태
      params: { productId } // 수정하고 싶은 상품 아이디
    } = req;
    const { loggedInUserId } = res.locals;

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
    // 업로더와 현재 로그인 한 유저가 다른 경우
    if (product.userId !== loggedInUserId) {
      return res.status(401).json({
        ...resBody(false, "상품을 수정할 권한이 존재하지 않습니다.")
      });
    }

    try {
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
    } catch (error) {
      return res.status(500).send({
        ...resBody(false, "상품 정보 수정에 실패했습니다. 다시 시도해주세요.")
      });
    }
  }
);

// 상품 삭제 API
router.delete(
  "/products/:productId(\\d+)",
  authMiddleware, // 인증 기능 추가
  async (req, res) => {
    const {
      params: { productId }
    } = req;
    const { loggedInUserId } = res.locals;

    const product = await Product.findByPk(productId);
    if (!product) {
      // 선택한 상품이 존재하지 않을 경우,
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
      return res.status(500).json({
        ...resBody(false, "상품 삭제에 실패했습니다.")
      });
    }
  }
);

export default router;
