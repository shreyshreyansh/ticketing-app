import express from 'express';
import { json } from 'body-parser';

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

app.use(errorHandler);

app.listen('3000', () => {
  console.log(`\u001b[32mAuth listening on port 3000!\u001b[0m`);
});
