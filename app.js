import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import logMiddleware from "./src/middlewares/logMiddleware.js";
import router from "./src/routes/index.js";

const app = express();
const PORT = 3000;

app.use(logMiddleware);
app.use(cookieParser());
app.use(express.json());

app.use("/", router);

// app.use("/api", apiRouter);
// app.use("/auth", authRouter);
// app.get("/", (req, res) => {
//   return res.send("Helo Server Open!");
// });

app.listen(PORT, () => {
  console.log(`포트 ${PORT} 으로 서버가 열렸습니다.`);
});

// npx sequelize model:generate --name User --attributes email:string,name:string,password:string

// npx sequelize model:generate --name Product --attributes title:string,content:string,author:string,status:string
