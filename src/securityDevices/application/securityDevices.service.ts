import { inject, injectable } from "inversify";
import { EntityNotFoundError } from "../../core/errors/entity-not-found.error";
import { ForbiddenError } from "../../core/errors/forbidden.error";
import { SecurityDevicesRepository } from "../repositories/securityDevices.repository";

@injectable()
export class SecurityDevicesService {
  constructor(
    @inject(SecurityDevicesRepository) public securityDevicesRepository: SecurityDevicesRepository
  ){}

  async deleteDeviceById ( userId: string, deviceId: string ): Promise<void>{
    const DeviceIdCheck = await this.securityDevicesRepository.findUserByDeviceId( deviceId );
    if ( !DeviceIdCheck ) {
      throw new EntityNotFoundError();
    }

    if ( DeviceIdCheck.userId !== userId ){
      throw new ForbiddenError();
    }

    const deleteCount = await this.securityDevicesRepository.deleteById( userId, deviceId );
    if ( deleteCount < 1 ) {
      throw new EntityNotFoundError();
    }
    
    return;
  }

  async deleteDevices ( userId: string, deviceId: string ): Promise<void> {
    const deleteCount = await this.securityDevicesRepository.deleteOtherSessions( userId, deviceId );
    if ( deleteCount < 1 ) {
      throw new EntityNotFoundError();
    }
    return;
  }
}
