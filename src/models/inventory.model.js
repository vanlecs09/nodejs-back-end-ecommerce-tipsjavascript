'use strict'

const { Schema, model } = require('mongoose'); // Erase if already required

const COLLECTION_NAME = 'Inventories'
const DOCUMENT_NAME = 'Inventory'

// Declare the Schema of the Mongo model
var inventorySchema = new Schema({
    inven_productId: { type: Schema.Types.ObjectId, ref: 'Product' },
    inven_location: { type: String, default: 'Uknow' },
    inven_stock: { type: Number, required: true },
    inven_shop_id: { type: Schema.Types.ObjectId, ref: 'Shop' },
    inven_reservation: { type: Array, default: [] }
    /*
     cardId : 1,
     stock : 1
     createdON: 
    */
}, {
    collection: COLLECTION_NAME,
    timestamps: true,
});

//Export the model
module.exports = {
    inventory: model(DOCUMENT_NAME, inventorySchema)
}