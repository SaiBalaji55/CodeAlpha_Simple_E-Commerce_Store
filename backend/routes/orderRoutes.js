const express = require("express");
const Order = require("../models/Order");

const router = express.Router();

// PLACE ORDER
router.post("/place", async (req, res) => {
  try {
    const { userId, products, totalAmount } = req.body;


    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    if (!products || products.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    if (!totalAmount || totalAmount <= 0) {
      return res.status(400).json({ message: "Invalid total amount" });
    }


    const newOrder = new Order({
      orderId: "ORD-" + Date.now(),   
      userId,
      products,
      totalAmount,
      status: "Placed"              
    });

    const savedOrder = await newOrder.save();


    res.status(201).json({
      message: "Order placed successfully",
      orderId: savedOrder.orderId
    });

  } catch (error) {
    console.error("ORDER ERROR:", error);
    res.status(500).json({
      message: "Server error while placing order"
    });
  }
});

module.exports = router;
