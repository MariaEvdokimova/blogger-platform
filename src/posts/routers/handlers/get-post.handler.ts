import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { postRepository } from "../../repositories/posts.repository";
import { createErrorMessages } from "../../../core/utils/error.utils";
import { mapToPostViewModel } from "../../mappers/map-to-post-view-model.util";

export const getPostHandler = async (
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

    const postViewModel = mapToPostViewModel( post );
    res.status(HttpStatus.Ok).send(postViewModel);
  } catch ( e: unknown ) {
    res.sendStatus(HttpStatus.InternalServerError);
  }
};
