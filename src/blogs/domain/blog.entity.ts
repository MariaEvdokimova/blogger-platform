import mongoose, { HydratedDocument, model, Model, Types } from "mongoose";

const BLOGS_COLLECTION_NAME = 'blogs';

export interface Blog {
  name:	string;
  description: string;
  websiteUrl:	string;
  createdAt: Date;
  isMembership: boolean;
  deletedAt: Date | null; 
}

type BlogModel = Model<Blog>;
export type BlogDocument = HydratedDocument<Blog>;

const BlogSchema = new mongoose.Schema<Blog>({
  name:	{ type: String, required: true },
  description: { type: String, required: true },
  websiteUrl:	{ type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now }, 
  isMembership: { type: Boolean, required: false },
  deletedAt: { type: Date, default: null },
});

export const BlogModel = model<Blog, BlogModel>( BLOGS_COLLECTION_NAME, BlogSchema );
