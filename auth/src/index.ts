import express from 'express';
import { json } from 'body-parser';

import { currentuserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';

const app = express();
app.use(json());

app.use(currentuserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);


app.listen('3000', () => {
    console.log(`\u001b[32mAuth listening on port 3000!\u001b[0m`);
});
