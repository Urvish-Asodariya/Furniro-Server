const Card = require("../../models/card.model");
const { status } = require("http-status");
const { getFileUrl } = require("../../utils/cloudinaryConfig");

exports.allCard = async (req, res) => {
    try {
        const limit = 8;
        const page = parseInt(req.query.page) || 1;
        const skip = (page - 1) * limit;
        const cards = await Card.find().limit(limit).skip(skip);
        cards.map((card) => {
            card.image = getFileUrl(card.image);
        });
        return res.status(status.OK).json({
            message: "All Cards retrieved successfully",
            data: cards
        });
    } catch (err) {
        console.error("Error in allCard:", err);
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            message: err.message
        });
    }
};

exports.allProductCard = async (req, res) => {
    try {
        var field = req.query.sort;
        const limit = parseInt(req.query.size) || 16;
        const page = parseInt(req.query.page) || 1;
        const skip = (page - 1) * limit;
        const total = await Card.countDocuments();
        const cards = await Card.aggregate([
            { $sort: { [field]: 1 } },
            { $skip: skip },
            { $limit: limit }
        ]);
        cards.map((card) => {
            card.image = getFileUrl(card.image);
        });
        return res.status(status.OK).json({
            message: "All Cards retrieved successfully",
            data: cards,
            total: total
        });
    } catch (err) {
        console.error("Error in allProductCard:", err);
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            message: err.message
        });
    }
};

exports.relatedproduct = async (req, res) => {
    try {
        const limit = 8;
        const cards = await Card.find().limit(limit);
        return res.status(status.OK).json({
            message: "All Cards retrieved successfully",
            data: cards
        });
    } catch (err) {
        console.error("Error in relatedproduct:", err);
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            message: err.message
        });
    }
};

