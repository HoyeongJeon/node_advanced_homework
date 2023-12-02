// import { prisma } from "../utils/prisma/index.js";

export class AuthRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }
  signup = async (email, name, password) => {
    const signup = await this.prisma.users.create({
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
    const user = await this.prisma.users.findFirst({
      where: {
        email
      }
    });
    return user;
  };
}
