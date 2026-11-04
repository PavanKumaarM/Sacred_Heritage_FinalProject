
const TokenService = require("../jwt/tokenService");
const User = require("../models/User");

const protect = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Authorization token required"
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = TokenService.verifyToken(token);

        const user = await User.findById(decoded.id)
            .select("-password");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found"
            });
        }

        req.user = {
            id: user._id,
            _id: user._id,
            name: user.name,
            email: user.email
        };

        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
};

module.exports = { protect };
