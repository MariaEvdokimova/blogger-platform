import { ObjectId, WithId } from "mongodb";
import { sessionsCollection } from "../../db/mongo.db";
import { SecurityDevice } from "../entities/securityDevices.entity";
import { injectable } from "inversify";

type FindSecurityDevicesParams = {
  id: string;
  userId: string;
};

@injectable()
export class SecurityDevicesRepository {

  async createSession ( newSession: SecurityDevice): Promise<string> {
    const insertResult = await sessionsCollection.insertOne( newSession );
    return insertResult.insertedId.toString();
  }

  async findByIdAndUserId({
    id,
    userId,
  }: FindSecurityDevicesParams):  Promise<WithId<SecurityDevice> | null> {
    return await sessionsCollection.findOne( {
        _id: new ObjectId( id ),
        user_id: userId
    });
  }
  
  async findUserByDeviceId( deviceId: string):  Promise< string | undefined> {
    const isValidId = await this._checkObjectId( deviceId );
    if ( !isValidId ) {
      return;
    }

    const session = await sessionsCollection.findOne( {
        _id: new ObjectId( deviceId )
    });

    return session?.userId;
  }

  async updateSession ( id: string, iat: number, exp: number ): Promise<number> {
    const updatedResult = await sessionsCollection.updateOne( 
      {
        _id: new ObjectId(id)
      }, 
      {
        $set: { 
          "iat": iat,
          "exp": exp
        }
      }
    );
    return updatedResult.matchedCount;
  }

  async isSessionValid (
    userId: string,
    deviceId: string,
    iat: number,
    exp: number
  ): Promise<boolean> {
  const session = await sessionsCollection.findOne({
      _id: new ObjectId(deviceId),
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
    
    const deleteResult = await sessionsCollection.deleteOne({ 
      userId, 
      _id: new ObjectId( deviceId ) 
    });
    return deleteResult.deletedCount;
  }

  async deleteOtherSessions ( userId: string, deviceId: string ): Promise<number> {
    const isValidId = await this._checkObjectId( deviceId );
    if ( !isValidId ) {
      return 0;
    }

    const deleteResult = await sessionsCollection.deleteMany({ 
      userId, 
      _id: { 
        $ne: new ObjectId( deviceId ) 
      } 
    });

    return deleteResult.deletedCount;
  }

  private async _checkObjectId(id: string): Promise<boolean> {
    return ObjectId.isValid(id);
  }
}
