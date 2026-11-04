const UserService = require("../services/userService");

exports.getProfile = async (req, res, next) => {

    try {

        const user = await UserService.getProfile(req.user._id);

        res.status(200).json({
            success: true,
            data: user
        });

    } catch (error) {
        next(error);
    }
};

exports.updateProfile = async (req, res, next) => {

    try {

        const user = await UserService.updateProfile(
            req.user._id,
            req.body
        );

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: user
        });

    } catch (error) {
        next(error);
    }
};