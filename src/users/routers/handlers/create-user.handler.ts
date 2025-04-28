import { Request, Response } from "express";
import { UserInputDto } from "../../dto/user.input-dto";
import { HttpStatus } from "../../../core/types/http-statuses";
import { usersService } from "../../domain/users.service";
import { usersQueryRepository } from "../../repositories/users.query.repository";
import { errorsHandler } from "../../../core/errors/errors.handler";

export const createUserHandler = async (
  req: Request< {}, {}, UserInputDto>,
  res: Response
) => {
  try {
    const createdUserId = await usersService.create( req.body );
    const createdUser = await usersQueryRepository.FindById( createdUserId );
    const userViewModel = await usersQueryRepository.mapToUserViewModel( createdUser! );

    res.status(HttpStatus.Created).send(userViewModel);

  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}
