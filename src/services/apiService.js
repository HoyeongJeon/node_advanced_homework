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
    const post = await this.apiRepository.postProduct(title, content, id);
    return response({
      status: 201,
      message: "제품을 판매 상품을 등록하였습니다.",
      data: post
    });
  };
}
