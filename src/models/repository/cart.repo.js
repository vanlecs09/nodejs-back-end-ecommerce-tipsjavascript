'use strict'

const { converToObjectMongodb } = require("../../utils")
const cartModel = require("../cart.model")

const findCartByid = async (cartId) => {
    return await cartModel.findOne({ _id: converToObjectMongodb(cartId), cart_state: 'active' }).lean();
}

module.exports = {
    findCartByid
}