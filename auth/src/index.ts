import mongoose from 'mongoose';
import { app } from './app';

// mongodb connection and start listening on port 3000
const start = async () => {
  // check at the start of the app if env variables are set properly
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined');
  }
  try {
    await mongoose.connect(process.env.MONGO_URI);
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
