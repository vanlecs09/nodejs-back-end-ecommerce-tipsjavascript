'use strict'

const DiscountService = require("../services/discount.service");
const { SuccessReponse } = require("../core/success.response");

class DiscountController {
    createDiscountCode = async (req, res, next) => {
        new SuccessReponse({
            message: 'Code Generation Success',
            metadata: await DiscountService.createDiscountCode({
                ...req.body,
                shopId: req.user.userId
            })
        }).send(res);
    }

    getAllDiscountCodes = async (req, res, next) => {
        new SuccessReponse({
            message: 'Code Found Success',
            metadata: await DiscountService.getAllDiscountCodesByShop({
                 ...req.query
            })
        }).send(res);
    }

    getAllDiscountAmount = async (req, res, next) => {
        new SuccessReponse({
            message: 'Code Found Success',
            metadata: await DiscountService.getDiscountAmount({
                ...req.body,
            })
        }).send(res);
    }

    getAllDiscountCodesWithProducts = async (req, res, next) => {
        new SuccessReponse({
            message: 'Code Found Success',
            metadata: await DiscountService.getAllDiscountCodesWithProduct({
                ...req.query
            })
        }).send(res);
    }

}

module.exports = new DiscountController