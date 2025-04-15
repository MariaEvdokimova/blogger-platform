import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { createErrorMessages } from "../../../core/utils/error.utils";
import { mapToPostViewModel } from "../../mappers/map-to-post-view-model.util";
import { postService } from "../../application/post.service";
import { postsQueryRepository } from "../../repositories/posts.query.repository";

export const getPostHandler = async (
  req: Request<{id: string}>, 
  res: Response
) => {
  try {
    const id = req.params.id;
    const post = await postsQueryRepository.findById(id);
      
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
