import express from "express";
import { Op } from "sequelize";
import { User } from "../models";
import jwt from "jsonwebtoken";

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
  console.log(User);
  console.log(email, password, name);
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
  // 비밀번호 해쉬하는 알고리즘 넣어야함.

  const user = await User.create({ email, name, password });
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
  if (password !== existUser.password) {
    return res
      .status(400)
      .send({ ...resBody(false, "잘못된 비밀번호입니다.") });
  }
  const loggedInUserId = existUser.id;
  // 토큰 생성
  const token = jwt.sign({ loggedInUserId }, process.env.SECRET_KEY, {
    expiresIn: "12h"
  });
  // res.setHeader("Authorization", "Bearer " + token);

  // 임시로 쿠키에 저장
  res.cookie("Authorization", "Bearer " + token);

  return res.status(200).send({ token });
});

export default router;
