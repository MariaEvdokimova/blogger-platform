import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { PostInputDto } from "../../dto/post.input-dto";
import { createErrorMessages } from "../../../core/utils/error.utils";
import { mapToPostViewModel } from "../../mappers/map-to-post-view-model.util";
import { postService } from "../../application/post.service";
import { blogsQueryRepository } from "../../../blogs/repositories/blogs.query.repository";
import { postsQueryRepository } from "../../repositories/posts.query.repository";

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
    const createdPost = await postsQueryRepository.findById(createdPostId);
    const postViewModel = mapToPostViewModel(createdPost!);
    
    res.status(HttpStatus.Created).send(postViewModel); 
     
  } catch ( e: unknown ) {
    res.sendStatus(HttpStatus.InternalServerError);
  }
};
