const Product = require("../../models/product.model");
const Card = require("../../models/card.model");
const Size = require("../../models/size.model");
const Color = require("../../models/color.model");
const Stock = require("../../models/stock.model");
const Review = require("../../models/review.model");
const Description = require("../../models/description.model");
const UserRating = require("../../models/userratings.model");
const { getFileUrl } = require("../../utils/cloudinaryConfig");
const Category = require("../../models/category.model");
const { status } = require("http-status");

exports.allProduct = async (req, res) => {
    try {
        // const { field, min, max } = req.query;
        // if (min && isNaN(min)) {
        //     return res.status(status.BAD_REQUEST).json({
        //         message: "'min' must be a number"
        //     });
        // }
        // if (max && isNaN(max)) {
        //     return res.status(status.BAD_REQUEST).json({
        //         message: "'max' must be a number"
        //     });
        // }
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
            // {
            //     $match: {
            //         price: {
            //             $gte: min,
            //             $lte: max
            //         }
            //     }
            // },
            // {
            //     $sort: {
            //         [field || 'price']: 1
            //     }
            // }
        ]);
        if (!products.length) {
            return res.status(status.NOT_FOUND).json({
                message: "No products found",
                status: 404
            });
        }
        const updatedProducts = products.map(prod => {
            const imagesWithUrl = prod.image && Array.isArray(prod.image) ? prod.image.map(img => getFileUrl(img)) : [];
            return { ...prod, image: imagesWithUrl };
        });
        return res.status(status.OK).json({
            message: "All products retrieved successfully",
            data: updatedProducts
        });
    } catch (err) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            message: err.message,
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
        product.image = product.image.map(img => getFileUrl(img));
        const size = await Size.find({ ProductId: product._id });
        const color = await Color.find({ ProductId: product._id });
        const review = await Review.findOne({ ProductId: product._id });
        const category = product.category.name;
        const description = await Description.find({ productId: product._id });
        const stock = await Stock.findOne({ ProductId: product._id });
        const rating = await UserRating.find({ productId: product._id });
        const SizeData = size.map((item) => item.size);
        const ColorData = color.map((item) => item.code);
        const CategoryData = category ? category : null;
        const DescriptionData = description.map(item => ({
            details: item.details,
            images: item.desc_image
        }));
        DescriptionData.map((item) => {
            item.images = item.images.map(img => getFileUrl(img));
        });
        const RatingData = rating.map(item => ({
            username: item.username,
            rating: item.rating,
            review: item.review
        }));
        // const updatedProducts = product.map(prod => {
        //     const imagesWithUrl = prod.image && Array.isArray(prod.image) ? prod.image.map(img => getFileUrl(img)) : [];
        //     return { ...prod, image: imagesWithUrl };
        // });
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
            }
        });
    }
    catch (err) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            message: err.message
        });
    }
};

exports.listcategory = async (req, res) => {
    try {
        const category = await Category.find();
        return res.status(status.OK).json({
            message: "Category found",
            data: category
        });
    }
    catch (err) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            message: err.message
        });
    }
};

exports.similar = async (req, res) => {
    try {
        const id = req.params.id;
        const product = await Product.findById(id);
        if (!product) {
            return res.status(status.NOT_FOUND).json({
                message: "Product not found"
            });
        }
        const category = product.category;
        const similar = await Product.find({ category: category, _id: { $ne: id } }).limit(5).lean();
        if (!similar.length) {
            return res.status(status.NOT_FOUND).json({
                message: "No similar products found"
            });
        }
        const card = await Card.find({ _id: similar.map(item => item.cardId) });
        return res.status(status.OK).json({
            message: "Similar products found",
            data: card
        });
    }
    catch (err) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            message: err.message
        });
    }
};