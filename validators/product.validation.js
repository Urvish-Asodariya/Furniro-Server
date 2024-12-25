const Joi = require("joi");
const Schema = Joi.object({
    sku: Joi.string().required({
        messages: {
            "string.empty": "Sku is required",
        }
    }),
    category: Joi.string().required({
        messages: {
            "string.empty": "Category is required",
        }
    })
});
exports.validateProduct = (req, res, next) => {
    const { error } = Schema.validate(req.body);
    if (error) {
        const err = {
            status: error.status,
            message: error.details[0].message
        };
        return res.json(err);
    }
    next();
};