const express = require("express");
const cors = require("cors");
const ApiError = require("./app/api-error");
const contactsRouter = require("./app/routes/contact.route");
const authRouter = require("./app/routes/auth.route"); // ← thêm

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Welcome to contact book application." });
});

// Routes
app.use("/api/contacts", contactsRouter);
app.use("/api/auth", authRouter); // ← thêm

// 404 handler
app.use((req, res, next) => {
  return next(new ApiError(404, "Resource not found"));
});

// Error handler
app.use((err, req, res, next) => {
  return res.status(err.statusCode || 500).json({
    message: err.message || "Internal Server Error",
  });
});

module.exports = app;