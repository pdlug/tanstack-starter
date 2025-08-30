/* eslint-disable functional/no-class-inheritance */

export class AppError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = this.constructor.name;
  }
}

export class ValidationError extends AppError {}
export class UnauthorizedError extends AppError {}
export class NotFoundError extends AppError {}
export class InternalError extends AppError {}
export class MissingContextError extends AppError {}
export class PostCreationError extends AppError {}
export class DatabaseError extends AppError {}

export type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };
