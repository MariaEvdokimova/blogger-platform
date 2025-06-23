import mongoose, { HydratedDocument, model, Model } from "mongoose";
import { CommentLikesEntity } from "../models/Likes.entity";

const COLLECTION_NAME = 'comment_likes';

export enum LikeStatus {
  None = 'None', 
  Like = 'Like', 
  Dislike = 'Dislike',
 };

interface CommentLikesMethods {
  updateLikeStatus ( status: LikeStatus): void 
}

type CommentLikesStatics = typeof CommentLikesEntity;
type CommentLikesModel = Model<CommentLikesEntity, {}, CommentLikesMethods> & CommentLikesStatics;
export type CommentLikesDocument = HydratedDocument<CommentLikesEntity, CommentLikesMethods>;

const CommentLikesSchema = new mongoose.Schema<CommentLikesEntity, CommentLikesModel, CommentLikesMethods>({
  commentId: { type: mongoose.Schema.Types.ObjectId, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  status: { type: String, enum: LikeStatus, default: LikeStatus.None},
  createdAt: { type: Date, required: true, default: Date.now, immutable: true /* Запрет на изменение */}, 
});

CommentLikesSchema.loadClass(CommentLikesEntity);
export const CommentLikesModel = model<CommentLikesEntity, CommentLikesModel>( COLLECTION_NAME, CommentLikesSchema );
