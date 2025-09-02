import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Card from '../models/card';
import { HTTP, BadRequestError, NotFoundError } from '../errors';

export async function getCards(_req: Request, res: Response, next: NextFunction) {
  try {
    const cards = await Card.find({});
    return res.status(HTTP.OK).send(cards);
  } catch (err) {
    return next(err);
  }
}

export async function createCard(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, link } = req.body;
    // @ts-ignore
    const owner = req.user._id;

    const card = await Card.create({ name, link, owner });
    return res.status(HTTP.CREATED).send(card);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      return next(new BadRequestError('Переданы некорректные данные карточки'));
    }
    if (err instanceof mongoose.Error.CastError) {
      return next(new BadRequestError('Некорректный идентификатор владельца'));
    }
    return next(err);
  }
}

export async function deleteCard(req: Request, res: Response, next: NextFunction) {
  try {
    const { cardId } = req.params;
    const card = await Card.findByIdAndDelete(cardId);
    if (!card) {
      return next(new NotFoundError('Карточка не найдена'));
    }
    return res.status(HTTP.OK).send(card);
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      return next(new BadRequestError('Некорректный формат id карточки'));
    }
    return next(err);
  }
}

export async function likeCard(req: Request, res: Response, next: NextFunction) {
  try {
    const { cardId } = req.params;
    // @ts-ignore
    const userId = req.user._id;

    const card = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: userId } },
      { new: true },
    );

    if (!card) {
      return next(new NotFoundError('Карточка не найдена'));
    }
    return res.status(HTTP.OK).send(card);
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      return next(new BadRequestError('Некорректный формат id карточки'));
    }
    return next(err);
  }
}

export async function dislikeCard(req: Request, res: Response, next: NextFunction) {
  try {
    const { cardId } = req.params;
    // @ts-ignore
    const userId = req.user._id;

    const card = await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: userId } },
      { new: true },
    );

    if (!card) {
      return next(new NotFoundError('Карточка не найдена'));
    }
    return res.status(HTTP.OK).send(card);
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      return next(new BadRequestError('Некорректный формат id карточки'));
    }
    return next(err);
  }
}
