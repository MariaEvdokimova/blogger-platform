import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { BlogInputDto } from "../../dto/blog.input-dto";
import { createErrorMessages } from "../../../core/errors/error.utils";
import { blogsService } from "../../domain/blogs.service";
import { blogsQueryRepository } from "../../repositories/blogs.query.repository";
import { errorsHandler } from "../../../core/errors/errors.handler";

export const updateBlogHandler = async (
  req: Request<{id: string}, {}, BlogInputDto>, 
  res: Response
) => {
  try {
    const id = req.params.id;
    
    await blogsQueryRepository.findByIdOrFail(id);    
    await blogsService.update(id, req.body);

    res.status(HttpStatus.NoContent).send();
    
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
};
