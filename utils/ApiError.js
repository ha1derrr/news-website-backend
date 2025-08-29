class ApiError extends Error {
  constructor(statusCode, message = "Something went wrong") {
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.message = message;
    this.success = false;

    Error.captureStackTrace(this, this.constructor);
  }
}

export { ApiError };
