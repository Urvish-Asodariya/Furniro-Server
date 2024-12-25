const Billing = require("../../models/billing.model");
const Order = require("../../models/order.model");
const { payment } = require("../../utils/payment");
const NotificationController = require("./notification.control");
const { status } = require("http-status");
const User = require("../../models/user.model");

exports.paybill = async (req, res) => {
    try {
        // const id = req.user._id;
        const Id = req.params.Id;
        // const order = await Order.find({
        //     $and: [
        //         { userId: userId },
        //         { _id: Id }
        //     ]
        // });
        const order = await Order.findById(Id);
        // let total = 0;
        // const totalamount = order.map((item) => {
        //     total += item.total;
        //     return total;
        // });
        if (!order) {
            return res.status(status.NOT_FOUND).json({
                message: "Order not found"
            });
        }
        const productname = order.productname;
        const quantity = order.quantity;
        // const bill = totalamount;
        const total = order.total;
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
        const billing = new Billing({ firstname, lastname, company, country, street_address, city, province, zipcode, phone, email, additional, productname: productname, quantity: quantity, total: total, orderId: Id });
        await billing.save();
        const paymentResponse = await payment({ username: billing.firstname, email: billing.email, product: productname, quantity: quantity, amount: total });
        if (paymentResponse.sessionId) {
            billing.paymentSessionId = paymentResponse.sessionId;
            await Billing.findByIdAndUpdate(billing._id, { $set: { status: "completed" } }, { new: true, runValidators: true });
            try {
                await NotificationController.sendNotification({
                    title: "Order Paid",
                    message: "Your order has been paid successfully"
                });
            } catch (notifyErr) {
                console.error("Notification sending failed:", notifyErr);
            }

            return res.status(status.OK).json({
                message: "Payment session created successfully, and status updated.",
                paymentResponse: paymentResponse
            });
        } else {
            return res.status(status.BAD_REQUEST).json({
                message: "Payment session creation failed",
                paymentResponse: paymentResponse
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
