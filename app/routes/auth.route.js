const express = require("express");
const auth = require("../controllers/auth.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

const router = express.Router();

// Public routes (không cần token)
router.post("/register", auth.register);
router.post("/login", auth.login);

// Protected routes (cần token)
router.get("/me", verifyToken, auth.getMe);
router.get("/users", verifyToken, auth.getAllUsers);

module.exports = router;