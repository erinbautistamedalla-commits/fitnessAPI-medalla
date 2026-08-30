const express = require("express");
const router = express.Router();
const { verifyToken } = require("../auth"); 
const workoutController = require("../controllers/workout");

// All workout endpoints mapped to specifications
router.post("/addWorkout", verifyToken, workoutController.addWorkout);
router.get("/getMyWorkouts", verifyToken, workoutController.getMyWorkouts);
router.patch("/updateWorkout/:id", verifyToken, workoutController.updateWorkout);
router.delete("/deleteWorkout/:id", verifyToken, workoutController.deleteWorkout);
router.patch("/completeWorkoutStatus/:id", verifyToken, workoutController.completeWorkoutStatus);

module.exports = router;
