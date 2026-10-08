const express = require('express');
const router = express.Router();

router.use('/v1/api', require('./access'))

// router.get('', (req, res, next) => {
//     const content = 'hell fan';
//     return res.status(500).json({
//         message: 'wellcome fanjs',
//     })
// })

module.exports = router;