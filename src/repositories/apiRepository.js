import { prisma } from "../utils/prisma/index.js";

export class ApiRepository {
  //   const filteredProducts = products.map((product) => ({
  //     id: product.id,
  //     title: product.title,
  //     content: product.content,
  //     author: product.User.name, // 사용자 Table의 JOIN
  //     status: product.status,
  //     createdAt: product.createdAt
  //   }));
  findAllProducts = async (order) => {
    const products = await prisma.products.findMany({
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
    const product = await prisma.products.create({
      data: {
        UserId: id,
        title,
        content
      }
    });
    return product;
  };
}
