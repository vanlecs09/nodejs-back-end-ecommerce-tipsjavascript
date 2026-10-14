const { Schema } = require('mongoose');
const mongoose = require('mongoose'); // Erase if already required
const slugify = require('slugify')

const COLLECTION_NAME = 'Product'
const DOCUMENT_NAME = 'Products'

// Declare the Schema of the Mongo model
const productSchema = new mongoose.Schema({
    product_name: { type: String, required: true },
    product_thumb: { type: String, required: true, },
    product_description: { type: String, required: true, }, // 
    product_slug: String,
    product_price: { type: Number, required: true, },
    product_quantity: { type: Number, required: true, },
    product_type: { type: String, required: true, enum: ['Electronics', 'Clothing', 'Furnitures'] },
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
    product_attributes: { type: Schema.Types.Mixed, required: true },
    product_ratingAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'rating must be above'],
        max: [5, 'rating must be below'],
    },
    product_variations: { type: Array, default: [] },
    isDraft: { type: Boolean, default: true, index: true, select: false },
    isPublished: { type: Boolean, default: false, index: true, select: false },
}, {
    collection: COLLECTION_NAME,
    timestamps: true
});

// create index for search

productSchema.index({product_name: 'text', product_description: 'text'})

//doucument middle ware: run before save and create
productSchema.pre('save', function () {
    this.product_slug = slugify(this.product_name, { lower: true });
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