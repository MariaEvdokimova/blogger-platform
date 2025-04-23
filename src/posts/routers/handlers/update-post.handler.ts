import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { createErrorMessages } from "../../../core/utils/error.utils";
import { PostInputDto } from "../../dto/post.input-dto";
import { postService } from "../../application/post.service";
import { postsQueryRepository } from "../../repositories/posts.query.repository";

export const updatePostHandler = async (
  req: Request<{id: string}, {}, PostInputDto>, 
  res: Response
) => {
  try {
    const id = req.params.id;
    const post = await postsQueryRepository.findById(id);

    if( !post ) {
      res
        .status(HttpStatus.NotFound)
        .send( 
          createErrorMessages([{ message: 'Post not found', field: 'id' }])
        );
      return;
    }
    
    await postService.update(id, req.body);
    res.status(HttpStatus.NoContent).send();

  } catch (e: unknown) {
    res.sendStatus(HttpStatus.InternalServerError);
  }
};
