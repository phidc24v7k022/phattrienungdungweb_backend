const config = {
    app: {
      port: process.env.PORT || 3000,
    },
    db: {
      uri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/contactbook"
    },
    jwt: {
      secret: process.env.JWT_SECRET || "contactbook_secret_key_2026",
      expiresIn: "3d", // token có hiệu lực 3 ngày
    },
  };
  module.exports = config;