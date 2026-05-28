/* eslint-disable functional/no-class-inheritance -- Error subclasses need real prototype chain for instanceof checks */

export class AppError extends Error {
  readonly status: number;

  constructor(message: string, status: number, options?: ErrorOptions) {
    super(message, options);
    this.name = this.constructor.name;
    this.status = status;
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string, options?: ErrorOptions) {
    super(message, 401, options);
  }
}

export class DatabaseError extends AppError {
  constructor(message: string, options?: ErrorOptions) {
    super(message, 500, options);
  }
}
