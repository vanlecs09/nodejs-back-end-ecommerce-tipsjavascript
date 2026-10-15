'use strict'

const { Types } = require('mongoose');
const { product, electronic, clothing, furniture } = require('../product.model');
const { getSelectData, unGetSelectData } = require('../../utils');

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

const findAllProducts = async ({ limit, sort, page, filter, select }) => {
    const skip = (page - 1)*limit;
    const sortBy = sort == 'ctime' ? {_id: -1} : {_id : 1};
    const products = await product.find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean();

    return products;
}

const findProduct = async ({product_id, unSelect}) => {
    return await product.findById(product_id).select(unGetSelectData(unSelect))
}

const updateProductById = async({
    productId,
    bodyUpdate,
    model, 
    isNew = true
}) => {
    return model.findByIdAndUpdate(productId, bodyUpdate, {
        returnDocument: isNew ? 'after' : 'before'
    })
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
    searchProductByUser,
    findAllProducts,
    findProduct,
    updateProductById
}