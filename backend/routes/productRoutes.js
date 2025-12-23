const express = require("express");
const Product = require("../models/Product");
const router = express.Router();


router.post("/add", async (req, res) => {
  try {
    const { name, price, image, description } = req.body;


    if (!name || !price || !image || !description) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    const product = new Product({
      name,
      price: Number(price),
      image,
      description
    });

    await product.save();

    res.status(201).json({
      message: "Product added successfully",
      product
    });

  } catch (error) {
    console.error("ADD PRODUCT ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});


router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.json(product);
  } catch (err) {
    res.status(404).json({ message: "Product not found" });
  }
});

module.exports = router;
