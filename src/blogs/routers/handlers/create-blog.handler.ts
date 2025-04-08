import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { BlogInputDto } from "../../dto/blog.input-dto";
import { Blog } from "../../types/blog";
import { blogsRepository } from "../../repositories/blogs.repository";
import { mapToBlogViewModel } from "../mappers/map-to-blog-view-model.util";

export const createBlogHandler = async (
  req: Request<{}, {}, BlogInputDto>, 
  res: Response
) => {
  try {
    const newBlog: Blog = {
      name: req.body.name,
      description: req.body.description,
      websiteUrl: req.body.websiteUrl,
      createdAt: new Date(),
      isMembership: false,
    } 

    const createdBlog = await blogsRepository.create(newBlog);
    const blogViewModal = mapToBlogViewModel(createdBlog);
    res.status(HttpStatus.Created).send(blogViewModal);
    
  } catch (e: unknown) {
    res.sendStatus(HttpStatus.InternalServerError);
  }
};
