import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

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

let mongo: any;

// runs before all the test startup
beforeAll(async () => {
  // We create a new instance of in-memory of copy mongodb server
  // each time we start the test server
  mongo = new MongoMemoryServer();

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
