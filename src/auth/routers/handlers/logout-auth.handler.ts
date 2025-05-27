import { Request, Response } from "express";
import { errorsHandler } from "../../../core/errors/errors.handler";
import { HttpStatus } from "../../../core/types/http-statuses";
import { authService } from "../../domain/auth.service";
import { cookieConfig } from "../../../core/types/cookie";
import { routersPaths } from "../../../core/paths/paths";
import { cookieService } from "../../adapters/cookie.service";

export const logoutAuthHandler = async (
  req: Request, 
  res: Response
) => {
  try {    
    const refreshToken= req.cookies[cookieConfig.refreshToken.name];
    await authService.logoutUser( refreshToken );
  
    cookieService.clearRefreshTokenCookie( res );
    res.status(HttpStatus.NoContent).send();
    
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
};
