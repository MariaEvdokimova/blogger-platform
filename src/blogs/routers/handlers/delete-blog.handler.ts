import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { blogsRepository } from "../../repositories/blogs.repository";
import { createErrorMessages } from "../../../core/utils/error.utils";

export const deleteBlogHandler = async (
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

    await blogsRepository.delete(id);
    res.status(HttpStatus.NoContent).send();
  } catch (e: unknown) {
    res.sendStatus( HttpStatus.InternalServerError );
  }
};
