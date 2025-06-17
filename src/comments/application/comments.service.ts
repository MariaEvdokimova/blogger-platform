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
import { CommentLikesModel, LikeStatus } from "../domain/likes.entity";

@injectable()
export class CommentsService {
  constructor(
    @inject(CommentsRepository) public commentsRepository: CommentsRepository,
    @inject(UsersRepository) public usersRepository: UsersRepository,
    @inject(CommentLikesRepository) public commentLikesRepository: CommentLikesRepository,
  ){}

  async create( comment: CommentInputDto, post: PostViewModel, id: string ): Promise<string> {
    const user = await this.usersRepository.findByIdOrFail( id );

    const { content } = comment;
    const { id: postId } = post;
    const { _id: userId, login } = user;
    
    const newComment = new CommentModel();
    newComment.content = content;
    newComment.commentatorInfo.userId = userId;
    newComment.commentatorInfo.userLogin = login;
    newComment.postId = new Types.ObjectId(postId);
    newComment.createdAt = new Date();

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

    commentVerifyed.content = dto.content;
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

    commentVerifyed.deletedAt = new Date();
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

    switch (likeStatus) {
      case LikeStatus.None:
        comment.likesInfo.likesCount > 0 && comment.likesInfo.likesCount--;
        comment.likesInfo.dislikesCount > 0 && comment.likesInfo.dislikesCount--;
        break;

      case LikeStatus.Like:
        if (userCommentStatus?.status === LikeStatus.Dislike && comment.likesInfo.dislikesCount > 0) {
          comment.likesInfo.dislikesCount--;
        }
        comment.likesInfo.likesCount++;
        break;

      case LikeStatus.Dislike:
        if (userCommentStatus?.status === LikeStatus.Like && comment.likesInfo.likesCount > 0) {
          comment.likesInfo.likesCount--;
        }
        comment.likesInfo.dislikesCount++;
        break;
    }

    await this.commentsRepository.save( comment );


    if ( userCommentStatus) {
      userCommentStatus.status = likeStatus;
      await this.commentLikesRepository.save( userCommentStatus );   
      return;   
    }
    
    const newStatus = new CommentLikesModel();
    newStatus.commentId = new Types.ObjectId(commentId); 
    newStatus.userId = new Types.ObjectId(userId); 
    newStatus.status = likeStatus;
    newStatus.createdAt = new Date();

    await this.commentLikesRepository.save( newStatus );
    
    return;
  }

}
