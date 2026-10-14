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

    publishProductByShop = async (req, res, next) => {
        new SuccessReponse({
            message: 'Publish Product Success',
            metadata: await ProductService.publishProductByShop( {
                product_id : req.params.id,
                product_shop: req.user.userId
            })
        }).send(res);
    }

    unPublishProductByShop = async (req, res, next) => {
        new SuccessReponse({
            message: 'unPublish Product Success',
            metadata: await ProductService.unPublishProductByShop( {
                product_id : req.params.id,
                product_shop: req.user.userId
            })
        }).send(res);
    }


    // QUERY 

    /**
     * @desc Get All Draft for Shop
     * @param {limit} limit 
     * @return {JSON}
     */
    getAllDraftsForShop = async (req, res, next) => {
        new SuccessReponse({
            message: 'Get List  Success',
            metadata: await ProductService.findAllDraftForShop({ product_shop: req.user.userId })
        }).send(res);
    }


     /**
     * @desc Get All Draft for Shop
     * @param {limit} limit 
     * @return {JSON}
     */
    getAllPublishedForShop = async (req, res, next) => {
        new SuccessReponse({
            message: 'Get List  Success',
            metadata: await ProductService.findAllPublishedForShop({ product_shop: req.user.userId })
        }).send(res);
    }
    //

     getListSearchProduct = async (req, res, next) => {
        new SuccessReponse({
            message: 'Get getListSearchProduct  Success',
            metadata: await ProductService.searchProducts(req.params)
        }).send(res);
    }

    findAllProducts = async (req, res, next) => {
         new SuccessReponse({
            message: 'Get findAllProducts  Success',
            metadata: await ProductService.findAllProducts(req.query)
        }).send(res);
    }

     findProduct = async (req, res, next) => {
         new SuccessReponse({
            message: 'Get findAllProducts  Success',
            metadata: await ProductService.findProduct({product_id : req.params.product_id})
        }).send(res);
    }
}

module.exports = new ProductController();