// routes/cartRoutes.js
const express = require("express");
const {
  getUserCart,
  addToCart,
  removeFromCart,
  clearCart,
} = require("../controllers/cartController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware.verifyUser, getUserCart);
router.post("/", authMiddleware.verifyUser, addToCart);
router.delete("/:id", authMiddleware.verifyUser, removeFromCart);
router.delete("/clear", authMiddleware.verifyUser, clearCart);

module.exports = router;
