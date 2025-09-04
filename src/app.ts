import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import { errors as celebrateErrors } from 'celebrate';
import usersRouter from './routes/users';
import cardsRouter from './routes/cards';
import { login, createUser } from './controllers/users';
import auth from './middlewares/auth';
import { NotFoundError, HTTP } from './errors';
import { requestLogger, errorLogger } from './middlewares/logger';
import errorHandler from './middlewares/errorHandler';
import { validateSignin, validateSignup } from './middlewares/validators';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(requestLogger);

app.post('/signin', validateSignin, login);
app.post('/signup', validateSignup, createUser);

app.use(auth);

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

app.get('/', (_req: Request, res: Response) => {
  res.status(HTTP.OK).send({ message: 'Mesto API is up' });
});

app.use('*', (_req: Request, _res: Response, next: NextFunction) => {
  next(new NotFoundError('Ресурс не найден'));
});

app.use(errorLogger);
app.use(celebrateErrors());
app.use(errorHandler);

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err?.statusCode ?? HTTP.INTERNAL_ERROR;
  const message = status === HTTP.INTERNAL_ERROR ? 'На сервере произошла ошибка' : err?.message;
  res.status(status).send({ message });
});

const { PORT = 3000 } = process.env;
const MONGO_URL = 'mongodb://localhost:27017/mestodb';

mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.warn('MongoDB connected');
    app.listen(Number(PORT), () => {
      console.warn(`Server: http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

export default app;
