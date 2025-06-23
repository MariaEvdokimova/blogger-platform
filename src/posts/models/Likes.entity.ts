import { Types } from "mongoose";
import { LikeStatus, PostLikesDocument, PostLikesModel } from "../domain/likes.entity";
import { CreateLikerDto } from "../dto/like.create-dto";

export class PostLikesEntity {
  createdAt: Date = new Date();
 
  constructor(
    public postId: Types.ObjectId, 
    public userId: Types.ObjectId,
    public status: LikeStatus,
  ){}
 
  static createLikeStatus(dto: CreateLikerDto){
    return new PostLikesModel({
      postId: dto.postId,
      userId: dto.userId,
      status: dto.status
    }) as PostLikesDocument
  }

  updateLikeStatus ( status: LikeStatus): void {
    this.status = status;
  }

}