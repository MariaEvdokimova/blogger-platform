import { NextFunction, Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { jwtService } from '../../adapters/jwt.service';
import { IdType } from '../../../core/types/id';

export const accessTokenGuard = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.headers.authorization) {
     res.sendStatus(HttpStatus.Unauthorized);
     return;
  }
  const [authType, token] = req.headers.authorization.split(' ');

  if (authType !== 'Bearer') {
    res.sendStatus(HttpStatus.Unauthorized);
    return;
  }

  const payload = await jwtService.verifyToken(token);

  if (payload) {
    const { userId } = payload;

    req.user = { id: userId } as IdType;
    next();

    return;
  }
    res.sendStatus(HttpStatus.Unauthorized);
  return;
};
