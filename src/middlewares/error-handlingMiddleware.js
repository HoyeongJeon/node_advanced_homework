import response from "../lib/response.js";

export default function (err, req, res, next) {
  // 에러를 출력합니다.
  console.error(err);
  // 클라이언트에게 에러 메시지를 전달합니다.
  return res
    .status(500)
    .json(response({ status: 500, message: "서버 내부 에러가 발생했습니다." }));
}
