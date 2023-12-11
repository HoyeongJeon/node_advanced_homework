# Node.js와 express, MySQL로 백엔드 서버 만들기 (리팩토링)

### sequelize를 Prisma로 변경

### 3-layer-architecture로 구조 수정

---

**재제출 변경사항**

- 불필요한 console.log 코드는 삭제
- apiController.js 코드의 getProducts 함수에서 req.query.sort === undefined일 때 order = "desc";를 하는 코드 삭제
- order 정렬 코드 삼항 연산자를 통해 리팩토링

리팩토링 이전 코드

```Javascript
// apiController.js/getProducts
let order = "desc";
if (req.query.sort === undefined) {
order = "desc";
} else {
if (req.query.sort.toLowerCase() === "asc") {
    order = req.query.sort;
}
}
```

리팩토링 후 코드

```Javascript
// apiController.js/getProducts
const order = (req.query.sort && req.query.sort.toLowerCase() === "asc") ? "asc": "desc";
```

- authController.js 코드에서 주석으로 작성하셨듯이 Line 27 - 29 불필요한 코드 삭제.

URL
http://sparta-node-alb-1422788954.ap-northeast-2.elb.amazonaws.com/

- 에러 처리 방식 변경

리팩토링 이전 코드

```Javascript
 signup = async (req, res, next) => {
    try {
      const { email, name, password, passwordCheck } = req.body;
      if (password !== passwordCheck) {
        return res.status(400).json(
          response({
            status: 400,
            message: "비밀번호가 일치하지 않습니다."
          })
        );
      }
      ...
    } catch (error) {
      next(error);
    }
  };
```

리팩토링 후 코드

```Javascript
 signup = async (req, res, next) => {
    try {
      const { email, name, password, passwordCheck } = req.body;
      if (password !== passwordCheck) {
        throw new customError(
          400,
          "Bad Request",
          "비밀번호가 일치하지 않습니다."
        );
      }
      ...
    } catch (error) {
      next(error);
    }
  };
```

# 환경변수

(환경변수는 `.env.default`를 참고할 것)

- SERVER_PORT: 서버 포트 번호
- DATABASE_URL: Prisma 사용을 위한 DB URL
- PASSWORD_HASH_SALT: 비밀번호 Hash Salt 생성
- SECRET_KEY : 세션 암호화를 위한 비밀키
- MYSQL_DATABASE: 세션 스토어 설정을 위한 DB 이름
- MYSQL_USERNAME: 세션 스토어 설정을 위한 MYSQL 유저 이름
- MYSQL_PASSWORD: 세션 스토어 설정을 위한 MYSQL 비밀번호
- MYSQL_HOST: 세션 스토어 설정을 위한 DB 호스트
- MYSQL_PORT: 세션 스토어 설정을 위한 MYSQL 포트 번호

# 실행 방법

```
yarn add
yarn run dev
```
