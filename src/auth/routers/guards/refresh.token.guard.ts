import { NextFunction, Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { IdType } from '../../../core/types/id';
import { cookieConfig } from '../../../core/types/cookie';
import { container } from '../../../composition-root';
import { JwtService } from '../../adapters/jwt.service';
import { SecurityDevicesRepository } from '../../../securityDevices/repositories/securityDevices.repository';

const jwtService = container.get(JwtService);
const securityDevicesRepository = container.get(SecurityDevicesRepository);

export const refreshTokenGuard = async (req: Request, res: Response, next: NextFunction) => {
  const refreshToken= req.cookies[cookieConfig.refreshToken.name];
  
  if (!refreshToken) {
     res.sendStatus(HttpStatus.Unauthorized);
     return;
  }

  /*const isTokenInBlackList = await blacklistRepository.isTokenBlacklisted( refreshToken );
  if ( isTokenInBlackList ) {
    res.sendStatus(HttpStatus.Unauthorized);
    return;
  }*/
  
  const payload = await jwtService.verifyRefresToken( refreshToken );

  if (payload) {
    const { userId, deviceId, iat, exp } = payload;
    if (iat && exp) {
      const isSessionValid = await securityDevicesRepository.isSessionValid( userId, deviceId, iat, exp )

      if (isSessionValid) {
       req.user = { id: userId } as IdType;
       req.deviceId = deviceId;
       next();
       return;
      }
    }
  }
    res.sendStatus(HttpStatus.Unauthorized);
    return;
};
