const Product = require("../../models/product.model");
const Card = require("../../models/card.model");
const Size = require("../../models/size.model");
const Color = require("../../models/color.model");
const Stock = require("../../models/stock.model");
const Review = require("../../models/review.model");
const Description = require("../../models/description.model");
const UserRating = require("../../models/userratings.model");
const Category = require("../../models/category.model");
const { status } = require("http-status");

exports.add = async (req, res) => {
    try {
        const { name } = req.body;
        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            return res.status(status.CONFLICT).json({
                message: "Category already exists"
            });
        }
        const category = new Category({ name });
        await category.save();
        return res.status(status.OK).json({
            message: "category added successfully"
        });
    }
    catch (err) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            message: err.message
        });
    }
};

exports.all = async (req, res) => {
    try {
        const categories = await Category.find();
        return res.status(status.OK).json({
            message: "categories fetched successfully",
            data: categories
        });
    }
    catch (err) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            message: err.message
        });
    }
};

exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        if (!category) {
            return res.status(status.NOT_FOUND).json({
                message: "Category not found"
            });
        }
        return res.status(status.OK).json({
            message: "Category updated successfully",
            data: category
        });
    } catch (err) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            message: err.message
        });
    }
};

exports.delete = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findById(id);
        if (!category) {
            return res.status(status.NOT_FOUND).json({ message: "Category not found" });
        }
        const products = await Product.find({ category: category._id });
        for (const product of products) {
            await Size.deleteMany({ ProductId: product._id });
            await Color.deleteMany({ ProductId: product._id });
            await Stock.deleteMany({ ProductId: product._id });
            await Review.deleteMany({ ProductId: product._id });
            await Description.deleteMany({ ProductId: product._id });
            await UserRating.deleteMany({ ProductId: product._id });
            await Card.findByIdAndDelete({ _id: product.cardId });
            await Product.findByIdAndDelete(product._id);
        }
        await Category.findByIdAndDelete(id);
        return res.status(status.OK).json({
            message: "Category deleted successfully"
        });
    } catch (err) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            message: err.message
        });
    }
};
