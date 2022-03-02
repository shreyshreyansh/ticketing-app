import express from 'express';

// make sure to import it after express
import 'express-async-errors';

import { json } from 'body-parser';

import cookieSession from 'cookie-session';

import { errorHandler, NotFoundError, currentUser } from '@k8stickets/common';

import { createTicketRouter } from './routes/new';
import { showTicketRouter } from './routes/show';

const app = express();

// as traffic is being proxied to our app through ingress nginx
// express will see the fact that the stuff is being proxied.
// So by default express will not trust the proxy are it will not
// use the cookie-session middleware and we have passed the option
// 'secure: true'. So to use the middleware here we have to trust
// the proxy
app.set('trust proxy', true);

app.use(json());

// new cookie session middleware with the provided options
// this middleware will attach the property session to req,
// which provides an object representing the loaded session

// middleware will automatically add a Set-Cookie header to
// the response if the contents of req.session were altered

// =========================NOTE=============================
/*
  No Set-Cookie header will be in the response (and thus no 
  session created for a specific user) unless there are contents 
  in the session, so be sure to add something to req.session as 
  soon as you have identifying information to store for the session.
*/
//===========================================================
app.use(
  cookieSession({
    // as JWT inside is already encrypted and we don't have any
    // other naked secrets inside it, therefore we do not
    // encryt our cookie.
    // Advantage of this is that service written in a different language
    // can use the cookie without worrying about the decryption.
    signed: false,
    // use cookies only if users are connnecting over an HTTPS connection
    // this tells that use secure: false when we are using test server
    secure: process.env.NODE_ENV !== 'test',
  })
);

app.use(currentUser);

app.use(createTicketRouter);
app.use(showTicketRouter);

// not found route
// app.all represents GET, POST, PUT, PATCH, etc.
app.all('*', () => {
  // as soon as it throws a not found error, express will capture the
  // error and throw it to the errorHandler as through that the user will
  // get the reponse
  throw new NotFoundError('Route not found');
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

export { app };
