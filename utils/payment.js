const stripe = require("stripe")(process.env.STRIPE_KEY);
exports.payment = async ({ username, email, product, quantity, amount }) => {
    try {
        if (!username || !email || !product || !quantity || !amount) {
            return {
                status: 400,
                message: "All fields are required"
            };
        }
        const existingCustomers = await stripe.customers.list({ email: email });
        let customer;
        if (existingCustomers.data.length > 0) {
            customer = existingCustomers.data[0];
        } else {
            customer = await stripe.customers.create({
                name: username,
                email: email,
            });
        }
        if (!customer) {
            return {
                status: 400,
                message: "Customer creation failed",
            };
        }
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            customer: customer.id,
            line_items: [
                {
                    price_data: {
                        currency: "inr",
                        product_data: {
                            name: product,
                        },
                        unit_amount: parseInt(amount) * 100,
                    },
                    quantity: parseInt(quantity),
                },
            ],
            mode: "payment",
            success_url: process.env.SUCCESS_URL,
            cancel_url: process.env.CANCEL_URL,
        });

        return { sessionId: session.id };
    } catch (err) {
        return {
            status: err.status || 500,
            message: err.message || "Payment creation failed",
        };
    }
};
