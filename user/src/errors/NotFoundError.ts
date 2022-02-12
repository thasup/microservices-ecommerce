import { CustomError } from "./CustomError";

export class NotFoundError extends CustomError {
  statusCode = 400;

  constructor() {
    super("Route not found");

    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializeErrors() {
    return [{ message: "Not Found" }];
  }
}
