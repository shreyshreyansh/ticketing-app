"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const custom_error_1 = require("../errors/custom-error");
const errorHandler = (err, req, res, next) => {
    // type checking the error
    if (err instanceof custom_error_1.CustomError) {
        return res.status(err.statusCode).send({ errors: err.serializeErrors() });
    }
    console.error(err);
    // some generic error
    res.status(400).send({
        errors: [
            {
                message: 'Something went wrong',
            },
        ],
    });
};
exports.errorHandler = errorHandler;
