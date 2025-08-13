const Payment = require('../models/paymentmodel');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.createcheckout = async (req, res) => {
    try {
        const { item } = req.body;
        const totalprice = item.reduce((acc, cur) => acc + (cur.price * cur.quantity), 0);

        // Create payment in DB as pending
        const payment = await Payment.create({ items: item, totalamount: totalprice, status: 'pending' });

        const line_items = item.map(item => ({
            price_data: {
                currency: 'inr',
                product_data: { name: item.name },
                unit_amount: item.price * 100
            },
            quantity: item.quantity
        }));

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items,
            mode: 'payment',
            client_reference_id: payment._id.toString(), // store Payment ID
            success_url: 'https://paymentcart.vercel.app/success',
            cancel_url: 'https://paymentcart.vercel.app/failed'
        });

        res.json({ url: session.url });
    } catch (error) {
        console.log(error.message);
        res.status(500).json(error.message);
    }
};
