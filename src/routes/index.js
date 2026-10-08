const express = require('express');
const { apiKey, permission } = require('../auth/checkAuth');
const router = express.Router();

// check apiKey before any route
router.use(apiKey)
// check permission (needs req.objKey set by apiKey)
router.use(permission('0000'))
router.use('/v1/api', require('./access'))

module.exports = router;