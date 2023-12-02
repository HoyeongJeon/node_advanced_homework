// import { AuthRepository } from "../repositories/authRepository";
import response from "../lib/response";
import bcrypt from "bcrypt";
import { PASSWORD_HASH_SALT } from "../constants/securityConstant";
export class AuthService {
  // authRepository = new AuthRepository();
  constructor(authRepository) {
    this.authRepository = authRepository;
  }
  signup = async (email, name, password) => {
    const duplicatedId = await this.authRepository.findByEmail(email);
    if (duplicatedId) {
      return response({ status: 409, message: "이미 존재하는 아이디입니다." });
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
      return response({ status: 409, message: "존재하지 않는 아이디입니다." });
    }
    const isMatch = await bcrypt.compare(password, duplicatedId.password);
    if (!isMatch) {
      return response({ status: 400, message: "잘못된 비밀번호입니다." });
    }
    const loggedInUser = {
      id: duplicatedId.userId,
      name: duplicatedId.name,
      email: duplicatedId.email,
      createdAt: duplicatedId.createdAt,
      updatedAt: duplicatedId.updatedAt
    };

    return response({
      status: 200,
      message: "로그인에 성공했습니다.",
      data: loggedInUser
    });
  };
}
