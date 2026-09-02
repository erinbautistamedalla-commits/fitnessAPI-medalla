const User = require("../models/User");
const auth = require("../auth"); // Assuming this is where your token-creation logic lives

// 1. Check if Email Exists
module.exports.checkEmailExists = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email.toLowerCase() });
        const exists = !!user;
        res.status(200).json({
            exists,
            message: exists ? "Email already exists." : "Email is available."
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 2. Register User (Using Clean Async/Await and matching your schema)
module.exports.registerUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation check
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        // Check duplicate
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(409).json({ error: "Duplicate email found" });
        }

        // Create new user (matching your actual model)
        const newUser = new User({ email, password });
        await newUser.save();

        res.status(201).json({ message: "User Registered Successfully." });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 3. Login User (Returns a JWT token for authentication)
module.exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Find user
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user || user.password !== password) {
            // Note: In real production, hash passwords with bcrypt instead of plain text!
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // Generate token using your existing auth system if it has a createAccessToken function
        let token = "";
        if (auth.createAccessToken) {
            token = auth.createAccessToken(user);
        }

        res.status(200).json({ 
            message: "Login successful", 
            access: token 
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 4. Get Logged-In User Details
module.exports.getUserDetails = async (req, res) => {
    try {
        // req.user.id is injected here by your verifyToken middleware
        const user = await User.findById(req.user.id).select("-password");
        
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: "Server error", message: error.message });
    }
};
