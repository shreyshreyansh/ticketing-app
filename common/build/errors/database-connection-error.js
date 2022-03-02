"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseConnectionError = void 0;
// abstract class
const custom_error_1 = require("./custom-error");
class DatabaseConnectionError extends custom_error_1.CustomError {
    constructor() {
        super('Database connection error');
        this.reason = 'Error connecting to the database';
        this.statusCode = 500;
        // this line is only because we are extending to a built-in class
        Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
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
        return [
            {
                message: this.reason,
            },
        ];
    }
}
exports.DatabaseConnectionError = DatabaseConnectionError;
