'use strict'
const { BadRequestError, NotFoundError } = require('../core/error.reponse');
const discountModel = require('../models/discount.model');
// const discount = require('../models/discount.model');
// const { product } = require('../models/product.model');
const { findAllDiscountCodesUnSelect, checkDiscountExits, findAllDiscountCodesSelect } = require('../models/repository/discount.repo');
const { findAllProducts } = require('../models/repository/product.repo');
const { Types } = require('mongoose');
const { converToObjectMongodb } = require('../utils');
/*
    Discount Services
    1 - Generator Discount code [Shop | Admin]
    2 - Get Discount Amount [User]
    3 - Get all discount code [User | Shop]
    4 - Verify discount code [User]
    5 - delete discount code [Amin | Shop]
    6 - Cancel discount [User]
*/

class DiscountService {
    static async createDiscountCode(payload) {
        const { code, start_date, end_date, is_active, shopId, min_order_value,
            product_ids, applies_to, name, description, type, value, users_used,
            max_uses, uses_count, max_uses_per_user } = payload;

        const startDate = new Date(start_date);
        const endDate = new Date(end_date);
        if (isNaN(startDate) || isNaN(endDate)) {
            throw new BadRequestError("Invalid start_date or end_date");
        }

        if (new Date() > endDate) {
            throw new BadRequestError("Discount code has expired");
        }

        if (startDate > endDate) {
            throw new BadRequestError("Start date must be before End Date");
        }

        const foundDiscount = await discountModel.findOne({
            discount_code: code,
            discount_shopId: converToObjectMongodb(shopId)
        });

        if (foundDiscount && foundDiscount.discount_is_active) {
            throw new BadRequestError("Discount exists");
        }

        const discount = await discountModel.create({
            discount_name: name,
            discount_description: description,
            discount_type: type, //percentage
            discount_value: value, // 10.000
            discount_code: code,
            discount_start_date: startDate, // ngay bat dau 
            discount_end_date: endDate, // ngay ket thuc
            discount_max_uses: max_uses, //   so luong discount duoc ap dung 
            discount_uses_count: uses_count,//
            discount_users_used: users_used,
            discount_max_used_per_users: max_uses_per_user,
            discount_min_order_value: min_order_value,
            discount_shopId: shopId,
            discount_is_active: is_active,
            discount_applies_to: applies_to,
            discount_product_ids: applies_to === 'all' ? [] : product_ids
        })

        return discount;
    }

    static async updateDiscountCode() {

    }

    static async getAllDiscountCodesWithProduct({
        code, shopId, limit = 50, page = 1
    }) {
        if (!code || !shopId) {
            throw new BadRequestError("code and shopId are required");
        }
        if (!Types.ObjectId.isValid(shopId)) {
            throw new BadRequestError("Invalid shopId");
        }
        limit = Number(limit);
        page = Number(page);

        const foundDiscount = await discountModel.findOne({
            discount_code: code,
            discount_shopId: converToObjectMongodb(shopId)
        }).lean();

        if (!foundDiscount || !foundDiscount.discount_is_active) {
            throw new BadRequestError("Discount dosed not exists");
        }


        const { discount_applies_to, discount_product_ids } = foundDiscount;
        let products;
        if (discount_applies_to === 'all') {
            products = await findAllProducts({
                filter: {
                    product_shop: converToObjectMongodb(shopId),
                    isPublished: true
                },
                limit: limit,
                page: page,
                sort: 'ctime',
                select: ['product_name']
            })
        }

        if (discount_applies_to === 'specific') {
            products = await findAllProducts({
                filter: {
                    _id: { $in: discount_product_ids },
                    isPublished: true
                },
                limit: limit,
                page: page,
                sort: 'ctime',
                select: ['product_name']
            })
        }

        return products;
    }

    static async getAllDiscountCodesByShop({ limit, page, shopId }) {
        const discounts = await findAllDiscountCodesSelect({
            limit: limit,
            page: page,
            filter: {
                discount_shopId: converToObjectMongodb(shopId),
                discount_is_active: true,
            },
            unSelect: ['discount_code', 'discount_name'],
            model: discountModel
        })

        return discounts;
    }

    /*
        apply dicscount code 
        products = {
            productId, 
            shopId, 
            quanitty,
            name,
            price
        }
    */

    static async getDiscountAmount({ codeId, userId, shopId, products }) {
        const foundDiscount = await checkDiscountExits({
            model: discountModel, filter: {
                discount_code: codeId,
                discount_shopId: converToObjectMongodb(shopId),
            }
        });

        if (!foundDiscount) throw new NotFoundError("discount doesnot exists");

        const {
            discount_is_active,
            discount_max_uses,
            discount_min_order_value,
            discount_users_used,
            discount_max_used_per_users,
            discount_type,
            discount_value
        } = foundDiscount;

        if (!discount_is_active) throw new NotFoundError("discount expired");

        if (!discount_max_uses) throw new NotFoundError("discount are out");

        // if (new Date() < new Date(start_date) || new Date() > new Date(end_date)) {
        //     throw BadRequestError("Discount code has expired");
        // }

        let totalOrder = 0;
        if (discount_min_order_value > 0) {
            totalOrder = products.reduce((acc, product) => {
                return acc + product.quantity * product.price;
            }, 0);

            if (totalOrder < discount_min_order_value) {
                throw new NotFoundError("discount require minimum order value");
            }
        }

        if (discount_max_used_per_users > 0) {
            const userUseDiscount = discount_users_used.find(user => user.userId == userId);
            if (userUseDiscount) {

            }
        }

        const amount = discount_type === 'fixed_amount' ? discount_value : totalOrder * (discount_value / 100);
        return {
            totalOrder,
            discount: amount,
            totalPrice: totalOrder - amount
        }

    }

    static async deleteDiscountCode({ shopId, codeId }) {
        const deleted = await discount.findOneAndDelete({
            discount_code: codeId,
            discount_shopId: shopId
        })
        return deleted;
    }

    static async cancelDiscount({ codeId, shopId, userId }) {
        const discountFound = await checkDiscountExits({
            model: discountModel, filter: {
                discount_code: codeId,
                discount_shopId: converToObjectMongodb(shopId),
            }
        }).lean();

        if (!discountFound) throw new NotFoundError("discount doesnot exists");

        const result = await discount.findByIdAndUpdate(foundDiscount._id, {
            $pull: {
                discount_users_used: userId,
            },
            $inc: {
                discount_max_uses: 1,
                discount_uses_count: -1,
            }
        })

        return result;
    }
}

module.exports = DiscountService;
