import { Request, Response } from "express";
import { CommentsQueryRepository } from "../repositories/comments.query.repository";
import { HttpStatus } from "../../core/types/http-statuses";
import { errorsHandler } from "../../core/errors/errors.handler";
import { CommentsService } from "../application/comments.service";
import { CommentInputDto } from "../dto/comment.input-dto";
import { inject, injectable } from "inversify";
import { CommentLikeStatusInputDto } from "../dto/comment-like-status.input.dto";
import { EntityNotFoundError } from "../../core/errors/entity-not-found.error";
import { CommentsLikesQueryRepository } from "../repositories/comment-likes.query.repository";
import { LikeStatus } from "../domain/likes.entity";
import { ResultStatus } from "../../core/result/resultCode";
import { AuthService } from "../../auth/application/auth.service";

@injectable()
export class CommentsController {
  constructor(
    @inject(CommentsQueryRepository) public commentsQueryRepository: CommentsQueryRepository,
    @inject(CommentsService) public commentsService: CommentsService,
    @inject(CommentsLikesQueryRepository) public CommentsLikesQueryRepository: CommentsLikesQueryRepository,
    @inject(AuthService) public AuthService: AuthService,
  ){}

  async deleteComment (
    req: Request<{commentId: string}, {}, {}>, 
    res: Response
  ){
    try {
      const id = req.params.commentId;

      await this.commentsService.delete( id, req.user?.id! );
      
      res.status(HttpStatus.NoContent).send();
      
    } catch (e: unknown) {
      errorsHandler(e, res);
    }
  }

  async getComment (
    req: Request<{id: string}, {}, {}>, 
    res: Response
  ){
    try {
      const id = req.params.id;

      let userId = null;
      if (req.headers.authorization) {
        const result = await this.AuthService.checkAccessToken(req.headers.authorization);
                
        if (result.status === ResultStatus.Success) {
          userId = result.data!.id;
        }
      }

      const comment = await this.commentsQueryRepository.findById(id);

      if ( !comment ) {
        throw new EntityNotFoundError();
      }
      
      const likeStatus = userId
        ? await this.CommentsLikesQueryRepository.findStatusByUserIdAndCommentId( userId, id)
        : LikeStatus.None;

      const commentWithMyStatus = {
        ...comment,
        likesInfo: {
          ...comment.likesInfo,
          myStatus: likeStatus || LikeStatus.None
        }
      };

      const commentViewModel = this.commentsQueryRepository.getInView( commentWithMyStatus );

      res.status(HttpStatus.Success).send( commentViewModel );
      
    } catch (e: unknown) {
      errorsHandler(e, res);
    }
  }

  async updateComment(
    req: Request<{commentId: string}, {}, CommentInputDto>, 
    res: Response
  ){
    try {
      const id = req.params.commentId;
 
      await this.commentsService.update( id, req.body, req.user?.id! );   
  
      res.status(HttpStatus.NoContent).send();
      
    } catch (e: unknown) {
      errorsHandler(e, res);
    }
  }

  async updateLikeStatus(
    req: Request<{commentId: string}, {}, CommentLikeStatusInputDto>, 
    res: Response
  ){
    try {
      const commentId = req.params.commentId;
 
      await this.commentsService.updateLikeStatus( commentId, req.body, req.user?.id! );   
  
      res.status(HttpStatus.NoContent).send();
      
    } catch (e: unknown) {
      errorsHandler(e, res);
    }
  }
  
}
