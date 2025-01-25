const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/user.model");
const nodemailer = require("nodemailer");
const NotificationController = require("./notification.control");
const { status } = require("http-status");
const validator = require("validator");
var randomstring = require("randomstring");

exports.register = async (req, res) => {
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

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!validator.isEmail(email)) {
            return res.status(status.BAD_REQUEST).json({
                message: "Invalid email format"
            });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(status.UNAUTHORIZED).json({
                message: "Invalid email"
            });
        } else {
            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) {
                return res.status(status.UNAUTHORIZED).json({
                    message: "Invalid password"
                });
            } else {
                const userId = user._id
                const token = jwt.sign({ userId }, process.env.SECRET_KEY, { expiresIn: "1h" });
                NotificationController.sendNotification({
                    userId: user._id,
                    title: "Login Success",
                    message: "You have logged in successfully"
                });
                const option = {
                    httpOnly: true,
                    maxAge: 3600000,
                    secure: process.env.NODE_ENV,
                    sameSite: "strict"
                };
                res.cookie("TOKEN", token, option);
                return res.status(status.OK).json({
                    message: "User logged in successfully",
                    token: token,
                    role: user.role
                });
            }
        }
    }
    catch (err) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            message: err.message
        });
    }
};

exports.ForgetPass = async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        if (!validator.isEmail(email)) {
            return res.status(status.BAD_REQUEST).json({
                message: "Invalid email format"
            });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(status.UNAUTHORIZED).json({
                message: "Invalid email"
            });
        } else {
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            user.password = hashedPassword;
            await user.save();
            return res.status(status.OK).json({
                message: "Password changed successfully"
            });
        }
    }
    catch (err) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            message: err.message
        });
    }
};

exports.resetPass = async (req, res) => {
    try {
        const email = req.body.email;
        if (!validator.isEmail(email)) {
            return res.status(status.BAD_REQUEST).json({ message: "Invalid email format" });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(status.UNAUTHORIZED).json({
                message: "Invalid email"
            });
        } else {
            const otp = randomstring.generate({
                length: 6,
                charset: 'numeric'
            });
            await User.findOneAndUpdate({ email }, { otp: otp }, { new: true, runvalidators: true });
            let transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.PASSWORD
                },
            });

            let mailOptions = {
                from: process.env.EMAIL,
                to: email,
                subject: "🔒 Reset Your Password - Quick & Easy!",
                html: `<h3><pre>Hello,
                     We received a request to reset your password. Don't worry, we've got you covered! Click the link below to set up a new password:
                🔗 Reset Your Password: ${process.env.BASE_URL}/user/reset;<br>
                <h1> ${otp} </h1>
                    If you didn't request a password reset, please ignore this email or contact us if you have any concerns.
                Best regards,
                The Support Team
                </pre></h3>`,
            };
            await transporter.sendMail(mailOptions);
            return res.status(status.OK).json({
                message: "Email sent successfully",
                otp: otp
            });
        }
    }
    catch (err) {
        console.log(err);
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            message: err.message
        });
    }
};

exports.newpass = async (req, res) => {
    try {
        const id = req.user._id
        const { newpassword, confirmpassword, otp } = req.body;
        console.log(newpassword);
        const users = await User.findById(id);
        if (!users) {
            return res.status(status.NOT_FOUND).json({
                message: "User not found"
            });
        } else {
            if (users.otp != otp) {
                return res.status(status.UNAUTHORIZED).json({
                    message: "Invalid OTP"
                });
            } else {
                if (await bcrypt.compare(newpassword, users.password)) {
                    console.log(newpassword, users.password);
                    return res.status(status.BAD_REQUEST).json({
                        message: "Password already exists"
                    });
                }
                if (newpassword !== confirmpassword) {
                    return res.status(status.UNAUTHORIZED).json({
                        message: "Passwords do not match"
                    });
                } else {
                    const hashedPassword = await bcrypt.hash(newpassword, 10);
                    users.password = hashedPassword;
                    await users.save();
                    return res.status(status.OK).json({
                        message: "Password changed successfully"
                    });
                }
            }
        }
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
            secure: true,
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