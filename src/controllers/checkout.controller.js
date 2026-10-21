'use strict'

const CheckoutService = require('../services/checkout.service');
const { SuccessReponse } = require("../core/success.response");

class CheckOutController {
    /** 
     * @desc 
     * @param
     * @param
     * @param
     * @method POST
     * @url
     * @return {
     * }
    */

    checkoutReview = async (req, res, next) => {
        new SuccessReponse({
            message: 'Add To Cart Success',
            metadata: await CheckoutService.checkOutReview(req.body)
        }).send(res);
    }
}

module.exports = new CheckOutController;