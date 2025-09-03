import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import {
  HTTP, BadRequestError, NotFoundError, ConflictError, UnauthorizedError,

} from '../errors';

export async function getUsers(_req: Request, res: Response, next: NextFunction) {
  try {
    const users = await User.find({}).select('-password');
    return res.status(HTTP.OK).send(users);
  } catch (err) {
    return next(err);
  }
}

export async function getCurrentUser(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await User.findById(req.user._id).select('-password').orFail();
    return res.status(HTTP.OK).send(user);
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      return next(new BadRequestError('Некорректный идентификатор пользователя'));
    }
    if (err instanceof mongoose.Error.DocumentNotFoundError) {
      return next(new NotFoundError('Пользователь не найден'));
    }
    return next(err);
  }
}

export async function getUserById(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select('-password').orFail();
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
    const {
      name, about, avatar, email, password,
    } = req.body;

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    });

    const userObj = user.toObject();
    delete userObj.password;

    return res.status(HTTP.CREATED).send(userObj);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      return next(new BadRequestError('Переданы некорректные данные пользователя'));
    }
    if (err instanceof mongoose.mongo.MongoServerError && err.code === 11000) {
      return next(new ConflictError('Пользователь с таким email уже существует'));
    }
    return next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new BadRequestError('Укажите email и пароль'));
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return next(new UnauthorizedError('Неправильные почта или пароль'));
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(new UnauthorizedError('Неправильные почта или пароль'));
    }

    const secret = process.env.JWT_SECRET || 'dev-secret';
    const token = jwt.sign({ _id: user._id.toString() }, secret, { expiresIn: '7d' });

    res.cookie('jwt', token, {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(HTTP.OK).send({ message: 'Успешный вход' });
  } catch (err) {
    return next(err);
  }
}

export async function updateProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, about } = req.body;
    const userId = req.user._id;

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { name, about } },
      { new: true, runValidators: true },
    ).select('-password');

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
    const userId = req.user._id;

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { avatar } },
      { new: true, runValidators: true },
    ).select('-password');

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
