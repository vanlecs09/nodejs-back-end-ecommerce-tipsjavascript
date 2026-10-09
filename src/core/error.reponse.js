'use strict'

const StatusCode = {
    FORBIDDEN : 404,
    CONFLICT : 409,
}

const StatusReasonCode = {
    FORBIDDEN : 'Bad request error',
    CONFLICT : 'Conflict error',
}

class ErrorReponse extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
    }
}

class ConflictError extends ErrorReponse {
    constructor(message = StatusReasonCode.CONFLICT, status = StatusCode.CONFLICT) {
        super(message, status);
    }
}

class BadRequestError extends ErrorReponse {
    constructor(message = StatusReasonCode.FORBIDDEN, status = StatusCode.FORBIDDEN) {
        super(message, status);
    }
}

module.exports = {
    ConflictError,
    BadRequestError
}