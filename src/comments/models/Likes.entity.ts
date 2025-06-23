import { Types } from "mongoose";
import { CommentLikesDocument, CommentLikesModel, LikeStatus } from "../domain/likes.entity";
import { CreateLikerDto } from "../dto/like.create-dto";

export class CommentLikesEntity {
  createdAt: Date = new Date();
 
  constructor(
    public commentId: Types.ObjectId, 
    public userId: Types.ObjectId,
    public status: LikeStatus,
  ){}
 
  static createLikeStatus(dto: CreateLikerDto){
    return new CommentLikesModel({
      commentId: dto.commentId,
      userId: dto.userId,
      status: dto.status
    }) as CommentLikesDocument
  }

  updateLikeStatus ( status: LikeStatus): void {
    this.status = status;
  }

}