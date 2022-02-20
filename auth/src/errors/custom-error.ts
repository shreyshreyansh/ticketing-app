// this is a custom error abstract class that will guide all the other error classes
export abstract class CustomError extends Error {
  // if the class extends to this CustomError abstract class
  // you got to have a statusCode property
  abstract statusCode: number;

  constructor(message: string) {
    // super function here is calling new Error(message)
    super(message);

    Object.setPrototypeOf(this, CustomError.prototype);
  }

  // if the class extends to this CustomError abstract class
  // you got to have a function serializeErrors that return the given array
  // of objects
  abstract serializeErrors(): {
    message: string;
    field?: string;
  }[];
}
