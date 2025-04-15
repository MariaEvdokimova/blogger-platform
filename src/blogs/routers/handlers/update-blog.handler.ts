import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { BlogInputDto } from "../../dto/blog.input-dto";
import { createErrorMessages } from "../../../core/utils/error.utils";
import { blogsService } from "../../application/blogs.service";
import { blogsQueryRepository } from "../../repositories/blogs.query.repository";

export const updateBlogHandler = async (
  req: Request<{id: string}, {}, BlogInputDto>, 
  res: Response
) => {
  try {
    const id = req.params.id;
    const blog = await blogsQueryRepository.findById(id);

    if (!blog) {
      res
        .status(HttpStatus.NotFound)
        .send( 
          createErrorMessages([{ message: 'Blog not found', field: 'id' }])
        );      
      return;
    }
    
    await blogsService.update(id, req.body);
    res.status(HttpStatus.NoContent).send();
    
  } catch (e: unknown) {
    res.sendStatus(HttpStatus.InternalServerError);
  }
};
