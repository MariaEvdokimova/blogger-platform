import { Request, Response } from "express";
import { PostInBlogInputDto } from "../../dto/post-in-blog.input-dto";
import { blogsService } from "../../domain/blogs.service";
import { HttpStatus } from "../../../core/types/http-statuses";
import { blogsQueryRepository } from "../../repositories/blogs.query.repository";
import { postsQueryRepository } from "../../../posts/repositories/posts.query.repository";
import { errorsHandler } from "../../../core/errors/errors.handler";

export const createPostInBlogHandler = async (
  req: Request<{ blogId: string }, {}, PostInBlogInputDto>, 
  res: Response
) => {
  try {
    const id = req.params.blogId;

    const blog = await blogsQueryRepository.findByIdOrFail(id);
    const createdPostId = await blogsService.createPost(req.body, blog!);
    const createdPost = await postsQueryRepository.findByIdOrFail(createdPostId);
  
    res.status(HttpStatus.Created).send(createdPost);
    
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
};
