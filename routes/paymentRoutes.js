const express = require("express");
const {
  createPayPalPayment,
  executePayPalPayment,
  createStripePayment,
} = require("../controllers/paymentController");

const router = express.Router();

router.post("/paypal", createPayPalPayment);
router.post("/paypal/execute", executePayPalPayment);
router.post("/stripe", createStripePayment);

module.exports = router;
