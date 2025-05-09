import { Request, Response } from "express";
import { LoginInputDto } from "../../dto/login.input-dto";
import { errorsHandler } from "../../../core/errors/errors.handler";
import { HttpStatus } from "../../../core/types/http-statuses";
import { authService } from "../../domain.ts/auth.service";

export const loginAuthHandler = async (
  req: Request<{}, {}, LoginInputDto>, 
  res: Response
) => {
  try {    
    const accessToken = await authService.loginUser( req.body );    
    res.status(HttpStatus.Success).send( accessToken );
    
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
};
