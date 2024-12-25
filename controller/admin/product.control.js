const Product = require("../../models/product.model");
const Card = require("../../models/card.model");
const Size = require("../../models/size.model");
const Color = require("../../models/color.model");
const Stock = require("../../models/stock.model");
const Review = require("../../models/review.model");
const Description = require("../../models/description.model");
const UserRating = require("../../models/userratings.model");
const Relateditems = require("../../models/related_items.model");
const { getFileUrl } = require("../../utils/cloudinaryConfig");
const Category = require("../../models/category.model");
const User = require("../../models/user.model");
const { status } = require("http-status");

exports.addProduct = async (req, res) => {
    try {
        const id = req.params.id;
        const card = await Card.findById(id);
        if (!card) {
            return res.status(status.NOT_FOUND).json({
                message: "Card not found"
            });
        }
        const { sku, category, sizes, colors, stock, ratings, details } = req.body;
        const title = card.title;
        const description = card.description;
        const price = card.DiscountedPrice ? card.OriginalPrice : null;
        const publicIds = req.files.map(file => file.filename);
        const productImages = publicIds.slice(0, 5);
        const descriptionImages = publicIds.slice(5);
        const categoryId = await Category.findOne({ name: category });
        const product = new Product({
            title: title,
            price: price,
            description: description,
            sku,
            image: productImages,
            cardId: id,
            category: categoryId._id
        });
        await product.save();
        const productid = product._id;
        const stockmodel = new Stock({ stock: stock, ProductId: productid });
        await stockmodel.save();
        const colorData = colors.map(color => color);
        const colorModel = new Color({ code: colorData, ProductId: productid });
        await colorModel.save();
        const sizeData = sizes.map(size => size);
        const sizeModel = new Size({ size: sizeData, ProductId: productid });
        await sizeModel.save();
        const ratingmodel = new Review({ ratings: ratings, ProductId: productid });
        await ratingmodel.save();
        const descriptionmodel = new Description({ details: details, desc_image: descriptionImages, ProductId: productid });
        await descriptionmodel.save();
        return res.status(status.OK).json({
            message: "Product added successfully"
        });
    }
    catch (err) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            message: err.message
        });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            return res.status(status.BAD_REQUEST).json({
                message: "Product id is required"
            });
        } else {
            const product = await Product.findById(id);
            if (!product) {
                return res.status(status.NOT_FOUND).json({
                    message: "Product not found"
                });
            } else {
                const updatedData = { ...req.body };
                if (req.files) {
                    updatedData.image = req.files.map((file) => file.path);
                }
                if (updatedData.sizes) {
                    updatedData.sizes = updatedData.sizes.split(",").map((size) => size.trim());
                }
                if (updatedData.colors) {
                    updatedData.colors = updatedData.colors.split(",").map((color) => color.trim());
                }
                if (updatedData.details) {
                    updatedData.details = updatedData.details;
                }
                if (updatedData.category) {
                    updatedData.category = updatedData.category;
                }
                const product = await Product.findByIdAndUpdate(id, updatedData, { new: true, runValidators: true });
                return res.status(status.OK).json({
                    message: "Product updated successfully",
                    data: product
                });
            }
        }
    }
    catch (err) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            message: err.message
        });
    }
};

exports.allProduct = async (req, res) => {
    try {
        var field = req.query.sort;
        const products = await Product.aggregate([
            {
                $lookup: {
                    from: "sizes",
                    localField: "_id",
                    foreignField: "ProductId",
                    as: "sizeData"
                }
            },
            {
                $lookup: {
                    from: "colors",
                    localField: "_id",
                    foreignField: "ProductId",
                    as: "colorData"
                }
            },
            {
                $lookup: {
                    from: "stocks",
                    localField: "_id",
                    foreignField: "ProductId",
                    as: "stockData"
                }
            },
            {
                $lookup: {
                    from: "reviews",
                    localField: "_id",
                    foreignField: "ProductId",
                    as: "reviewData"
                }
            },
            {
                $lookup: {
                    from: "descriptions",
                    localField: "_id",
                    foreignField: "productId",
                    as: "descriptionData"
                }
            },
            {
                $lookup: {
                    from: "ratings",
                    localField: "_id",
                    foreignField: "productId",
                    as: "ratingData"
                }
            },
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
                    size: { $arrayElemAt: ["$sizeData.size", 0] },
                    color: { $arrayElemAt: ["$colorData.code", 0] },
                    stock: { $arrayElemAt: ["$stockData.stock", 0] },
                    review: { $arrayElemAt: ["$reviewData.ratings", 0] },
                    details: { $arrayElemAt: ["$descriptionData.details", 0] },
                    desc_image: { $arrayElemAt: ["$descriptionData.desc_image", 0] },
                    username: { $arrayElemAt: ["$ratingData.username", 0] },
                    rating: { $arrayElemAt: ["$ratingData.rating", 0] },
                    Userreview: { $arrayElemAt: ["$ratingData.review", 0] },
                    category: { $arrayElemAt: ["$categoryData.name", 0] }
                }
            },
            {
                $project: {
                    title: 1,
                    price: 1,
                    description: 1,
                    sku: 1,
                    category: 1,
                    image: 1,
                    size: 1,
                    color: 1,
                    stock: 1,
                    review: 1,
                    details: 1,
                    desc_image: 1,
                    username: 1,
                    rating: 1,
                    Userreview: 1
                }
            },
            {
                $sort: {
                    [field]: 1
                }
            }
        ]);

        if (!products.length) {
            return res.status(status.NOT_FOUND).json({
                message: "No products found"
            });
        }
        return res.status(status.OK).json({
            message: "All products fetched successfully",
            data: products
        });
    } catch (err) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            message: err.message
        });
    }
};

exports.singleProduct = async (req, res) => {
    try {
        const id = req.params.id;
        const card = await Card.findById(id);
        if (!card) {
            return res.status(status.NOT_FOUND).json({
                message: "Card not found"
            });
        }

        const product = await Product.findOne({ cardId: card._id }).populate('category').lean();
        if (!product) {
            return res.status(status.NOT_FOUND).json({
                message: "Product not found"
            });
        }
        const size = await Size.find({ ProductId: product._id });
        const color = await Color.find({ ProductId: product._id });
        const review = await Review.findOne({ ProductId: product._id });
        const category = product.category.name;
        const description = await Description.find({ productId: product._id });
        const stock = await Stock.findOne({ ProductId: product._id });
        const rating = await UserRating.find({ productId: product._id });
        const items = await Relateditems.find({ productId: product._id });
        items.map((item) => {
            item.image = getFileUrl(item.image);
        });
        const SizeData = size.map((item) => item.size);
        const ColorData = color.map((item) => item.code);
        const CategoryData = category ? category.name : null;
        const DescriptionData = description.map(item => ({
            details: item.details,
            images: item.desc_image
        }));
        const RatingData = rating.map(item => ({
            username: item.username,
            rating: item.rating,
            review: item.review
        }));
        return res.status(status.OK).json({
            message: "Product found",
            data: {
                product,
                SizeData,
                ColorData,
                Category: CategoryData,
                review: review ? review.ratings : null,
                stock: stock ? stock.stock : null,
                DescriptionData,
                RatingData,
                items
            }
        });
    }
    catch (err) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            message: err.message
        });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const id = req.params.id;
        const product = await Product.findById(id);
        if (!product) {
            return res.status(status.NOT_FOUND).json({
                message: "Product not found"
            });
        }
        await Product.findByIdAndDelete(id);
        await Stock.findOneAndDelete({ ProductId: product._id });
        await Color.findOneAndDelete({ ProductId: product._id });
        await Size.findOneAndDelete({ ProductId: product._id });
        await Review.findOneAndDelete({ ProductId: product._id });
        await Description.findOneAndDelete({ ProductId: product._id });
        return res.status(status.OK).json({
            message: "Product deleted successfully"
        });
    } catch (err) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            message: err.message
        });
    }
};

