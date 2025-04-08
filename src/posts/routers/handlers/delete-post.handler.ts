import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { postRepository } from "../../repositories/posts.repository";
import { createErrorMessages } from "../../../core/utils/error.utils";

export const deletePostHandler = async (
  req: Request<{id: string}>, 
  res: Response
) => {
  try {
    const id = req.params.id;
    const post = await postRepository.findById(id);
    
    if (!post) {
      res
        .status(HttpStatus.NotFound)
        .send( 
          createErrorMessages([{ message: 'Post not found', field: 'id' }])
        );
      return;
    }

    await postRepository.delete(id);
    res.status(HttpStatus.NoContent).send();

  } catch ( e: unknown ) {
    res.sendStatus(HttpStatus.InternalServerError);
  }
};
