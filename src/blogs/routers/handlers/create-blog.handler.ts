import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { BlogInputDto } from "../../dto/blog.input-dto";
import { Blog } from "../../types/blog";
import { db } from "../../../db/in-memory.db";
import { blogsRepository } from "../../repositories/blogs.repository";

export const createBlogHandler = (
  req: Request<{}, {}, BlogInputDto>, 
  res: Response
) => {
  const newBlog: Blog = {
    id: db.blogs.length ? +(db.blogs[db.blogs.length - 1].id) + 1 +'' : '1',
    name: req.body.name,
    description: req.body.description,
    websiteUrl: req.body.websiteUrl
  } 

  blogsRepository.create(newBlog);
  res.status(HttpStatus.Created).send(newBlog);
};
