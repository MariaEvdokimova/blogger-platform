import { Request, Response } from "express";
import { errorsHandler } from "../../../core/errors/errors.handler";
import { HttpStatus } from "../../../core/types/http-statuses";
import { securityDevicesQueryRepository } from "../../repositories/securityDevices.query.repository";

export const getDevicesHandler = async (
  req: Request, 
  res: Response
) => {
  try {    
    const devices = await securityDevicesQueryRepository.getActiveDevices( req.user!.id );

    res.status(HttpStatus.Success).send( devices );
    
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
};

