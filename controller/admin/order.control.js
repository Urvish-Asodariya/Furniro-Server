const Order = require("../../models/order.model");
const Stock = require("../../models/stock.model");
const Cart = require("../../models/cart.model");
const { status } = require("http-status");

// exports.allorder = async (req, res) => {
//     try {
//         const field = req.query.field;
//         const order = await Order.aggregate([
//             {
//                 $sort: {
//                     [field]: 1
//                 }
//             }
//         ]);
//         return res.status(status.OK).json({
//             message: "All orders fetched successfully",
//             data: order
//         });
//     }
//     catch (err) {
//         return res.status(status.INTERNAL_SERVER_ERROR).json({
//             message: err.message
//         });
//     }
// };

exports.singleorder = async (req, res) => {
    try {
        const id = req.params.id;
        const order = await Order.findById(id);
        if (!order) {
            return res.status(status.NOT_FOUND).json({
                message: "Order not found"
            });
        }
        return res.status(status.OK).json({
            message: "Order fetched successfully",
            data: order
        });
    }
    catch (err) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            message: err.message
        });
    }
};

exports.updateorder = async (req, res) => {
    try {
        const id = req.params.id;
        const updatedOrder = await Order.findByIdAndUpdate(id, { $set: { status: req.query.status } }, { new: true, runValidators: true });
        if (!updatedOrder) {
            return res.status(status.NOT_FOUND).json({
                message: "Order not found"
            });
        }
        return res.status(status.OK).json({
            message: "Order updated successfully",
            data: updatedOrder
        });
    }
    catch (err) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            message: err.message
        });
    };
};

exports.cancelorder = async (req, res) => {
    try {
        const id = req.params.id;
        const order = await Order.findById(id);
        if (!order) {
            return res.status(status.NOT_FOUND).json({
                message: "Order not found"
            });
        }
        const cart = await Cart.find({ _id: order.cartId });
        const stock = await Stock.findOne({ productId: cart.productId });
        if (stock) {
            await Stock.findByIdAndUpdate(stock._id, { $inc: { stock: order.quantity } }, { new: true, runValidators: true });
        }
        await Order.findByIdAndDelete(id);
        if (!order) {
            return res.status(status.NOT_FOUND).json({
                message: "Order not found"
            });
        } else {
            return res.status(status.OK).json({
                message: "Order deleted successfully"
            });
        }
    }
    catch (err) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            message: err.message
        });
    }
};

exports.allorder = async (req, res) => {
    try {
        const orders = await Order.find();
        if (orders.length == 0) {
            const error = {
                status: 404,
                message: "No orders found"
            };
            return res.status(error.status).json(error);
        } else {
            const success = {
                status: 200,
                message: "Orders found",
                orders: orders
            };
            return res.status(200).json(success);
        }
    }
    catch (err) {
        const error = {
            status: err.status,
            message: err.message
        };
        return res.status(error.status).json(error);
    }
};

exports.ordersells = async (req, res) => {
    try {
        const orders = await Order.aggregate([
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
            {
                $skip: 1
            }
        ]);
        orders.map((item) => {
            const months = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            item._id = months[item._id];
        })
        if (orders === 0) {
            return res.status(status.NOT_FOUND).json({
                message: "No sales found"
            });
        }
        return res.status(status.OK).json({
            message: "Last 5 month orders fetched successfully",
            data: orders
        });
    }
    catch (err) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            message: err.message
        });
    }
};

exports.orderreport = async (req, res) => {
    try {
        const pendingOrder = await Order.find({ status: "Pending" });
        const processingOrder = await Order.find({ status: "Processing" });
        const delivereddOrder = await Order.find({ status: "Delivered" });
        return res.status(status.OK).json({
            message: "Order chart fetched successfully",
            data: [
                {
                    label: "Pending",
                    value: pendingOrder.length
                },
                {
                    label: "Processing",
                    value: processingOrder.length
                },
                {
                    label: "Delivered",
                    value: delivereddOrder.length
                }
            ]
        });
    }
    catch (err) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            message: err.message
        });
    }
};