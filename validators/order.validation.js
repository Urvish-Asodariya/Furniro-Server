const Joi = require("joi");
const Schema = Joi.object({
    username: Joi.string().required({
        messages: {
            "string.empty": "Username is required",
        }
    }),
    productname: Joi.string().required({
        messages: {
            "string.empty": "Product name is required",
        }
    }),
    price: Joi.number().required({
        messages: {
            "number.empty": "Price is required",
        }
    }),
    quantity: Joi.number().required({
        messages: {
            "number.empty": "Quantity is required",
        }
    })
});
exports.validateOrder = (req, res, next) => {
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