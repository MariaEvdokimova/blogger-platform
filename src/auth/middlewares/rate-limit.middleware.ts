import { NextFunction, Request, Response } from 'express';
import { HttpStatus } from '../../core/types/http-statuses';
import { container } from '../../composition-root';
import { RateLimitRepository } from '../repositories/rate-limit.repository';
import { RateLimitModel } from '../domain/rate-limit.entity';

const rateLimitRepository = container.get(RateLimitRepository);

export const rateLimitMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const ip = req.ip || '';

  const newAttempt = new RateLimitModel();
  newAttempt.ip = ip;
  newAttempt.url = req.originalUrl;
  newAttempt.date = new Date();

  await rateLimitRepository.save( newAttempt );

  const attempts = await rateLimitRepository.getAttemptsCountFromDate( ip, req.originalUrl );

  if ( attempts > 5 ) {
    res.sendStatus(HttpStatus.TooManyRequests);
    return;
  }

  next();
};
