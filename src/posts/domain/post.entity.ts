import mongoose, { HydratedDocument, model, Model, Types } from "mongoose";
import { NewestLikesEntity, PostEntity } from "../models/Post.entity";
import { LikeStatus } from "./likes.entity";
import { NewestLikesSchema } from "./newestLikes.entity";

const POST_COLLECTION_NAME = 'post';

interface Post {
  title: string;
  shortDescription: string;
  content: string;
  blogId: Types.ObjectId;
  blogName: string;
  createdAt: Date;
  deletedAt: Date | null; 
  extendedLikesInfo: {
    likesCount: number;
    dislikesCount: number;
    newestLikes: NewestLikesEntity[]
  };
}

export type PostWithMyStatus = Post & {
  _id: Types.ObjectId,
  extendedLikesInfo: Post['extendedLikesInfo'] & {
    myStatus: LikeStatus;
  };
};

export type PostLean = Omit<Post, '_id'> & { 
    _id: Types.ObjectId 
};

interface PostMethods {
  updatePostInfo( title: string, shortDescription: string, content: string, blogId: Types.ObjectId): void,
  markAsDeleted(): void,
  updateLikesInfo ( likeStatus: LikeStatus, userPostStatus: LikeStatus | undefined,  userId: string, login: string): void;
  updateNewestLikes( newestLikes: NewestLikesEntity[]): void;
}

type PostStatics = typeof PostEntity;
type PostModel = Model<PostEntity, {}, PostMethods> & PostStatics;
export type PostDocument = HydratedDocument<PostEntity, PostMethods>;

const PostSchema = new mongoose.Schema<PostEntity, PostModel, PostMethods>({
  title: { type: String, required: true },
  shortDescription: { type: String, required: true },
  content: { type: String, required: true },
  blogId: { type: mongoose.Schema.Types.ObjectId, required: true },
  blogName: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now }, 
  deletedAt: { type: Date, default: null },
  extendedLikesInfo: {
    likesCount: { type: Number, default: 0 },
    dislikesCount: { type: Number, default: 0 },
    newestLikes: { type: [NewestLikesSchema]}
    }
  },
  { optimisticConcurrency: true }
);

PostSchema.loadClass(PostEntity);
export const PostModel = model<PostEntity, PostModel>( POST_COLLECTION_NAME, PostSchema );

