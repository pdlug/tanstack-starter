/* eslint-disable functional/no-class-inheritance */

export class AppError extends Error {
  readonly statusCode: number;
  readonly status: number;

  constructor(message: string, statusCode: number, options?: ErrorOptions) {
    super(message, options);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.status = statusCode;
  }
}

export class ValidationError extends AppError {
  constructor(message: string, options?: ErrorOptions) {
    super(message, 400, options);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string, options?: ErrorOptions) {
    super(message, 401, options);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string, options?: ErrorOptions) {
    super(message, 404, options);
  }
}

export class InternalError extends AppError {
  constructor(message: string, options?: ErrorOptions) {
    super(message, 500, options);
  }
}

export class MissingContextError extends AppError {
  constructor(message: string, options?: ErrorOptions) {
    super(message, 500, options);
  }
}

export class PostCreationError extends AppError {
  constructor(message: string, options?: ErrorOptions) {
    super(message, 500, options);
  }
}

export class DatabaseError extends AppError {
  constructor(message: string, options?: ErrorOptions) {
    super(message, 500, options);
  }
}

export type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };
