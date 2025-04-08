import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { postRepository } from "../../repositories/posts.repository";
import { PostInputDto } from "../../dto/post.input-dto";
import { Post } from "../../types/post";
import { blogsRepository } from "../../../blogs/repositories/blogs.repository";
import { createErrorMessages } from "../../../core/utils/error.utils";
import { mapToPostViewModel } from "../../mappers/map-to-post-view-model.util";

export const createPostHandler = async (
  req: Request<{}, {}, PostInputDto>, 
  res: Response
) => {
  try {
    const blog = await blogsRepository.findById(req.body.blogId);
    
    if (!blog) {
      res
        .status(HttpStatus.BadRequest)
        .send(
          createErrorMessages([{ message: 'Post not found in blog', field: 'idBlog' }])
        );
      
      return;
    }

    const newPost: Post = {
        title: req.body.title,
        shortDescription: req.body.shortDescription,
        content: req.body.content,
        blogId: blog._id,
        blogName: blog.name,
        createdAt: new Date(),
      } 
    
    const createdPost = await postRepository.create(newPost);
    const postViewModel = mapToPostViewModel(createdPost);
    res.status(HttpStatus.Created).send(postViewModel); 
     
  } catch ( e: unknown ) {
    res.sendStatus(HttpStatus.InternalServerError);
  }
};
