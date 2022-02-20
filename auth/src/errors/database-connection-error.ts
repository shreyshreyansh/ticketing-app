export class DatabaseConnectionError extends Error {
  reason = 'Error connecting to the database';
  statusCode = 500;

  constructor() {
    super();

    // this line is only because we are extending to a built-in class
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  // it formats the error reponse into the custom error response we want
  /**
     * {
          errors: {
            message: string,
            field?: string
          }[]
        }
     */
  serializeErrors() {
    return [
      {
        message: this.reason,
      },
    ];
  }
}
