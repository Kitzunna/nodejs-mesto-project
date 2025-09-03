import { Request, Response, NextFunction } from 'express';
import { HTTP } from '../errors';

export default function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (err?.code === 11000) {
    return res.status(HTTP.CONFLICT).send({ message: 'Пользователь с таким email уже существует' });
  }

  if (err?.name === 'JsonWebTokenError' || err?.name === 'TokenExpiredError') {
    return res.status(HTTP.UNAUTHORIZED).send({ message: 'Необходима авторизация' });
  }

  const status = typeof err?.statusCode === 'number' ? err.statusCode : HTTP.INTERNAL_ERROR;

  const message = status === HTTP.INTERNAL_ERROR
    ? 'На сервере произошла ошибка'
    : err?.message || 'Ошибка';

  return res.status(status).send({ message });
}
