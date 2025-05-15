import { Request, Response } from "express";
import { errorsHandler } from "../../../core/errors/errors.handler";
import { HttpStatus } from "../../../core/types/http-statuses";
import { UserInputDto } from "../../../users/dto/user.input-dto";
import { authService } from "../../domain/auth.service";

export const registrationHandler = async (
  req: Request< {}, {}, UserInputDto>, 
  res: Response
) => {
  try {    
    await authService.registerUser( req.body );

    res.status(HttpStatus.NoContent).send(); 
    
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
};
