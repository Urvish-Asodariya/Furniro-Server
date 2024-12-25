const Admin = require("../../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { status } = require("http-status");

exports.register = async (req, res) => {
    try {
        const { name, mobile, email, address, zipcode, city, state, country, password } = req.body;
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(status.CONFLICT).json({
                message: "Email already exists",
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const admin = new Admin({ name, mobile, email, address, zipcode, city, state, country, password: hashedPassword, role: "admin" });
        await admin.save();
        return res.status(status.OK).json({
            message: "Admin created successfully",
        });
    }
    catch (err) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            message: err.message
        });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(status.BAD_REQUEST).json({
                message: "Email and password are required",
            });
        }
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(status.UNAUTHORIZED).json({
                message: "Invalid email"
            });
        }
        if (admin.role !== "admin") {
            return res.status(status.UNAUTHORIZED).json({
                message: "You are not an admin",
            });
        }
        const isValidPassword = await bcrypt.compare(password, admin.password);
        if (!isValidPassword) {
            return res.status(status.UNAUTHORIZED).json({
                message: "Invalid password"
            });
        } else {
            const token = jwt.sign({ id: admin._id }, process.env.SECRET_KEY, { expiresIn: "1h" });
            const option = {
                httpOnly: true,
                maxAge: 3600000,
                secure: process.env.NODE_ENV === "production" ? true : false,
                sameSite: "strict",
                path: "/admin"
            };
            res.cookie("TOKEN", token, option);
            return res.status(status.OK).json({
                message: "Admin logged in successfully",
                token: token,
                expiresIn: "1h"
            });
        }
    }
    catch (err) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            message: err.message
        });
    }
};

exports.changePass = async (req, res) => {
    try {
        const { email, oldpassword, newpassword } = req.body;
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(status.FOUND).json({
                message: "Admin not found",
            });
        }
        const isValidPassword = await bcrypt.compare(oldpassword, admin.password);
        if (!isValidPassword) {
            return res.status(status.UNAUTHORIZED).json({
                message: "Invalid old password"
            });
        }
        if (oldpassword === newpassword) {
            return res.status(status.BAD_REQUEST).json({
                message: "New password must be different from the old password"
            });
        }
        const hashedPassword = await bcrypt.hash(newpassword, 10);
        admin.password = hashedPassword;
        await admin.save();
        return res.status(status.OK).json({
            message: "Password changed successfully",
        });
    }
    catch (err) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            message: err.message
        });
    }
};

exports.logout = async (req, res) => {
    try {
        res.clearCookie("TOKEN", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict"
        });

        return res.status(status.OK).json({
            message: "Logged out successfully"
        });
    }
    catch (err) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            message: err.message
        });
    }
};
