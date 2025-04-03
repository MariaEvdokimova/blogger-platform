import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { postRepository } from "../../repositories/posts.repository";
import { createErrorMessages } from "../../../core/utils/error.utils";

export const getPostHandler = (
  req: Request<{id: string}>, 
  res: Response
) => {
  const id = req.params.id;
  const post = postRepository.findById(id);
    
  if (!post) {
    res
      .status(HttpStatus.NotFound)
      .send( 
        createErrorMessages([{ message: 'Post not found', field: 'id' }])
      );
    return;
  }

  res.status(HttpStatus.Ok).send(post);
}
