const express = require('express');
const discountController = require('../../controllers/discount.controller');
const { asyncHandler } = require('../../helper/asynchandler');
const { authentication } = require('../../auth/authUtils');
const router = express.Router();

router.get('/amount', asyncHandler(discountController.getAllDiscountAmount));
router.get('/list_product_code', asyncHandler(discountController.getAllDiscountCodesWithProducts));

router.use(authentication);
router.post('', asyncHandler(discountController.createDiscountCode));
router.get('', asyncHandler(discountController.getAllDiscountCodes));
module.exports = router;