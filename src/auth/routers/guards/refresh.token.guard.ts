import { NextFunction, Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { jwtService } from '../../adapters/jwt.service';
import { IdType } from '../../../core/types/id';
import { cookieConfig } from '../../../core/types/cookie';
import { blacklistRepository } from '../../repositories/blacklis.repository';

export const refreshTokenGuard = async (req: Request, res: Response, next: NextFunction) => {
  const refreshToken= req.cookies[cookieConfig.refreshToken.name];
  
  if (!refreshToken) {
     res.sendStatus(HttpStatus.Unauthorized);
     return;
  }

  const isTokenInBlackList = await blacklistRepository.isTokenBlacklisted( refreshToken );
  if ( isTokenInBlackList ) {
    res.sendStatus(HttpStatus.Unauthorized);
    return;
  }
  
  const payload = await jwtService.verifyRefresToken({
    token: refreshToken
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
