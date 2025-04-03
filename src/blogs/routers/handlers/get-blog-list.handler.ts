import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { blogsRepository } from "../../repositories/blogs.repository";

export const getBlogListHandler = (req: Request, res: Response) => {
  const blogs = blogsRepository.findAll();
  res.status(HttpStatus.Ok).send(blogs);
};
