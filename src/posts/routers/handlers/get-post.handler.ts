import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { postsQueryRepository } from "../../repositories/posts.query.repository";
import { errorsHandler } from "../../../core/errors/errors.handler";

export const getPostHandler = async (
  req: Request<{id: string}>, 
  res: Response
) => {
  try {
    const id = req.params.id;
    
    const post = await postsQueryRepository.findByIdOrFail(id);
    res.status(HttpStatus.Success).send(post);
  
  } catch ( e: unknown ) {
    errorsHandler(e, res);
  }
};
