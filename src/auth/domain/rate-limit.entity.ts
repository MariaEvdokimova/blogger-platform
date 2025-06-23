import mongoose, { HydratedDocument, model, Model, Types } from "mongoose";
import { RateLimitEntity } from "../models/RateLimit.entity";

const RATE_LIMIT_COLLECTION_NAME= 'rateLimit'

interface RateLimitMethods {
}

type RateLimitStatics = typeof RateLimitEntity;
type RateLimitModel = Model<RateLimitEntity, {}, RateLimitMethods> & RateLimitStatics;
export type RateLimitDocument = HydratedDocument<RateLimitEntity, RateLimitMethods>;

const RateLimitSchema = new mongoose.Schema<RateLimitEntity, RateLimitModel, RateLimitMethods>({
  date: { type: Date, required: true, default: Date.now },
  ip: { type: String, required: true },
  url: { type: String, required: true },
});

RateLimitSchema.loadClass(RateLimitEntity);
export const RateLimitModel = model<RateLimitEntity, RateLimitModel>( RATE_LIMIT_COLLECTION_NAME, RateLimitSchema );
