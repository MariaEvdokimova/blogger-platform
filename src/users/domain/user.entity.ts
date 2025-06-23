import mongoose, { HydratedDocument, model, Model } from "mongoose";
import { UserEntity } from "../models/User.entity";

const USER_MODEL_NAME = 'users';

export enum ConfirmetionStatus {
  confirmed = 'confirmed',
  unconfirmed = 'unconfirmed',
 };

interface UserMethods {
  markAsDeleted(): void;
  updateEmailConfirmationCode( code: string ): void;
  updatePasswordHash( passwordHash: string ): void;
  updateEmailConfirmed (): void;
}

type UserStatics = typeof UserEntity;
type UserModel = Model<UserEntity, {}, UserMethods> & UserStatics;
export type UserDocument = HydratedDocument<UserEntity, UserMethods>;

const userSchema = new mongoose.Schema<UserEntity, UserModel, UserMethods>({
  login: { type: String, required: true },
  email: { type: String, required: true },
  passwordHash: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now }, 
  deletedAt: { type: Date, default: null },
  emailConfirmation: {    
    expirationDate: { type: Date, default: null}, 
    confirmationCode: { type: String, default: '' },
    isConfirmed: { type: String, enum: ConfirmetionStatus, default: ConfirmetionStatus.unconfirmed },
  },
});

userSchema.loadClass(UserEntity);
export const UserModel = model<UserEntity, UserModel>( USER_MODEL_NAME, userSchema );
