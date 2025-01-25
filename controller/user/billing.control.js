const Billing = require("../../models/billing.model");
const Order = require("../../models/order.model");
const { payment } = require("../../utils/payment");
const NotificationController = require("./notification.control");
const { status } = require("http-status");
const User = require("../../models/user.model");
const Sell = require("../../models/sells.model");

exports.paybill = async (req, res) => {
    try {
        // const id = req.user._id;
        const id = req.params.Id;
        const order = await Order.findById(id);
        if (!order) {
            return res.status(status.BAD_REQUEST).json({
                message: "Order not found"
            });
        }
        const products = [{
            name: order.productname,
            quantity: order.quantity,
            amount: Math.round(order.total * 100),
            category: order.category
        }];
        const totalAmount = products.reduce((sum, product) => sum + product.amount * product.quantity, 0);
        // const user = await User.findById(id);
        // if (!user) {
        //     return res.status(status.NOT_FOUND).json({
        //         message: "User not found"
        //     });
        // }
        // if (user.wallet < total) {
        //     return res.status(status.BAD_REQUEST).json({
        //         message: "Insufficient wallet"
        //     });
        // }
        const { firstname, lastname, company, country, street_address, city, province, zipcode, phone, email, additional } = req.body;
        const billing = new Billing({
            firstname, lastname, company, country, street_address, city, province, zipcode, phone, email, additional,
            products, total: totalAmount / 100, userId: id, orderIds: [order._id],
        });
        await billing.save();
        await Promise.all(products.map(async (product) => {
            const existingSell = await Sell.findOne({ name: product.name });
            if (!existingSell) {
                const newSell = new Sell({ name: product.name, quantity: product.quantity, category: product.category });
                await newSell.save();
            } else {
                await Sell.findByIdAndUpdate(existingSell._id, { $inc: { quantity: product.quantity } }, { new: true, runValidators: true });
            }
        }));
        const paymentResponse = await payment({ username: firstname, email, products, totalAmount, });
        if (paymentResponse.sessionId) {
            billing.paymentSessionId = paymentResponse.sessionId;
            billing.status = "completed";
            await billing.save();
            return res.status(status.OK).json({
                message: "Payment session created successfully",
                sessionId: paymentResponse.sessionId,
            });
        } else {
            return res.status(status.BAD_REQUEST).json({
                message: "Payment session creation failed",
                paymentResponse,
            });
        }
    }
    catch (err) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            message: err.message
        });
    }
};

exports.orderitems = async (req, res) => {
    try {
        // const userId = req.user._id;
        const id = req.params.id;
        const order = await Order.findById(id);
        if (!order) {
            return res.status(status.NOT_FOUND).json({
                message: "Order not found"
            });
        }
        return res.status(status.OK).json({
            message: "Order items retrieved successfully",
            data: [order]
        });
    }
    catch (err) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            message: err.message
        });
    }
};

exports.orderstatus = async (req, res) => {
    try {
        const userId = req.user._id;
        const orderId = req.params.orderId;
        const order = await Order.aggregate([{
            $match: {
                $and: [
                    { userId: userId },
                    { _id: orderId }
                ]
            }
        },
        {
            $project: {
                status: 1
            }
        }]);
        return res.status(status.OK).json({
            message: "Order status retrieved successfully",
            data: order
        });
    }
    catch (err) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            message: err.message
        });
    }
};
