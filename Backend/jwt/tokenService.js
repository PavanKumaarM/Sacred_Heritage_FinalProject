
const jwt = require("jsonwebtoken");

class TokenService {

    static generateToken(user) {
        return jwt.sign(
            {
                id: user._id,
                email: user.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN || "1d"
            }
        );
    }

    static verifyToken(token) {
        return jwt.verify(
            token,
            process.env.JWT_SECRET
        );
    }
}

module.exports = TokenService;
