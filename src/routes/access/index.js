const express = require('express');
const AccessController = require('../../controllers/access.controller');
const { asyncHandler } = require('../../helper/asynchandler');
const { authentication } = require('../../auth/authUtils');
const router = express.Router();


router.post('/shop/signup', asyncHandler(AccessController.signUp))
router.post('/shop/login', asyncHandler(AccessController.login));

router.use(authentication);
router.post('/shop/logout', asyncHandler(AccessController.logout));
router.post('/shop/handRefreshTolen', asyncHandler(AccessController.handRefreshTolen));

module.exports = router;