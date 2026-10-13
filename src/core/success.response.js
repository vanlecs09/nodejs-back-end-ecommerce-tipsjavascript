'use strict'

const { ReasonPhrases, StatusCodes } = require("../utils/httpStatusCode");


// const STATUSCODE = {
//     OK: 200,
//     CREATED: 201,
// }

// const REASONSTATUSCODE = {
//     OK: 'OK',
//     CREATEED: 'CREATED',
// }

class SuccessReponse {
    constructor({ message, statusCode = StatusCodes.OK, reasonStatusCode = ReasonPhrases.OK, metadata }) {
        this.message = !message ? reasonStatusCode : message;
        this.status = statusCode;
        this.metadata = metadata;
    }

    send(res, header = {}) {
        return res.status(this.status).json(this);
    }
}

class OK extends SuccessReponse {
    constructor({ message = ReasonPhrases.OK, metadata }) {
        super({ message, statusCode: StatusCodes.OK, metadata });
    }
}

class CREATED extends SuccessReponse {
    constructor({ options = {}, message = ReasonPhrases.CREATED, statusCode = StatusCodes.CREATED, reasonStatusCode, metadata }) {
        super({ message, statusCode, reasonStatusCode, metadata })
        this.options = options;
    }
}

module.exports = {
    OK,
    CREATED,
    SuccessReponse
}