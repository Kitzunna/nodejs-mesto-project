import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ICard extends Document {
  name: string;
  link: string;
  owner: Types.ObjectId; // ref: 'user'
  likes: Types.ObjectId[]; // ref: 'user'[]
  createdAt: Date;
}

const cardSchema = new Schema<ICard>(
  {
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 30,
    },
    link: {
      type: String,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    likes: {
      type: [{ type: Schema.Types.ObjectId, ref: 'user' }],
      default: [],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  },
);

export default mongoose.model<ICard>('card', cardSchema);
