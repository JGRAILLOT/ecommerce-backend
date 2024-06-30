// routes/orderRoutes.js
const express = require("express");
const {
  getUserOrders,
  getAllOrders,
  createOrder,
  deleteOrder,
} = require("../controllers/orderController");

const router = express.Router();

router.get("/:userId", getUserOrders);
router.get("/all", getAllOrders);
router.post("/", createOrder);
router.delete("/:id", deleteOrder);

module.exports = router;
