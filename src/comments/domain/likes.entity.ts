import mongoose, { HydratedDocument, model, Model, Types } from "mongoose";

const COLLECTION_NAME = 'comment_likes';

export enum LikeStatus {
  None = 'None', 
  Like = 'Like', 
  Dislike = 'Dislike',
 };

export interface CommentLikes {
  commentId: Types.ObjectId; 
  userId: Types.ObjectId; 
  status: LikeStatus;
  createdAt: Date;
}

type CommentLikesModel = Model<CommentLikes>;
export type CommentLikesDocument = HydratedDocument<CommentLikes>;

const CommentLikesSchema = new mongoose.Schema<CommentLikes>({
  commentId: { type: mongoose.Schema.Types.ObjectId, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  status: { type: String, enum: LikeStatus, default: LikeStatus.None},
  createdAt: { type: Date, required: true, default: Date.now, immutable: true /* Запрет на изменение */}, 
});

export const CommentLikesModel = model<CommentLikes, CommentLikesModel>( COLLECTION_NAME, CommentLikesSchema );
