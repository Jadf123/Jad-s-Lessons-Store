const express = require("express");
const Order = require("../models/Order");

const router = express.Router();

// POST /api/orders
router.post("/", async (req, res) => {
    try {
        const order = new Order(req.body);
        await order.save();
        res.json(order);
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;
