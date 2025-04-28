import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { usersService } from "../../domain/users.service";
import { usersQueryRepository } from "../../repositories/users.query.repository";
import { errorsHandler } from "../../../core/errors/errors.handler";

export const deleteUserHandler = async (
  req: Request< {id: string},{},{} >,
  res: Response
) => {
  try {
    const id = req.params.id;
  
    await usersQueryRepository.findByIdOrFail( id );
    await usersService.delete( id );
    
    res.status( HttpStatus.NoContent ).send();
  } catch ( e: unknown ) {
    errorsHandler(e, res);
  }
}
