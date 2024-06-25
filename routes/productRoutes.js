const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const upload = require("../middleware/uploadMiddleware");
const { verifyAdmin } = require("../middleware/authMiddleware");

// GET all products and POST a new product (with file upload)
router
  .route("/")
  .get(productController.getProducts)
  .post(verifyAdmin, upload.single("image"), productController.createProduct);

// GET, PUT, and DELETE a specific product (with file upload for update)
router
  .route("/:id")
  .get(productController.getProduct)
  .put(verifyAdmin, upload.single("image"), productController.updateProduct)
  .delete(verifyAdmin, productController.deleteProduct);

// GET products based on search criteria
router.get("/search", productController.searchProducts);

// GET most popular products
router.get("/popular", productController.getMostPopularProducts);

module.exports = router;
