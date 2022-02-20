/**
 * Express automatically considers a function as an
 * error handler if the function has four arguments
 */
import { Request, Response, NextFunction } from 'express';

import { RequestValidationError } from '../errors/request-validation-error';
import { DatabaseConnectionError } from '../errors/database-connection-error';

export const errorHandle = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // type checking the error
  // handling this error as a request validation error
  if (err instanceof RequestValidationError) {
    // formating the validation error to the common error response which is:
    /**
     * {
          errors: {
            message: string,
            field?: string
          }[]
        }
     */
    const formattedErrors = err.errors.map((error) => {
      return {
        message: error.msg,
        field: error.param,
      };
    });

    return res.status(400).send({ errors: formattedErrors });
  }

  // handling this error as a database connection error
  if (err instanceof DatabaseConnectionError) {
    // database connection is an internal server error
    return res.status(500).send({
      errors: [
        {
          message: err.reason,
        },
      ],
    });
  }
  // some generic error
  res.status(400).send({
    errors: [
      {
        message: 'Something went wrong',
      },
    ],
  });
};
