import { Types } from "mongoose";
import { CreateCommentDto } from "../dto/comment.create-dto";
import { CommentDocument, CommentModel } from "../domain/comment.entity";
import { LikeStatus } from "../domain/likes.entity";

export class CommentEntity {
  createdAt: Date = new Date();
  deletedAt: Date | null = null;
  likesInfo = {
    likesCount: 0,
    dislikesCount: 0,
  };
 
  constructor(
    public content:	string,
    public commentatorInfo: {
      userId: Types.ObjectId, 
      userLogin: string,
    },
    public postId: Types.ObjectId,
  ){}

  static createComment(dto: CreateCommentDto){
    return new CommentModel({
      content: dto.content,
      commentatorInfo: {
        userId: dto.userId,
        userLogin: dto.userLogin,
      },
      postId: dto.postId,
    }) as CommentDocument
  }

  markAsDeleted(): void {
    this.deletedAt = new Date();
  }

  updateContent( content: string ): void {
    this.content = content;
  }

  updateLikesInfo ( likeStatus: LikeStatus, userCommentStatus: LikeStatus | undefined): void {
    switch (likeStatus) {
      case LikeStatus.None:
        this.likesInfo.likesCount > 0 && this.likesInfo.likesCount--;
        this.likesInfo.dislikesCount > 0 && this.likesInfo.dislikesCount--;
        break;

      case LikeStatus.Like:
        if (userCommentStatus === LikeStatus.Dislike && this.likesInfo.dislikesCount > 0) {
          this.likesInfo.dislikesCount--;
        }
        this.likesInfo.likesCount++;
        break;

      case LikeStatus.Dislike:
        if (userCommentStatus === LikeStatus.Like && this.likesInfo.likesCount > 0) {
          this.likesInfo.likesCount--;
        }
        this.likesInfo.dislikesCount++;
        break;
    }
  }
}