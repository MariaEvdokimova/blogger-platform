import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { blogsQueryRepository } from "../../repositories/blogs.query.repository";
import { errorsHandler } from "../../../core/errors/errors.handler";

export const getBlogHandler = async (
  req: Request<{id: string},{},{}>, 
  res: Response
) => {
  try {
    const id = req.params.id;

    const blog = await blogsQueryRepository.findByIdOrFail(id);
    res.status(HttpStatus.Success).send(blog);

  } catch ( e: unknown ) {
    errorsHandler(e, res);
  }
};
