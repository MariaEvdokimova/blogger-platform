import { Request, Response } from "express";
import { errorsHandler } from "../../../core/errors/errors.handler";
import { HttpStatus } from "../../../core/types/http-statuses";
import { authService } from "../../domain/auth.service";
import { cookieConfig } from "../../../core/types/cookie";
import { usersQueryRepository } from "../../../users/repositories/users.query.repository";
import { routersPaths } from "../../../core/paths/paths";

export const refreshTokenHandler = async (
  req: Request, 
  res: Response
) => {
  try {    
    const userId = req.user?.id as string;
    if (!userId) {
      res.sendStatus(HttpStatus.Unauthorized);
      return;
    }

    const user = usersQueryRepository.findById(userId);
    if ( !user ) {
      res.sendStatus(HttpStatus.Unauthorized);
      return;
    }

    const refreshToken= req.cookies[cookieConfig.refreshToken.name];
    const tokens = await authService.refreshToken( refreshToken, userId );
    
    res.cookie(cookieConfig.refreshToken.name, tokens.refreshToken, {
      httpOnly: cookieConfig.refreshToken.httpOnly, 
      secure: cookieConfig.refreshToken.secure,
      path: routersPaths.auth.base,
      maxAge: cookieConfig.refreshToken.maxAge
    });
    res.status(HttpStatus.Success).send({ accessToken: tokens.accessToken });
    
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
};
