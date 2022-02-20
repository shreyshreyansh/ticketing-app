// ValidationError describes a type, that comes back whenever
// we do a validation attempt using express validator
import { ValidationError } from 'express-validator';

// abstract class
import { CustomError } from './custom-error';

// we are building our own custom implementation of an error
export class RequestValidationError extends CustomError {
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
  statusCode = 400;

  constructor(private errors: ValidationError[], message: string) {
    super(message);

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
