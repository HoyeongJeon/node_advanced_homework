export class customError extends Error {
  constructor(statusCode, name, message) {
    super(message);
    this.statusCode = statusCode;
    this.name = name;
  }
}
