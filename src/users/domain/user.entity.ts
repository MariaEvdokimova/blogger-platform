import mongoose, { HydratedDocument, model, Model } from "mongoose";
import { add } from "date-fns/add";

const USER_MODEL_NAME = 'users';

export enum ConfirmetionStatus {
  confirmed = 'confirmed',
  unconfirmed = 'unconfirmed',
 };

export interface IUser {
  login: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  deletedAt: Date | null; 
  emailConfirmation: {
    expirationDate: Date;
    confirmationCode: string;
    isConfirmed: ConfirmetionStatus;
  };
}

type UserModel = Model<IUser>;
export type UserDocument = HydratedDocument<IUser>;

const userSchema = new mongoose.Schema<IUser>({
  login: { type: String, required: true },
  email: { type: String, required: true },
  passwordHash: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now }, 
  deletedAt: { type: Date, default: null },
  emailConfirmation: {    
    expirationDate: { type: Date, default: () => add(new Date(), {hours: 1, minutes: 3})
          }, 
    confirmationCode: { type: String, default: '' },
    isConfirmed: { type: String, enum: ConfirmetionStatus, default: ConfirmetionStatus.unconfirmed },
  },
});

export const UserModel = model<IUser, UserModel>( USER_MODEL_NAME, userSchema );
