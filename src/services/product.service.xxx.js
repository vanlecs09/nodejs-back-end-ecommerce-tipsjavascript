const { BadRequestError } = require("../core/error.reponse");
const { product, electronic, clothing, funiture: furniture } = require("../models/product.model");
const { insertInventory } = require("../models/repository/inventory.repo");
const { findAllDraftForShop,
    findAllPublishedForShop,
    publishProductByShop,
    unPublishProductByShop,
    searchProductByUser,
    findAllProducts,
    findProduct,
    updateProductById } = require("../models/repository/product.repo");
const { removeUndefinedObject, updateNestedObjectParser } = require("../utils");

class ProductFactory {

    static productRegistry = {}

    static registerProductType(type, classRef) {
        ProductFactory.productRegistry[type] = classRef;
    }

    static async createProduct(type, payload) {
        // console.log(payload);
        const productClass = ProductFactory.productRegistry[type];
        if (!productClass) throw new BadRequestError(`invalid product type ${type}`)
        return new productClass(payload).createProduct();
    }

    static async updateProduct(type, productId, payload) {
        const productClass = ProductFactory.productRegistry[type];
        if (!productClass) throw new BadRequestError(`invalid product type ${type}`)
        return new productClass(payload).updateProduct(productId);
    }

    static async findAllDraftForShop({ product_shop, limit = 50, skip = 0 }) {
        const query = { product_shop, isDraft: true, };
        return await findAllDraftForShop({ query, limit, skip })
    }

    static async findAllPublishedForShop({ product_shop, limit = 50, skip = 0 }) {
        const query = { product_shop, isPublished: true, };
        return await findAllPublishedForShop({ query, limit, skip })
    }

    static async publishProductByShop({ product_shop, product_id }) {
        return await publishProductByShop({ product_shop, product_id });
    }

    static async unPublishProductByShop({ product_shop, product_id }) {
        return await unPublishProductByShop({ product_shop, product_id });
    }

    static async searchProducts({ keySearch }) {
        return await searchProductByUser({ keySearch })
    }

    static async findAllProducts({ limit = 50, sort = 'ctime', page = 1, filter = { isPublished: true } }) {
        return await findAllProducts({
            limit, sort, page, filter,
            select: ['product_name', 'product_price', 'product_thumb']
        })
    }

    static async findProduct({ product_id }) {
        return await findProduct({ product_id, unSelect: ['__v'] })
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
        const newProduct = await product.create({ ...this, _id: product_id });
        if (newProduct) {
            // insert inventory
            insertInventory({
                productId : newProduct._id,
                shopeId : this.product_shop,
                stock : this.product_quantity
            })
        }
        return newProduct;
    }

    async updateProduct(productId, bodyUpdate) {
        return await updateProductById({ productId, bodyUpdate, model: product });

    }
}

class Clothing extends Product {
    async createProduct() {
        const newClothing = await clothing.create(this.product_attributes);
        if (!newClothing) throw new BadRequestError('create new clothing error');

        const newProduct = await super.createProduct();

        return newProduct;
    }

    async updateProduct(productId) {
        const objectParams = removeUndefinedObject(this);
        if (objectParams.product_attributes) {
            await updateProductById({ productId, bodyUpdate: updateNestedObjectParser(objectParams.product_attributes), model: clothing });
        }

        const updateProduct = await super.updateProduct(productId, updateNestedObjectParser(objectParams));
        return updateProduct;
    }
}


class Electronics extends Product {

    async createProduct() {
        const newElectronic = await electronic.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        });
        if (!newElectronic) throw new BadRequestError('create new Electronic error');

        const newProduct = await super.createProduct(newElectronic._id);

        return newProduct;
    }

    async updateProduct(productId) {
        const objectParams = removeUndefinedObject(this);
        //1. remove attr and undefine
        //2. check xem update o dau
        if (objectParams.product_attributes) {
            await updateProductById({ productId, bodyUpdate: updateNestedObjectParser(objectParams.product_attributes), model: electronic });
        }

        const updateProduct = await super.updateProduct(productId, updateNestedObjectParser(objectParams));
        return updateProduct;
    }
}

class Furnitures extends Product {

    async createProduct() {
        const newElectronic = await furniture.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        });
        if (!newElectronic) throw new BadRequestError('create new Electronic error');

        const newProduct = await super.createProduct(newElectronic._id);

        return newProduct;
    }

    async updateProduct(productId) {
        const objectParams = removeUndefinedObject(this);
        if (objectParams.product_attributes) {
            await updateProductById({ productId, bodyUpdate: updateNestedObjectParser(objectParams.product_attributes), model: furniture });
        }

        const updateProduct = await super.updateProduct(productId, updateNestedObjectParser(objectParams));
        return updateProduct;
    }
}


ProductFactory.registerProductType('Clothing', Clothing);
ProductFactory.registerProductType('Electronics', Electronics);
ProductFactory.registerProductType('Furnitures', Furnitures);

module.exports = ProductFactory;