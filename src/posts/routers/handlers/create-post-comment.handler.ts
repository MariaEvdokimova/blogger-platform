import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { postsQueryRepository } from "../../repositories/posts.query.repository";
import { errorsHandler } from "../../../core/errors/errors.handler";
import { CommentInputDto } from "../../../comments/dto/comment.input-dto";
import { commentsService } from "../../../comments/domain/comments.service";
import { usersQueryRepository } from "../../../users/repositories/users.query.repository";
import { commentsQueryRepository } from "../../../comments/repositories/comments.query.repository";

export const createPostCommentHandler = async (
  req: Request<{ postId: string }, {}, CommentInputDto>, 
  res: Response
) => {
  try {
    const postId = req.params.postId;

    const post = await postsQueryRepository.findByIdOrFail( postId );
    const user = await usersQueryRepository.findByIdOrFail( req.user?.id! );
    const createdCommentId = await commentsService.create (req.body, post, user );
    const commentViewModel = await commentsQueryRepository.findByIdOrFail( createdCommentId );
    
    res.status(HttpStatus.Created).send(commentViewModel); 
     
  } catch ( e: unknown ) {
    errorsHandler(e, res);
  }
};
