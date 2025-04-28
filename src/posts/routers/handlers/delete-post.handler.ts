import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { createErrorMessages } from "../../../core/errors/error.utils";
import { postService } from "../../domain/post.service";
import { postsQueryRepository } from "../../repositories/posts.query.repository";
import { errorsHandler } from "../../../core/errors/errors.handler";

export const deletePostHandler = async (
  req: Request<{id: string}>, 
  res: Response
) => {
  try {
    const id = req.params.id;
    
    await postsQueryRepository.findByIdOrFail(id);
    await postService.delete(id);
    
    res.status(HttpStatus.NoContent).send();

  } catch ( e: unknown ) {
    errorsHandler(e, res);
  }
};
