import { celebrate, Joi, Segments } from 'celebrate';

export const urlRegex = /^https?:\/\/(www\.)?([-a-zA-Z0-9]{1}[-a-zA-Z0-9.]*\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}([-._~:/?#[\]@!$&'()*+,;=0-9]*)?$/;

export const validateSignin = celebrate({
  [Segments.BODY]: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  }),
});

export const validateSignup = celebrate({
  [Segments.BODY]: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    name: Joi.string().min(2).max(30).optional(),
    about: Joi.string().min(2).max(30).optional(),
    avatar: Joi.string().pattern(urlRegex).optional(),
  }),
});

export const validateUserIdParam = celebrate({
  [Segments.PARAMS]: Joi.object({
    userId: Joi.string().hex().length(24).required(),
  }),
});

export const validateUpdateProfile = celebrate({
  [Segments.BODY]: Joi.object({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
});

export const validateUpdateAvatar = celebrate({
  [Segments.BODY]: Joi.object({
    avatar: Joi.string().pattern(urlRegex).required(),
  }),
});

export const validateCreateCard = celebrate({
  [Segments.BODY]: Joi.object({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().pattern(urlRegex).required(),
  }),
});

export const validateCardIdParam = celebrate({
  [Segments.PARAMS]: Joi.object({
    cardId: Joi.string().hex().length(24).required(),
  }),
});
