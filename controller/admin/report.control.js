const Product = require("../../models/product.model");
const User = require("../../models/user.model");
const Order = require("../../models/order.model");
const Stock = require("../../models/stock.model");
const Category = require("../../models/category.model");
const Billing = require("../../models/billing.model")
const { status } = require("http-status");
const Sell = require("../../models/sells.model");

exports.sales = async (req, res) => {
    try {
        const product = await Product.countDocuments();
        const user = await User.countDocuments();
        const category = await Category.countDocuments();
        const active = await User.aggregate([
            {
                $match: { status: "active" }
            }
        ]);
        const inactive = await User.aggregate([
            {
                $match: {
                    status: {
                        $in: ["inactive", "block"]
                    }
                }
            }
        ]);
        const newUsers = await User.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: new Date(new Date().setDate(new Date().getDate() - 7))
                    }
                }
            }
        ]);
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
        const orders = await Order.find();
        const pending = await Order.find({ status: "Pending" });
        const completed = await Order.find({ status: "Delivered" });
        return res.status(status.OK).json({
            message: "Sales report fetched successfully",
            totalProduct: product,
            user: user,
            newUsers: newUsers.length,
            activeUser: active.length,
            inactiveUser: inactive.length,
            category: category,
            revenue: `Rs. ${revenue[0].total}`,
            categoryProduct: categoryProduct,
            totalOrder: orders.length,
            pendingOrder: pending.length,
            completedOrder: completed.length
        });
    }
    catch (err) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            message: err.message
        });
    }
};

exports.productSells = async (req, res) => {
    try {
        const sells = await Sell.find().sort({ quantity: -1 }).limit(5);
        const product = sells.map((item) => {
            const name = item.name
            const quantity = item.quantity
            return { name, quantity };
        })
        if (sells === 0) {
            return res.status(status.OK).json({
                message: "No sales found",
            })
        }
        return res.status(status.OK).json({
            message: "Product sales fetched successfully",
            data: product
        });
    }
    catch (err) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            message: err.message
        });
    }
};

exports.categorySells = async (req, res) => {
    try {
        const categorySells = await Sell.aggregate([
            {
                $lookup: {
                    from: "categories",
                    localField: "category",
                    foreignField: "_id",
                    as: "categoryData"
                }
            },
            {
                $addFields: {
                    category: { $arrayElemAt: ["$categoryData.name", 0] }
                }
            },
            {
                $group: {
                    _id: "$category",
                    total: { $sum: "$quantity" },
                }
            },
            {
                $project: {
                    _id: 1,
                    category: 1,
                    total: 1
                }
            },
            {
                $sort: { total: -1 }
            }, {
                $limit: 5
            }
        ]);
        if (categorySells === 0) {
            return res.status(status.NOT_FOUND).json({
                message: "No category found"
            })
        }
        return res.status(status.OK).json({
            message: "Category sales fetched successfully",
            data: categorySells
        })
    }
    catch (err) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            message: err.message
        });
    }
};

exports.last5monthrevenue = async (req, res) => {
    try {
        const sells = await Sell.aggregate([
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    total: { $sum: "$quantity" }
                }
            },
            {
                $sort: { _id: -1 }
            },
            {
                $limit: 6,
            },
            // {
            //     $skip: 1
            // }
        ]);
        sells.map((item) => {
            const months = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            item._id = months[item._id];
        })
        if (sells === 0) {
            return res.status(status.NOT_FOUND).json({
                message: "No sales found"
            });
        }
        return res.status(status.OK).json({
            message: "Last 5 month sales fetched successfully",
            data: sells
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