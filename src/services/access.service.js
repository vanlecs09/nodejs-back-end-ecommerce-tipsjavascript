
'use strict'


const shopModel = require("../models/shop.model");
const bcrypt = require('bcrypt')
const crypto = require('crypto');
const KeyTokenService = require('../services/keyToken.service')
const { createTokenPair, verifyJWT } = require('../auth/authUtils');
const { getIntoData } = require("../utils");
const { BadRequestError, AuthFailureError, ForbiddenError } = require("../core/error.reponse");
const { findByEmail } = require("./shop.service");

const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
}

class AccessService {

    static handleRefreshToken = async (refreshToken) => {
        console.log(refreshToken)
        // check refreshToken is used or not 
        const foundRefreshTokenUsed = await KeyTokenService.findByRefreshTokenUsed(refreshToken);
         console.log("find used refreshToken " + foundRefreshTokenUsed)

        if (foundRefreshTokenUsed) {
           
            // console.log(foundRefreshTokenUsed)
            // decode to see who used this refreshToken
            const { userId, email } = await verifyJWT(refreshToken, foundRefreshTokenUsed.privateKey);
            console.log({ userId, email });
            // delete all record
            await KeyTokenService.deleteKeyByUserId(userId);
            throw new ForbiddenError(' some thing wrong happened, please relogin');
        }

        const holderToken = await KeyTokenService.findByRefreshToken(refreshToken);
        if (!holderToken) throw new AuthFailureError("Shop is not registered 1");
        console.log(holderToken);

        // verfiy token
        const { userId, email } = await verifyJWT(refreshToken, holderToken.privateKey);
        console.log("2 -- ", { userId, email });
        const foundShop = await findByEmail({ email });
        if (!foundShop) throw new AuthFailureError("Shop is not registered 2");


        const tokens = await createTokenPair({ userId, email }, holderToken.publicKey, holderToken.privateKey);
        await holderToken.updateOne({
            $set : {
                refreshToken : tokens.refreshToken,
            },
            $addToSet : {
                refeshTokenUsed : refreshToken
            }
        })

        return {
            user : { userId, email },
            tokens
        }
    }

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