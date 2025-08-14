const express = require('express');
const payrouter = express.Router();
const paymentcontroller = require('../controllers/paymentcontroller');


payrouter.post('/checkout', paymentcontroller.createcheckout);


module.exports = payrouter;
