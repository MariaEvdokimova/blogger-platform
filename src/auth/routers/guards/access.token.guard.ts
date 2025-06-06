import { NextFunction, Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { ResultStatus } from '../../../core/result/resultCode';
import { container } from '../../../composition-root';
import { AuthService } from '../../domain/auth.service';

const authService = container.get(AuthService);

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
