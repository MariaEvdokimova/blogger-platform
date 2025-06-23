import { Types } from "mongoose";
import { LikeStatus } from "../domain/likes.entity";

export class CreateLikerDto {
  constructor(
    public commentId: Types.ObjectId, 
    public userId: Types.ObjectId,
    public status: LikeStatus,
  ) {}
}
