import { Request, Response } from "express";
import { SecurityDevicesService } from "../domain/securityDevices.service";
import { HttpStatus } from "../../core/types/http-statuses";
import { errorsHandler } from "../../core/errors/errors.handler";
import { SecurityDevicesQueryRepository } from "../repositories/securityDevices.query.repository";
import { inject, injectable } from "inversify";

@injectable()
export class SecurityDevicesController {
  constructor(
    @inject(SecurityDevicesService) public securityDevicesService: SecurityDevicesService,
    @inject(SecurityDevicesQueryRepository) public securityDevicesQueryRepository: SecurityDevicesQueryRepository
  ){}

  async deleteDeviceById (
    req: Request<{ deviceId: string },{},{}>, 
    res: Response
  ){
    try {    
      const deviceId = req.params.deviceId;
  
      await this.securityDevicesService.deleteDeviceById(
        req.user!.id,
        deviceId
      );
      
      res.status(HttpStatus.NoContent).send();
      
    } catch (e: unknown) {
      errorsHandler(e, res);
    }
  }

  async deleteDevices (
    req: Request, 
    res: Response
  ){
    try {    
      await this.securityDevicesService.deleteDevices(
        req.user!.id,
        req.deviceId!
      );
      
      res.status(HttpStatus.NoContent).send();    
    } catch (e: unknown) {
      errorsHandler(e, res);
    }
  }

  async getDevices (
    req: Request, 
    res: Response
  ){
    try {    
      const devices = await this.securityDevicesQueryRepository.getActiveDevices( req.user!.id );
  
      res.status(HttpStatus.Success).send( devices );
      
    } catch (e: unknown) {
      errorsHandler(e, res);
    }
  }

}