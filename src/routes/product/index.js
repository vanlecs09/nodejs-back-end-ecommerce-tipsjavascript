const express = require('express');
const ProductController = require('../../controllers/product.controller');
const { asyncHandler } = require('../../helper/asynchandler');
const { authentication } = require('../../auth/authUtils');
const router = express.Router();


router.use(authentication);
router.post('', asyncHandler(ProductController.createProduct));

module.exports = router;