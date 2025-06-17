import mongoose, { HydratedDocument, model, Model, Types } from "mongoose";

const POST_COLLECTION_NAME = 'post';

export interface Post {
  title: string;
  shortDescription: string;
  content: string;
  blogId: Types.ObjectId;
  blogName: string;
  createdAt: Date;
  deletedAt: Date | null; 
}

type PostModel = Model<Post>;
export type PostDocument = HydratedDocument<Post>;

const PostSchema = new mongoose.Schema<Post>({
  title: { type: String, required: true },
  shortDescription: { type: String, required: true },
  content: { type: String, required: true },
  blogId: { type: mongoose.Schema.Types.ObjectId, required: true },
  blogName: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now }, 
  deletedAt: { type: Date, default: null },
});

export const PostModel = model<Post, PostModel>( POST_COLLECTION_NAME, PostSchema );

