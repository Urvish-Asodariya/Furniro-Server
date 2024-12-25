const Relateditems = require("../../models/related_items.model");
const { status } = require("http-status");


exports.allCard = async (req, res) => {
    try {
        const limit = 8;
        const page = parseInt(req.query.page) || 1;
        if (page < 1) {
            return res.status(status.BAD_REQUEST).json({
                message: "Page number must be greater than or equal to 1"
            });
        }
        const skip = (page - 1) * limit;
        const cards = await Relateditems.find().skip(skip).limit(limit);
        return res.status(status.OK).json({
            message: "All items retrieved successfully",
            data: cards
        });
    } catch (err) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "An error occurred, please try again later."
        });
    }
};

exports.single = async (req, res) => {
    try {
        const id = req.params.ItemId;
        const item = await Relateditems.findOne({ productId: id });
        if (!item) {
            return res.status(status.NOT_FOUND).json({
                message: "Item not found"
            });
        }
        return res.status(status.OK).json({
            message: "Item retrieved successfully",
            data: item
        });
    } catch (err) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "An error occurred, please try again later."
        });
    }
};
