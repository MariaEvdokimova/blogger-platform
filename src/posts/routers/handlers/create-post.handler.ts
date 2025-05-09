import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { PostInputDto } from "../../dto/post.input-dto";
import { createErrorMessages } from "../../../core/errors/error.utils";
import { postService } from "../../domain/post.service";
import { blogsQueryRepository } from "../../../blogs/repositories/blogs.query.repository";
import { postsQueryRepository } from "../../repositories/posts.query.repository";
import { errorsHandler } from "../../../core/errors/errors.handler";

export const createPostHandler = async (
  req: Request<{}, {}, PostInputDto>, 
  res: Response
) => {
  try {
    const blog = await blogsQueryRepository.findById(req.body.blogId);
    
    if (!blog) {
      res
        .status(HttpStatus.BadRequest)
        .send(
          createErrorMessages([{ message: 'Post not found in blog', field: 'idBlog' }])
        );
      
      return;
    }

    const createdPostId = await postService.create(req.body, blog);
    const createdPost = await postsQueryRepository.findByIdOrFail(createdPostId);
      
    res.status(HttpStatus.Created).send(createdPost); 
     
  } catch ( e: unknown ) {
    errorsHandler(e, res);
  }
};
