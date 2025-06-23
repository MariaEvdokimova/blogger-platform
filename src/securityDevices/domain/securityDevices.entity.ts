import mongoose, { HydratedDocument, model, Model } from "mongoose";
import { SecurityDevicesEntity } from "../models/SecurityDevices.entity";

const SECURITY_DEVICE_COLLECTION_NAME = 'security_device';

interface SecurityDeviceMethods {
  updateIatAndExp( iat: number, exp: number ): void,
}

type SecurityDeviceStatics = typeof SecurityDevicesEntity;

type SecurityDeviceModel = Model<SecurityDevicesEntity, {}, SecurityDeviceMethods> & SecurityDeviceStatics;
export type SecurityDeviceDocument = HydratedDocument<SecurityDevicesEntity, SecurityDeviceMethods>;

const SecurityDeviceSchema = new mongoose.Schema<SecurityDevicesEntity, SecurityDeviceModel, SecurityDeviceMethods>({
  userId: { type: String, required: true },
  deviceId: { type: mongoose.Schema.Types.ObjectId, required: true },
  deviceName: { type: String, required: true },
  ip: { type: String, required: true },
  iat: { type: Number, required: true },
  exp: { type: Number, required: true },
});

SecurityDeviceSchema.loadClass(SecurityDevicesEntity);
export const SecurityDeviceModel = model<SecurityDevicesEntity, SecurityDeviceModel>( SECURITY_DEVICE_COLLECTION_NAME, SecurityDeviceSchema );
