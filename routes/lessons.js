const express = require("express");
const Lesson = require("../models/Lesson");

const router = express.Router();

// GET /api/lessons
router.get("/", async (req, res) => {
    try {
        const lessons = await Lesson.find();
        res.json(lessons);
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

// PUT /api/lessons/:id
router.put("/:id", async (req, res) => {
    try {
        const lesson = await Lesson.findByIdAndUpdate(
            req.params.id,
            { $inc: { spaces: -1 } },
            { new: true }
        );
        res.json(lesson);
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;
