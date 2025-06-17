import { SessionViewModels } from "../types/session-view-model";
import { injectable } from "inversify";
import { SecurityDeviceDocument, SecurityDeviceModel } from "../domain/securityDevices.entity";

@injectable()
export class SecurityDevicesQueryRepository {
  async getActiveDevices( userId: string ): Promise<SessionViewModels[]> {
    const now = Math.floor(Date.now() / 1000); // UNIX timestamp (in s.)

    const sessions = await SecurityDeviceModel.find({
      userId,
      exp: { $gt: now } 
    });

    return sessions.map(this._getInView.bind(this))
  }
  
  private _getInView(session: SecurityDeviceDocument): SessionViewModels {
    return {
      ip: session.ip,
      title: session.deviceName,
      lastActiveDate: new Date(session.iat * 1000).toISOString(),
      deviceId: session.deviceId.toString()
    };
  }
}
