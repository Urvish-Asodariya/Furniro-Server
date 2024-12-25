const User = require("../../models/user.model");
const { status } = require("http-status");

exports.profile = async (req, res) => {
    try {
        const id = req.user._id
        const user = await User.findById(id);
        if (!user) {
            return res.status(status.NOT_FOUND).json({
                message: "User not found"
            });
        }
        return res.status(status.OK).json({
            message: "User found",
            data: user
        });
    }
    catch (err) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            message: err.message
        });
    }
};

exports.update = async (req, res) => {
    try {
        const { email, name, mobile, address, zipcode, city, state, country } = req.body;
        if (!validator.isEmail(email)) {
            return res.status(status.BAD_REQUEST).json({ message: "Invalid email format" });
        }
        const id = req.user._id
        const user = await User.findById(id);
        if (!user) {
            return res.status(status.NOT_FOUND).json({
                message: "User not found"
            });
        } else {
            const updatedUser = await User.findByIdAndUpdate(user._id, { name, mobile, address, zipcode, city, state, country }, { new: true, runValidators: true });
            return res.status(status.OK).json({
                message: "User updated successfully"
            });
        }
    }
    catch (err) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            message: err.message
        });
    }
};

exports.changepassword = async (req, res) => {
    try {
        const id = req.user._id;
        const user = await User.findById(id);
        if (!user) {
            return res.status(status.NOT_FOUND).json({
                message: "User not found"
            });
        }
        const { oldPassword, newPassword, confirmPassword } = req.body;
        if (newPassword !== confirmPassword) {
            return res.status(status.BAD_REQUEST).json({
                message: "Passwords do not match"
            });
        }
        const isValidPassword = await bcrypt.compare(oldPassword, user.password);
        if (!isValidPassword) {
            return res.status(status.BAD_REQUEST).json({
                message: "Invalid old password"
            });
        };
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();
        return res.status(status.OK).json({
            message: "Password updated successfully"
        });
    }
    catch (err) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            message: err.message
        });
    }
};


exports.addWallet = async (req, res) => {
    try {
        const id = req.user._id;
        const user = await User.findById(id);
        if (!user) {
            return res.status(status.NOT_FOUND).json({
                message: "User not found"
            });
        }
        const { wallet } = req.body;
        user.wallet = wallet;
        await user.save();
        return res.status(status.OK).json({
            message: "Wallet added successfully"
        });
    }
    catch (err) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            message: err.message
        });
    }
};

