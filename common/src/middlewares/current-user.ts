import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface UserPayload {
  id: string;
  email: string;
}

// redefining the Request type
declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

// this middleware extracts the JWT payload and set it on
// req.currentUser
export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session?.jwt) {
    return next();
  }

  try {
    const payload = jwt.verify(
      req.session.jwt,
      process.env.JWT_KEY!
    ) as UserPayload;
    /*
        TS will yell that req.currentUser = payload, curremtUser is not defined on req as
        req is of Request type (given by Express). Therefore we need to redefine the Request property
    */
    req.currentUser = payload;
  } catch (err) {}
  next();
};
