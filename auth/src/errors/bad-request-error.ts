import { CustomError } from './custom-error';

// A general purpose bad request error class
export class BadRequestError extends CustomError {
  statusCode = 400;

  constructor(public message: string) {
    super(message);

    Object.setPrototypeOf(this, BadRequestError.prototype);
  }
  serializeErrors() {
    return [
      {
        message: this.message,
      },
    ];
  }
}
