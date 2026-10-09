'use strict'


const STATUSCODE = {
    OK: 200,
    CREATED: 201,
}

const REASONSTATUSCODE = {
    OK: 'OK',
    CREATEED: 'CREATED',
}

class SuccessReponse {
    constructor({ message, statusCode, reasonStatusCode, metadata }) {
        this.message = !message ? reasonStatusCode : message;
        this.status = statusCode;
        this.metadata = metadata;
    }

    send(res, header = {}) {
        return res.status(this.status).json(this);
    }
}

class OK extends SuccessReponse {
    constructor({ message = REASONSTATUSCODE.OK, metadata }) {
        super({ message, statusCode: STATUSCODE.OK, metadata });
    }
}

class CREATED extends SuccessReponse {
    constructor({ options: { }, message = REASONSTATUSCODE.CREATEED, statusCode = STATUSCODE.CREATED, reasonStatusCode, metadata }) {
        super({ message, statusCode, reasonStatusCode, metadata })
        this.options = options;
    }
}

module.exports = {
    OK,
    CREATED
}