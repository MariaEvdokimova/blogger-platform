import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { postRepository } from "../../repositories/posts.repository";

export const getPostListHandler = (req: Request, res: Response) => {
  const posts = postRepository.findAll();
  
  res.status(HttpStatus.Ok).send(posts);
}
