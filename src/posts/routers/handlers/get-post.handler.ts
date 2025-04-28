import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { createErrorMessages } from "../../../core/errors/error.utils";
import { mapToPostViewModel } from "../../mappers/map-to-post-view-model.util";
import { postService } from "../../domain/post.service";
import { postsQueryRepository } from "../../repositories/posts.query.repository";
import { errorsHandler } from "../../../core/errors/errors.handler";

export const getPostHandler = async (
  req: Request<{id: string}>, 
  res: Response
) => {
  try {
    const id = req.params.id;
    
    const post = await postsQueryRepository.findByIdOrFail(id);
    const postViewModel = mapToPostViewModel( post );
   
   res.status(HttpStatus.Ok).send(postViewModel);
  
  } catch ( e: unknown ) {
    errorsHandler(e, res);
  }
};
