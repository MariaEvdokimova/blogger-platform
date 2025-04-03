import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { blogsRepository } from "../../repositories/blogs.repository";
import { BlogInputDto } from "../../dto/blog.input-dto";
import { createErrorMessages } from "../../../core/utils/error.utils";

export const updateBlogHandler = (
  req: Request<{id: string}, {}, BlogInputDto>, 
  res: Response
) => {
  const id = req.params.id;
  const blog = blogsRepository.findById(id);

  if (!blog) {
    res
      .status(HttpStatus.NotFound)
      .send( 
        createErrorMessages([{ message: 'Blog not found', field: 'id' }])
      );      
    return;
  }
  
  blogsRepository.update(id, req.body);
  res.status(HttpStatus.NoContent).send();
};
