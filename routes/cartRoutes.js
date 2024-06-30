// routes/cartRoutes.js
const express = require("express");
const {
  getUserCart,
  addToCart,
  removeFromCart,
  clearCart,
} = require("../controllers/cartController");

const router = express.Router();

router.get("/:userId", getUserCart);
router.post("/", addToCart);
router.delete("/:id", removeFromCart);
router.delete("/clear", clearCart);

module.exports = router;
