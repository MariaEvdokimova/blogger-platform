import { NextFunction, Request, Response } from 'express';
import { HttpStatus } from '../../core/types/http-statuses';
import { rateLimitRepository } from '../repositories/rate-limit.repository';


export const rateLimitMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const ip = req.ip || '';

  await rateLimitRepository.setAttempt( ip, req.originalUrl );

  const attempts = await rateLimitRepository.getAttemptsCountFromDate( ip, req.originalUrl );

  if ( attempts > 5 ) {
    res.sendStatus(HttpStatus.TooManyRequests);
    return;
  }

  next();
};
