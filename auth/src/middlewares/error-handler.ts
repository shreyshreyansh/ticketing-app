/**
 * Express automatically considers a function as an
 * error handler if the function has four arguments
 */
import { Request, Response, NextFunction } from 'express';

export const errorHandle = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log('something went wrong', err);
  // err.message will have the string we gave while throwing
  // the error function
  res.status(400).send({
    message: err.message,
  });
};
