import { Types } from "mongoose";

export class SecurityDeviceDto {
  constructor(
    public userId: string,
    public deviceId: Types.ObjectId,
    public deviceName: string,
    public ip: string,
    public iat?: number,
    public exp?: number,
  ) {}
}
