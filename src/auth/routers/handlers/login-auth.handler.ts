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
    await authService.checkCredentials( req.body );    
    res.status(HttpStatus.NoContent).send();
    
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
};
