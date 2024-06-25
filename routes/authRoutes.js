// routes/authRoutes.js
const express = require("express");
const { validateUser } = require("../middleware/validationMiddleware");
const { register, login } = require("../controllers/authController");
const router = express.Router();

router.post("/register", validateUser, register);
router.post("/login", validateUser, login);

module.exports = router;
