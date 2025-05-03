import { Request, Response } from "express";
import { errorsHandler } from "../../../core/errors/errors.handler";
import { HttpStatus } from "../../../core/types/http-statuses";
import { authService } from "../../domain.ts/auth.service";
import { usersQueryRepository } from "../../../users/repositories/users.query.repository";

export const getMeHandler = async (
  req: Request, 
  res: Response
) => {
  try {    
    const userId = req.user?.id as string;

    if (!userId) {
      res.sendStatus(HttpStatus.Unauthorized);
      return;
    }
    const me = await usersQueryRepository.findById(userId);

    res.status(HttpStatus.Success).send(me);
 
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
};
