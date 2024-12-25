const Joi = require("joi");
const Schema = Joi.object({
    name: Joi.string().required({
        messages: {
            "string.empty": "Name is required"
        }
    }),
    price: Joi.number().required({
        messages: {
            "number.empty": "Price is required"
        }
    }),
    quantity: Joi.number().required({
        messages: {
            "number.empty": "Quantity is required"
        }
    }),
    subtotal: Joi.number().required({
        messages: {
            "number.empty": "Subtotal is required"
        }
    })
});

exports.validateCart = (req, res, next) => {
    const { error } = Schema.validate(req.body);
    if (error) {
        const err = {
            status: error.status,
            message: error.details[0].message
        };
        return res.json(err);
    }
    next();
}