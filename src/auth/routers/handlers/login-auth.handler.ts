import { Request, Response } from "express";
import { LoginInput } from "../../dto/login.input-dto";
import { errorsHandler } from "../../../core/errors/errors.handler";
import { HttpStatus } from "../../../core/types/http-statuses";
import { authService } from "../../domain/auth.service";
import { cookieConfig } from "../../../core/types/cookie";
import { cookieService } from "../../adapters/cookie.service";

export const loginAuthHandler = async (
  req: Request<{}, {}, LoginInput>, 
  res: Response
) => {
  try {    
    const ip = req.ip || '';
    const deviceName = req.headers['user-agent'] || 'Unknown device';
    const refreshToken= req.cookies[cookieConfig.refreshToken.name];
    const { loginOrEmail, password } = req.body;
    const tokens = await authService.loginUser({ loginOrEmail, password, refreshToken, deviceName, ip });
   
    cookieService.createRefreshTokenCookie( res, tokens.refreshToken );  
    res.status(HttpStatus.Success).send({ accessToken: tokens.accessToken });
    
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
};
