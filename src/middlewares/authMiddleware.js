import response from "../lib/response.js";

export default (req, res, next) => {
  if (req.session.loggedIn) {
    return next();
  } else {
    return res
      .status(401)
      .json(response({ status: 401, message: "로그인 해주세요" }));
  }
};
