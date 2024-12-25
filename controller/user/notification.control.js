const Notification = require("../../models/notification.model");
const { status } = require("http-status");

exports.sendNotification = async (userId, message, title) => {
    try {
        const newNotification = new Notification({ userId, message, title });
        await newNotification.save();
        return {
            status: true,
            message: "Notification sent successfully",
            data: message
        };
    } catch (err) {
        return {
            status: status.INTERNAL_SERVER_ERROR,
            message: err.message,
            stack: err.stack
        };
    }
};

exports.list = async (req, res) => {
    try {
        const userId = req.user._id;
        const notifications = await Notification.find({ userId: userId });
        if (!notifications || notifications.length === 0) {
            return res.status(status.NOT_FOUND).json({
                message: "No notifications found"
            });
        }
        return res.status(status.OK).json({
            message: "Notifications found",
            data: notifications
        });
    } catch (err) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            message: err.message
        });
    }
};

exports.read_notifications = async (req, res) => {
    try {
        const userId = req.user._id;
        const notification = await Notification.findOne({ userId: userId });
        if (!notification) {
            return res.status(status.NOT_FOUND).json({
                message: "No notifications found"
            });
        }
        const updatedNotification = await Notification.findByIdAndUpdate(notification._id, { $set: { read: true } }, { new: true, runValidators: true });
        return res.status(status.OK).json({
            message: "Notification marked as read",
            data: updatedNotification
        });
    } catch (err) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            message: err.message
        });
    }
};
