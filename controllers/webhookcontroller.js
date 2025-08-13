const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Payment = require('../models/paymentmodel');

exports.handleWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];

    let event;
    try {
        event = stripe.webhooks.constructEvent(
            req.body, // raw body (express.raw middleware required)
            sig,
            process.env.STRIPE_WEBHOOK_SECRET // from Stripe dashboard
        );
    } catch (err) {
        console.error(`Webhook Error: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;

        // Update payment status to paid
        await Payment.findByIdAndUpdate(session.client_reference_id, { status: 'paid' });
    }

    if (event.type === 'checkout.session.expired') {
        const session = event.data.object;
        await Payment.findByIdAndUpdate(session.client_reference_id, { status: 'cancelled' });
    }

    res.json({ received: true });
};
