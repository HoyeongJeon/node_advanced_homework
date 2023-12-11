import response from "../lib/response.js";
import { customError } from "../utils/customError/index.js";

export class AuthController {
  constructor(authService) {
    this.authService = authService;
  }
  signup = async (req, res, next) => {
    try {
      const { email, name, password, passwordCheck } = req.body;
      if (password !== passwordCheck) {
        throw new customError(
          400,
          "Bad Request",
          "비밀번호가 일치하지 않습니다."
        );
      }

      const responseFromService = await this.authService.signup(
        email,
        name,
        password
      );

      return res.status(responseFromService.status).json(responseFromService);
    } catch (error) {
      next(error);
    }
  };
  login = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        throw new customError(
          400,
          "Bad Request",
          "아이디 / 비밀번호를 입력해주세요."
        );
      }

      const responseFromService = await this.authService.login(email, password);

      req.session.loggedIn = true;
      req.session.loggedInUser = responseFromService.data;
      return res.status(responseFromService.status).json(responseFromService);
    } catch (error) {
      next(error);
    }
  };

  me = async (req, res, next) => {
    try {
      return res
        .status(200)
        .json(
          response({ status: 200, message: "", data: req.session.loggedInUser })
        );
    } catch (error) {
      next(error);
    }
  };
  logout = (req, res, next) => {
    try {
      req.session.user = null;
      res.locals.loggedInUser = req.session.user;
      req.session.loggedIn = false;
      return res
        .status(200)
        .json(response({ status: 200, message: "로그아웃 됐습니다." }));
    } catch (error) {
      next(error);
    }
  };
}
