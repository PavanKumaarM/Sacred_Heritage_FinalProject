const User = require("../models/User");
const bcrypt = require("bcryptjs");
const TokenService = require("../jwt/tokenService");

class AuthService {

    static async signup(data) {
        const { name, email, password, phone } = data;

        if (
            !name?.trim() ||
            !email?.trim() ||
            !password
        ) {
            const error = new Error(
                "Name, email and password are required"
            );
            error.statusCode = 400;
            throw error;
        }

        if (typeof password !== "string" || password.length < 6) {
            const error = new Error(
                "Password must contain at least 6 characters"
            );
            error.statusCode = 400;
            throw error;
        }

        const normalizedEmail = email.trim().toLowerCase();

        const existingUser = await User.findOne({
            email: normalizedEmail
        });

        if (existingUser) {
            const error = new Error("Email already exists");
            error.statusCode = 409;
            throw error;
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            password: hashedPassword,
            phone
        });

        const token = TokenService.generateToken(user);

        return {
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone
            },
            token
        };
    }

    static async login(email, password) {
        if (
            typeof email !== "string" ||
            !email.trim() ||
            typeof password !== "string" ||
            !password
        ) {
            const error = new Error(
                "Email and password are required"
            );
            error.statusCode = 400;
            throw error;
        }

        const user = await User.findOne({
            email: email.trim().toLowerCase()
        }).select("+password");

        if (!user) {
            const error = new Error("Invalid email or password");
            error.statusCode = 401;
            throw error;
        }

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            const error = new Error("Invalid email or password");
            error.statusCode = 401;
            throw error;
        }

        const token = TokenService.generateToken(user);

        return {
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone
            },
            token
        };
    }
}

module.exports = AuthService;
