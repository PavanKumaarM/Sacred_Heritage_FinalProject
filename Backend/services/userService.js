const User = require("../models/User");

class UserService {

    static async getProfile(userId) {

        const user = await User.findById(userId);

        if (!user) {
            throw new Error("User not found");
        }

        return user;
    }

    static async updateProfile(userId, data) {

        const allowedFields = ["name", "phone", "address"];

        const updates = {};

        allowedFields.forEach((field) => {
            if (data[field] !== undefined) {
                updates[field] = data[field];
            }
        });

        const user = await User.findByIdAndUpdate(
            userId,
            { $set: updates },
            {
                new: true,
                runValidators: true
            }
        );

        if (!user) {
            throw new Error("User not found");
        }

        return user;
    }
}

module.exports = UserService;