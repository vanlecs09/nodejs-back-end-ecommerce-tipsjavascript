'use strict'
const { BadRequestError } = require('../core/error.reponse');
const discountModel = require('../models/discount.model');
const discount = require('../models/discount.model');
const { findAllDiscountCodesUnSelect } = require('../models/repository/discount.repo');
const { findAllProducts } = require('../models/repository/product.repo');
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

        if (new Date() < new Date(start_date) || new Date() > new Date(end_date)) {
            throw BadRequestError("Discount code has expired");
        }

        if (new Date(start_date) > new Date(end_date)) {
            throw BadRequestError("Start date must be before End Date");
        }

        const foundDiscount = await discount.findOne({
            discount_code: code,
            discount_shopId: converToObjectMongodb(shopId)
        });

        if (foundDiscount && foundDiscount.discount_is_active) {
            throw new BadRequestError("Discount exists");
        }

        const discount = discount.create({
            discount_name: name,
            discount_description: description,
            discount_type: type, //percentage
            discount_value: value, // 10.000
            discount_code: code,
            discount_start_date: start_date, // ngay bat dau 
            discount_end_date: end_date, // ngay ket thuc
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
        code, shopId, userId, limit, page
    }) {
        const foundDiscount = await discount.findOne({
            discount_code: code,
            discount_shopId: converToObjectMongodb(shopId)
        }).lean();

        if (!foundDiscount && !foundDiscount.discount_is_active) {
            throw new BadRequestError("Discount dosed not exists");
        }


        const { discount_applies_to, discount_product_ids } = foundDiscount;
        let products;
        if (discount_applies_to === 'all') {
            products = await findAllProducts({
                filter: {
                    product_shop: onverToObjectMongodb(shopId),
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
        const discounts = await findAllDiscountCodesUnSelect({
            limit: limit,
            page: page,
            filter: {
                discount_shopId: converToObjectMongodb(shopId),
                discount_is_active: true,
            },
            unSelect: ['__v', 'discount_shopId'],
            model: discountModel
        })

        return discounts;
    }
}
