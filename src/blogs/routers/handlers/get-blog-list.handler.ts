import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { blogsRepository } from "../../repositories/blogs.repository";
import { mapToBlogViewModel } from "../mappers/map-to-blog-view-model.util";

export const getBlogListHandler = async (req: Request, res: Response) => {
  try {
    const blogs = await blogsRepository.findAll();
    const blogViewModels = blogs.map(mapToBlogViewModel);
    res.status(HttpStatus.Ok).send(blogViewModels);
  } catch (e: unknown) {
    res.sendStatus(HttpStatus.InternalServerError);
  }
};
