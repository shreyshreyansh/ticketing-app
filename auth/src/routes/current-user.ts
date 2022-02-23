import express from 'express';

import { currentUser } from '../middlewares/current-user';

import jwt from 'jsonwebtoken';

const router = express.Router();

// this route is used to check if the user accessing the resources
// is logged in
//===================STEPS===================
/*
  1. Does this user has a req.session.jwt set?
  2. It is not set or the jwt is invalid, return early. Response ==> { currentUser: null }
  3. If yes and jwt is valid then send back the info stored into the Jwt. Response ==> { currentUser: { id: '...', email: '...' } }
*/

router.get('/api/users/currentuser', currentUser, (req, res) => {
  /*
  if(!req.session || !req.session.jwt)
  is equivalent to
  if(!req.session?.jwt)
  */
  // if req.currentUser is undefined (not logged in) then { currentUser: null }
  res.send({ currentUser: req.currentUser || null });
});

export { router as currentuserRouter };
