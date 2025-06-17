import mongoose, { HydratedDocument, model, Model, Types } from "mongoose";

const RATE_LIMIT_COLLECTION_NAME= 'rateLimit'

export interface RateLimit {
  date: Date;
  ip: string;
  url: string;
}

type RateLimitModel = Model<RateLimit>;
export type RateLimitDocument = HydratedDocument<RateLimit>;

const RateLimitSchema = new mongoose.Schema<RateLimit>({
  date: { type: Date, required: true, default: Date.now },
  ip: { type: String, required: true },
  url: { type: String, required: true },
});

export const RateLimitModel = model<RateLimit, RateLimitModel>( RATE_LIMIT_COLLECTION_NAME, RateLimitSchema );
