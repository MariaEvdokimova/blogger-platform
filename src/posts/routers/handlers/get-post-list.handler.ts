import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { postRepository } from "../../repositories/posts.repository";
import { mapToPostViewModel } from "../../mappers/map-to-post-view-model.util";

export const getPostListHandler = async (req: Request, res: Response) => {
  try {
    const posts = await postRepository.findAll();
    const postsViewModels = posts.map(mapToPostViewModel);
    res.status(HttpStatus.Ok).send(postsViewModels);

  } catch ( e: unknown ) {
    res.sendStatus(HttpStatus.InternalServerError);
  }
};
