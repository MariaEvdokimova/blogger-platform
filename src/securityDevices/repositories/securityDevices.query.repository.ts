import { WithId } from "mongodb";
import { sessionsCollection } from "../../db/mongo.db";
import { SessionViewModels } from "../types/session-view-model";
import { SecurityDevice } from "../entities/securityDevices.entity";
import { injectable } from "inversify";

@injectable()
export class SecurityDevicesQueryRepository {
  async getActiveDevices( userId: string ): Promise<SessionViewModels[]> {
    const now = Math.floor(Date.now() / 1000); // UNIX timestamp (in s.)

    const sessions = await sessionsCollection.find({
      userId,
      exp: { $gt: now } 
    }).toArray();

    return sessions.map(this._getInView.bind(this))
  }
  
  private _getInView(session: WithId<SecurityDevice>): SessionViewModels {
    return {
      ip: session.ip,
      title: session.deviceName,
      lastActiveDate: new Date(session.iat * 1000).toISOString(),
      deviceId: session._id.toString()
    };
  }
}
