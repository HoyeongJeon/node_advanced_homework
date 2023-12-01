import response from "../lib/response";
import { AuthService } from "../services/authService";

export class AuthController {
  authService = new AuthService();
  signup = async (req, res, next) => {
    try {
      const { email, name, password, passwordCheck } = req.body;
      if (password !== passwordCheck) {
        return res.status(400).json(
          response({
            status: 400,
            message: "비밀번호가 일치하지 않습니다."
          })
        );
      }

      const responseFromService = await this.authService.signup(
        email,
        name,
        password
      );

      // 이거 없어도 될 듯?
      if (responseFromService.status >= 400) {
        return res.status(responseFromService.status).json(responseFromService);
      }

      return res.status(responseFromService.status).json(responseFromService);
    } catch (error) {
      next(error);
    }
  };
  login = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json(
          response({
            status: 400,
            message: "아이디 / 비밀번호를 입력해주세요."
          })
        );
      }

      const responseFromService = await this.authService.login(email, password);

      if (responseFromService.status >= 400) {
        return res.status(responseFromService.status).json(responseFromService);
      }

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
