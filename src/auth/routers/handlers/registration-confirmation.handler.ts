import { Request, Response } from "express";
import { errorsHandler } from "../../../core/errors/errors.handler";
import { HttpStatus } from "../../../core/types/http-statuses";
import { RegistrationConfirmationInputDto } from "../../dto/registration-confirmation.input-dto";
import { authService } from "../../domain/auth.service";

export const registrationConfirmationHandler = async (
  req: Request< {}, {}, RegistrationConfirmationInputDto >, 
  res: Response
) => {
  try {   
    await authService.registrationConfirmation( req.body );

    res.status(HttpStatus.NoContent).send();
 
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
};
