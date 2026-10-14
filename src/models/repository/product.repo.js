'use strict'

const { Types } = require('mongoose');
const { product, electronic, clothing, furniture } = require('../product.model');

const findAllDraftForShop = async ({ query, skip, limit }) => {
    return await queryProduct({ query, skip, limit });
}

const findAllPublishedForShop = async ({ query, skip, limit }) => {
    return await queryProduct({ query, skip, limit });
}

const searchProductByUser = async ({ keySearch }) => {
    const regexSearch = new RegExp(keySearch);
    const result = await product.find({
        $text: { $search: regexSearch },

    }, { score: { $meta: 'textScore' } }).sort({ score: { $meta: 'textScore' } }).lean();

    return result;
}


const publishProductByShop = async ({ product_shop, product_id }) => {
    const foundShop = await product.findOne({
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id)
    })

    if (!foundShop) return null;

    const { modifiedCount } = await foundShop.updateOne({
        isDraft: false,
        isPublished: true,
    })
    return modifiedCount;
}


const unPublishProductByShop = async ({ product_shop, product_id }) => {
    const foundShop = await product.findOne({
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id)
    })

    if (!foundShop) return null;

    const { modifiedCount } = await foundShop.updateOne({
        isDraft: true,
        isPublished: false,
    })
    return modifiedCount;
}


const queryProduct = async ({ query, skip, limit }) => {
    return await product.find(query)
        .populate('product_shop', 'name email -_id')
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec();
}

module.exports = {
    findAllDraftForShop,
    findAllPublishedForShop,
    publishProductByShop,
    unPublishProductByShop,
    searchProductByUser
}