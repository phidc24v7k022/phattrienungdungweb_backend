const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");
const config = require("../config");

class AuthService {
  constructor(client) {
    this.User = client.db().collection("users");
  }

  // Trích xuất dữ liệu user từ payload
  extractUserData(payload) {
    const user = {
      username: payload.username,
      password: payload.password,
    };
    Object.keys(user).forEach(
      (key) => user[key] === undefined && delete user[key]
    );
    return user;
  }

  // Đăng ký tài khoản mới
  async register(payload) {
    const { username, password } = payload;

    // Kiểm tra username đã tồn tại chưa
    const existing = await this.User.findOne({ username });
    if (existing) {
      throw new Error("Username đã tồn tại.");
    }

    // Mã hóa password
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await this.User.insertOne({
      username,
      password: hashedPassword,
      createdAt: new Date(),
    });

    return {
      _id: result.insertedId,
      username,
    };
  }

  // Đăng nhập - trả về JWT token
  async login(payload) {
    const { username, password } = payload;

    // Tìm user theo username
    const user = await this.User.findOne({ username });
    if (!user) {
      throw new Error("Username hoặc mật khẩu không đúng.");
    }

    // So sánh password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Username hoặc mật khẩu không đúng.");
    }

    // Tạo JWT token
    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
      },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    return {
      token,
      user: {
        _id: user._id,
        username: user.username,
      },
      expiresIn: "3 ngày",
    };
  }

  // Lấy thông tin user theo id
  async findById(id) {
    return await this.User.findOne(
      { _id: ObjectId.isValid(id) ? new ObjectId(id) : null },
      { projection: { password: 0 } } // không trả về password
    );
  }

  // Lấy danh sách tất cả users (không trả về password)
  async findAll() {
    const cursor = await this.User.find(
      {},
      { projection: { password: 0 } }
    );
    return await cursor.toArray();
  }
}

module.exports = AuthService;