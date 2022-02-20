// ValidationError describes a type, that comes back whenever
// we do a validation attempt using express validator
import { ValidationError } from 'express-validator';

// we are building our own custom implementation of an error
export class RequestValidationError extends Error {
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
  constructor(private errors: ValidationError[]) {
    super();

    // this line is only because we are extending to a built-in class
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }
}
