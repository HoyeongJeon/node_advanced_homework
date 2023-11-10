import "dotenv/config";
import express from "express";
import connect from "./schemas/index.js";
import router from "./routes";
import morgan from "morgan";

// 몽고디비 연결
connect();
const logger = morgan("dev");

const app = express();
const PORT = 3000;

app.set("views", __dirname + "/views");

app.set("view engine", "ejs");
app.engine("html", require("ejs").renderFile);

app.use(express.json());
app.use(logger);

app.use("/api", router);

app.get("/", (req, res) => {
  return res.render("index.html");
});

app.listen(PORT, () => {
  console.log(`포트 ${PORT} 으로 서버가 열렸습니다.`);
});
