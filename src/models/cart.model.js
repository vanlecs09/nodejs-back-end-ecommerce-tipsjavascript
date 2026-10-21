'use strict'

const { Schema, model } = require('mongoose'); // Erase if already required

const COLLECTION_NAME = 'Carts'
const DOCUMENT_NAME = 'Cart'

// Declare the Schema of the Mongo model
var cartSchema = new Schema({
    cart_state: {
        type: String,
        required: true,
        enum: ['active', 'completed', 'failed', 'pending'],
        default: 'active'
    },
    cart_products: {
        type: Array,
        required: true,
        default: []
    },
    /*
    {
        productId,
        shopId,
        quantity,
        name,
        price
    }
    */
    cart_count_product: {
        type: Number,
        default: 0
    },
    cart_userId: { type: Number, required: true }
}, {
    collection: COLLECTION_NAME,
    timestamps : {
        createdAt : 'createdOn',
        updateAt : 'modifiedOn'
    }
    // timestamps: true,
});

//Export the model
module.exports = model(DOCUMENT_NAME, cartSchema);