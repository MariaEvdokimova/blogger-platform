import mongoose, { HydratedDocument, model, Model, Types } from "mongoose";

const SECURITY_DEVICE_COLLECTION_NAME = 'security_device';

export interface SecurityDevice {
  userId: string;
  deviceId: Types.ObjectId;
  deviceName: string;
  ip: string;
  iat: number;
  exp: number;
}

type SecurityDeviceModel = Model<SecurityDevice>;
export type SecurityDeviceDocument = HydratedDocument<SecurityDevice>;

const SecurityDeviceSchema = new mongoose.Schema<SecurityDevice>({
  userId: { type: String, required: true },
  deviceId: { type: mongoose.Schema.Types.ObjectId, required: true },
  deviceName: { type: String, required: true },
  ip: { type: String, required: true },
  iat: { type: Number, required: true },
  exp: { type: Number, required: true },
});

export const SecurityDeviceModel = model<SecurityDevice, SecurityDeviceModel>( SECURITY_DEVICE_COLLECTION_NAME, SecurityDeviceSchema );

