# Node.js와 express, MySQL로 백엔드 서버 만들기 (리팩토링)

### sequelize를 Prisma로 변경

### 3-layer-architecture로 구조 수정

---

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
