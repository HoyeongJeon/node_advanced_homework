import response from "../lib/response";

export class ApiController {
  constructor(apiService) {
    this.apiService = apiService;
  }
  getProducts = async (req, res, next) => {
    try {
      const order =
        req.query.sort && req.query.sort.toLowerCase() === "asc"
          ? "asc"
          : "desc";

      const responseFromService = await this.apiService.getProducts(order);
      return res.status(responseFromService.status).json(responseFromService);
    } catch (error) {
      next(error);
    }
  };

  getProductById = async (req, res, next) => {
    try {
      const { productId } = req.params;

      const responseFromService =
        await this.apiService.getProductById(productId);

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
        loggedInUser: { userId }
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
        userId
      );

      return res.status(responseFromService.status).json(responseFromService);
    } catch (error) {
      next(error);
    }
  };
  editProduct = async (req, res, next) => {
    try {
      const {
        body: { title, content, status }, // 상품명, 작성 내용, 상품상태
        params: { productId } // 수정하고 싶은 상품 아이디
      } = req;
      const { loggedInUser } = res.locals;

      if (!title || !content) {
        return res.status(400).json(
          response({
            status: 400,
            message: "데이터 형식이 올바르지 않습니다."
          })
        );
      }
      const responseFromService = await this.apiService.editProduct(
        productId,
        title,
        content,
        status,
        loggedInUser
      );

      return res.status(responseFromService.status).json(responseFromService);
    } catch (error) {
      next(error);
    }
  };

  deleteProduct = async (req, res, next) => {
    try {
      const {
        params: { productId }
      } = req;
      const { loggedInUser } = res.locals;

      const responseFromService = await this.apiService.deleteProduct(
        productId,
        loggedInUser
      );

      return res.status(responseFromService.status).json(responseFromService);
    } catch (error) {
      next(error);
    }
  };
}
