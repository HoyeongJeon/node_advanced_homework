// import { AuthRepository } from "../repositories/authRepository";
import response from "../lib/response.js";
import bcrypt from "bcrypt";
import { PASSWORD_HASH_SALT } from "../constants/securityConstant.js";
import { customError } from "../utils/customError/index.js";
export class AuthService {
  // authRepository = new AuthRepository();
  constructor(authRepository) {
    this.authRepository = authRepository;
  }
  signup = async (email, name, password) => {
    const duplicatedId = await this.authRepository.findByEmail(email);
    if (duplicatedId) {
      throw new customError(409, "Conflict", "이미 존재하는 아이디입니다.");
    }

    const hashedPassword = await bcrypt.hash(password, PASSWORD_HASH_SALT);

    const signUp = await this.authRepository.signup(
      email,
      name,
      hashedPassword
    );
    return response({
      status: 200,
      message: "회원가입에 성공했습니다.",
      data: signUp
    });
  };

  login = async (email, password) => {
    const duplicatedId = await this.authRepository.findByEmail(email);
    if (!duplicatedId) {
      throw new customError(409, "Conflict", "존재하지 않는 아이디입니다.");
    }
    const isMatch = await bcrypt.compare(password, duplicatedId.password);
    if (!isMatch) {
      throw new customError(400, "Bad Request", "잘못된 비밀번호입니다.");
    }

    const isCorrectUser = duplicatedId && isMatch;

    if (!isCorrectUser) {
      throw new customError(
        400,
        "Bad Request",
        "일치하는 인증정보가 없습니다."
      );
    }

    delete duplicatedId.password;
    return response({
      status: 200,
      message: "로그인에 성공했습니다.",
      data: duplicatedId
    });
  };
}
