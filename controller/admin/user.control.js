const User = require("../../models/user.model");
const { status } = require("http-status");

exports.alluser = async (req, res) => {
    try {
        const field = req.query.field || 'name';
        const users = await User.aggregate([
            {
                $sort: {
                    [field]: 1
                }
            }
        ]);
        return res.status(status.OK).json({
            message: "All users fetched successfully",
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


exports.updateuser = async (req, res) => {
    try {
        const status = req.body.status
        if (!status) {
            return res.status(status.BAD_REQUEST).json({
                message: "Status is required"
            });
        }
        const userId = req.params.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(status.NOT_FOUND).json({
                message: "User not found"
            });
        }
        await User.findByIdAndUpdate(userId, { $set: { status: status } }, { new: true, runValidators: true });
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