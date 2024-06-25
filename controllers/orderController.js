// controllers/orderController.js
const Order = require("../models/order");

const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).populate(
      "productId"
    );
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllOrders = async (req, res) => {
  if (!req.admin) {
    return res.status(403).json({ error: "Access denied" });
  }
  try {
    const orders = await Order.find().populate("userId productId");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createOrder = async (req, res) => {
  try {
    const { userId, address, items } = req.body;

    const order = new Order({
      userid: userId,
      address,
      items,
    });

    await order.save();

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: "Failed to create order", error });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json({ message: "Order deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getUserOrders,
  getAllOrders,
  createOrder,
  deleteOrder,
};
