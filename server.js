const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();
app.use(express.json()); // Middleware to parse JSON

// MongoDB Connection
const uri = "mongodb+srv://Jadf123:jadjad@cluster0.7suzy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

let lessonsCollection;
let ordersCollection;

async function connectToDatabase() {
    try {
        await client.connect();
        const db = client.db("LessonsStore"); // Database name
        lessonsCollection = db.collection("lessons");
        ordersCollection = db.collection("orders");
        console.log("Connected to MongoDB - LessonsStore");
    } catch (err) {
        console.error("MongoDB connection error:", err);
    }
}
connectToDatabase();

// API Endpoints

// 1. Get all lessons
app.get("/api/lessons", async (req, res) => {
    try {
        const lessons = await lessonsCollection.find().toArray();
        res.json(lessons);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch lessons" });
    }
});

// 2. Update lesson inventory
app.put("/api/lessons/:id", async (req, res) => {
    try {
        const lessonId = req.params.id;
        const updateResult = await lessonsCollection.updateOne(
            { _id: new ObjectId(lessonId) },
            { $inc: { availableInventory: -1 } } // Decrement inventory
        );

        if (updateResult.matchedCount === 0) {
            return res.status(404).json({ error: "Lesson not found" });
        }

        const updatedLesson = await lessonsCollection.findOne({ _id: new ObjectId(lessonId) });
        res.json(updatedLesson);
    } catch (err) {
        res.status(500).json({ error: "Failed to update lesson", details: err });
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

        // Insert the order into the orders collection
        const order = {
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
            createdAt: new Date(),
        };

        const result = await ordersCollection.insertOne(order);
        res.status(201).json({ message: "Order placed successfully", orderId: result.insertedId });
    } catch (err) {
        res.status(500).json({ error: "Failed to place order", details: err });
    }
});

// Seed Data (Optional)
app.post("/api/seed", async (req, res) => {
    const seedLessons = [
        {
            title: "Mathematics for Beginners",
            description: "An introductory course to fundamental mathematics concepts.",
            price: 100,
            image: "images/mathforbeginners.png",
            availableInventory: 10,
            location: "Hendon",
        },
        {
            title: "Intermediate Algebra",
            description: "Master the art of algebra with this intermediate-level course.",
            price: 120,
            image: "images/intermediatealgebra.jpeg",
            availableInventory: 8,
            location: "Colindale",
        },
        {
            title: "Advanced Calculus",
            description: "A comprehensive guide to advanced calculus techniques.",
            price: 150,
            image: "images/advancedcalculus.jpeg",
            availableInventory: 5,
            location: "Brent Cross",
        },
    ];

    try {
        const result = await lessonsCollection.insertMany(seedLessons);
        res.status(201).json({ message: "Database seeded with lessons", insertedCount: result.insertedCount });
    } catch (err) {
        res.status(500).json({ error: "Failed to seed database", details: err });
    }
});

// Start the server
const PORT = 4000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
