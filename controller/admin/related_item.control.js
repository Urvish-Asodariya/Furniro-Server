const Relateditems = require("../../models/related_items.model");
const { status } = require("http-status");

exports.additem = async (req, res) => {
    try {
        const { title, description, discount, OriginalPrice, productId } = req.body;
        if (!title || !description || !OriginalPrice || !productId) {
            return res.status(status.BAD_REQUEST).json({
                message: "All required fields  must be provided"
            });
        }
        let parsedDiscount = null;
        let DiscountedPrice = null;
        if (discount === "New") {
            parsedDiscount = "New";
        } else if (!isNaN(parseInt(discount))) {
            parsedDiscount = parseInt(discount);
            if (parsedDiscount < 0 || parsedDiscount > 100) {
                return res.status(status.BAD_REQUEST).json({
                    message: "Discount percentage should be between 0 and 100"
                });
            }
            const Price = (OriginalPrice * parsedDiscount) / 100;
            DiscountedPrice = OriginalPrice - Price;
        } else {
            return res.status(status.BAD_REQUEST).json({
                message: "Invalid discount value"
            });
        }
        const publicId = req.file?.filename || null;
        const items = new Relateditems({
            title,
            description,
            discount: parsedDiscount,
            OriginalPrice,
            DiscountedPrice,
            image: publicId,
            productId
        });
        await items.save();
        return res.status(status.OK).json({
            message: "Item added successfully"
        });
    } catch (err) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "An error occurred, please try again later."
        });
    }
};

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
        const id = req.params.id;
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


exports.change = async (req, res) => {
    try {
        const id = req.params.id;
        const item = await Relateditems.findById(id);
        if (!item) {
            return res.status(status.NOT_FOUND).json({
                message: "Item not found"
            });
        }
        const updateddata = { ...req.body };
        if (req.file) {
            updateddata.image = req.file?.path || req.file?.filename;
        }
        const updateditem = await Relateditems.findByIdAndUpdate(id, updateddata, { new: true, runValidators: true });
        return res.status(status.OK).json({
            message: "Item updated successfully",
            data: updateditem
        });
    } catch (err) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "An error occurred, please try again later."
        });
    }
};

exports.deleteitem = async (req, res) => {
    try {
        const id = req.params.id;
        const item = await Relateditems.findByIdAndDelete(id);

        if (!item) {
            return res.status(status.NOT_FOUND).json({
                message: "Item not found"
            });
        }
        return res.status(status.OK).json({
            message: "Item deleted successfully"
        });
    } catch (err) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "An error occurred, please try again later."
        });
    }
};

