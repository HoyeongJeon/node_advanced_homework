import "dotenv/config";
import express from "express";
import apiRouter from "./routes/apiRouter.js";
import authRouter from "./routes/authRouter.js";
import morgan from "morgan";
import cookieParser from "cookie-parser";

// 몽고디비 연결
const logger = morgan("dev");

const app = express();
const PORT = 3000;

app.set("views", __dirname + "/views");

app.set("view engine", "ejs");
app.engine("html", require("ejs").renderFile);

app.use(cookieParser());
app.use(express.json());
app.use(logger);

app.use("/api", apiRouter);
app.use("/auth", authRouter);
app.get("/", (req, res) => {
  return res.render("index.html");
});

app.listen(PORT, () => {
  console.log(`포트 ${PORT} 으로 서버가 열렸습니다.`);
});

// npx sequelize model:generate --name User --attributes email:string,name:string,password:string

// npx sequelize model:generate --name Product --attributes title:string,content:string,author:string,status:string
