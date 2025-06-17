import { injectable } from "inversify";
import mongoose, { Types } from "mongoose";
import { SecurityDeviceDocument, SecurityDeviceModel } from "../domain/securityDevices.entity";

type FindSecurityDevicesParams = {
  deviceId: string;
  userId: string;
};

@injectable()
export class SecurityDevicesRepository {

  async save( device: SecurityDeviceDocument ): Promise<SecurityDeviceDocument> {
    return await device.save();
  }

  async findByIdAndUserId({
    deviceId,
    userId,
  }: FindSecurityDevicesParams):  Promise<SecurityDeviceDocument | null> {
    const isValidId = await this._checkObjectId( deviceId );
    if ( !isValidId ) {
      return null;
    }

    return SecurityDeviceModel.findOne( {
      deviceId: new Types.ObjectId( deviceId ),
      userId
    });
  }
  
  async findUserByDeviceId( deviceId: string):  Promise< SecurityDeviceDocument | null> {
    const isValidId = await this._checkObjectId( deviceId );
    if ( !isValidId ) {
      return null;
    }

    return SecurityDeviceModel.findOne({ deviceId: new Types.ObjectId(deviceId) });
  }

  async isSessionValid (
    userId: string,
    deviceId: string,
    iat: number,
    exp: number
  ): Promise<boolean> {
  const session = await SecurityDeviceModel.findOne({
      deviceId: new Types.ObjectId(deviceId),
      userId,
      iat,
      exp
    });

    if (!session) return false;

    const now = Math.floor(Date.now() / 1000); // текущий timestamp в секундах

    return session.exp > now;
  }

  async deleteById ( userId: string, deviceId: string ): Promise<number> {
    const isValidId = await this._checkObjectId( deviceId );
    if ( !isValidId ) {
      return 0;
    }
    
    const deleteResult = await SecurityDeviceModel.deleteOne({ 
      userId, 
      deviceId: new Types.ObjectId( deviceId ) 
    });
    return deleteResult.deletedCount;
  }

  async deleteOtherSessions ( userId: string, deviceId: string ): Promise<number> {
    const isValidId = await this._checkObjectId( deviceId );
    if ( !isValidId ) {
      return 0;
    }

    const deleteResult = await SecurityDeviceModel.deleteMany({ 
      userId, 
      deviceId: { 
        $ne: new Types.ObjectId( deviceId ) 
      } 
    });

    return deleteResult.deletedCount;
  }

  private async _checkObjectId(id: string): Promise<boolean> {
    return mongoose.isValidObjectId(id);
  }
}
