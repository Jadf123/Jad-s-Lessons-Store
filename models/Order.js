const { MongoClient, ObjectId } = require("mongodb");

const uri = "mongodb+srv://Jadf123:jadjad@cluster0.7suzy.mongodb.net/lessonsStore?retryWrites=true&w=majority"; // Your connection string
const dbName = "LessonsStore";
const collectionName = "orders";

// Connect to MongoDB
const client = new MongoClient(uri, { useUnifiedTopology: true });

let ordersCollection;

async function connectToDatabase() {
    try {
        await client.connect();
        const db = client.db(dbName);
        ordersCollection = db.collection(collectionName); // Access the orders collection
        console.log("Connected to MongoDB - lessonsStore");
    } catch (err) {
        console.error("MongoDB connection error:", err);
    }
}

// Call the connection function
connectToDatabase();

// Function to insert a new order
async function addOrder(order) {
    try {
        const result = await ordersCollection.insertOne(order);
        console.log("Order added:", result.insertedId);
        return result;
    } catch (err) {
        console.error("Error adding order:", err);
    }
}

// Function to fetch all orders
async function getOrders() {
    try {
        const orders = await ordersCollection.find().toArray();
        console.log("Orders fetched:", orders);
        return orders;
    } catch (err) {
        console.error("Error fetching orders:", err);
    }
}

// Example Usage
(async () => {
    // Adding an order
    await addOrder({
        name: "John Doe",
        phone: "1234567890",
        lessons: [
            new ObjectId("6757e55a77b21ffd57d40478"),
            new ObjectId("6757e55a77b21ffd57d40479"),
        ],
    });

    // Fetching all orders
    const orders = await getOrders();
    console.log(orders);
})();
