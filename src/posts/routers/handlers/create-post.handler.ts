import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { postRepository } from "../../repositories/posts.repository";
import { PostInputDto } from "../../dto/post.input-dto";
import { Post } from "../../types/post";
import { db } from "../../../db/in-memory.db";
import { blogsRepository } from "../../../blogs/repositories/blogs.repository";
import { createErrorMessages } from "../../../core/utils/error.utils";

export const createPostHandler = (
  req: Request<{}, {}, PostInputDto>, 
  res: Response
) => {
  const blog = blogsRepository.findById(req.body.blogId);
  
  if (!blog) {
    res
      .status(HttpStatus.BadRequest)
      .send(
        createErrorMessages([{ message: 'Post not found in blog', field: 'idBlog' }])
      );
    
    return;
  }

  const newPost: Post = {
      id: db.posts.length ? +(db.posts[db.posts.length - 1].id) + 1 +'' : '1',
      title: req.body.title,
      shortDescription: req.body.shortDescription,
      content: req.body.content,
      blogId: req.body.blogId,
      blogName: blog.name,
    } 
  
  postRepository.create(newPost);
  res.status(HttpStatus.Created).send(newPost);  
}
