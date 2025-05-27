import { Request, Response } from "express";
import { LoginInputDto } from "../../dto/login.input-dto";
import { errorsHandler } from "../../../core/errors/errors.handler";
import { HttpStatus } from "../../../core/types/http-statuses";
import { authService } from "../../domain/auth.service";
import { cookieConfig } from "../../../core/types/cookie";
import { cookieService } from "../../adapters/cookie.service";

export const loginAuthHandler = async (
  req: Request<{}, {}, LoginInputDto>, 
  res: Response
) => {
  try {    
    const refreshToken= req.cookies[cookieConfig.refreshToken.name];
    const tokens = await authService.loginUser( req.body, refreshToken );
   
    cookieService.createRefreshTokenCookie( res, tokens.refreshToken );  
    res.status(HttpStatus.Success).send({ accessToken: tokens.accessToken });
    
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
};
