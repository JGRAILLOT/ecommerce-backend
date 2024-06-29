const Product = require("../models/product");
const upload = require("../middleware/uploadMiddleware");

const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, price, category, details } = req.body;
    const product = new Product({
      name,
      price,
      category,
      details,
      image: req.file ? req.file.path : undefined, // Conditionally add image path
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(400).json({ error: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { name, price, category, details, image } = req.body;
    const updatedProduct = {
      name,
      price,
      category,
      details,
      image,
    };

    // Check if an image file was uploaded
    if (req.file) {
      updatedProduct.image = req.file.path; // Update the file path
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updatedProduct,
      { new: true }
    );
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const searchProducts = async (req, res) => {
  try {
    const { name, category, minPrice, maxPrice } = req.query;
    const filter = {};

    // Validate and construct filters
    if (name) {
      filter.name = new RegExp(name.trim(), "i"); // Using trim() to remove unnecessary spaces
    }
    if (category) {
      filter.category = category.trim();
    }
    if (minPrice) {
      const min = parseFloat(minPrice);
      if (!isNaN(min)) {
        // Ensuring the input is a valid number
        filter.price = { ...filter.price, $gte: min };
      }
    }
    if (maxPrice) {
      const max = parseFloat(maxPrice);
      if (!isNaN(max)) {
        // Ensuring the input is a valid number
        filter.price = { ...filter.price, $lte: max };
      }
    }

    // Fetch products from the database
    const products = await Product.find(filter);
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Server Error", error: error.toString() });
  }
};

const getMostPopularProducts = async (req, res) => {
  try {
    const popularProducts = await Order.aggregate([
      { $group: { _id: "$productId", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      { $project: { _id: 0, product: 1 } },
    ]);

    res.json(popularProducts.map((p) => p.product));
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
  getMostPopularProducts,
};
