const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json()); // Middleware to parse JSON

// MongoDB Connection
const dbURI = "mongodb://localhost:27017/LessonsStore"; // Your database name
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB Compass - LessonsStore"))
    .catch((err) => console.error("MongoDB connection error:", err));

// Define Lesson Schema
const lessonSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    image: String,
    availableInventory: Number,
    location: String,
});

const Lesson = mongoose.model("Lesson", lessonSchema);

// Define Order Schema
const orderSchema = new mongoose.Schema({
    firstName: { type: String, required: true, match: /^[A-Za-z]+$/ }, // Only letters
    lastName: { type: String, required: true, match: /^[A-Za-z]+$/ }, // Only letters
    phone: { type: String, required: true, match: /^\d+$/ }, // Ensure phone is numeric
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true, match: /^\d+$/ }, // Ensure zip code is numeric
    gift: { type: Boolean, default: false },
    method: { type: String, enum: ["Home", "Business"], required: true },
    lessons: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lesson" }], // Referencing lessons
});

const Order = mongoose.model("Order", orderSchema);

// API Endpoints

// 1. Get all lessons
app.get("/api/lessons", async (req, res) => {
    try {
        const lessons = await Lesson.find();
        res.json(lessons);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch lessons" });
    }
});

// 2. Update lesson inventory
app.put("/api/lessons/:id", async (req, res) => {
    try {
        const lesson = await Lesson.findByIdAndUpdate(
            req.params.id,
            { $inc: { availableInventory: -1 } }, // Decrement inventory
            { new: true }
        );
        if (!lesson) return res.status(404).json({ error: "Lesson not found" });
        res.json(lesson);
    } catch (err) {
        res.status(500).json({ error: "Failed to update lesson" });
    }
});

// 3. Place an order
app.post("/api/orders", async (req, res) => {
    try {
        const { firstName, lastName, phone, address, city, state, zip, gift, method, lessons } = req.body;

        // Validate inputs
        if (!/^[A-Za-z]+$/.test(firstName)) {
            return res.status(400).json({ error: "Invalid first name. Letters only." });
        }
        if (!/^[A-Za-z]+$/.test(lastName)) {
            return res.status(400).json({ error: "Invalid last name. Letters only." });
        }
        if (!/^\d+$/.test(phone)) {
            return res.status(400).json({ error: "Invalid phone number. Only digits are allowed." });
        }
        if (!/^\d+$/.test(zip)) {
            return res.status(400).json({ error: "Invalid zip code. Only digits are allowed." });
        }

        // Create the order
        const order = new Order({
            firstName,
            lastName,
            phone,
            address,
            city,
            state,
            zip,
            gift,
            method,
            lessons,
        });

        await order.save();
        res.status(201).json({ message: "Order placed successfully", order });
    } catch (err) {
        res.status(500).json({ error: "Failed to place order", details: err });
    }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
