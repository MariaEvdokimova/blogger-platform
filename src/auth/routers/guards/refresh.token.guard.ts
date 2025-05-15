import { NextFunction, Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { jwtService } from '../../adapters/jwt.service';
import { IdType } from '../../../core/types/id';
import { appConfig } from '../../../core/config/config';
import { cookieConfig } from '../../../core/types/cookie';

export const refreshTokenGuard = async (req: Request, res: Response, next: NextFunction) => {
  const refreshToken= req.cookies[cookieConfig.refreshToken.name];
  
  if (!refreshToken) {
     res.sendStatus(HttpStatus.Unauthorized);
     return;
  }

  const payload = await jwtService.verifyToken({
    token: refreshToken, 
    secret: appConfig.R_JWT_SECRET
  });

  if (payload) {
    const { userId } = payload;
    req.user = { id: userId } as IdType;

    next();
    return;
  }
    res.sendStatus(HttpStatus.Unauthorized);
    return;
};
