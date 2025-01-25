const Joi = require("joi");
const schema = Joi.object({
    password: Joi.string()
        .length(6)
        .regex(/^[0-9A-Za-z]{6}$/)
        .message("Password must be exactly 6 hexadecimal characters (0-9, A-F)."),

});
exports.validateUser = (req, res, next) => {
    const { error } = schema.validate(req.body);

    if (error) {
        const err = {
            status: error.status,
            message: error.details[0].message
        };
        return res.json(err);
    }
    next();
};
