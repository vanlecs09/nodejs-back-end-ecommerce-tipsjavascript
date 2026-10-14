'use strict'

const AccessService = require("../services/access.service");
const { OK, CREATED, SuccessReponse } = require("../core/success.response")
class AccessController {
    handRefreshTolen = async (req, res, next) => {
        new SuccessReponse({
            message : 'Get Token Success',
            metadata :  await AccessService.handleRefreshToken(req.body.refreshToken)
        }).send(res);
    } 

    logout = async (req, res, next) => {
        new SuccessReponse({
            message : 'logout success',
            metadata :  await AccessService.logout(req.keyStore)
        }).send(res);
    }

    login = async (req, res, next) => {
        new SuccessReponse({
            metadata : await AccessService.login(req.body)
        }).send(res);
    }

    signUp = async (req, res, next) => {
        new CREATED({
            message: "register Ok",
            metadata: await AccessService.signUp(req.body),
            options: { limit : 10 }
        }).send(res);
    }
}

module.exports = new AccessController();