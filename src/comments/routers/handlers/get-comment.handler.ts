import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { errorsHandler } from "../../../core/errors/errors.handler";
import { commentsQueryRepository } from "../../repositories/comments.query.repository";

export const getCommentHandler = async (
  req: Request<{id: string}, {}, {}>, 
  res: Response
) => {
  try {
    const id = req.params.id;
    
    const comment = await commentsQueryRepository.findByIdOrFail(id);

    res.status(HttpStatus.Success).send( comment );
    
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
};
