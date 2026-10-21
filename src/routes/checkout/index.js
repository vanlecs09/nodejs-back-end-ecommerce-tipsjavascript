const express = require('express');
const checkOutController = require('../../controllers/checkout.controller');
const { asyncHandler } = require('../../helper/asynchandler');
const router = express.Router();

router.post('/review', asyncHandler(checkOutController.checkoutReview));



module.exports = router;