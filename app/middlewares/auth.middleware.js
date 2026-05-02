const jwt = require("jsonwebtoken");
const config = require("../config");
const ApiError = require("../api-error");

const verifyToken = (req, res, next) => {
  // Lấy token từ header Authorization: Bearer <token>
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return next(new ApiError(401, "Không có token. Vui lòng đăng nhập."));
  }

  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    req.user = decoded; // lưu thông tin user vào request
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return next(new ApiError(401, "Token đã hết hạn. Vui lòng đăng nhập lại."));
    }
    return next(new ApiError(401, "Token không hợp lệ."));
  }
};

module.exports = { verifyToken };