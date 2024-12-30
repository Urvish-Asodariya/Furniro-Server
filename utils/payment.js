const stripe = require("stripe")(process.env.STRIPE_KEY);

exports.payment = async ({ username, email, products, totalAmount }) => {
    try {
        if (!username || !email || !products || !totalAmount) {
            return {
                status: 400,
                message: "All fields are required",
            };
        }
        const existingCustomers = await stripe.customers.list({ email });
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
            line_items: products.map(product => ({
                price_data: {
                    currency: "inr",
                    product_data: {
                        name: product.name,
                    },
                    unit_amount: product.amount,
                },
                quantity: product.quantity,
            })),
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
