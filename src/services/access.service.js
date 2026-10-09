
'use strict'


const shopModel = require("../models/shop.model");
const bcrypt = require('bcrypt')
const crypto = require('crypto');
const KeyTokenService = require('../services/keyToken.service')
const { createTokenPair } = require('../auth/authUtils');
const { getIntoData } = require("../utils");
const { BadRequestError } = require("../core/error.reponse");

const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
}

class AccessService {
    static signUp = async ({ name, password, email }) => {
        // try {
            const holderShop = await shopModel.findOne({ email }).lean();
            if (holderShop) {
                throw new BadRequestError("Error : Shop already registered");
            }
            // prevent hack to read password if they successfully accesss database
            const passwordHash = await bcrypt.hash(password, 10);
            const newShop = await shopModel.create({ name, email, password: passwordHash, roles: RoleShop.SHOP })
            if (newShop) {

                const privateKey = crypto.randomBytes(64).toString('hex');
                const publicKey = crypto.randomBytes(64).toString('hex');
                    
                console.log(privateKey, publicKey); // save to collection tree store

                const keyStore = await KeyTokenService.createKeyToken({
                    userId: newShop._id,
                    publicKey,
                    privateKey
                })

                if (!keyStore) {
                    throw new  BadRequestError('Error : keyStore error')
                }

                const tokens = await createTokenPair({userId: newShop._id, email}, publicKey, privateKey);
                console.log(`Created tokens ::`, tokens);

                return {
                    code: 201,
                    metadata : {
                        shop: getIntoData({fields: ['_id', 'name', 'email'], object: newShop}), 
                        tokens
                    }
                }
            }

            return {
                code : 20, 
                metadata: null
            }
        // } catch (error) {
        //     return {
        //         code: 'xxx',
        //         message: error.message,
        //         status: 'error'
        //     }
        // }
    }
}

module.exports = AccessService;