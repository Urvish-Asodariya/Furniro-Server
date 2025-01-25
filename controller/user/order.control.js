const Order = require("../../models/order.model");
const Stock = require("../../models/stock.model");
const Cart = require("../../models/cart.model");
const NotificationController = require("./notification.control");
const { status } = require("http-status");

exports.singleorder = async (req, res) => {
    try {
        const id = req.params.Id;
        const userId = req.user._id;
        const order = await Order.find({
            $and: [
                { _id: id },
                { userId: userId }
            ]
        });
        if (!order) {
            return res.status(status.NOT_FOUND).json({
                message: "Order not found"
            });
        } else {
            return res.status(status.OK).json({
                message: "Order found",
                order: order
            });
        }
    }
    catch (err) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            message: err.message
        });
    }
};
exports.createorder = async (req, res) => {
    try {
        // const userId =  req.user._id;
        const id = req.params.cartId;
        const cart = await Cart.findOne({ _id: id });
        if (!cart) {
            return res.status(status.NOT_FOUND).json({
                message: "Cart not found"
            });
        }
        const stock = await Stock.findOne({ ProductId: cart.productId });
        if (!stock) {
            return res.status(status.NOT_FOUND).json({
                message: "Stock not found"
            });
        }
        // const username = req.user.name;
        const productId = cart.productId;
        const productname = cart.name;
        const image = cart.image;
        const price = parseInt(cart.price);
        const quantity = parseInt(cart.quantity);
        const category = cart.category;
        if (quantity <= 0) {
            return res.status(status.BAD_REQUEST).json({
                status: 400,
                message: "Invalid quantity"
            });
        }
        const totalAmount = price * quantity;
        if (!stock || stock.stock < quantity) {
            return res.status(status.BAD_REQUEST).json({
                message: "Insufficient stock"
            });
        }
        const order = new Order({
            // userId: userId,
            productId: productId,
            // username: username,
            productname: productname,
            image: image,
            price: price,
            quantity: quantity,
            category: category,
            total: totalAmount,
            cartId: id
        });
        await order.save();
        const Id = stock._id;
        await Stock.findByIdAndUpdate(Id, { $inc: { stock: -quantity } }, { new: true, runValidators: true });
        // NotificationController.sendNotification({
        //     userId: userId,
        //     title: "Order Created",
        //     message: "Your order has been Created successfully"
        // });
        return res.status(status.OK).json({
            message: "Order created successfully",
            order: order
        });
    } catch (err) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            message: err.message
        });
    }
};

exports.updateorder = async (req, res) => {
    try {
        const id = req.params.Id;
        const order = await Order.findById(id);
        if (!order) {
            return res.status(status.NOT_FOUND).json({
                message: "Order not found"
            });
        } else {
            const updatedOrder = await Order.findByIdAndUpdate(id, { $set: { quantity: req.body.quantity } }, { new: true, runValidators: true });
            return res.status(status.OK).json({
                message: "Order updated successfully",
                order: updatedOrder
            });
        }
    }
    catch (err) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            message: err.message
        });
    }
};

exports.deleteorder = async (req, res) => {
    try {
        const id = req.params.Id;
        const order = await Order.findById(id);
        if (!order) {
            return res.status(status.NOT_FOUND).json({
                message: "Order not found"
            });
        }
        console.log(order);
        const cart = await Cart.findOne({ _id: order.cartId });
        if (!cart) {
            return res.status(status.NOT_FOUND).json({
                message: "Cart not found"
            });
        }
        const stock = await Stock.findOne({ ProductId: cart.productId });
        await Stock.findByIdAndUpdate(stock._id, { $inc: { stock: order.quantity } });
        await Order.findByIdAndDelete(id);
        return res.status(status.OK).json({
            message: "Order deleted"
        });
    }
    catch (err) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            message: err.message
        });
    }
};