import { Types } from "mongoose";
import { SecurityDeviceDocument, SecurityDeviceModel } from "../domain/securityDevices.entity";
import { SecurityDeviceDto } from "../dto/security-device.create-dto";

export class SecurityDevicesEntity {
  constructor(
    public userId: string,
    public deviceId: Types.ObjectId,
    public deviceName: string,
    public ip: string,
    public iat: number,
    public exp: number,
  ){}
 
  static createUser(dto: SecurityDeviceDto){
    return new SecurityDeviceModel({
      userId: dto.userId,
      deviceId: dto.deviceId,
      deviceName: dto.deviceName,
      ip: dto.ip,
      iat: dto.iat || 0,
      exp: dto.exp || 0,
    }) as SecurityDeviceDocument
  }

  updateIatAndExp( iat: number, exp: number ): void {
    this.iat = iat;
    this.exp = exp;
  }

}