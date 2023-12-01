import { prisma } from "../utils/prisma/index.js";

export class AuthRepository {
  signup = async (email, name, password) => {
    const signup = await prisma.users.create({
      data: {
        email,
        name,
        password
      }
    });
    return {
      userId: signup.userId,
      email: signup.email,
      name: signup.name,
      createdAt: signup.createdAt,
      updatedAt: signup.updatedAt
    };
  };
  findByEmail = async (email) => {
    const user = await prisma.users.findFirst({
      where: {
        email
      }
    });
    return user;
  };
}
