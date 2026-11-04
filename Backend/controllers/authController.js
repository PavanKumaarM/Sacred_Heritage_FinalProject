
const AuthService = require("../services/authService");

exports.signup = async (req, res) => {

    try {

        const result = await AuthService.signup(req.body);

        return res.status(201).json({
            success: true,
            message: "Registration successful",
            data: result
        });

    } catch (error) {

        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "Email already exists"
            });
        }

        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message
        });
    }
};


exports.login = async (req, res) => {

    try {

        const { email, password } = req.body;

        const result = await AuthService.login(
            email,
            password
        );

        return res.status(200).json({
            success: true,
            message: "Login successful",
            data: result
        });

    } catch (error) {

        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message
        });
    }
};
