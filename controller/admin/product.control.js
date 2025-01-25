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
const Sell = require("../../models/sells.model");

exports.addProduct = async (req, res) => {
    try {
        const { title, description, discount, OriginalPrice, sizes, colors, sku, category, stock, details } = req.body;
        const publicIds = req.files.map(file => file.filename);
        const productImages = publicIds.slice(0, 5);
        const descriptionImages = publicIds.slice(5);
        const singleimage = publicIds.slice(0, 1);
        let parsedDiscount;
        if (discount === "New") {
            parsedDiscount = "New";
        } else {
            parsedDiscount = parseInt(discount);
            if (isNaN(parsedDiscount) || parsedDiscount < 0 || parsedDiscount > 100) {
                return res.status(status.BAD_REQUEST).json({
                    message: "Discount must be 'New' or a number between 0 and 100"
                });
            }
        }
        let DiscountedPrice = parsedDiscount !== "New" ? (OriginalPrice - (OriginalPrice * parsedDiscount) / 100) : null;
        const categoryDoc = await Category.findOne({ name: category });
        if (!categoryDoc) {
            return res.status(404).json({ message: "Category not found" });
        }
        const card = new Card({ title, description, discount: parsedDiscount, OriginalPrice, DiscountedPrice: DiscountedPrice, image: singleimage });
        await card.save();
        let price;
        if (DiscountedPrice) {
            price = DiscountedPrice;
        } else {
            price = OriginalPrice;
        }
        // const price = DiscountedPrice ? OriginalPrice : null;
        const product = new Product({
            title: title,
            price: price,
            description: description,
            sku,
            image: productImages,
            cardId: card._id,
            category: categoryDoc._id
        });
        await product.save();
        const productid = product._id;
        const stockmodel = new Stock({ stock: stock, ProductId: productid });
        await stockmodel.save();
        let sizeData;
        if (Array.isArray(sizes)) {
            sizeData = sizes;
        } else if (typeof sizes === "string") {
            try {
                sizeData = JSON.parse(sizes);
            } catch (error) {
                sizeData = sizes.split(',').map(size => size.trim());
            }
        }
        const sizeModel = new Size({ size: sizeData, ProductId: productid });
        await sizeModel.save();
        let colorData;
        if (Array.isArray(colors)) {
            colorData = colors;
        } else if (typeof colors === "string") {
            try {
                colorData = JSON.parse(colors);
            } catch (error) {
                colorData = colors.split(',').map(color => color.trim());
            }
        }
        const colorModel = new Color({ code: colorData, ProductId: productid });
        await colorModel.save();
        // const ratingmodel = new Review({ ratings: ratings, ProductId: productid });
        // await ratingmodel.save();
        const descriptionModel = new Description({ details, desc_image: descriptionImages, productId: productid });
        await descriptionModel.save();
        return res.status(status.OK).json({
            message: "Product added successfully"
        });
    }
    catch (err) {
        console.log(err);
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            message: err.message
        });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const id = req.params.id;
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }
        const { title, description, discount, OriginalPrice, sizes, colors, sku, category, stock, details } = req.body;
        const updatedData = {};
        if (req.files && req.files.length > 0) {
            const publicIds = req.files.map(file => file.filename);
            updatedData.image = publicIds.slice(0, 5);
            updatedData.singleimage = publicIds.slice(0, 1);
            updatedData.desc_image = publicIds.slice(5);
        }
        let DiscountedPrice;
        let parsedDiscount;
        if (discount) {
            if (discount === "New") {
                parsedDiscount = "New";
            } else {
                parsedDiscount = parseInt(discount);
                if (isNaN(parsedDiscount) || parsedDiscount < 0 || parsedDiscount > 100) {
                    return res.status(400).json({
                        message: "Discount must be 'New' or a number between 0 and 100"
                    });
                }
            }
            DiscountedPrice = parsedDiscount !== "New" ? (OriginalPrice - (OriginalPrice * parsedDiscount) / 100) : null;
        }
        await Card.findOneAndUpdate(
            { _id: product.cardId }, {
            title,
            description,
            discount: parsedDiscount,
            OriginalPrice: OriginalPrice,
            DiscountedPrice,
            image: updatedData.singleimage || product.image
        }, { new: true, runValidators: true });
        const categoryDoc = await Category.findOne({ name: category });
        if (!categoryDoc) {
            return res.status(404).json({
                message: "Category not found"
            });
        }
        updatedData.title = title;
        // if (DiscountedPrice) {
        //     updatedData.price = DiscountedPrice;
        // } else {
        // }
        updatedData.price = OriginalPrice;
        updatedData.description = description;
        updatedData.sku = sku;
        updatedData.category = categoryDoc._id;
        const updatedProduct = await Product.findByIdAndUpdate(id, updatedData, { new: true, runValidators: true });
        if (stock !== undefined) {
            await Stock.findOneAndUpdate({ ProductId: id }, { stock }, { new: true, runValidators: true });
        }
        if (sizes) {
            const sizeData = Array.isArray(sizes) ? sizes : sizes.split(',').map(size => size.trim());
            await Size.findOneAndUpdate({ ProductId: id }, { size: sizeData }, { new: true, runValidators: true });
        }
        if (colors) {
            const colorData = Array.isArray(colors) ? colors : colors.split(',').map(color => color.trim());
            await Color.findOneAndUpdate({ ProductId: id }, { code: colorData }, { new: true, runValidators: true });
        }
        if (details || updatedData.desc_image) {
            const descUpdate = {};
            if (details) descUpdate.details = details;
            if (updatedData.desc_image) descUpdate.desc_image = updatedData.desc_image;
            await Description.findOneAndUpdate({ ProductId: id }, descUpdate, { new: true, runValidators: true });
        }
        return res.status(status.OK).json({
            message: "Product updated successfully",
            data: updatedProduct
        });
    } catch (err) {
        console.error(err);
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            message: err.message
        });
    }
};

exports.allProduct = async (req, res) => {
    try {
        var field = req.query.sort || "title";
        const product = await Product.aggregate([
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
                $lookup: {
                    from: "sells",
                    localField: "title",
                    foreignField: "name",
                    as: "sellData"
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
                    category: { $arrayElemAt: ["$categoryData.name", 0] },
                    totalSell: { $arrayElemAt: ["$sellData.quantity", 0] } || 0
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
                    Userreview: 1,
                    totalSell: 1
                }
            },
            {
                $sort: {
                    [field]: 1
                }
            }
        ]);

        if (!product.length) {
            return res.status(404).json({
                message: "No products found"
            });
        }
        const updatedProducts = product.map(prod => {
            const imagesWithUrl = prod.image && Array.isArray(prod.image) ? prod.image.map(img => getFileUrl(img)) : [];
            return { ...prod, image: imagesWithUrl };
        });
        return res.status(200).json({
            message: "All products fetched successfully",
            data: updatedProducts,
            total: updatedProducts.length
        });
    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
};

exports.singleProduct = async (req, res) => {
    try {
        const id = req.params.id;
        const product = await Product.findById(id).populate('category').lean();
        if (!product) {
            return res.status(status.NOT_FOUND).json({
                message: "Product not found"
            });
        };
        product.image = getFileUrl(product.image);
        const card = await Card.findOne({ title: product.title });
        const discount = card.discount;
        const OriginalPrice = card.OriginalPrice;
        const size = await Size.find({ ProductId: product._id });
        const color = await Color.find({ ProductId: product._id });
        const review = await Review.findOne({ ProductId: product._id });
        const category = product.category.name;
        const description = await Description.find({ productId: product._id });
        const stock = await Stock.findOne({ ProductId: product._id });
        // const items = await Relateditems.find({ productId: product._id });
        // items.map((item) => {
        //     item.image = getFileUrl(item.image);
        // });
        const SizeData = size.map((item) => item.size);
        const ColorData = color.map((item) => item.code);
        const CategoryData = category ? category.name : null;
        const DescriptionData = description.map(item => ({
            details: item.details,
            images: item.desc_image
        }));
        DescriptionData.map((item) => {
            item.images = item.images.map(img => getFileUrl(img));
        });
        return res.status(status.OK).json({
            message: "Product found",
            data: [{
                product,
                discount,
                OriginalPrice,
                SizeData,
                ColorData,
                Category: CategoryData,
                review: review ? review.ratings : null,
                stock: stock ? stock.stock : null,
                DescriptionData,
            }]
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
        const cardId = product.cardId;
        await Card.findByIdAndDelete({ _id: cardId });
        await Stock.findOneAndDelete({ ProductId: product._id });
        await Color.findOneAndDelete({ ProductId: product._id });
        await Size.findOneAndDelete({ ProductId: product._id });
        await Review.findOneAndDelete({ ProductId: product._id });
        await Description.findOneAndDelete({ ProductId: product._id });
        await Product.findByIdAndDelete(id);
        return res.status(status.OK).json({
            message: "Product deleted successfully"
        });
    } catch (err) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            message: err.message
        });
    }
};
