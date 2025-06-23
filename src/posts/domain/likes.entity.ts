import mongoose, { HydratedDocument, model, Model } from "mongoose";
import { PostLikesEntity } from "../models/Likes.entity";

const COLLECTION_NAME = 'post_likes';

export enum LikeStatus {
  None = 'None', 
  Like = 'Like', 
  Dislike = 'Dislike',
 };

interface PostLikesMethods {
  updateLikeStatus ( status: LikeStatus): void 
}

type PostLikesStatics = typeof PostLikesEntity;
type PostLikesModel = Model<PostLikesEntity, {}, PostLikesMethods> & PostLikesStatics;
export type PostLikesDocument = HydratedDocument<PostLikesEntity, PostLikesMethods>;

const PostLikesSchema = new mongoose.Schema<PostLikesEntity, PostLikesModel, PostLikesMethods>({
  postId: { type: mongoose.Schema.Types.ObjectId, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  status: { type: String, enum: LikeStatus, default: LikeStatus.None},
  createdAt: { type: Date, required: true, default: Date.now, immutable: true /* Запрет на изменение */}, 
});

PostLikesSchema.loadClass(PostLikesEntity);
export const PostLikesModel = model<PostLikesEntity, PostLikesModel>( COLLECTION_NAME, PostLikesSchema );
