import express from 'express';

// make sure to import it after express
import 'express-async-errors';

import { json } from 'body-parser';

import mongoose from 'mongoose';

import { currentuserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';

import { errorHandler } from './middlewares/error-handler';
import { NotFoundError } from './errors/not-found-error';

const app = express();
app.use(json());

app.use(currentuserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

// not found route
// app.all represents GET, POST, PUT, PATCH, etc.
app.all('*', () => {
  // as soon as it throws a not found error, express will capture the
  // error and throw it to the errorHandler as through that the user will
  // get the reponse
  throw new NotFoundError();
});

/**
   If synchronous code throws an error, then Express will catch and process it
   but if the function in the app.all function is async then throwing an error,
   will not be caught by express
   app.all('*', async() => {
    throw new NotFoundError(); // breaks the app
   });

   For errors returned from asynchronous functions invoked by route handlers and 
   middleware, you must pass them to the next() function, where Express will catch 
   and process them.
   app.all('*', async(req, res, next) => {
    next(new NotFoundError());
   })

   If you don't want to use next function to pass the error to Express, we can use
   a package that will handle errors in an async function 'express-async-errors' and 
   it is easy to use. It takes care of the error behind the scene
   app.all('*', async() => {
    throw new NotFoundError(); // will not break the app
   });
 */

app.use(errorHandler);

// mongodb connection and start listening on port 3000
const start = async () => {
  try {
    await mongoose.connect('mongodb://auth-mongo-srv:27017/auth');
    console.log(`\u001b[32mConnected to the auth DB!\u001b[0m`);
  } catch (err) {
    console.error(err);
  }
  app.listen('3000', () => {
    console.log(`\u001b[32mAuth listening on port 3000!\u001b[0m`);
  });
};

// start app
start();
