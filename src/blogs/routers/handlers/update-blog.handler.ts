import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { blogsRepository } from "../../repositories/blogs.repository";
import { BlogInputDto } from "../../dto/blog.input-dto";
import { createErrorMessages } from "../../../core/utils/error.utils";

export const updateBlogHandler = async (
  req: Request<{id: string}, {}, BlogInputDto>, 
  res: Response
) => {
  try {
    const id = req.params.id;
    const blog = await blogsRepository.findById(id);

    if (!blog) {
      res
        .status(HttpStatus.NotFound)
        .send( 
          createErrorMessages([{ message: 'Blog not found', field: 'id' }])
        );      
      return;
    }
    
    await blogsRepository.update(id, req.body);
    res.status(HttpStatus.NoContent).send();
    
  } catch (e: unknown) {
    res.sendStatus(HttpStatus.InternalServerError);
  }
};
