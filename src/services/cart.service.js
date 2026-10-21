'use strict'

const cartModel = require("../models/cart.model")
const { BadRequestError, NotFoundError } = require('../core/error.reponse');
const { findProduct } = require("../models/repository/product.repo");
/*
    Key Feature : Cart Service
    - add product to cart
    - descrese product quantity
    - increase product quantity
    - get cart [user]
    - delete cart [user]
    - delete cart item [user]
*/

class CartService {

    static async createUserCart({ userId, product }) {
        const query = { cart_userId: userId, cart_state: 'active' },
            updateOrInsert = {
                $addToSet: {
                    cart_products: product,
                }
            }, options = { upsert: true, new: true };

        return await cartModel.findOneAndUpdate(query, updateOrInsert, options);
    }

    static async updateUserCartQuantity(userId, product) {
        const { productId, quantity } = product;
        const query = {
            cart_userId: userId,
            'cart_products.productId': productId,
            cart_state: 'active'
        },
            updateSet = {
                $inc: {
                    'cart_products.$.quantity': quantity,
                }
            }, options = { upsert: true, new: true };

        return await cartModel.findOneAndUpdate(query, updateSet, options);
    }

    static async addToCart({ userId, product = {}, }) {
        const userCart = await cartModel.findOne({
            cart_userId: userId
        })

        if (!userCart) {
            return await CartService.createUserCart({ userId, product })
        }

        if (!userCart.cart_products.length) {
            userCart.cart_products = [product];
            return await userCart.save();
        }

        return await CartService.updateUserCartQuantity(userId, product)
    }

    // update cart 
    /*
        shop_order_ids : [
            shopId,
            item_products : [
            {   
                quantity,
                price,
                shopId,
                old_quantity,
                productId
            }],
            version
        ]
    */

    static async addToCartV2({ userId, shop_order_ids }) {
        const item = shop_order_ids?.[0]?.item_products?.[0];
        if (!item) throw new BadRequestError("item_products must be a non-empty array");

        const { productId, quantity, old_quantity } = item;
        const foundProduct = await findProduct({ product_id: productId });

        if (!foundProduct) throw new NotFoundError("Product not exits");

        if (foundProduct.product_shop.toString() !== shop_order_ids[0]?.shopId) {
            throw new NotFoundError("Product does not belong to shop");
        }

        if (quantity === 0) {
            // delete
        }


        return await CartService.updateUserCartQuantity(userId, {
            productId,
            quantity: quantity - old_quantity
        })
    }

    static async deleteUserCart({ userId, productId }) {
        const query = { cart_userId: userId, cart_state: 'active' },
            updateSet = {
                $pull: {
                    cart_products: {
                        productId
                    }
                }
            }

        const deleteCart = await cartModel.updateOne(query, updateSet);
        return deleteCart;
    }

    static async getListUserCart({ userId }) {
        return await cartModel.findOne({
            cart_userId : userId
        }).lean();
    }
}

module.exports =  CartService;