const Product = require("../../models/product.model");
const User = require("../../models/user.model");
const Order = require("../../models/order.model");
const Stock = require("../../models/stock.model");
const Category = require("../../models/category.model");
const Billing = require("../../models/billing.model")
const { status } = require("http-status");

exports.sales = async (req, res) => {
    try {
        const product = await Product.countDocuments();
        const user = await User.countDocuments();
        const category = await Category.countDocuments();
        const revenue = await Billing.aggregate([
            {
                $match: { status: "completed" }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$total" },
                }
            }
        ]);
        const results = await Category.aggregate([
            {
                $lookup: {
                    from: "products",
                    localField: "_id",
                    foreignField: "category",
                    as: "products"
                }
            },
            {
                $project: {
                    _id: 0,
                    name: 1,
                    totalProducts: { $size: "$products" }
                }
            }
        ]);
        const categoryProduct = results.map((item) => {
            const name = item.name
            const totalProducts = item.totalProducts
            return { name, totalProducts };
        })
        return res.status(status.OK).json({
            message: "Sales report fetched successfully",
            product: product,
            user: user,
            category: category,
            revenue:`Rs. ${revenue[0].total}`,
            categoryProduct: categoryProduct
        });
    }
    catch (err) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            message: err.message
        });
    }
};

exports.inventory = async (req, res) => {
    try {
        const lowstock = await Stock.find({
            $and: [
                {
                    stock: {
                        $lte: 10,
                    }
                },
                {
                    stock: {
                        $gt: 0,
                    }
                }
            ]
        }).populate("ProductId").lean();
        const number1 = lowstock.map((item) => ({
            product: item.ProductId.title
        }));
        const outstock = await Stock.find({
            stock: {
                $eq: 0
            }
        }).populate("ProductId").lean();
        const number2 = outstock.map((item) => ({
            product: item.ProductId.title
        }))
        return res.status(status.OK).json({
            message: "Inventory report fetched successfully",
            lowstock: number1,
            outOfstock: number2
        });
    }
    catch (err) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            message: err.message
        });
    }
};

exports.userreport = async (req, res) => {
    try {
        const active = await User.aggregate([
            {
                $match: {
                    status: "activate"
                }
            }
        ]);
        const inactive = await User.aggregate([
            {
                $match: {
                    status: "deactivate"
                }
            }
        ]);
        return res.status(status.OK).json({
            message: "User report fetched successfully",
            active: active.length,
            inActive: inactive.length
        });
    }
    catch (err) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            message: err.message
        });
    };
};