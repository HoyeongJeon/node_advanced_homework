import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { resBody } from "../routes/authRouter";

const authMiddleware = (req, res, next) => {
  const { authorization } = req.headers;
  //
  if (!authorization) {
    return res.status(401).send({ ...resBody(false, "로그인 해주세요") });
  }
  // 토큰 표준과 일치하지 않는 경우
  const [tokenType, tokenCredential] = authorization.split(" ");
  if (!tokenType || !tokenCredential || tokenType !== "Bearer") {
    // 토큰 중 하나라도 없는 경우
    return res.status(401).send({ ...resBody(false, "로그인 해주세요") });
  }

  // 토큰 에러 종류별로 핸들링 (만료, 삭제)

  try {
    const { loggedInUserId } = jwt.verify(
      tokenCredential,
      process.env.SECRET_KEY
    );
    res.locals.loggedInUserId = loggedInUserId;
    next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      console.error(error);
      return res.status(401).send({
        ...resBody(false, "토큰이 만료되었어요! 다시 로그인해주세요")
      });
    } else if (error instanceof JsonWebTokenError) {
      console.log("Token verify 실패,유효성 로직 체크 필요.(비밀키)");
      console.error(error);
      return res.status(401).send({
        ...resBody(false, "다시 로그인해주세요")
      });
    } else {
      console.error(error);
    }
  }
};

export default authMiddleware;
