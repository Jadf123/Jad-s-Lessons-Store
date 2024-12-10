const mongoose = require("mongoose");

const dbURI = "mongodb://localhost:27017/lessonsStore";
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB Compass"))
    .catch((err) => console.error("MongoDB connection error:", err));

const lessonSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    image: String,
    availableInventory: Number,
    location: String,
});

const Lesson = mongoose.model("Lesson", lessonSchema);

// Lesson Data
const lessons = [
    {
        title: "Mathematics for Beginners",
        description: "An introductory course to fundamental mathematics concepts.",
        price: 100,
        image: "images/mathforbeginners.png",
        availableInventory: 10,
        location: "Hendon",
    },
    // Add other lessons here...
];

// Seed the database
Lesson.insertMany(lessons)
    .then(() => {
        console.log("Lessons seeded successfully");
        mongoose.connection.close();
    })
    .catch((err) => console.error("Seeding error:", err));
