'use strict'

const ProductService = require("../services/product.service.xxx");
const { OK, CREATED, SuccessReponse } = require("../core/success.response")
class ProductController {
    createProduct = async (req, res, next) => {
        new SuccessReponse({
            message: 'Create New Product Success',
            metadata: await ProductService.createProduct(req.body.product_type, {
                ...req.body,
                product_shop: req.user.userId
            })
        }).send(res);
    }

}

module.exports = new ProductController();