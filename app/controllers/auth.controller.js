const AuthService = require("../services/auth.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

// POST /api/auth/register
exports.register = async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return next(new ApiError(400, "Username và password không được để trống."));
  }

  if (password.length < 6) {
    return next(new ApiError(400, "Password phải có ít nhất 6 ký tự."));
  }

  try {
    const authService = new AuthService(MongoDB.client);
    const user = await authService.register({ username, password });
    return res.status(201).json({
      message: "Đăng ký thành công.",
      user,
    });
  } catch (error) {
    if (error.message === "Username đã tồn tại.") {
      return next(new ApiError(409, error.message));
    }
    return next(new ApiError(500, "Lỗi khi đăng ký tài khoản."));
  }
};

// POST /api/auth/login
exports.login = async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return next(new ApiError(400, "Username và password không được để trống."));
  }

  try {
    const authService = new AuthService(MongoDB.client);
    const result = await authService.login({ username, password });
    return res.json({
      message: "Đăng nhập thành công.",
      ...result,
    });
  } catch (error) {
    return next(new ApiError(401, error.message));
  }
};

// GET /api/auth/me  (cần token)
exports.getMe = async (req, res, next) => {
  try {
    const authService = new AuthService(MongoDB.client);
    const user = await authService.findById(req.user.id);
    if (!user) {
      return next(new ApiError(404, "Không tìm thấy tài khoản."));
    }
    return res.json(user);
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi lấy thông tin tài khoản."));
  }
};

// GET /api/auth/users  (cần token - admin)
exports.getAllUsers = async (req, res, next) => {
  try {
    const authService = new AuthService(MongoDB.client);
    const users = await authService.findAll();
    return res.json(users);
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi lấy danh sách tài khoản."));
  }
};  