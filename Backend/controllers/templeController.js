
const TempleService = require("../services/templeService");

exports.createTemple = async (req, res, next) => {
    try {
        const temple = await TempleService.createTemple(req.body);

        res.status(201).json({
            success: true,
            message: "Temple added successfully",
            data: temple
        });
    } catch (error) {
        next(error);
    }
};

exports.getAllTemples = async (req, res, next) => {
    try {
        const temples = await TempleService.getAllTemples();

        res.status(200).json({
            success: true,
            count: temples.length,
            data: temples
        });
    } catch (error) {
        next(error);
    }
};

exports.getTempleById = async (req, res, next) => {
    try {
        const temple = await TempleService.getTempleById(req.params.id);

        res.status(200).json({
            success: true,
            data: temple
        });
    } catch (error) {
        next(error);
    }
};

// New: temple information + associated products
exports.getTempleDetails = async (req, res, next) => {
    try {
        const details = await TempleService.getTempleDetails(req.params.id);

        res.status(200).json({
            success: true,
            data: details
        });
    } catch (error) {
        next(error);
    }
};

exports.updateTemple = async (req, res, next) => {
    try {
        const temple = await TempleService.updateTemple(
            req.params.id,
            req.body
        );

        res.status(200).json({
            success: true,
            message: "Temple updated successfully",
            data: temple
        });
    } catch (error) {
        next(error);
    }
};

exports.deleteTemple = async (req, res, next) => {
    try {
        const temple = await TempleService.deleteTemple(req.params.id);

        res.status(200).json({
            success: true,
            message: "Temple deactivated successfully",
            data: temple
        });
    } catch (error) {
        next(error);
    }
};
