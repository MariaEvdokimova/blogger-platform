import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { blogsRepository } from "../../repositories/blogs.repository";
import { createErrorMessages } from "../../../core/utils/error.utils";
import { mapToBlogViewModel } from "../mappers/map-to-blog-view-model.util";

export const getBlogHandler = async (
  req: Request<{id: string},{},{}>, 
  res: Response
) => {
  try {
    const id = req.params.id;
    const blog = await blogsRepository.findById(id);
    
    if (!blog) {
      res
        .status(HttpStatus.NotFound)
        .send( 
          createErrorMessages([{ message: 'Blog not found', field: 'id' }])
        );
      return;
    }
    
    const blogViewModel = mapToBlogViewModel(blog);
    res.status(HttpStatus.Ok).send(blogViewModel);
  } catch ( e: unknown ) {
    res.sendStatus(HttpStatus.InternalServerError);
  }
};
