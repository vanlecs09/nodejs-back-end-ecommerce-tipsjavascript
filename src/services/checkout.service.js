'use strict'

const { BadRequestError } = require("../core/error.reponse");
const { findCartByid } = require("../models/repository/cart.repo");
const { checkProductByServer } = require("../models/repository/product.repo");
const { getDiscountAmount } = require("./discount.service");

class CheckoutSerivce {
    /*
        {
            userId,
            cartId,
            shop_order_ids : [
                {
                    shopId,
                    shop_discount : []
                    item_products : [
                    {   
                        quantity,
                        price,
                        productId
                    }],
                }

        ]
        }
    */

    static async checkOutReview({
        cartId, userId, shop_order_ids = []
    }) {
        const foundCart = await findCartByid(cartId);
        if (!foundCart) throw new BadRequestError('Cart does not exit');

        const checkout_order = {
            totalPrice: 0,
            feeShip: 0,
            totalDiscount: 0,
            totalCheckOut: 0,
        }
        const shop_order_ids_new = [];

        for (let i = 0; i < shop_order_ids.length; i++) {
            const { shopId, shop_discounts = [], item_products = [] } = shop_order_ids[i];
            const checkProductServer = await checkProductByServer(item_products);
            if (!checkProductServer.length) throw new BadRequestError('Order wrong!!!');

            const checkOutPrice = checkProductServer.reduce((acc, product) => {
                return acc + (product.quantity * product.price);
            }, 0)

            checkout_order.totalPrice += checkOutPrice;

            const itemCheckOut = {
                shopId,
                shop_discounts,
                priceRaw: checkOutPrice,
                priceApplyCheckOut: checkOutPrice,
                item_products: checkProductServer,
            }

            if (shop_discounts.length > 0) {
                const { discount = 0 } = await getDiscountAmount({
                    codeId: shop_discounts[0].codeId,
                    userId,
                    shopId,
                    products: checkProductServer
                })

                checkout_order.totalDiscount += discount;

                if (discount > 0) {
                    itemCheckOut.priceApplyCheckOut = checkOutPrice - discount;
                }
            }

            checkout_order.totalCheckOut += itemCheckOut.priceApplyCheckOut;
            shop_order_ids_new.push(itemCheckOut)
        }

        return {
            shop_order_ids,
            shop_order_ids_new,
            checkout_order
        }
    }

    static async orderByUser({
        shop_order_ids,
        cartId,
        userId,
        user_address = {},
        user_payment = {}
    }) {
        const { shop_order_ids_new, checkout_order } = CheckoutSerivce.checkOutReview({
            cartId, 
            userId,
            shop_order_ids,

        })
    }
}

module.exports = CheckoutSerivce;