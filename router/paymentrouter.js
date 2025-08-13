const express = require('express');
const payrouter = express.Router();
const paymentcontroller = require('../controllers/paymentcontroller');
const webhookController = require('../controllers/webhookcontroller');

payrouter.post('/checkout', paymentcontroller.createcheckout);
payrouter.post('/webhook', webhookController.handleWebhook); // webhook endpoint

module.exports = payrouter;
