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
      },
      orderBy: {
        createdAt: order
      }
    });

    return products;
  };

  postProduct = async (title, content, id, order) => {
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
    const product = await this.prisma.products.findFirst({
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
    const updatedProduct = await this.prisma.products.update({
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
