const { MongoClient, ObjectId } = require("mongodb");

const uri = "mongodb+srv://Jadf123:jadjad@cluster0.7suzy.mongodb.net/lessonsStore?retryWrites=true&w=majority"; // Your connection string
const dbName = "LessonsStore";
const collectionName = "lessons";

// Connect to MongoDB
const client = new MongoClient(uri, { useUnifiedTopology: true });

let lessonsCollection;

async function connectToDatabase() {
    try {
        await client.connect();
        const db = client.db(dbName);
        lessonsCollection = db.collection(collectionName); // Access the lessons collection
        console.log("Connected to MongoDB - LessonsStore");
    } catch (err) {
        console.error("MongoDB connection error:", err);
    }
}

// Call the connection function
connectToDatabase();

// Function to insert a new lesson
async function addLesson(lesson) {
    try {
        const result = await lessonsCollection.insertOne(lesson);
        console.log("Lesson added:", result.insertedId);
        return result;
    } catch (err) {
        console.error("Error adding lesson:", err);
    }
}

// Function to fetch all lessons
async function getLessons() {
    try {
        const lessons = await lessonsCollection.find().toArray();
        console.log("Lessons fetched:", lessons);
        return lessons;
    } catch (err) {
        console.error("Error fetching lessons:", err);
    }
}

// Example Usage
(async () => {
    // Adding a lesson
    await addLesson({
        topic: "Mathematics",
        location: "Sharjah",
        price: 100,
        spaces: 10,
        image: "images/mathforbeginners.png",
    });

    // Fetching all lessons
    const lessons = await getLessons();
    console.log(lessons);
})();
