// this will be envoked when a user goes to a route that does not exists

import { CustomError } from './custom-error';

export class NotFoundError extends CustomError {
  reason = 'Route not found';
  statusCode = 404;

  constructor() {
    super('Route not found');

    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
  serializeErrors() {
    return [
      {
        message: this.reason,
      },
    ];
  }
}
