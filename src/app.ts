import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import usersRouter from './routes/users';
import cardsRouter from './routes/cards';
import { NotFoundError, HTTP } from './errors';

const app = express();
app.use(express.json());

app.use((req: Request, _res: Response, next: NextFunction) => {
  req.user = {
    _id: '68b6e325263a8de771eb58d9',
  };
  next();
});

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

app.get('/', (_req: Request, res: Response) => {
  res.status(HTTP.OK).send({ message: 'Mesto API is up' });
});

app.use('*', (_req: Request, _res: Response, next: NextFunction) => {
  next(new NotFoundError('Ресурс не найден'));
});

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err?.statusCode ?? HTTP.INTERNAL_ERROR;
  const message = status === HTTP.INTERNAL_ERROR
    ? 'На сервере произошла ошибка'
    : err?.message;

  res.status(status).send({ message });
});

const { PORT = 3000 } = process.env;
const MONGO_URL = 'mongodb://localhost:27017/mestodb';

mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(Number(PORT), () => {
      console.log(`Server: http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

export default app;
