const Rating = require("../../models/userratings.model");
const Product = require("../../models/product.model");
const { status } = require("http-status");

exports.addratings = async (req, res) => {
    try {
        const id = req.params.productId;
        const product = await Product.findById(id);
        if (!product) {
            return res.status(status.NOT_FOUND).json({
                message: "Product not found"
            });
        }
        const { username, rating, review } = req.body;
        if (!rating || rating < 1 || rating > 5) {
            return res.status(status.BAD_REQUEST).json({
                message: "Rating must be between 1 and 5"
            });
        };
        if (!review) {
            return res.status(status.BAD_REQUEST).json({
                message: "Review is required"
            });
        }
        const ratings = new Rating({ username, rating, review, productId: id });
        await ratings.save();
        return res.status(status.OK).json({
            message: "Rating added successfully"
        });
    }
    catch (err) {

        return res.status(status.INTERNAL_SERVER_ERROR).json({
            message: err.message
        });
    }
};

exports.changerating = async (req, res) => {
    try {
        const id = req.params.id;
        const rating = await Rating.findById(id);
        if (!rating) {
            return res.status(status.NOT_FOUND).json({
                message: "Rating not found",
            });
        };
        const { rating: newRating, review } = req.body;
        if (newRating && (newRating < 1 || newRating > 5)) {
            return res.status(status.BAD_REQUEST).json({
                message: "Rating must be between 1 and 5"
            });
        }
        const data = await Rating.findByIdAndUpdate(id, { rating: newRating, review }, { new: true, runValidators: true });
        return res.status(status.OK).json({
            message: "Rating updated successfully",
            data: data
        });
    }
    catch (err) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            message: err.message
        });
    }
};

exports.productratings = async (req, res) => {
    try {
        const id = req.params.productId;
        const data = await Rating.find({ productId: id });
        if (data.length === 0) {
            return res.status(status.NOT_FOUND).json({
                message: "No ratings found for this product"
            });
        }
        return res.status(status.OK).json({
            message: "Rating updated successfully",
            data: data
        });
    }
    catch (err) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            message: err.message
        });
    }
};

exports.deleteratings = async (req, res) => {
    try {
        const id = req.params.id;
        const data = await Rating.findByIdAndDelete(id);
        if (!data) {
            return res.status(status.NOT_FOUND).json({
                message: "No rating found with this ID"
            });
        }
        return res.status(status.OK).json({
            message: "Rating updated successfully",
            data: data
        });
    }
    catch (err) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            message: err.message
        });
    }
};

exports.allratings = async (req, res) => {
    try {
        const data = await Rating.find().populate("productId");
        if (data.length === 0) {
            return res.status(status.NOT_FOUND).json({
                message: "No ratings found"
            });
        }
        return res.status(status.OK).json({
            message: "All ratings found",
            data: data
        });
    }
    catch (err) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            message: err.message
        });
    }
};