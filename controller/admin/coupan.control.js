const Discount = require("../../models/discount_coupan.model");
const { status } = require("http-status");

exports.add = async (req, res) => {
    try {
        const { name, amount, startDate, endDate, description } = req.body;
        const discount = new Discount({ name, amount, startDate, endDate, description });
        const result = await discount.save();
        res.status(status.OK).json({
            message: "Coupan added successfully",
            data: result
        });
    }
    catch (err) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            message: err.message
        });
    }
};

exports.updatecoupan = async (req, res) => {
    try {
        const id = req.params.id;
        const discount = await Discount.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        if (!discount) {
            return res.status(status.NOT_FOUND).json({
                message: "Coupon not found"
            });
        }
        res.status(status.OK).json({
            message: "Coupon updated successfully",
            data: discount
        });
    } catch (err) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            message: err.message
        });
    }
};

exports.allcoupan = async (req, res) => {
    try {
        const discount = await Discount.find();
        res.status(status.FOUND).json({
            message: "Coupans fetched successfully",
            data: discount
        });
    }
    catch (err) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            message: err.message
        });
    }
};

exports.singlecoupan = async (req, res) => {
    try {
        const id = req.params.id;
        const discount = await Discount.findById(id);
        if (!discount) {
            return res.status(status.NOT_FOUND).json({
                message: "Coupan not found"
            });
        }
        res.status(status.OK).json({
            message: "Coupan fetched successfully",
            data: discount
        });
    }
    catch (err) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            message: err.message
        });
    }
};

exports.deletecoupan = async (req, res) => {
    try {
        const id = req.params.id;
        const discount = await Discount.findByIdAndDelete(id);
        if (!discount) {
            return res.status(status.NOT_FOUND).json({
                message: "Coupan not found"
            });
        }
        res.status(status.OK).json({
            message: "Coupan deleted successfully",
        });
    }
    catch (err) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            message: err.message
        });
    }
};