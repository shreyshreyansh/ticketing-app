"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestValidationError = void 0;
// abstract class
const custom_error_1 = require("./custom-error");
// we are building our own custom implementation of an error
class RequestValidationError extends custom_error_1.CustomError {
    constructor(errors) {
        super('Invalid input');
        this.errors = errors;
        // this class needs to be called with the ValidationError from the express-validator
        /**
         *
         * constructor(private errors: ValidationError[]){super();}
         *
         * is just equivalent to writting
         *
         * errors: ValidationError[]
         * constructor(errors: ValidationError[]){
         *    super();
         *    this.errors = errors;
         * }
         */
        this.statusCode = 400;
        // this line is only because we are extending to a built-in class
        Object.setPrototypeOf(this, RequestValidationError.prototype);
    }
    // it formats the error reponse into the custom error response we want
    /**
       * {
            errors: {
              message: string,
              field?: string
            }[]
          }
       */
    serializeErrors() {
        return this.errors.map((error) => {
            return {
                message: error.msg,
                field: error.param,
            };
        });
    }
}
exports.RequestValidationError = RequestValidationError;
