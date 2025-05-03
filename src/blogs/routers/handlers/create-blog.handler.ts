import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { BlogInputDto } from "../../dto/blog.input-dto";
import { blogsService } from "../../domain/blogs.service";
import { blogsQueryRepository } from "../../repositories/blogs.query.repository";
import { errorsHandler } from "../../../core/errors/errors.handler";

export const createBlogHandler = async (
  req: Request<{}, {}, BlogInputDto>, 
  res: Response
) => {
  try {    
    const createdBlogId = await blogsService.create(req.body);
    const createdBlog = await blogsQueryRepository.findByIdOrFail(createdBlogId);
    
    res.status(HttpStatus.Created).send( createdBlog );
    
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
};
