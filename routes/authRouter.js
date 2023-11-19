import express from "express";
import { Op } from "sequelize";
import { User } from "../models";
import jwt from "jsonwebtoken";
import authMiddleware from "../middlewares/authMiddleware";
import bcrypt from "bcrypt";
import validationCheck from "../middlewares/validationMiddleware";

const router = express.Router();

// Response Body에 들어갈 데이터
export const resBody = (success, message) => {
  return {
    success,
    message
  };
};

// 회원가입
// vaildationCheck 미들웨어 : 유효성 체크
router.post("/signup", validationCheck, async (req, res) => {
  // 이메일, 비밀번호, 비밀번호 확인, 이름을 데이터로 넘겨서 회원가입을 요청
  const { email, password, passwordCheck, name } = req.body;
  if (!email || !password || !name || !passwordCheck) {
    return res.status(400).send({ ...resBody(false, "정보가 비어있습니다.") });
  }

  // 이메일 중복 체크
  const duplicatedUsers = await User.findAll({
    where: {
      [Op.or]: [{ email }]
    }
  });
  if (duplicatedUsers.length) {
    return res
      .status(409) // 이미 존재하는 리소스와 충돌
      .send({ ...resBody(false, "이미 존재하는 아이디입니다.") });
  }

  // 비밀번호 확인과 일치여부
  if (password !== passwordCheck) {
    return res
      .status(400)
      .send({ ...resBody(false, "비밀번호가 일치하지 않습니다.") });
  }

  // 보안을 위해 비밀번호는 평문(Plain Text)으로 저장하지 않고 Hash 된 값을 저장합니다
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await User.create({ email, name, password: hashedPassword });
    // 회원가입 성공 시, 비밀번호를 제외 한 사용자의 정보를 반환
    return res.status(201).send({
      ...resBody(true, "회원가입에 성공했습니다."),
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(400).send({
      ...resBody(false, "회원가입에 실패했습니다. 다시 시도해주세요")
    });
  }
});

// 로그인
router.post("/login", async (req, res) => {
  // 이메일, 비밀번호로 로그인을 요청
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .send({ ...resBody(false, "아이디 / 비밀번호를 입력해주세요.") });
  }

  // 이메일 또는 비밀번호 중 하나라도 일치하지 않는다면, 알맞은 Http Status Code와 에러 메세지를 반환.
  // DB에 아이디가 없는 경우
  const existUser = await User.findOne({
    where: {
      email
    }
  });
  if (!existUser) {
    return res.status(400).send({ ...resBody(false, "없는 아이디입니다.") });
  }

  // 비밀번호가 틀린 경우
  const isMatch = await bcrypt.compare(password, existUser.password);
  if (!isMatch) {
    return res
      .status(400)
      .send({ ...resBody(false, "잘못된 비밀번호입니다.") });
  }

  const loggedInUserId = existUser.id;

  // 토큰 생성
  // payload에 로그인한 userId 담기.
  const token = jwt.sign({ loggedInUserId }, process.env.SECRET_KEY, {
    expiresIn: "12h" // 토큰 만료 시간 12시간 설정
  });
  res.setHeader("Authorization", "Bearer " + token); // singular header를 설정할 것이기에 setHeader 사용

  return res.status(200).send({ token });
});

// 내 프로필
// 인증에 성공했다면, 비밀번호를 제외한 내 정보를 반환
router.get("/my-profile", authMiddleware, async (req, res) => {
  const { loggedInUserId } = res.locals;
  if (!loggedInUserId) {
    return res.status(401).json({
      success: false,
      message: "권한이 없습니다."
    });
  }

  const loggedInUser = await User.findByPk(loggedInUserId);

  return res.status(200).json({
    success: true,
    user: {
      id: loggedInUser.id,
      email: loggedInUser.email,
      name: loggedInUser.name,
      createdAt: loggedInUser.createdAt,
      updatedAt: loggedInUser.updatedAt
    }
  });
});

export default router;
