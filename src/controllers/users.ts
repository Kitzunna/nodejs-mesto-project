import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import User from '../models/user';
import { HTTP, BadRequestError, NotFoundError } from '../errors';

export async function getUsers(_req: Request, res: Response, next: NextFunction) {
  try {
    const users = await User.find({});
    return res.status(HTTP.OK).send(users);
  } catch (err) {
    return next(err);
  }
}

export async function getUserById(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).orFail();
    return res.status(HTTP.OK).send(user);
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      return next(new BadRequestError('Некорректный формат id'));
    }
    if (err instanceof mongoose.Error.DocumentNotFoundError) {
      return next(new NotFoundError('Пользователь не найден'));
    }
    return next(err);
  }
}

export async function createUser(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, about, avatar } = req.body;
    const user = await User.create({ name, about, avatar });
    return res.status(HTTP.CREATED).send(user);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      return next(new BadRequestError('Переданы некорректные данные пользователя'));
    }
    return next(err);
  }
}

export async function updateProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, about } = req.body;
    // @ts-ignore
    const userId = req.user._id;

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { name, about } },
      { new: true, runValidators: true },
    );

    if (!user) {
      return next(new NotFoundError('Пользователь не найден'));
    }
    return res.status(HTTP.OK).send(user);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      return next(new BadRequestError('Переданы некорректные данные пользователя'));
    }
    if (err instanceof mongoose.Error.CastError) {
      return next(new BadRequestError('Некорректный идентификатор пользователя'));
    }
    return next(err);
  }
}

export async function updateAvatar(req: Request, res: Response, next: NextFunction) {
  try {
    const { avatar } = req.body;
    // @ts-ignore
    const userId = req.user._id;

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { avatar } },
      { new: true, runValidators: true },
    );

    if (!user) {
      return next(new NotFoundError('Пользователь не найден'));
    }
    return res.status(HTTP.OK).send(user);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      return next(new BadRequestError('Переданы некорректные данные аватара'));
    }
    if (err instanceof mongoose.Error.CastError) {
      return next(new BadRequestError('Некорректный идентификатор пользователя'));
    }
    return next(err);
  }
}
