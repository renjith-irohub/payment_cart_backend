const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Payment = require('../models/paymentmodel');



exports.handleWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];

    let event;
    
    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        console.error(`Webhook Error: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle different event types
    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object;
            console.log(`Updating payment ${session.client_reference_id} to paid`);
            await Payment.findByIdAndUpdate(session.client_reference_id, { 
                status: 'paid',
                stripeSessionId: session.id 
            });
            break;
            
        case 'checkout.session.expired':
            const expiredSession = event.data.object;
            console.log(`Updating payment ${expiredSession.client_reference_id} to cancelled`);
            await Payment.findByIdAndUpdate(expiredSession.client_reference_id, { 
                status: 'cancelled',
                stripeSessionId: expiredSession.id 
            });
            break;
            
        default:
            console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
};
