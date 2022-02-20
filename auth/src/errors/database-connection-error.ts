export class DatabaseConnectionError extends Error {
  reason = 'Error connecting to the database';

  constructor() {
    super();

    // this line is only because we are extending to a built-in class
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }
}
