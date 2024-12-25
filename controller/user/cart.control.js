const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");
const Order = require("../../models/order.model");
const { status } = require("http-status");

exports.addcart = async (req, res) => {
    try {
        const ProductId = req.params.Id;
        const product = await Product.findById(ProductId);
        if (!product) {
            return res.status(status.NOT_FOUND).json({
                message: "Product not found"
            });
        }
        const image = product.image[0];
        const name = product.title;
        const productId = product._id;
        const price = parseInt(product.price);
        const size = req.body.size;
        const color = req.body.color;
        const quantity = parseInt(req.body.quantity) || 1;
        if (isNaN(quantity) || quantity <= 0) {
            return res.status(status.BAD_REQUEST).json({
                message: "Invalid quantity"
            });
        }
        const subtotal = price * quantity;
        // const userId = req.user._id;
        const cart = new Cart({
            image: image,
            name: name,
            price: price,
            size: size,
            color: color,
            quantity: quantity,
            productId: productId,
            subtotal: subtotal,
            // userId:userId
        });
        await cart.save();
        return res.status(status.OK).json({
            message: "Product added to cart successfully",
        });
    }
    catch (err) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            message: err.message
        });
    }
};

exports.updatecart = async (req, res) => {
    try {
        const Id = req.params.Id;
        const cartproduct = await Cart.findById(Id);
        if (!cartproduct) {
            return res.status(status.NOT_FOUND).json({
                message: "Cart product not found"
            });
        } else {
            const quantity = req.body.quantity;
            if (isNaN(quantity) || quantity <= 0) {
                return res.status(status.BAD_REQUEST).json({
                    message: "Invalid quantity"
                });
            }
            const cart = await Cart.findByIdAndUpdate(Id, { $set: { quantity: quantity } }, { new: true, runValidators: true });
            return res.status(status.OK).json({
                message: "Cart product updated successfully",
                data: cart
            });
        }
    } catch (err) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            message: err.message
        });
    }
};

exports.deletecart = async (req, res) => {
    try {
        const ProductId = req.params.Id;
        // const userId = req.user._id;
        // const cartproduct = await Cart.findOne({ 
        //     $and: [
        //         { userId: userId },
        //         { productId: ProductId }
        //     ]
        //  });
        const cartproduct = await Cart.findOne({ productId: ProductId });
        if (!cartproduct) {
            return res.status(status.NOT_FOUND).json({
                message: "Cart product not found"
            });
        }
        await Order.deleteOne({ cartId: cartproduct._id });
        await Cart.deleteOne({ productId: ProductId });
        return res.status(status.OK).json({
            message: "Cart product and related order deleted successfully"
        });
    } catch (err) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            message: err.message
        });
    }
};

exports.singleUserCart = async (req, res) => {
    try {
        // const userId = req.user._id;
        const ProductId = req.params.Id;
        // const cartproduct = await Cart.find({ 
        //     $and: [
        //         { userId: userId },
        //         { productId: ProductId }
        //     ]
        //  });
        const cartproduct = await Cart.find({ productId: ProductId });
        if (!cartproduct) {
            return res.status(status.NOT_FOUND).json({
                message: "Cart not found"
            });
        } else {
            return res.status(status.OK).json({
                message: "Cart retrieved successfully",
                data: cartproduct
            });
        }
    }
    catch (err) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            message: err.message
        });
    }
};
exports.totalamount = async (req, res) => {
    try {
        const userId = req.user._id;
        const cart = await Cart.find({ userId: userId });
        if (cart.length === 0) {
            return res.status(status.NOT_FOUND).json({
                message: "Cart not found"
            });
        }
        let total = 0;
        cart.forEach((item) => {
            total += item.subtotal;
        });
        return res.status(status.OK).json({
            message: "Total amount found",
            data: total
        });
    } catch (err) {
        return res.status(status.OK).json({
            message: err.message
        });
    }
};


exports.allcarts = async (req, res) => {
    try {
        const carts = await Cart.find();
        if (carts == 0) {
            return res.status(status.NOT_FOUND).json({
                message: "No carts found"
            });
        } else {
            return res.status(status.OK).json({
                message: "All carts retrieved successfully",
                data: carts
            });
        }
    }
    catch (err) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            message: err.message
        });
    }
};