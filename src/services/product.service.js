const { BadRequestError } = require("../core/error.reponse");
const { product, electronic, clothing } = require("../models/product.model");

class ProductFactory {
    static async createProduct(type, payLoad) {
        switch (type) {
            case 'Electronics':
                return new Electronics(payLoad).createProduct();
            case 'Clothing':
                return new Clothing(payLoad).createProduct();
            default:
                throw new BadRequestError(`invalid product type ${type}`)
        }
    }
}


class Product {
    constructor({
        product_name,
        product_thumb,
        product_description,
        product_price,
        product_quantity,
        product_type,
        product_shop,
        product_attributes
    }) {
        this.product_name = product_name;
        this.product_thumb = product_thumb;
        this.product_description = product_description;
        this.product_price = product_price;
        this.product_quantity = product_quantity;
        this.product_type = product_type;
        this.product_shop = product_shop;
        this.product_attributes = product_attributes;
    }

    async createProduct(product_id) {
        return await product.create({...this, _id : product_id});
    }
}

class Clothing extends Product {
    async createProduct() {
        const newClothing = await clothing.create(this.product_attributes);
        if (!newClothing) throw new BadRequestError('create new clothing error');

        const newProduct = await super.createProduct();

        return  newProduct;
    }
}


class Electronics extends Product {
    async createProduct() {
        const newElectronic = await electronic.create({
            ...this.product_attributes,
        product_shop: this.product_shop});
        if (!newElectronic) throw new BadRequestError('create new Electronic error');

        const newProduct = await super.createProduct(newElectronic._id);

        return  newProduct;
    }
}

module.exports = ProductFactory;