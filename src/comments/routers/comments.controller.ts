import { Request, Response } from "express";
import { CommentsQueryRepository } from "../repositories/comments.query.repository";
import { HttpStatus } from "../../core/types/http-statuses";
import { errorsHandler } from "../../core/errors/errors.handler";
import { CommentsService } from "../domain/comments.service";
import { CommentInputDto } from "../dto/comment.input-dto";
import { inject, injectable } from "inversify";

@injectable()
export class CommentsController {
  constructor(
    @inject(CommentsQueryRepository) public commentsQueryRepository: CommentsQueryRepository,
    @inject(CommentsService) public commentsService: CommentsService,
  ){}

  async deleteComment (
    req: Request<{commentId: string}, {}, {}>, 
    res: Response
  ){
    try {
      const id = req.params.commentId;
      
      await this.commentsQueryRepository.findByIdOrFail( id );
      await this.commentsService.verifyUserOwnership( id, req.user?.id!)
      await this.commentsService.delete( id );
      
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
      
      const comment = await this.commentsQueryRepository.findByIdOrFail(id);
  
      res.status(HttpStatus.Success).send( comment );
      
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
      
      await this.commentsQueryRepository.findByIdOrFail( id );
      await this.commentsService.verifyUserOwnership( id, req.user?.id!)
      await this.commentsService.update( id, req.body );   
  
      res.status(HttpStatus.NoContent).send();
      
    } catch (e: unknown) {
      errorsHandler(e, res);
    }
  }
  
}
