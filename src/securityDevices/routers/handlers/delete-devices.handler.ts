import { Request, Response } from "express";
import { errorsHandler } from "../../../core/errors/errors.handler";
import { HttpStatus } from "../../../core/types/http-statuses";
import { securityDevicesService } from "../../domain/securityDevices.service";

export const deleteDevicesHandler = async (
  req: Request, 
  res: Response
) => {
  try {    
    await securityDevicesService.deleteDevices(
      req.user!.id,
      req.deviceId!
    );
    
    res.status(HttpStatus.NoContent).send();    
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
};

