// import { prisma } from "../utils/prisma/index.js";

export class ApiRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  findAllProducts = async (order) => {
    const products = await this.prisma.products.findMany({
      select: {
        productId: true,
        title: true,
        content: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        User: {
          select: {
            name: true
          }
        }
      }
    });

    // 여기 프로덕트 데이터 포맷팅 가능한지 확인. User{name} 을 author 하나로
    return products;
  };

  postProduct = async (title, content, id) => {
    const product = await this.prisma.products.create({
      data: {
        UserId: id,
        title,
        content
      }
    });
    return product;
  };

  getProductById = async (productId) => {
    const product = await prisma.products.findFirst({
      where: {
        productId: +productId
      },
      select: {
        productId: true,
        title: true,
        content: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        User: {
          select: {
            userId: true,
            name: true
          }
        }
      }
    });
    if (!product) {
      return false;
    }

    return product;
  };

  editProduct = async (productId, title, content, status) => {
    const updatedProduct = await prisma.products.update({
      where: {
        productId: +productId
      },
      data: {
        title,
        content,
        status
      }
    });

    return updatedProduct;
  };

  deleteProduct = async (productId) => {
    const deletedProduct = await this.prisma.products.delete({
      where: {
        productId: +productId
      }
    });

    return deletedProduct;
  };
}
