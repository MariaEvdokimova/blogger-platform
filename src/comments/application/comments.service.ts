import { CommentInputDto } from "../dto/comment.input-dto";
import { CommentsRepository } from "../repositories/comments.repository";
import { PostViewModel } from "../../posts/types/post-view-model";
import { inject, injectable } from "inversify";
import { UsersRepository } from "../../users/repositories/users.repository";
import { CommentModel } from "../domain/comment.entity";
import { Types } from "mongoose";
import { EntityNotFoundError } from "../../core/errors/entity-not-found.error";
import { ForbiddenError } from "../../core/errors/forbidden.error";
import { CommentLikeStatusInputDto } from "../dto/comment-like-status.input.dto";
import { CommentLikesRepository } from "../repositories/comment-likes.repository";
import { CommentLikesModel } from "../domain/likes.entity";
import { PostLean } from "../../posts/domain/post.entity";

@injectable()
export class CommentsService {
  constructor(
    @inject(CommentsRepository) public commentsRepository: CommentsRepository,
    @inject(UsersRepository) public usersRepository: UsersRepository,
    @inject(CommentLikesRepository) public commentLikesRepository: CommentLikesRepository,
  ){}

  async create( comment: CommentInputDto, post: PostLean, id: string ): Promise<string> {
    const user = await this.usersRepository.findByIdOrFail( id );

    const { content } = comment;
    const { _id: postId } = post;
    const { _id: userId, login } = user;
    
    const newComment = CommentModel.createComment({
      content,
      userId,
      userLogin: login,
      postId: new Types.ObjectId(postId),
    });

    return await this.commentsRepository.save( newComment );
  }
  
  async update( id: string, dto: CommentInputDto, userId: string ): Promise<void> {
    const comment = await this.commentsRepository.findById( id );
    if ( !comment ) {
      throw new EntityNotFoundError();
    }

    const commentVerifyed = await this.commentsRepository.verifyUserOwnership( id, userId);
    if ( !commentVerifyed ) {
      throw new ForbiddenError();
    }

    commentVerifyed.updateContent( dto.content );
    await this.commentsRepository.save( commentVerifyed );
    
    return;
  }

  async delete(id: string, userId: string ): Promise<void> {
    const comment = await this.commentsRepository.findById( id );
    if ( !comment ) {
      throw new EntityNotFoundError();
    }

    const commentVerifyed = await this.commentsRepository.verifyUserOwnership( id, userId);
    if ( !commentVerifyed ) {
      throw new ForbiddenError();
    }

    commentVerifyed.markAsDeleted();
    await this.commentsRepository.save( commentVerifyed );

    return;
  }

  async updateLikeStatus( commentId: string, dto: CommentLikeStatusInputDto, userId: string ): Promise<void> {
    const { likeStatus } = dto;
     const comment = await this.commentsRepository.findById( commentId );
    if ( !comment ) {
      throw new EntityNotFoundError();
    }

    const userCommentStatus = await this.commentLikesRepository.findUserCommentStatus( commentId, userId );
    if ( userCommentStatus && userCommentStatus.status === likeStatus) return;

    comment.updateLikesInfo( likeStatus, userCommentStatus?.status );

    await this.commentsRepository.save( comment );


    if ( userCommentStatus) {
      userCommentStatus.updateLikeStatus( likeStatus );
      await this.commentLikesRepository.save( userCommentStatus );   
      return;   
    }

    const newStatus = CommentLikesModel.createLikeStatus({
      commentId: new Types.ObjectId(commentId),
      userId: new Types.ObjectId(userId),
      status: likeStatus,
    });

    await this.commentLikesRepository.save( newStatus );
    
    return;
  }

}
