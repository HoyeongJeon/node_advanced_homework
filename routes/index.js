import express from "express";
import Product from "../schemas/products.schema";

const router = express.Router();

router.get("/", (req, res) => {
  return res.render("api.html");
});

// 상품 목록 조회 API
router.get("/products", async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 }); // 최신순 정렬
  const filteredProducts = products.map((product) => {
    const { title, content, author, status, createdAt } = product; // 상품명, 상품내용, 작성자명, 상품 상태, 작성 날짜
    return { title, content, author, status, createdAt };
  });
  return res.json({ data: filteredProducts });
});

// 상품 작성 API
router.post("/products", async (req, res) => {
  const {
    body: { title, content, author, password }
  } = req; // 상품명, 작성 내용, 작성자명 , 비밀번호, 상품 상태 default:FOR_SALE
  if (!title || !content || !author || !password) {
    return res
      .status(400)
      .json({ errorMessage: "데이터 형식이 올바르지 않습니다." });
  }
  try {
    await Product.create({ title, content, author, password });
    return res.status(200).json({ message: "판매 상품을 등록하였습니다." });
  } catch (error) {
    return res.send(404).json({
      errorMessage: "판매 상품 등록에 실패하였습니다.",
      error
    });
  }
});

// 상품 상세 조회 API
router.get("/products/:productId([0-9a-f]{24})", async (req, res) => {
  const {
    params: { productId }
  } = req;

  if (!productId) {
    return res
      .status(400)
      .json({ errorMessage: "데이터 형식이 올바르지 않습니다." });
  }
  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ errorMessage: "상품 조회에 실패하였습니다." });
    }
    const { title, content, author, status, createdAt } = product;

    return res.status(200).json({
      data: {
        title,
        content,
        author,
        status,
        createdAt
      }
    });
  } catch (error) {
    console.error("Error: ", error);
    return res.redirect("/products");
  }
});

// 상품 정보 수정
router.put("/products/:productId([0-9a-f]{24})/edit", async (req, res) => {
  const {
    body: { title, content, password, status }, // 상품명, 작성 내용, 상품상태, 비밀번호
    params: { productId }
  } = req;

  if (!title || !content || !status || !password) {
    return res
      .status(400)
      .json({ errorMessage: "데이터 형식이 올바르지 않습니다." });
  }
  const product = await Product.findById(productId);
  if (!product) {
    // 제품 없는 경우
    return res
      .status(404)
      .json({ errorMessage: "상품 조회에 실패하였습니다." });
  }
  if (product.password !== password) {
    // 비밀번호 일치 여부
    return res
      .status(401)
      .json({ errorMessage: "상품을 수정할 권한이 존재하지 않습니다." });
  }
  await Product.findByIdAndUpdate(productId, {
    title,
    content,
    status,
    password
  });
  return res.status(200).json({
    message: "상품 정보를 수정하였습니다."
  });
});

// 상품 삭제 API
router.delete("/products/:productId([0-9a-f]{24})/delete", async (req, res) => {
  const {
    body: { password },
    params: { productId }
  } = req;

  if (!password || !productId) {
    return res
      .status(400)
      .json({ errorMessage: "데이터 형식이 올바르지 않습니다." });
  }
  const product = await Product.findById({ _id: productId });
  if (!product) {
    return res
      .status(404)
      .json({ errorMessage: "상품 조회에 실패하였습니다." });
  }
  if (product.password !== password) {
    // 비밀번호 일치 여부
    return res
      .status(401)
      .json({ errorMessage: "상품을 수정할 권한이 존재하지 않습니다." });
  }
  try {
    await product.deleteOne();
    return res.status(200).json({
      message: "상품을 삭제하였습니다."
    });
  } catch (error) {
    console.error("ERROR", error);
    return res.status(404).json({
      message: "상품 삭제에 실패하였습니다."
    });
  }
});

export default router;

/*

{
  "title": "갤럭시 플립",
  "content": "새거에요",
  "author": "판매자",
  "password":"1234"
}


 */
