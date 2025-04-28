import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { createErrorMessages } from "../../../core/errors/error.utils";
import { blogsService } from "../../domain/blogs.service";
import { blogsQueryRepository } from "../../repositories/blogs.query.repository";
import { errorsHandler } from "../../../core/errors/errors.handler";

export const deleteBlogHandler = async (
  req: Request<{id: string},{},{}>, 
  res: Response
) => {
  try {
    const id = req.params.id;
    
    await blogsQueryRepository.findByIdOrFail(id);
    await blogsService.delete(id);
    
    res.status(HttpStatus.NoContent).send();

  } catch (e: unknown) {
    errorsHandler(e, res);
  }
};
