import mongoose, { HydratedDocument, model, Model } from "mongoose";
import { BlogEntity } from "../models/Blogs.entity";

const BLOGS_COLLECTION_NAME = 'blogs';

interface BlogMethods {
  markAsDeleted(): void;
  updateBlogInfo( name: string, description: string, websiteUrl: string): void;
}

type BlogStatics = typeof BlogEntity;
type BlogModel = Model<BlogEntity, {}, BlogMethods> & BlogStatics;
export type BlogDocument = HydratedDocument<BlogEntity, BlogMethods>;

const BlogSchema = new mongoose.Schema<BlogEntity, BlogModel, BlogMethods>({
  name:	{ type: String, required: true },
  description: { type: String, required: true },
  websiteUrl:	{ type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now }, 
  isMembership: { type: Boolean, required: false },
  deletedAt: { type: Date, default: null },
});

BlogSchema.loadClass(BlogEntity);
export const BlogModel = model<BlogEntity, BlogModel>( BLOGS_COLLECTION_NAME, BlogSchema );
