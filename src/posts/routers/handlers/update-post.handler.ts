import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { postRepository } from "../../repositories/posts.repository";
import { createErrorMessages } from "../../../core/utils/error.utils";
import { PostInputDto } from "../../dto/post.input-dto";

export const updatePostHandler = (
  req: Request<{id: string}, {}, PostInputDto>, 
  res: Response
) => {
  const id = req.params.id;
  const post = postRepository.findById(id);

  if( !post ) {
    res
      .status(HttpStatus.NotFound)
      .send( 
        createErrorMessages([{ message: 'Post not found', field: 'id' }])
      );
    return;
  }
  
  postRepository.update(id, req.body);
  res.status(HttpStatus.NoContent).send();
}
