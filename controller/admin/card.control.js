const Product = require("../../models/product.model");
const Card = require("../../models/card.model");
const Size = require("../../models/size.model");
const Color = require("../../models/color.model");
const Stock = require("../../models/stock.model");
const Review = require("../../models/review.model");
const Description = require("../../models/description.model");
const { status } = require("http-status");

exports.addCard = async (req, res) => {
    try {
        const { title, description, discount, OriginalPrice } = req.body;
        if (!title || !OriginalPrice || isNaN(OriginalPrice)) {
            return res.status(status.BAD_REQUEST).json({ message: "Invalid input data" });
        }
        let parsedDiscount;
        if (discount === "New") {
            parsedDiscount = "New";
        } else {
            parsedDiscount = parseInt(discount);
            if (isNaN(parsedDiscount) || parsedDiscount < 0 || parsedDiscount > 100) {
                return res.status(status.BAD_REQUEST).json({
                    message: "Discount must be 'New' or a number between 0 and 100"
                });
            }
        }
        let DiscountedPrice = parsedDiscount !== "New" ? (OriginalPrice - (OriginalPrice * parsedDiscount) / 100) : null;
        const publicId = req.file?.filename || null;
        const card = new Card({ title, description, discount: parsedDiscount, OriginalPrice, DiscountedPrice, image: publicId });
        await card.save();
        return res.status(status.OK).json({
            message: "Card added successfully"
        });
    }
    catch (err) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            message: err.message
        });
    }
};

exports.updateCard = async (req, res) => {
    try {
        const id = req.params.id;
        const card = await Card.findById(id);
        if (!card) {
            return res.status(status.NOT_FOUND).json({
                message: "Card not found"
            });
        } else {
            const updateddata = { ...req.body };
            if (updateddata.OriginalPrice && (typeof updateddata.OriginalPrice !== "number" || updateddata.OriginalPrice <= 0)) {
                return res.status(status.BAD_REQUEST).json({
                    message: "OriginalPrice must be a positive number"
                });
            }
            if (updateddata.discount) {
                let parsedDiscount;
                if (updateddata.discount === "New") {
                    parsedDiscount = "New";
                } else {
                    parsedDiscount = parseInt(updateddata.discount);
                    if (isNaN(parsedDiscount) || parsedDiscount < 0 || parsedDiscount > 100) {
                        return res.status(status.BAD_REQUEST).json({
                            message: "Discount must be 'New' or a number between 0 and 100"
                        });
                    }
                }
                updateddata.discount = parsedDiscount;
                if (parsedDiscount !== "New" && updateddata.OriginalPrice) {
                    const Price = (updateddata.OriginalPrice * parsedDiscount) / 100;
                    updateddata.DiscountedPrice = parseFloat((updateddata.OriginalPrice - Price).toFixed(2));
                } else if (parsedDiscount === "New") {
                    updateddata.DiscountedPrice = null;
                }
            }
            if (req.file) {
                updateddata.image = req.file.filename;
            }
            await Card.findByIdAndUpdate(id, updateddata, { new: true, runValidators: true });
            return res.status(status.OK).json({
                message: "Card updated successfully"
            });
        }
    }
    catch (err) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            message: err.message
        });
    }
};

exports.singlecard = async (req, res) => {
    try {
        const id = req.params.id;
        const card = await Card.findById(id);
        if (!card) {
            return res.status(status.NOT_FOUND).json({
                message: "Card not found"
            });
        }
        return res.status(status.FOUND).json({
            message: "Card found successfully",
            data: card
        });
    }
    catch (err) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            message: err.message
        });
    }
};

exports.allCard = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 8;
        const page = Math.max(parseInt(req.query.page) || 1, 1);
        const skip = (page - 1) * limit;
        const cards = await Card.find().skip(skip).limit(limit);
        return res.status(status.OK).json({
            message: "All Cards retrieved successfully",
            data: cards
        });
    }
    catch (err) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            message: err.message
        });
    }
};

exports.deleteCard = async (req, res) => {
    try {
        const id = req.body.id;
        const card = await Card.findByIdAndDelete(id);
        if (!card) {
            return res.status(status.NOT_FOUND).json({
                message: "Card not found",
            });
        }
        const product = await Product.findOne({ cardId: card._id });
        if (product) {
            await Promise.all([
                Size.deleteMany({ ProductId: product._id }),
                Color.deleteMany({ ProductId: product._id }),
                Stock.deleteOne({ ProductId: product._id }),
                Review.deleteOne({ ProductId: product._id }),
                Description.deleteOne({ ProductId: product._id }),
            ]);
            await Product.findByIdAndDelete(product._id);
        }
        return res.status(status.OK).json({
            message: "Card deleted successfully",
        });
    } catch (err) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "An error occurred while deleting the card. Please try again later.",
        });
    }
};