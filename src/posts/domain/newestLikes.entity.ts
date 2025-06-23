import mongoose, { HydratedDocument, model, Model } from "mongoose";
import { NewestLikesEntity } from "../models/Post.entity";

const NEWEST_LIKES_COLLECTION_NAME = 'newestLikes';

interface newestLikes {
  addedAt: Date;
  userId: string;
  login: string;
}

type NewestLikesStatics = typeof NewestLikesEntity;
type NewestLikesModel = Model<NewestLikesEntity, {}, {}> & NewestLikesStatics;
export type NewestLikesDocument = HydratedDocument<NewestLikesEntity, {}>;

export const NewestLikesSchema = new mongoose.Schema<NewestLikesEntity, NewestLikesModel, {}>({
  addedAt: { type: Date, required: true, default: Date.now },
  userId: { type: String, required: true },
  login: { type: String, required: true },
});

NewestLikesSchema.loadClass(NewestLikesEntity);

export const NewestLikesModel = model<NewestLikesEntity, NewestLikesModel>(NEWEST_LIKES_COLLECTION_NAME, NewestLikesSchema);
