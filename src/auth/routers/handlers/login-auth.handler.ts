import { Request, Response } from "express";
import { LoginInputDto } from "../../dto/login.input-dto";
import { errorsHandler } from "../../../core/errors/errors.handler";
import { HttpStatus } from "../../../core/types/http-statuses";
import { authService } from "../../domain/auth.service";
import { cookieConfig } from "../../../core/types/cookie";
import { routersPaths } from "../../../core/paths/paths";

export const loginAuthHandler = async (
  req: Request<{}, {}, LoginInputDto>, 
  res: Response
) => {
  try {    
    const refreshToken= req.cookies[cookieConfig.refreshToken.name];
    const tokens = await authService.loginUser( req.body, refreshToken );
   
    res.cookie(cookieConfig.refreshToken.name, tokens.refreshToken, {
      httpOnly: cookieConfig.refreshToken.httpOnly, 
      secure: cookieConfig.refreshToken.secure,
      path: routersPaths.auth.base,
      maxAge: cookieConfig.refreshToken.maxAge
    })    
    res.status(HttpStatus.Success).send({ accessToken: tokens.accessToken });
    
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
};
