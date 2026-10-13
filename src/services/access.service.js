
'use strict'


const shopModel = require("../models/shop.model");
const bcrypt = require('bcrypt')
const crypto = require('crypto');
const KeyTokenService = require('../services/keyToken.service')
const { createTokenPair } = require('../auth/authUtils');
const { getIntoData } = require("../utils");
const { BadRequestError, AuthFailureError } = require("../core/error.reponse");
const { findByEmail } = require("./shop.service");

const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
}

class AccessService {

    static logout = async (keystore) => {
        const delKey = await KeyTokenService.removeKeyById(keystore._id)
        // console.log(delkey)
        return delKey;
    }

    /*
        1 - check email exit
        2 - matching passwrod   
        3 - create AT and RT
        4 - generate token
        5 - return data 
    */

    static login = async ({ email, password }) => {
        //1
        const foundShop = await findByEmail({ email })
        if (!foundShop) throw new BadRequestError("shop is not registered");

        //2
        const match = await bcrypt.compare(password, foundShop.password)
        if (!match) throw new AuthFailureError("Authenication Error")

        //3 
        const privateKey = crypto.randomBytes(64).toString('hex');
        const publicKey = crypto.randomBytes(64).toString('hex');

        const tokens = await createTokenPair({ userId: foundShop._id, email }, publicKey, privateKey);
        await KeyTokenService.createKeyToken({
            userId: foundShop._id,
            publicKey,
            privateKey,
            refreshToken: tokens.refreshToken
        })
        return {
            code: 201,
            metadata: {
                shop: getIntoData({ fields: ['_id', 'name', 'email'], object: foundShop }),
                tokens
            }
        }
    }

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

            console.log(privateKey, publicKey); // save to collection tree store\
            const tokens = await createTokenPair({ userId: newShop._id, email }, publicKey, privateKey);
            console.log(`Created tokens ::`, tokens);

            const keyStore = await KeyTokenService.createKeyToken({
                userId: newShop._id,
                publicKey,
                privateKey,
                refreshToken: tokens.refreshToken
            })

            if (!keyStore) {
                throw new BadRequestError('Error : keyStore error')
            }


            return {
                code: 201,
                metadata: {
                    shop: getIntoData({ fields: ['_id', 'name', 'email'], object: newShop }),
                    tokens
                }
            }
        }

        return {
            code: 20,
            metadata: null
        }
    }
}

module.exports = AccessService;