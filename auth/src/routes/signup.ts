import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// use express-validator as a middleware to check if email and password is valid
// if the email or password is invalid, it will return the string inside withMessage function

// a valid email should follow an actual email format through isEmail()
// a valid password should be of 4>=length<=20
router.post(
  '/api/users/signup',
  [
    body('email').isEmail().withMessage('Email must be valid!'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must be between 4 and 20 characters!'),
  ],
  (req: Request, res: Response) => {
    // we can find the result of the validation middleware by calling the validationResult function
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // this will automatically be picked by the error handler middleware
      throw new Error('Invalid email or password');
    }
    const { email, password } = req.body;
    res.send({ msg: 'Hi there!' });
  }
);

export { router as signupRouter };
