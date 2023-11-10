import jwt from "jsonwebtoken";
import { resBody } from "../routes/authRouter";

const authMiddleware = (req, res, next) => {
  const { Authorization } = req.cookies;
  // 토큰이 없는 경우 = 로그인 안함.
  if (!Authorization) {
    return res.status(401).send({ ...resBody(false, "로그인 해주세요") });
  }

  const [tokenType, tokenCredential] = Authorization.split(" ");
  if (!tokenType || !tokenCredential || tokenType !== "Bearer") {
    // 토큰 중 하나라도 없는 경우
    return res.status(401).send({ ...resBody(false, "로그인 해주세요") });
  }

  // console.log(tokenCredential);
  // 토큰 에러 종류별로 핸들링 (만료, 삭제)

  try {
    const { loggedInUserId } = jwt.verify(
      tokenCredential,
      process.env.SECRET_KEY
    );
    console.log(loggedInUserId);
    next();
  } catch (error) {
    console.error("Error", error);
  }

  // header의 authorization token 검증
  // 검증되면 token 내 id, res.locals.loggedInId에 넣음
};

export default authMiddleware;
