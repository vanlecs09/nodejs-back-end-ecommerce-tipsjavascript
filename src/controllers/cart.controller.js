'use strict'

const CartService = require('../services/cart.service');
const { SuccessReponse } = require("../core/success.response");

class CartController {
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

    addToCart = async (req, res, next) => {
        new SuccessReponse({
            message: 'Add To Cart Success',
            metadata: await CartService.addToCart(req.body)
        }).send(res);
    }


    update = async (req, res, next) => {
        new SuccessReponse({
            message: 'Add To Cart Success',
            metadata: await CartService.addToCartV2(req.body)
        }).send(res);
    }

    delete = async (req, res, next) => {
        new SuccessReponse({
            message: 'Delete Cart Success',
            metadata: await CartService.deleteUserCart(req.body)
        }).send(res);
    }

    list = async (req, res, next) => {
        new SuccessReponse({
            message: 'List Cart Success',
            metadata: await CartService.getListUserCart(req.query)
        }).send(res);
    }
}

module.exports = new CartController;