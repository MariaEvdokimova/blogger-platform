import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { errorsHandler } from "../../../core/errors/errors.handler";
import { commentsQueryRepository } from "../../repositories/comments.query.repository";
import { commentsService } from "../../domain/comments.service";
import { CommentInputDto } from "../../dto/comment.input-dto";

export const updateCommentHandler = async (
  req: Request<{commentId: string}, {}, CommentInputDto>, 
  res: Response
) => {
  try {
    const id = req.params.commentId;
    
    await commentsQueryRepository.findByIdOrFail( id );
    await commentsService.verifyUserOwnership( id, req.user?.id!)
    await commentsService.update( id, req.body );   

    res.status(HttpStatus.NoContent).send();
    
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
};
