import response from "../lib/response.js";

export default function (err, req, res, next) {
  const status = err.statusCode || 500;
  const message = err.message || "서버 내부 에러가 발생했습니다.";
  return res.status(status).json(
    response({
      status,
      message
    })
  );
}
