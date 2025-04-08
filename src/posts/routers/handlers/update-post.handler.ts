import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { postRepository } from "../../repositories/posts.repository";
import { createErrorMessages } from "../../../core/utils/error.utils";
import { PostInputDto } from "../../dto/post.input-dto";

export const updatePostHandler = async (
  req: Request<{id: string}, {}, PostInputDto>, 
  res: Response
) => {
  try {
    const id = req.params.id;
    const post = await postRepository.findById(id);

    if( !post ) {
      res
        .status(HttpStatus.NotFound)
        .send( 
          createErrorMessages([{ message: 'Post not found', field: 'id' }])
        );
      return;
    }
    
    await postRepository.update(id, req.body);
    res.status(HttpStatus.NoContent).send();

  } catch (e: unknown) {
    res.sendStatus(HttpStatus.InternalServerError);
  }
};
