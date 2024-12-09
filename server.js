const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const app = express();

// Middleware for parsing JSON
app.use(express.json());

// Serve static files (images, etc.)
app.use("/static", express.static(path.join(__dirname, "static")));

// Database connection
mongoose.connect("mongodb+srv://<username>:<password>@cluster.mongodb.net/lessons", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// API Routes
const lessonRoutes = require("./routes/lessons");
const orderRoutes = require("./routes/orders");
app.use("/api/lessons", lessonRoutes);
app.use("/api/orders", orderRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
