'use strict'

const { unGetSelectData, getSelectData } = require("../../utils");
const discountModel = require("../discount.model");

const findAllDiscountCodesUnSelect = async ({
    limit = 50, sort = 'ctime', page = 1, filter, unSelect, model }) => {
    limit = Number(limit);
    const skip = (Number(page) - 1) * limit;
    const sortBy = sort == 'ctime' ? { _id: -1 } : { _id: 1 };
    const documents = await model.find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(unGetSelectData(unSelect))
        .lean();

    return documents;
}


const findAllDiscountCodesSelect = async ({
    limit = 50, sort = 'ctime', page = 1, filter, select, model }) => {
    limit = Number(limit);
    const skip = (Number(page) - 1) * limit;
    const sortBy = sort == 'ctime' ? { _id: -1 } : { _id: 1 };
    const documents = await model.find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(getSelectData(select))
        .lean();

    return documents;
}

const checkDiscountExits = async ({ model, filter }) => {
    return await model.findOne(filter).lean();
}

module.exports = {
    findAllDiscountCodesUnSelect,
    findAllDiscountCodesSelect,
    checkDiscountExits
}