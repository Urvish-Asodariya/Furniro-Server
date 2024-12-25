const Contact = require("../../models/contact.model");
const NotificationController = require("./notification.control");
const { status } = require("http-status");

exports.add = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        const contact = new Contact({ name, email, subject, message });
        await contact.save();
        return res.status(status.OK).json({
            message: "Contact added successfully",
        });
    }
    catch (err) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            message: err.message
        });
    }
};

exports.all = async (req, res) => {
    try {
        const contacts = await Contact.find();
        return res.status(status.OK).json({
            message: "All Contacts retrieved successfully",
            data: contacts
        });
    }
    catch (err) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            message: err.message
        });
    }
};

exports.single = async (req, res) => {
    try {
        const userId = req.params.id;
        const contact = await Contact.findOne({ userId: userId });
        if (!contact) {
            return res.status(status.NOT_FOUND).json({
                message: "Contact not found"
            });
        }
        return res.status(status.OK).json({
            message: "Contact retrieved successfully",
            data: contact
        });
    }
    catch (err) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            message: err.message
        });
    }
};

exports.delete = async (req, res) => {
    try {
        const userId = req.params.id;
        const contact = await Contact.findOneAndDelete({ userId: userId });
        if (!contact) {
            return res.status(status.NOT_FOUND).json({
                message: "Contact not found"
            });
        }
        return res.status(status.OK).json({
            message: "Contact deleted successfully"
        });
    }
    catch (err) {
        return res.status(status.OK).json({
            message: err.message
        });
    }
};