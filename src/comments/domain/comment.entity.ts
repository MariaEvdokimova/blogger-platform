import mongoose, { HydratedDocument, model, Model, Types } from "mongoose";
import { LikeStatus } from "./likes.entity";
import { CommentEntity } from "../models/Comments.entity";

const COMMENTS_COLLECTION_NAME = 'comments';

export interface Comment {
  content:	string;
  commentatorInfo: {
    userId: Types.ObjectId;  
    userLogin: string;
  };
  likesInfo: {
    likesCount: number;
    dislikesCount: number;
  };
  createdAt: Date;
  postId: Types.ObjectId;
  deletedAt: Date | null; 
}

export type CommentWithMyStatus = Comment & {
  _id: Types.ObjectId,
  likesInfo: Comment['likesInfo'] & {
    myStatus: LikeStatus;
  };
};

export type CommentLean = Omit<Comment, '_id'> & { 
    _id: Types.ObjectId 
};

interface CommentMethods {
  markAsDeleted(): void;
  updateContent( content: string ): void;
  updateLikesInfo ( likeStatus: LikeStatus, userCommentStatus: LikeStatus | undefined): void;
}

type CommentStatics = typeof CommentEntity;
type CommentModel = Model<CommentEntity, {}, CommentMethods> & CommentStatics;
export type CommentDocument = HydratedDocument<CommentEntity, CommentMethods>;

const CommentSchema = new mongoose.Schema<CommentEntity, CommentModel, CommentMethods>({
  content: { type: String, required: true },
  commentatorInfo: {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    userLogin: { type: String, required: true },
  },  
  likesInfo: {
    likesCount: { type: Number, default: 0 },
    dislikesCount: { type: Number, default: 0 },
  },
  createdAt: { type: Date, required: true, default: Date.now, immutable: true /* Запрет на изменение */}, 
  postId: { type: mongoose.Schema.Types.ObjectId, required: true },
  deletedAt: { type: Date, default: null },
});

CommentSchema.loadClass(CommentEntity);
export const CommentModel = model<CommentEntity, CommentModel>( COMMENTS_COLLECTION_NAME, CommentSchema );
