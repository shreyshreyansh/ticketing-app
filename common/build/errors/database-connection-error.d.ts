import { CustomError } from './custom-error';
export declare class DatabaseConnectionError extends CustomError {
    reason: string;
    statusCode: number;
    constructor();
    /**
       * {
            errors: {
              message: string,
              field?: string
            }[]
          }
       */
    serializeErrors(): {
        message: string;
    }[];
}
