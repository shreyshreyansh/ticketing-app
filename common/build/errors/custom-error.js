"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomError = void 0;
// this is a custom error abstract class that will guide all the other error classes
class CustomError extends Error {
    constructor(message) {
        // super function here is calling new Error(message)
        super(message);
        Object.setPrototypeOf(this, CustomError.prototype);
    }
}
exports.CustomError = CustomError;
