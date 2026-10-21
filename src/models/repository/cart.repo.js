'use strict'

const { converToObjectMongodb } = require("../../utils")
const cartModel = require("../cart.model")

const findCartByid = async (carId) => {
    return await cartModel.findOne({ _id: converToObjectMongodb(cardId), cart_state: 'active' }).lean();
}

module.exports = {
    findCartByid
}