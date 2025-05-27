import { NextFunction, Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { authService } from '../../domain/auth.service';
import { ResultStatus } from '../../../core/result/resultCode';

export const accessTokenGuard = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.headers.authorization) {
     res.sendStatus(HttpStatus.Unauthorized);
     return;
  }

  const result = await authService.checkAccessToken(req.headers.authorization);
  
  if (result.status === ResultStatus.Success) {
    req.user = result.data!;
    return next();
  }
  res.sendStatus(HttpStatus.Unauthorized);
};
