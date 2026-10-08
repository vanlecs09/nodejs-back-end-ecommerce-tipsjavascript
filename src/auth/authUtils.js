const JWT = require('jsonwebtoken')

const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        const accessToken = await JWT.sign(payload, privateKey, {
            algorithm: 'RS256',
            expiresIn: '2 days',
        })

        const refreshToken = await JWT.sign(payload, privateKey, {
            algorithm: 'RS256',
            expiresIn: '7 days',
        })

        JWT.verify(accessToken, publicKey, (err, decode) => {
            if (err) {
                console.error('error verify::', err);
            } else {
                console.log()
            }
        })

        return {accessToken, refreshToken}
    } catch (error) {
        console.error('errr create token pair::', error)
    }
}

module.exports = {
    createTokenPair
}