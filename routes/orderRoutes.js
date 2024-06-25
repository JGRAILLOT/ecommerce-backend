// routes/orderRoutes.js
const express = require("express");
const {
  getUserOrders,
  getAllOrders,
  createOrder,
  deleteOrder,
  getMostOrderedProduct,
} = require("../controllers/orderController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware.verifyUser, getUserOrders);
router.get("/all", authMiddleware.verifyAdmin, getAllOrders);
router.post("/", createOrder);
router.delete("/:id", authMiddleware.verifyAdmin, deleteOrder);

module.exports = router;
