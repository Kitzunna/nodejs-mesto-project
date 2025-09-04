import mongoose, { Schema, Document } from 'mongoose';
import validator from 'validator';

export interface IUser extends Document {
  name: string;
  about: string;
  avatar: string;
  email: string;
  password: string;
}

const urlRegex = /^https?:\/\/(www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?#?$/;

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      minlength: [2, 'Минимальная длина поля "name" — 2'],
      maxlength: [30, 'Максимальная длина поля "name" — 30'],
      default: 'Жак-Ив Кусто',
      trim: true,
    },
    about: {
      type: String,
      minlength: [2, 'Минимальная длина поля "about" — 2'],
      maxlength: [30, 'Максимальная длина поля "about" — 30'],
      default: 'Исследователь',
      trim: true,
    },
    avatar: {
      type: String,
      default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
      validate: {
        validator: (v: string) => urlRegex.test(v),
        message: 'Некорректный URL аватара',
      },
    },
    email: {
      type: String,
      required: [true, 'Поле "email" должно быть заполнено'],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: (v: string) => validator.isEmail(v),
        message: 'Некорректный email',
      },
    },
    password: {
      type: String,
      required: [true, 'Поле "password" должно быть заполнено'],
      select: false,
    },
  },
  { versionKey: false },
);

userSchema.index({ email: 1 }, { unique: true });

export default mongoose.model<IUser>('user', userSchema);
