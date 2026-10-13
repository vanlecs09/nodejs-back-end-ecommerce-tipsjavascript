const JWT = require('jsonwebtoken')
const { asyncHandler } = require('../helper/asynchandler')
const { AuthFailureError, NotFoundError } = require('../core/error.reponse')
const { findByUserId } = require('../services/keyToken.service');


const HEADER = {
    API_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: 'authorization'
}

const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        const accessToken = await JWT.sign(payload, publicKey, {
            // algorithm: 'RS256',
            expiresIn: '2 days',
        })

        const refreshToken = await JWT.sign(payload, privateKey, {
            // algorithm: 'RS256',
            expiresIn: '7 days',
        })

        JWT.verify(accessToken, publicKey, (err, decode) => {
            if (err) {
                console.error('error verify::', err);
            } else {
                console.log()
            }
        })

        return { accessToken, refreshToken }
    } catch (error) {
        console.error('errr create token pair::', error)
    }
}

const authentication = asyncHandler(async (req, res, next) => {
    /*
        1 - check userId missing 
        2 - get access Token
        3 - verify token
        4 - check user in dbs 
        5 - check keystore with this user id 
        6 - ok all => next
    */

    const userId = req.headers[HEADER.CLIENT_ID];
    if (!userId) throw new AuthFailureError("Invalid Request");
    //2
    const keyStore = await findByUserId(userId);
    if (!keyStore) throw new NotFoundError("Not Found Key Store");

    // 
    const accessToken = await req.headers[HEADER.AUTHORIZATION];
    if (!accessToken) throw new AuthFailureError("Invalid Request");

    try {
        const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
        if (userId !== decodeUser.userId) throw new AuthFailureError("Invalid UserId");
        req.keyStore = keyStore;
        req.user = decodeUser; // {userId, email}
        return next();
    } catch (error) {
        throw new AuthFailureError("Invalid Token");
    }
});

const verifyJWT = async (token, keySecret) =>
{
    console.log("verifyJWT " + token)
    return await JWT.verify(token, keySecret);
}

module.exports = {
    createTokenPair,
    HEADER,
    authentication,
    verifyJWT
}