import { Request, Response } from "express";
import { PostInBlogInputDto } from "../../dto/post-in-blog.input-dto";
import { blogsService } from "../../application/blogs.service";
import { HttpStatus } from "../../../core/types/http-statuses";
import { blogsQueryRepository } from "../../repositories/blogs.query.repository";
import { createErrorMessages } from "../../../core/utils/error.utils";
import { mapToPostViewModel } from "../../../posts/mappers/map-to-post-view-model.util";
import { postsQueryRepository } from "../../../posts/repositories/posts.query.repository";

export const createPostInBlogHandler = async (
  req: Request<{ blogId: string }, {}, PostInBlogInputDto>, 
  res: Response
) => {
  try {
    const id = req.params.blogId;
    const blog = await blogsQueryRepository.findById(id);
        
    if (!blog) {
      res.sendStatus(HttpStatus.NotFound);      
      return;
    }
 
    const createdPostId = await blogsService.createPost(req.body, blog);
    const createdPost = await postsQueryRepository.findById(createdPostId);
    const postInBlogViewModel = mapToPostViewModel( createdPost! );
    
    res.status(HttpStatus.Created).send(postInBlogViewModel);
    
  } catch (e: unknown) {
    res.sendStatus(HttpStatus.InternalServerError);
  }
};
