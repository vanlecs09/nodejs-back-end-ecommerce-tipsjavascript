const { Schema } = require('mongoose');
const mongoose = require('mongoose'); // Erase if already required


const COLLECTION_NAME = 'Product'
const DOCUMENT_NAME = 'Products'

// Declare the Schema of the Mongo model
const productSchema = new mongoose.Schema({
    product_name: { type: String, required: true },
    product_thumb: { type: String, required: true, },
    product_description: { type: String, required: true, },
    product_price: { type: Number, required: true, },
    product_quantity: { type: Number, required: true, },
    product_type: { type: String, required: true, enum: ['Electronics', 'Clothing', 'Furnitures'] },
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
    product_attributes: { type: Schema.Types.Mixed, required: true }
}, {
    collection: COLLECTION_NAME,
    timestamps: true
});

const clothingSchema = new mongoose.Schema({
    brand: { type: String, required: true },
    size: String,
    material: String,
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
}, {
    collection: 'clothes',
    timestamps: true
});

const electronicSchema = new mongoose.Schema({
    manufacturer: { type: String, required: true },
    model: String,
    color: String,
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
}, {
    collection: 'electronics',
    timestamps: true
});

const furnitureSchema = new mongoose.Schema({
    manufacturer: { type: String, required: true },
    size: String,
    material: String,
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
}, {
    collection: 'furnitures',
    timestamps: true
}); 



//Export the model
module.exports = {
    product: mongoose.model(DOCUMENT_NAME, productSchema),
    electronic: mongoose.model('Electronics', electronicSchema),
    clothing: mongoose.model('Clothing', clothingSchema),
    funiture: mongoose.model('Furniture', furnitureSchema)
}