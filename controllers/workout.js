const Workout = require("../models/workout");

// 1. ADD WORKOUT
exports.addWorkout = async (req, res) => {
    try {
        const { name, duration, status } = req.body;
        const newWorkout = await Workout.create({
            name,
            duration,
            status, // Will use default "completed" if not provided
            userId: req.user.id
        });
        res.status(201).json(newWorkout);
    } catch (error) {
        res.status(400).json({ error: "Failed to add workout", message: error.message });
    }
};

// 2. GET MY WORKOUTS
exports.getMyWorkouts = async (req, res) => {
    try {
        const workouts = await Workout.find({ userId: req.user.id }).sort({ dateAdded: -1 });
        res.status(200).json({ workouts });
    } catch (error) {
        res.status(500).json({ error: "Server error", message: error.message });
    }
};

// 3. UPDATE WORKOUT
exports.updateWorkout = async (req, res) => {
    try {
        const workout = await Workout.findById(req.params.id);

        if (!workout) {
            return res.status(404).json({ error: "Workout not found" });
        }

        if (workout.userId.toString() !== req.user.id) {
            return res.status(403).json({ error: "Unauthorized action" });
        }

        if (req.body.name) workout.name = req.body.name;
        if (req.body.duration) workout.duration = req.body.duration;
        if (req.body.status) workout.status = req.body.status;

        const updatedWorkout = await workout.save();
        res.status(200).json({ 
            message: "Workout updated successfully", 
            updatedWorkout 
        });
    } catch (error) {
        res.status(400).json({ error: "Update failed", message: error.message });
    }
};

// 4. DELETE WORKOUT
exports.deleteWorkout = async (req, res) => {
    try {
        const workout = await Workout.findById(req.params.id);

        if (!workout) {
            return res.status(404).json({ error: "Workout not found" });
        }

        if (workout.userId.toString() !== req.user.id) {
            return res.status(403).json({ error: "Unauthorized action" });
        }

        await workout.deleteOne();
        res.status(200).json({ message: "Workout deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Delete failed", message: error.message });
    }
};

// 5. COMPLETE WORKOUT STATUS
exports.completeWorkoutStatus = async (req, res) => {
    try {
        const workout = await Workout.findById(req.params.id);

        if (!workout) {
            return res.status(404).json({ error: "Workout not found" });
        }

        if (workout.userId.toString() !== req.user.id) {
            return res.status(403).json({ error: "Unauthorized action" });
        }

        workout.status = "completed";
        const updatedWorkout = await workout.save();

        res.status(200).json({ 
            message: "Workout status updated to completed", 
            updatedWorkout 
        });
    } catch (error) {
        res.status(400).json({ error: "Failed to update status", message: error.message });
    }
};
