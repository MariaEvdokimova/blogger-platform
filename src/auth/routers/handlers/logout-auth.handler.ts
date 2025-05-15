import { Request, Response } from "express";
import { errorsHandler } from "../../../core/errors/errors.handler";
import { HttpStatus } from "../../../core/types/http-statuses";
import { authService } from "../../domain/auth.service";
import { cookieConfig } from "../../../core/types/cookie";

export const logoutAuthHandler = async (
  req: Request, 
  res: Response
) => {
  try {    
    const refreshToken= req.cookies[cookieConfig.refreshToken.name];
    await authService.logoutUser( refreshToken );
  
    res.status(HttpStatus.NoContent).send();
    
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
};
