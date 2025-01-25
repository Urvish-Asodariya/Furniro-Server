const User = require("../../models/user.model");
const { status } = require("http-status");
const bcrypt = require("bcryptjs");
const validator = require("validator");

exports.addUser = async (req, res) => {
    try {
        const { firstname, lastname, mobile, email, address, zipcode, city, state, country, password } = req.body;
        if (!validator.isEmail(email)) {
            return res.status(status.BAD_REQUEST).json({
                message: "Invalid email format"
            });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(status.CONFLICT).json({
                message: "Email already in use"
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ firstname, lastname, mobile, email, address, zipcode, city, state, country, password: hashedPassword });
        await user.save();
        return res.status(status.OK).json({
            message: "User created successfully"
        });
    }
    catch (err) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            message: err.message
        });
    }
};

exports.alluser = async (req, res) => {
    try {
        const field = req.query.field || 'name';
        const total = await User.countDocuments();
        const users = await User.aggregate([
            {
                $sort: {
                    [field]: 1
                }
            },
            {
                $match: {
                    role: "user"
                }
            }
        ]);
        return res.status(status.OK).json({
            message: "All users fetched successfully",
            total: total,
            data: users
        });
    }
    catch (err) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            message: err.message
        });
    }
};

exports.singleuser = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findById(id);
        if (!user) {
            return res.status(status.NOT_FOUND).json({
                message: "User not found"
            });
        }
        return res.status(status.OK).json({
            message: "User fetched successfully",
            data: user
        });
    }
    catch (err) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            message: err.message
        });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        if (!user) {
            return res.status(status.NOT_FOUND).json({
                message: "User not found"
            });
        }
        return res.status(status.OK).json({
            message: "User updated"
        });
    }
    catch (err) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            message: err.message
        });
    }
};

exports.changeStatus = async (req, res) => {
    try {
        const statuses = req.query.status
        if (!status) {
            return res.status(status.BAD_REQUEST).json({
                message: "Status is required"
            });
        }
        const id = req.params.id;
        const user = await User.findById(id);
        if (!user) {
            return res.status(status.NOT_FOUND).json({
                message: "User not found"
            });
        }
        await User.findByIdAndUpdate(id, { $set: { status: statuses } }, { new: true, runValidators: true });
        return res.status(status.OK).json({
            message: "User updated successfully",
            data: user
        });
    }
    catch (err) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            message: err.message
        });
    }
};
exports.deleteuser = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findById(id);
        if (!user) {
            return res.status(status.NOT_FOUND).json({
                message: "No such user exists"
            });
        }
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
            return res.status(status.INTERNAL_SERVER_ERROR).json({
                message: "Error deleting user"
            });
        }
        return res.status(status.OK).json({
            message: "User deleted successfully"
        });
    }
    catch (err) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            message: err.message
        });
    }
};
