import "dotenv/config";
import express from "express";
import session from "express-session";
import cookieParser from "cookie-parser";
import logMiddleware from "./src/middlewares/logMiddleware.js";
import router from "./src/routes/index.js";
import errorHandlingMiddleware from "./src/middlewares/error-handlingMiddleware.js";
import expressMySQLSession from "express-mysql-session";
import localsMiddleware from "./src/middlewares/localsMiddleware.js";
import { SERVER_PORT } from "./src/constants/appConstant.js";
import {
  MYSQL_HOST,
  MYSQL_PASSWORD,
  MYSQL_USERNAME,
  MYSQL_PORT,
  MYSQL_DATABASE
} from "./src/constants/dbConstant.js";
import { SECRET_KEY } from "./src/constants/securityConstant.js";

const app = express();
const PORT = 3000 || SERVER_PORT;

const MySQLStore = expressMySQLSession(session);

const sessionStore = new MySQLStore({
  user: MYSQL_USERNAME,
  password: MYSQL_PASSWORD,
  host: MYSQL_HOST,
  port: MYSQL_PORT,
  database: MYSQL_DATABASE,
  expiration: 1000 * 60 * 60 * 24, // 세션의 만료 기간을 1일로 설정합니다.
  createDatabaseTable: true
});

app.use(logMiddleware);
app.use(cookieParser());
app.use(express.json());

app.use(
  session({
    secret: SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24
    }
  })
);

app.use(localsMiddleware);

app.use("/", router);

// app.use("/api", apiRouter);
// app.use("/auth", authRouter);
// app.get("/", (req, res) => {
//   return res.send("Helo Server Open!");
// });
app.use(errorHandlingMiddleware);
app.listen(PORT, () => {
  console.log(`포트 ${PORT} 으로 서버가 열렸습니다.`);
});

// npx sequelize model:generate --name User --attributes email:string,name:string,password:string

// npx sequelize model:generate --name Product --attributes title:string,content:string,author:string,status:string
