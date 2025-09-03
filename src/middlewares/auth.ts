import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { UnauthorizedError } from '../errors';

type TokenPayload = JwtPayload & { _id: string };

export default function auth(req: Request, _res: Response, next: NextFunction) {
  try {
    const { authorization } = req.headers;

    let token: string | undefined;
    if (authorization?.startsWith('Bearer ')) {
      token = authorization.slice('Bearer '.length);
    } else if (req.cookies?.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return next(new UnauthorizedError('Необходима авторизация'));
    }

    const secret = process.env.JWT_SECRET || 'dev-secret';
    const payload = jwt.verify(token, secret) as TokenPayload;

    req.user = { _id: payload._id };
    return next();
  } catch {
    return next(new UnauthorizedError('Необходима авторизация'));
  }
}
