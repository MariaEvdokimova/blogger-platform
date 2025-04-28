import { Response } from 'express';
import { HttpStatus } from "../types/http-statuses";
import { ValidationError } from './validation.error';
import { createErrorMessages } from './error.utils';
import { EntityNotFoundError } from './entity-not-found.error';
import { UnauthorizedError } from './unauthorized.error';

export const errorsHandler = (error: unknown, res: Response): void => {
   if (error instanceof EntityNotFoundError) {
    res.sendStatus(HttpStatus.NotFound);
    return;
  }

  if ( error instanceof UnauthorizedError ) {
    res.sendStatus( HttpStatus.Unauthorized );
    return;
  }
  
  if ( error instanceof ValidationError) {
    res
      .status(HttpStatus.BadRequest)
      .send( 
        createErrorMessages([
          { 
            message: error.message, 
            field: error.field 
          }
        ])
      );

    return;
  }

  res.sendStatus(HttpStatus.InternalServerError);
  return;
};
