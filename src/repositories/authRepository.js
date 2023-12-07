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
    delete signup.password;
    return {
      signup
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
