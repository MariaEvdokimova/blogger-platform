import { Request, Response } from "express";
import { errorsHandler } from "../../../core/errors/errors.handler";
import { HttpStatus } from "../../../core/types/http-statuses";
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
    const user = await usersQueryRepository.findById(userId);
    if (!user) {
      res.sendStatus(HttpStatus.Unauthorized);
      return;
    }

    const meViewModel = await usersQueryRepository.mapMeViewModel( user );

    res.status(HttpStatus.Success).send( meViewModel );
 
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
};
