import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { createErrorMessages } from "../../../core/errors/error.utils";
import { mapToBlogViewModel } from "../mappers/map-to-blog-view-model.util";
import { blogsQueryRepository } from "../../repositories/blogs.query.repository";
import { errorsHandler } from "../../../core/errors/errors.handler";

export const getBlogHandler = async (
  req: Request<{id: string},{},{}>, 
  res: Response
) => {
  try {
    const id = req.params.id;

    const blog = await blogsQueryRepository.findByIdOrFail(id);
    const blogViewModel = mapToBlogViewModel(blog);

    res.status(HttpStatus.Ok).send(blogViewModel);

  } catch ( e: unknown ) {
    errorsHandler(e, res);
  }
};
