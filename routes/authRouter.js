import express from "express";
import { Op } from "sequelize";
import { User } from "../models";
import jwt from "jsonwebtoken";
import authMiddleware from "../middlewares/authMiddleware";
import bcrypt from "bcrypt";

const router = express.Router();

// Response Body에 들어갈 데이터
export const resBody = (success, message) => {
  return {
    success,
    message
  };
};

// 회원가입
router.post("/signup", async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    return res.status(400).send({ ...resBody(false, "정보가 비어있습니다.") });
  }
  const duplicatedUsers = await User.findAll({
    where: {
      [Op.or]: [{ email }]
    }
  });
  if (duplicatedUsers.length) {
    return res
      .status(400)
      .send({ ...resBody(false, "이미 존재하는 아이디입니다.") });
  }
  // 비밀번호 해쉬
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({ email, name, password: hashedPassword });
  return res
    .status(201)
    .send({ success: "true", message: "회원가입에 성공했습니다.", data: user });
});

// 로그인
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .send({ ...resBody(false, "아이디 / 비밀번호를 입력해주세요.") });
  }
  // 아이디가 없는 경우
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

  const token = jwt.sign({ loggedInUserId }, process.env.SECRET_KEY, {
    expiresIn: "12h" // "12h"
  });
  res.setHeader("Authorization", "Bearer " + token); // singular header를 설정할 것이기에 setHeader 사용
  // res.header("Authorization", `Bearer ${token}`);
  // res.cookie("Authorization", "Bearer " + token);

  return res.status(200).send({ token });
});

// 내 프로필
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
