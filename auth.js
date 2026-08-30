const jwt = require("jsonwebtoken");
// Note: Ensure you have a secret key configured in your environment variables (.env file)
const secret = process.env.JWT_SECRET_KEY || "YourSuperSecretFitnessTrackerKey";

// 1. Generate Access Token (Used inside userController.loginUser)
module.exports.createAccessToken = (user) => {
    const data = {
        id: user._id,
        email: user.email,
        isAdmin: user.isAdmin
    };
    // Sign the token with user details; expires in 1 day
    return jwt.sign(data, secret, { expiresIn: "1d" });
};

// 2. Middleware to Verify JWT Token (Used to protect incoming routes)
module.exports.verifyToken = (req, res, next) => {
    let token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ auth: "Failed", message: "No token provided." });
    }

    // Standard authorization check: remove 'Bearer ' prefix if present
    if (token.startsWith("Bearer ")) {
        token = token.slice(7, token.length);
    }

    // Verify token validity
    jwt.verify(token, secret, (err, decodedToken) => {
        if (err) {
            return res.status(403).json({
                auth: "Failed",
                message: "Invalid or expired authorization token."
            });
        } else {
            // Injects the decoded payload (user ID, email) directly into the request
            req.user = decodedToken;
            next(); // Hand-off execution to the next controller function
        }
    });
};
