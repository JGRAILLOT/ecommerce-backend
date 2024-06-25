const express = require("express");
const {
  createPayPalPayment,
  executePayPalPayment,
  createStripePayment,
} = require("../controllers/paymentController");
const { verifyUser } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/paypal", verifyUser, createPayPalPayment);
router.post("/paypal/execute", verifyUser, executePayPalPayment);
router.post("/stripe", verifyUser, createStripePayment);

module.exports = router;
