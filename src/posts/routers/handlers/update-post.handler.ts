import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { createErrorMessages } from "../../../core/errors/error.utils";
import { PostInputDto } from "../../dto/post.input-dto";
import { postService } from "../../domain/post.service";
import { postsQueryRepository } from "../../repositories/posts.query.repository";
import { errorsHandler } from "../../../core/errors/errors.handler";

export const updatePostHandler = async (
  req: Request<{id: string}, {}, PostInputDto>, 
  res: Response
) => {
  try {
    const id = req.params.id;
   
    await postsQueryRepository.findByIdOrFail(id);
    await postService.update(id, req.body);
   
    res.status(HttpStatus.NoContent).send();

  } catch (e: unknown) {
    errorsHandler(e, res);
  }
};
