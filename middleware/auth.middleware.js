const jwt = require('jsonwebtoken');
const User = require("../models/user.model");
const { status } = require("http-status");

exports.auth = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) {
        return res.status(status.UNAUTHORIZED).json({
            message: 'Access denied. No token provided.'
        });
    }

    try {
        const verified = jwt.verify(token, process.env.SECRET_KEY);
        req.user._id = verified.userId;
        req.admin = { _id: verified.id };
        next();
    } catch (err) {
        return res.status(status.BAD_REQUEST).json({
            message: "Invalid token"
        });
    }
};

exports.isadmin = async (req, res, next) => {
    try {
        const id = req.admin;
        const admin = await User.findById(id);
        if (!admin || admin.role?.toLowerCase() !== "admin") {
            return res.status(status.UNAUTHORIZED).json({
                message: "You are not an admin"
            });
        }
        next();
    } catch (err) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "Error fetching user information."
        });
    }
};
