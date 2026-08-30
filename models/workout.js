const mongoose = require("mongoose");

const workoutSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Workout name is required"],
    trim: true
  },
  duration: {
    type: String, // Saved in minutes
    required: [true, "Duration is required"],
    trim: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Matches the exact name of your User model
    required: [true, "Workout must belong to a user"]
  },
  status: {
    type: String,
    enum: ["pending", "completed", "in-progress"], 
    default: "pending"
  },
  dateAdded: {
    type: Date,
    default: Date.now 
  }
});

module.exports = mongoose.model("Workout", workoutSchema);
