const Temple = require("../models/Temple");

class TempleService {

    static async createTemple(data) {
        return await Temple.create(data);
    }

    static async getAllTemples() {
        return await Temple.find({
            isActive: true
        }).sort({ createdAt: -1 });
    }

    static async getTempleById(id) {

        const temple = await Temple.findOne({
            _id: id,
            isActive: true
        });

        if (!temple) {
            throw new Error("Temple not found");
        }

        return temple;
    }

    static async updateTemple(id, data) {

        const allowedFields = [
            "name",
            "location",
            "description",
            "history",
            "deity",
            "openingTime",
            "closingTime",
            "image",
            "isActive"
        ];

        const updates = {};

        allowedFields.forEach((field) => {
            if (data[field] !== undefined) {
                updates[field] = data[field];
            }
        });

        const temple = await Temple.findByIdAndUpdate(
            id,
            { $set: updates },
            {
                new: true,
                runValidators: true
            }
        );

        if (!temple) {
            throw new Error("Temple not found");
        }

        return temple;
    }

    static async deleteTemple(id) {

        const temple = await Temple.findByIdAndUpdate(
            id,
            { isActive: false },
            { new: true }
        );

        if (!temple) {
            throw new Error("Temple not found");
        }

        return temple;
    }
}

module.exports = TempleService;