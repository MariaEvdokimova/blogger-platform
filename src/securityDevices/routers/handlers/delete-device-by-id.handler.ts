import { Request, Response } from "express";
import { errorsHandler } from "../../../core/errors/errors.handler";
import { securityDevicesService } from "../../domain/securityDevices.service";
import { HttpStatus } from "../../../core/types/http-statuses";

export const deleteDeviceByIdHandler = async (
  req: Request<{ deviceId: string },{},{}>, 
  res: Response
) => {
  try {    
    const deviceId = req.params.deviceId;

    await securityDevicesService.deleteDeviceById(
      req.user!.id,
      deviceId
    );
    
    res.status(HttpStatus.NoContent).send();
    
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
};

