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
  if (err instanceof RequestValidationError) {
    console.log('handling this error as a request validation error');
  }

  if (err instanceof DatabaseConnectionError) {
    console.log('handling this error as a database connection error');
  }
  // err.message will have the string we gave while throwing
  // the error function
  res.status(400).send({
    message: err.message,
  });
};
