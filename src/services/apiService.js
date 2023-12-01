import { ApiRepository } from "../repositories/apiRepository";
import response from "../lib/response";

export class ApiService {
  apiRepository = new ApiRepository();

  getProducts = async (order) => {
    // 프로덕트 갖고오기 , order는 정렬순서
    const products = await this.apiRepository.findAllProducts(order);
    return response({ status: 200, message: "", data: products });
  };

  postProduct = async (title, content, id) => {
    const products = await this.apiRepository.postProduct(title, content, id);
    return response({
      status: 201,
      message: "제품을 판매 상품을 등록하였습니다.",
      data: products
    });
  };
  getProductById = async (productId) => {
    const product = await this.apiRepository.getProductById(productId);
    if (!product) {
      return response({
        status: 404,
        message: "상품 조회에 실패했습니다.",
        data: product
      });
    }
    return response({
      status: 200,
      message: "상품을 조회했습니다.",
      data: product
    });
  };

  editProduct = async (
    productId,
    title,
    content,
    status,

    loggedInUser
  ) => {
    const existProduct = await this.apiRepository.getProductById(productId);

    if (!existProduct) {
      return response({
        status: 404,
        message: "상품 조회에 실패했습니다."
      });
    }

    if (existProduct.User.userId !== loggedInUser.id) {
      return response({
        status: 401,
        message: "상품을 수정할 권한이 없습니다."
      });
    }

    let statusCheck = ["FOR_SALE", "SOLD_OUT"];

    if (!statusCheck.includes(status)) {
      return response({
        status: 400,
        message: "상품의 상태는 FOR_SALE 또는 SOLD_OUT 외 가질 수 없습니다."
      });
    }

    if (
      existProduct.title === title &&
      existProduct.content === content &&
      existProduct.status === status
    ) {
      return response({
        status: 201,
        message: "상품 정보의 변화가 없습니다."
      });
    }

    const product = await this.apiRepository.editProduct(
      productId,
      title,
      content,
      status
    );

    return response({
      status: 200,
      message: "상품을 수정했습니다.",
      data: product
    });
  };

  deleteProduct = async (productId, loggedInUser) => {
    const existProduct = await this.apiRepository.getProductById(productId);

    if (!existProduct) {
      return response({
        status: 404,
        message: "상품 조회에 실패했습니다."
      });
    }

    if (existProduct.User.userId !== loggedInUser.id) {
      return response({
        status: 401,
        message: "상품을 수정할 권한이 없습니다."
      });
    }

    const deletedProduct = await this.apiRepository.deleteProduct(productId);

    return response({
      status: 200,
      message: "상품을 삭제했습니다.",
      data: deletedProduct
    });
  };
}
