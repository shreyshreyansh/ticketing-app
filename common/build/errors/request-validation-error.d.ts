import { ValidationError } from 'express-validator';
import { CustomError } from './custom-error';
export declare class RequestValidationError extends CustomError {
    private errors;
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
    statusCode: number;
    constructor(errors: ValidationError[]);
    /**
       * {
            errors: {
              message: string,
              field?: string
            }[]
          }
       */
    serializeErrors(): {
        message: any;
        field: string;
    }[];
}
