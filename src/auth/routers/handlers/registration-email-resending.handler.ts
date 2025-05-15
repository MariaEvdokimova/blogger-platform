import { Request, Response } from "express";
import { errorsHandler } from "../../../core/errors/errors.handler";
import { HttpStatus } from "../../../core/types/http-statuses";
import { RegistrationEmailResendingInputDto } from "../../dto/registration-email-resending.input-dto";
import { authService } from "../../domain/auth.service";

export const registrationEmailResendingHandler = async (
  req: Request< {}, {}, RegistrationEmailResendingInputDto>, 
  res: Response
) => {
  try {
    await authService.registrationEmailResending( req.body );
    res.status(HttpStatus.NoContent).send();
 
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
};
