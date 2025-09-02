/* eslint-disable max-classes-per-file */

export const HTTP = {
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500,
  OK: 200,
  CREATED: 201,
} as const;

export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class BadRequestError extends AppError {
  constructor(message = 'Переданы некорректные данные') {
    super(message, HTTP.BAD_REQUEST);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Ресурс не найден') {
    super(message, HTTP.NOT_FOUND);
  }
}
