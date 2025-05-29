import { EntityNotFoundError } from "../../core/errors/entity-not-found.error";
import { ForbiddenError } from "../../core/errors/forbidden.error";
import { securityDevicesRepository } from "../repositories/securityDevices.repository";

export const securityDevicesService = {
  async deleteDeviceById ( userId: string, deviceId: string ): Promise<void>{
    const userIdCheck = await securityDevicesRepository.findUserByDeviceId( deviceId );
    if ( !userIdCheck ) {
      throw new EntityNotFoundError();
    }

    if ( userIdCheck !== userId ){
      throw new ForbiddenError();
    }

    const deleteCount = await securityDevicesRepository.deleteById( userId, deviceId );
    if ( deleteCount < 1 ) {
      throw new EntityNotFoundError();
    }
    
    return;
  },

  async deleteDevices ( userId: string, deviceId: string ): Promise<void> {
    const deleteCount = await securityDevicesRepository.deleteOtherSessions( userId, deviceId );
    if ( deleteCount < 1 ) {
      throw new EntityNotFoundError();
    }
    return;
  }
}
