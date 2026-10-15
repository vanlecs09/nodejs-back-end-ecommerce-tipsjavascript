const express = require('express');
const ProductController = require('../../controllers/product.controller');
const { asyncHandler } = require('../../helper/asynchandler');
const { authentication } = require('../../auth/authUtils');
const router = express.Router();

router.get('/search/:keySearch', asyncHandler(ProductController.getListSearchProduct));
router.get('', asyncHandler(ProductController.findAllProducts));
router.get('/:productId', asyncHandler(ProductController.findProduct));

router.use(authentication);
router.post('', asyncHandler(ProductController.createProduct));
router.patch('/:productId', asyncHandler(ProductController.updateProduct));
router.post('/published/:id', asyncHandler(ProductController.publishProductByShop));
router.post('/unPublished/:id', asyncHandler(ProductController.unPublishProductByShop));
// QUERY
router.get('/draft/all', asyncHandler(ProductController.getAllDraftsForShop));
router.get('/published/all', asyncHandler(ProductController.getAllPublishedForShop));
module.exports = router;