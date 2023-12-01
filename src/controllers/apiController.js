import response from "../lib/response";
import { ApiService } from "../services/apiService";

export class ApiController {
  apiService = new ApiService();
  getProducts = async (req, res, next) => {
    try {
      let order = "desc";
      if (req.query.sort === undefined) {
        order = "desc";
      } else {
        if (req.query.sort.toLowerCase() === "asc") {
          order = req.query.sort;
        }
      }
      const responseFromService = await this.apiService.getProducts(order);
      return res.status(responseFromService.status).json(responseFromService);
    } catch (error) {
      next(error);
    }
  };
  postProduct = async (req, res, next) => {
    try {
      const {
        title,
        content // 상품명, 작성 내용
      } = req.body;
      const {
        loggedInUser: { id }
      } = res.locals;

      if (!title || !content) {
        return res.status(400).json(
          response({
            status: 400,
            message: "데이터 형식이 올바르지 않습니다."
          })
        );
      }
      const responseFromService = await this.apiService.postProduct(
        title,
        content,
        id
      );

      return res.status(responseFromService.status).json(responseFromService);
    } catch (error) {
      next(error);
    }
  };
}
