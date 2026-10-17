'use strict'

const { Schema, model } = require('mongoose'); // Erase if already required

const COLLECTION_NAME = 'Discounts'
const DOCUMENT_NAME = 'Discount'

// Declare the Schema of the Mongo model
var discountSchema = new Schema({
    discount_name: { type: String, required: true },
    discount_description: { type: String, required: true },
    discount_type: { type: String, default: 'fixed_amount' }, //percentage
    discount_value: { type: Number, required: true }, // 10.000
    discount_code: { type: String, required: true },
    discount_start_date: { type: Date, required: true }, // ngay bat dau 
    discount_end_date: { type: Date, required: true }, // ngay ket thuc
    discount_max_uses: { type: Number, required: true }, //   so luong discount duoc ap dung 
    discount_uses_count: { type: Number, required: true },//
    discount_users_used: { type: Array, default: [] },
    discount_max_used_per_users: { type: Number, required: true },
    discount_min_order_value: { type: Number, required: true },
    discount_shopId: { type: Schema.Types.ObjectId, ref: 'Shop' },
    discount_is_active: { type: Boolean, default: true },
    discount_applies_to: { type: String, required: true, enum: ['all', 'specific'] },
    discount_product_id: { type: Array, default: [] },
}, {
    collection: COLLECTION_NAME,
    timestamps: true,
});

//Export the model
module.exports = model(DOCUMENT_NAME, discountSchema);