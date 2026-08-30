const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config(); 

const app = express();

// Global Middleware Configuration (MUST sit above routes to process JSON bodies)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: "http://localhost:5173", // Allows your Vue dev server to connect
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}))

// Database Connection Logic
// Replace with your local mongo URI string if not using a system environment variable
const dbURI = process.env.MONGODB_URI || "mongodb://localhost:27017/fitnessTracker";
mongoose.connect(dbURI)
    .then(() => console.log("Successfully connected to MongoDB database."))
    .catch((err) => console.error("Database connection failure:", err));

// Routes Middleware Definitions
const workoutRoutes = require("./routes/workout");
const userRoutes = require("./routes/user");

app.use("/workouts", workoutRoutes);
app.use("/users", userRoutes);

// Runtime listener activation 
if (require.main === module) {
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
        console.log(`API is now online on port ${PORT}`);
    });
}

// Export references for testing scripts or clustering implementations
module.exports = { app, mongoose };
