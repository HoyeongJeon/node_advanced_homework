import express from "express";
import apiRouter from "./apiRouter.js";
import authRouter from "./authRouter.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("you are in server!");
});

router.use("/api", apiRouter);
router.use("/auth", authRouter);

export default router;
