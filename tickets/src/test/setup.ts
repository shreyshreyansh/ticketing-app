import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import jwt from 'jsonwebtoken';

/**
 * "if the server is not already listening for connections
 * then it is bound to an ephemeral port for you so there
 * is no need to keep track of ports."
 *
 * So as we know app.js is not listening on any port (infact index.js
 * is the one that is listening on port 3000), the test server will get a
 * random ephemeral port and we can overcome the port in use error
 */
import { app } from '../app';

// tell TS there is a global property called signup
declare global {
  // signup will be a function that returns a promise which
  // will be resolved by an array of string (cookie)
  var signup: () => string[];
}

import 'dotenv/config';

let mongo: any;

// runs before all the test startup
beforeAll(async () => {
  // We create a new instance of in-memory of copy mongodb server
  // each time we start the test server
  mongo = await MongoMemoryServer.create();

  // get the URL of the in-memory mongodb created
  const mongoUri = mongo.getUri();

  // tells mongoose to connect to the the in-memory mongodb server instance
  await mongoose.connect(mongoUri);
});

// runs before each of the test
beforeEach(async () => {
  // before each test start we are going to delete all the data (collections)
  // inside the in-memory mongodb server

  // get all the collection that exists in the mongodb server
  const collections = await mongoose.connection.db.collections();

  // loop over the collections and delete the data inside
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

// runs after all the tests have run
afterAll(async () => {
  // stop the in-memory mongodb server
  mongo.stop();
  // close the mongoose connection to the in-memory mongodb server
  mongoose.connection.close();
});

// declare a global function that can be used by any of the test files
global.signup = () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }

  // Build a JWT payload. { id, email }
  const payload = {
    id: 'test@test.com',
    password: 'password',
  };

  // Use JWT KEY
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // Build Session Object { jwt: JWT_TOKEN }
  const session = { jwt: token };

  // Turn session into json
  const sessionJSON = JSON.stringify(session);

  // Take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString('base64');

  // Returns a string thats the cookie with encoded data
  return [`session=${base64}`];
};
