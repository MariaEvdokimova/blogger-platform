import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { blogsRepository } from "../../repositories/blogs.repository";
import { createErrorMessages } from "../../../core/utils/error.utils";

export const getBlogHandler = (
  req: Request<{id: string},{},{}>, 
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
    
  res.status(HttpStatus.Ok).send(blog);
};
