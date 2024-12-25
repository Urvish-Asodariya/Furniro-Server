const Wishlist = require("../../models/wishlist.model");
const Product = require("../../models/product.model");
const { status } = require("http-status");

exports.userwishlist = async (req, res) => {
    try {
        // const UserId = req.user._id;
        const id = req.params.id;
        const wishlist = await Wishlist.find({ productId: id });
        if (wishlist.length === 0) {
            return res.status(status.NOT_FOUND).json({
                message: "No wishlist found"
            });
        }
        return res.status(status.OK).json({
            message: "Wishlist retrieved successfully",
            data: wishlist
        });
    }
    catch (err) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            message: err.message
        });
    }
};

exports.addlist = async (req, res) => {
    try {
        const UserId = req.user._id;
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
        const { size, color, quantity } = req.body;
        if (!size || !color || isNaN(quantity)) {
            return res.status(status.BAD_REQUEST).json({
                message: "Missing or invalid data"
            });
        }
        const quantityParsed = parseInt(quantity) || 1;
        const subtotal = price * quantity;
        const wishlist = new Wishlist({
            image: image,
            name: name,
            price: price,
            size: size,
            color: color,
            quantity: quantityParsed,
            productId: productId,
            subtotal: subtotal,
            userId: UserId
        });
        await wishlist.save();
        return res.status(status.OK).json({
            message: "Wishlist added to cart successfully"
        });
    }
    catch (err) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            message: err.message
        });
    }
};

exports.deletewishlist = async (req, res) => {
    try {
        const id = req.params.id;
        const wishlist = await Wishlist.findByIdAndDelete(id);
        if (!wishlist) {
            return res.status(status.NOT_FOUND).json({
                message: "Wishlist not found"
            });
        }
        return res.status(status.OK).json({
            message: "Wishlist deleted successfully"
        });
    }
    catch (err) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            message: err.message
        });
    }
};