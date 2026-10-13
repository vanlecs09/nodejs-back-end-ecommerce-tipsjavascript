'use strict'

const { StatusCodes, ReasonPhrases } = require("../utils/httpStatusCode");

class ErrorReponse extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
    }
}

class ConflictError extends ErrorReponse {
    constructor(message = ReasonPhrases.CONFLICT, status = StatusCodes.CONFLICT) {
        super(message, status);
    }
}

class BadRequestError extends ErrorReponse {
    constructor(message = ReasonPhrases.FORBIDDEN, status = StatusCodes.FORBIDDEN) {
        super(message, status);
    }
}

class AuthFailureError extends ErrorReponse {
    constructor(message = ReasonPhrases.UNAUTHORIZED, status = StatusCodes.UNAUTHORIZED)
    {
        super(message, status);
    }
}

class NotFoundError extends ErrorReponse {
    constructor(message = ReasonPhrases.NOT_FOUND, status = StatusCodes.NOT_FOUND)
    {
        super(message, status);
    }
}

class ForbiddenError extends ErrorReponse {
    constructor(message = ReasonPhrases.FORBIDDEN, status = StatusCodes.FORBIDDEN)
    {
        super(message, status);
    }
}

module.exports = {
    ConflictError,
    BadRequestError,
    AuthFailureError,
    NotFoundError,
    ForbiddenError
}